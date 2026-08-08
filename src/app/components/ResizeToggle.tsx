import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { resizeLockToggled } from '../../store/slices/resizeSlice'
import { colors } from '../../theme'

// Matched geometry with ThemeToggle (rem-based for root font-size scaling).
const TRACK_WIDTH = 4.5 // 72px
const TRACK_HEIGHT = 2.25 // 36px
const THUMB_SIZE = 1.75 // 28px
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2 // 0.25rem

export function ResizeToggle() {
	const dispatch = useAppDispatch()
	const locked = useAppSelector(state => state.resize.locked)
	const resizable = !locked

	return (
		<button
			onClick={() => dispatch(resizeLockToggled())}
			aria-label={resizable ? 'Lock card width' : 'Allow resizing card width'}
			aria-pressed={resizable}
			className='relative cursor-pointer group'
			style={{
				width: `${TRACK_WIDTH}rem`,
				height: `${TRACK_HEIGHT}rem`,
				borderRadius: '62.4375rem',
				padding: '0.0625rem',
				background:
					'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.55) 0%, rgba(var(--color-indigo-rgb), 0.45) 100%)',
				transition: 'background 0.4s ease',
			}}>
			{/* Glass track */}
			<div
				className='relative w-full h-full overflow-hidden'
				style={{
					borderRadius: '62.4375rem',
					background: 'rgba(var(--color-bg-elevated-rgb), 0.6)',
					backdropFilter: 'blur(1rem)',
					WebkitBackdropFilter: 'blur(1rem)',
					transition: 'background 0.4s ease',
				}}>
				{/* Background hint icons */}
				<span
					className='absolute top-1/2 flex items-center justify-center transition-opacity duration-300'
					style={{
						left: `${THUMB_INSET + 0.0625}rem`,
						width: `${THUMB_SIZE - 0.5}rem`,
						height: `${THUMB_SIZE - 0.5}rem`,
						transform: 'translateY(-50%)',
						color: colors.textFaint,
						opacity: resizable ? 0.5 : 0,
					}}>
					<OpenLockIcon />
				</span>
				<span
					className='absolute top-1/2 flex items-center justify-center transition-opacity duration-300'
					style={{
						right: `${THUMB_INSET + 0.0625}rem`,
						width: `${THUMB_SIZE - 0.5}rem`,
						height: `${THUMB_SIZE - 0.5}rem`,
						transform: 'translateY(-50%)',
						color: colors.textFaint,
						opacity: resizable ? 0 : 0.5,
					}}>
					<WidthArrowsIcon />
				</span>

				{/* Sliding thumb */}
				<span
					className='absolute top-1/2 rounded-full flex items-center justify-center'
					style={{
						width: `${THUMB_SIZE}rem`,
						height: `${THUMB_SIZE}rem`,
						left: resizable
							? `${TRACK_WIDTH - THUMB_SIZE - THUMB_INSET}rem`
							: `${THUMB_INSET}rem`,
						transform: 'translateY(-50%)',
						background: resizable
							? `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`
							: `linear-gradient(135deg, ${colors.indigo}, ${colors.indigoLight})`,
						boxShadow: resizable
							? '0 0.125rem 0.625rem rgba(var(--color-mint-rgb), 0.5)'
							: '0 0.125rem 0.625rem rgba(var(--color-indigo-rgb), 0.5)',
						transition:
							'left 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), background 0.35s ease, box-shadow 0.35s ease',
					}}>
					<span
						key={String(resizable)}
						className='flex items-center justify-center'
						style={{
							width: `${THUMB_SIZE - 0.625}rem`,
							height: `${THUMB_SIZE - 0.625}rem`,
							color: resizable
								? 'rgb(var(--color-on-mint-rgb))'
								: 'rgb(var(--color-on-accent-rgb))',
							animation: 'theme-toggle-pop 0.35s ease',
						}}>
						{resizable ? <WidthArrowsIcon /> : <LockIcon />}
					</span>
				</span>
			</div>
		</button>
	)
}

// Closed padlock (locked state).
function LockIcon() {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'>
			<rect
				x='3'
				y='7'
				width='10'
				height='7'
				rx='1.5'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

// Open padlock (hint for unlocked/resizable side).
function OpenLockIcon() {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'>
			<rect
				x='3'
				y='7'
				width='10'
				height='7'
				rx='1.5'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M5.5 7V4.8a2.5 2.5 0 0 1 5 0'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

// Width arrows (resizable state + hint).
function WidthArrowsIcon() {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'>
			<path
				d='M2 3v10M14 3v10'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
			<path
				d='M4.5 8h7M4.5 8L6.5 6M4.5 8l2 2M11.5 8l-2-2M11.5 8l-2 2'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
