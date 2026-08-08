import { useCallback } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { widthChanged } from '../../store/slices/resizeSlice'
import { useResizableBox } from '../../hooks/useResizableBox'
import type { ResizeDirection } from '../../hooks/useResizableBox'
import { colors } from '../../theme'
import { CARD_MIN_WIDTH_PX, CARD_MAX_WIDTH_RATIO } from '../../constants'

interface ResizableWrapperProps {
	children: ReactNode
	/** Reports the card's actual rendered pixel width, in any state. */
	onWidthChange?: (width: number) => void
	/** Reports whether a drag/pinch resize is currently in progress. */
	onResizingChange?: (isResizing: boolean) => void
}

const EDGE_DIRECTIONS: ResizeDirection[] = ['e', 'w']

// Default footprint matches the original card width.
const DEFAULT_MAX_WIDTH = '24rem'

export function ResizableWrapper({ children, onWidthChange, onResizingChange }: ResizableWrapperProps) {
	const dispatch = useAppDispatch()
	const locked = useAppSelector(state => state.resize.locked)
	// Width lives in Redux so reset can restore it with everything else.
	const width = useAppSelector(state => state.resize.width)

	const handleCommitWidth = useCallback(
		(next: number | null) => dispatch(widthChanged(next)),
		[dispatch],
	)

	const { containerRef, handlePointerDown, handlePointerMove, handlePointerUp } = useResizableBox({
		locked,
		width,
		onCommitWidth: handleCommitWidth,
		minWidth: CARD_MIN_WIDTH_PX,
		maxWidthRatio: CARD_MAX_WIDTH_RATIO,
		onMeasuredWidthChange: onWidthChange,
		onResizingChange,
	})

	return (
		<div
			ref={containerRef}
			className='relative w-full'
			style={{
				maxWidth: width === null ? DEFAULT_MAX_WIDTH : undefined,
				width: width ?? undefined,
				// Height always follows content now — only width is resizable.
				height: 'auto',
				// Prevent native pinch-zoom from competing with our resize handling.
				touchAction: locked ? undefined : 'pan-y',
			}}>
			{children}

			{!locked &&
				EDGE_DIRECTIONS.map(direction => (
					<ResizeHandle
						key={direction}
						direction={direction}
						onPointerDown={handlePointerDown(direction)}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
					/>
				))}
		</div>
	)
}

// Hit-region + cursor per handle edge — tall, centered, easy to grab.
const HANDLE_STYLE: Record<ResizeDirection, CSSProperties> = {
	e: { right: '-0.375rem', top: '1rem', bottom: '1rem', width: '0.875rem', cursor: 'ew-resize' },
	w: { left: '-0.375rem', top: '1rem', bottom: '1rem', width: '0.875rem', cursor: 'ew-resize' },
}

interface ResizeHandleProps {
	direction: ResizeDirection
	onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
	onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void
	onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
}

function ResizeHandle({ direction, onPointerDown, onPointerMove, onPointerUp }: ResizeHandleProps) {
	return (
		<div
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			className='absolute z-10 flex items-center justify-center touch-none select-none'
			style={HANDLE_STYLE[direction]}>
			<span
				className='rounded-full transition-opacity duration-200 opacity-40 hover:opacity-90'
				style={{
					width: '0.25rem',
					height: '2.25rem',
					background: `linear-gradient(180deg, ${colors.mint}, ${colors.indigo})`,
				}}
			/>
		</div>
	)
}
