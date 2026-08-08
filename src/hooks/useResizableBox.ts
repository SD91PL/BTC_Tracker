import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { CARD_MIN_WIDTH_PX, CARD_MAX_WIDTH_RATIO } from '../constants'

// Width-only resize; direction is just which edge is dragged.
export type ResizeDirection = 'e' | 'w'

interface UseResizableBoxOptions {
	/** When true, all drag/pinch handling is disabled. */
	locked: boolean
	/** Committed width in px, or null for the default footprint. Controlled
	 * value backed by Redux so reset can restore it with everything else. */
	width: number | null
	onCommitWidth: (width: number | null) => void
	minWidth?: number
	/** Ceiling as a fraction of the *parent* element's width (0.9 = 90%). */
	maxWidthRatio?: number
	/** Fires whenever the box's rendered width changes, in any state.
	 * A raw DOM measurement, not app state worth persisting or resetting. */
	onMeasuredWidthChange?: (width: number) => void
	/** Fires true when a drag/pinch starts and false when it ends — lets
	 * a parent suppress its own animations while width is changing. */
	onResizingChange?: (isResizing: boolean) => void
}

// Drag/pinch bookkeeping lives in refs to avoid renders on every move.
interface DragState {
	direction: ResizeDirection
	startX: number
	startWidth: number
}

interface PinchState {
	startDistanceX: number
	startWidth: number
}

export function useResizableBox({
	locked,
	width,
	onCommitWidth,
	minWidth = CARD_MIN_WIDTH_PX,
	maxWidthRatio = CARD_MAX_WIDTH_RATIO,
	onMeasuredWidthChange,
	onResizingChange,
}: UseResizableBoxOptions) {
	const containerRef = useRef<HTMLDivElement>(null)
	const dragRef = useRef<DragState | null>(null)
	const pinchRef = useRef<PinchState | null>(null)
	// Parent width lives in a ref, not state, to avoid re-renders.
	const parentWidthRef = useRef<number>(Infinity)

	// minWidth/parentWidthRef stay in px since DOM measurements are
	// always reported in physical px regardless of root font size.
	const clampWidth = useCallback(
		(w: number) => {
			const ceiling = parentWidthRef.current * maxWidthRatio
			return Math.min(Math.max(w, minWidth), Math.max(ceiling, minWidth))
		},
		[minWidth, maxWidthRatio],
	)

	// Keep width/setter in refs so the observer below isn't recreated
	// on every width change.
	const widthRef = useRef(width)
	useEffect(() => {
		widthRef.current = width
	}, [width])
	const onCommitWidthRef = useRef(onCommitWidth)
	useEffect(() => {
		onCommitWidthRef.current = onCommitWidth
	}, [onCommitWidth])

	// Track the parent's width so the ceiling stays correct regardless of
	// how this component is embedded; re-clamp on parent resize.
	useEffect(() => {
		const parent = containerRef.current?.parentElement
		if (!parent) return

		const observer = new ResizeObserver(entries => {
			const parentWidth = entries[0]?.contentRect.width
			if (parentWidth == null) return
			parentWidthRef.current = parentWidth
			if (widthRef.current !== null) {
				onCommitWidthRef.current(clampWidth(widthRef.current))
			}
		})
		observer.observe(parent)
		return () => observer.disconnect()
	}, [clampWidth])

	// Report the box's own rendered width so a parent can key layout
	// decisions off it.
	useEffect(() => {
		const el = containerRef.current
		if (!el || !onMeasuredWidthChange) return

		const observer = new ResizeObserver(entries => {
			const measuredWidth = entries[0]?.contentRect.width
			if (measuredWidth != null) onMeasuredWidthChange(measuredWidth)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [onMeasuredWidthChange])

	// --- Desktop: drag the left/right edge handle -----------------------------

	const handlePointerDown = useCallback(
		(direction: ResizeDirection) => (e: ReactPointerEvent<HTMLDivElement>) => {
			if (locked || !containerRef.current) return
			e.preventDefault()
			e.stopPropagation()
			const rect = containerRef.current.getBoundingClientRect()
			dragRef.current = {
				direction,
				startX: e.clientX,
				startWidth: rect.width,
			}
			e.currentTarget.setPointerCapture(e.pointerId)
			onResizingChange?.(true)
		},
		[locked, onResizingChange],
	)

	const handlePointerMove = useCallback(
		(e: ReactPointerEvent<HTMLDivElement>) => {
			const drag = dragRef.current
			if (!drag) return
			const dx = e.clientX - drag.startX
			const next = clampWidth(drag.direction === 'e' ? drag.startWidth + dx : drag.startWidth - dx)
			onCommitWidth(next)
		},
		[clampWidth, onCommitWidth],
	)

	const handlePointerUp = useCallback(
		(e: ReactPointerEvent<HTMLDivElement>) => {
			if (!dragRef.current) return
			dragRef.current = null
			if (e.currentTarget.hasPointerCapture(e.pointerId)) {
				e.currentTarget.releasePointerCapture(e.pointerId)
			}
			onResizingChange?.(false)
		},
		[onResizingChange],
	)

	// --- Touch: two-finger pinch resizes width only -------------------------

	useEffect(() => {
		const el = containerRef.current
		if (!el || locked) return

		const distanceX = (t: TouchList) => Math.abs(t[0].clientX - t[1].clientX)

		function onTouchStart(e: TouchEvent) {
			if (e.touches.length !== 2 || !el) return
			const rect = el.getBoundingClientRect()
			pinchRef.current = {
				startDistanceX: Math.max(distanceX(e.touches), 1),
				startWidth: rect.width,
			}
			onResizingChange?.(true)
		}

		function onTouchMove(e: TouchEvent) {
			const pinch = pinchRef.current
			if (!pinch || e.touches.length !== 2) return
			// Prevent native pinch-zoom/scroll while resizing.
			e.preventDefault()
			const scaleX = distanceX(e.touches) / pinch.startDistanceX
			onCommitWidth(clampWidth(pinch.startWidth * scaleX))
		}

		function onTouchEnd(e: TouchEvent) {
			if (e.touches.length < 2) {
				pinchRef.current = null
				onResizingChange?.(false)
			}
		}

		el.addEventListener('touchstart', onTouchStart, { passive: true })
		el.addEventListener('touchmove', onTouchMove, { passive: false })
		el.addEventListener('touchend', onTouchEnd)
		el.addEventListener('touchcancel', onTouchEnd)

		return () => {
			el.removeEventListener('touchstart', onTouchStart)
			el.removeEventListener('touchmove', onTouchMove)
			el.removeEventListener('touchend', onTouchEnd)
			el.removeEventListener('touchcancel', onTouchEnd)
		}
	}, [locked, clampWidth, onCommitWidth, onResizingChange])

	return {
		containerRef,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
	}
}
