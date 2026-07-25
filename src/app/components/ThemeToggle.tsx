import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { themeToggled } from '../../store/slices/themeSlice'
import { colors } from '../../theme'

// Track/thumb geometry, kept in one place so the thumb's sliding
// position math stays in sync with the track's own dimensions.
const TRACK_WIDTH = 72
const TRACK_HEIGHT = 36
const THUMB_SIZE = 28
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2

export function ThemeToggle() {
	const dispatch = useAppDispatch()
	const mode = useAppSelector(state => state.theme.mode)
	const isDark = mode === 'dark'

	return (
		<button
			onClick={() => dispatch(themeToggled())}
			aria-label={
				isDark ? 'Switch to light theme' : 'Switch to dark theme'
			}
			aria-pressed={isDark}
			className='relative cursor-pointer group'
			style={{
				width: TRACK_WIDTH,
				height: TRACK_HEIGHT,
				borderRadius: '999px',
				padding: '1px',
				background:
					'linear-gradient(135deg, rgba(var(--color-mint-rgb), 0.55) 0%, rgba(var(--color-indigo-rgb), 0.45) 100%)',
				transition: 'background 0.4s ease',
			}}>
			{/* Glass track */}
			<div
				className='relative w-full h-full overflow-hidden'
				style={{
					borderRadius: '999px',
					background: 'rgba(var(--color-bg-elevated-rgb), 0.6)',
					backdropFilter: 'blur(16px)',
					WebkitBackdropFilter: 'blur(16px)',
					transition: 'background 0.4s ease',
				}}>
				{/* Sun icon */}
				<span
					className='absolute top-1/2 flex items-center justify-center transition-opacity duration-300'
					style={{
						left: THUMB_INSET + 1,
						width: THUMB_SIZE - 8,
						height: THUMB_SIZE - 8,
						transform: 'translateY(-50%)',
						color: colors.textFaint,
						opacity: isDark ? 0.5 : 0,
					}}>
					<SunIcon />
				</span>

				{/* Moon icon */}
				<span
					className='absolute top-1/2 flex items-center justify-center transition-opacity duration-300'
					style={{
						right: THUMB_INSET + 1,
						width: THUMB_SIZE - 8,
						height: THUMB_SIZE - 8,
						transform: 'translateY(-50%)',
						color: colors.textFaint,
						opacity: isDark ? 0 : 0.5,
					}}>
					<MoonIcon />
				</span>

				{/* Sliding thumb */}
				<span
					className='absolute top-1/2 rounded-full flex items-center justify-center'
					style={{
						width: THUMB_SIZE,
						height: THUMB_SIZE,
						left: isDark
							? TRACK_WIDTH - THUMB_SIZE - THUMB_INSET
							: THUMB_INSET,
						transform: 'translateY(-50%)',
						background: isDark
							? `linear-gradient(135deg, ${colors.indigo}, ${colors.indigoLight})`
							: `linear-gradient(135deg, ${colors.mint}, ${colors.mintDark})`,
						boxShadow: isDark
							? '0 2px 10px rgba(var(--color-indigo-rgb), 0.5)'
							: '0 2px 10px rgba(var(--color-mint-rgb), 0.5)',
						transition:
							'left 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), background 0.35s ease, box-shadow 0.35s ease',
					}}>
					<span
						key={mode}
						className='flex items-center justify-center'
						style={{
							width: THUMB_SIZE - 10,
							height: THUMB_SIZE - 10,
							// The moon sits on indigo (needs constant on-accent white);
							// the sun sits on mint/orange, whose contrasting text
							// color flips per theme (dark ink vs. near-white).
							color: isDark
								? 'rgb(var(--color-on-accent-rgb))'
								: 'rgb(var(--color-on-mint-rgb))',
							animation: 'theme-toggle-pop 0.35s ease',
						}}>
						{isDark ? <MoonIcon filled /> : <SunIcon filled />}
					</span>
				</span>
			</div>
		</button>
	)
}

function SunIcon({ filled = false }: { filled?: boolean }) {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'>
			<circle
				cx='8'
				cy='8'
				r='3.5'
				fill={filled ? 'currentColor' : 'none'}
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M8 0.5v2M8 13.5v2M15.5 8h-2M2.5 8h-2M13.4 2.6l-1.4 1.4M4 12l-1.4 1.4M13.4 13.4L12 12M4 4L2.6 2.6'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
			/>
		</svg>
	)
}

function MoonIcon({ filled = false }: { filled?: boolean }) {
	return (
		<svg
			width='100%'
			height='100%'
			viewBox='0 0 16 16'
			fill='none'>
			<path
				d='M14 9.7A6.3 6.3 0 1 1 6.3 2a5 5 0 0 0 7.7 7.7Z'
				fill={filled ? 'currentColor' : 'none'}
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
