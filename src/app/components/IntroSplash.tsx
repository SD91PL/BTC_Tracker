import logotypeMarkup from '../../assets/img/logotype.svg?raw'

interface IntroSplashProps {
	onFinish: () => void
}

export function IntroSplash({ onFinish }: IntroSplashProps) {
	return (
		<div
			className='intro-splash'
			style={{ background: 'rgb(var(--color-bg-rgb))' }}
			aria-hidden='true'
			onAnimationEnd={event => {
				if (event.animationName === 'intro-splash-fade') onFinish()
			}}>
			<div className='intro-splash__glow' />
			<div
				className='intro-splash__logo'
				dangerouslySetInnerHTML={{ __html: logotypeMarkup }}
			/>
		</div>
	)
}

