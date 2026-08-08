import { useRef, useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { appReset } from '../../store/actions'
import { colors } from '../../theme'

// Matches ThemeToggle/ResizeToggle track height so controls line up.
const SIZE = 2.25

export function ResetButton() {
	const dispatch = useAppDispatch()
	const [isSpinning, setIsSpinning] = useState(false)
	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	function handleReset() {
		// Resets every slice to its initialState in one dispatch.
		dispatch(appReset())

		if (resetTimer.current) clearTimeout(resetTimer.current)
		setIsSpinning(true)
		resetTimer.current = setTimeout(() => setIsSpinning(false), 500)
	}

	return (
		<button
			onClick={handleReset}
			aria-label='Reset layout to defaults'
			title='Reset layout to defaults'
			className='relative cursor-pointer'
			style={{
				width: `${SIZE}rem`,
				height: `${SIZE}rem`,
				borderRadius: '62.4375rem',
				padding: '0.0625rem',
				background:
					'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.55) 0%, rgba(var(--color-indigo-rgb), 0.45) 100%)',
				transition: 'background 0.4s ease',
			}}>
			<div
				className='relative w-full h-full flex items-center justify-center'
				style={{
					borderRadius: '62.4375rem',
					background: 'rgba(var(--color-bg-elevated-rgb), 0.6)',
					backdropFilter: 'blur(1rem)',
					WebkitBackdropFilter: 'blur(1rem)',
					transition: 'background 0.4s ease',
				}}>
				<span
					className='flex items-center justify-center'
					style={{
						width: `${SIZE - 1}rem`,
						height: `${SIZE - 1}rem`,
						color: colors.textMuted,
						transform: isSpinning ? 'rotate(-360deg)' : 'rotate(0deg)',
						transition: isSpinning ? 'transform 0.5s ease' : 'none',
					}}>
					<ResetIcon />
				</span>
			</div>
		</button>
	)
}

// Circular arrow icon reads as "start over".
function ResetIcon() {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'
			transform='scale(-1, 1)'
			style={{ transformOrigin: 'center' }}>
			<path
				d='M13 8A5 5 0 1 1 11.5 4.3'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
			<path
				d='M13 2.5V5.5H10'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
