// Re-exports CSS custom properties from theme.css as var() strings
// so inline styles stay reactive to light/dark theme changes.

export const colors = {
	bg: 'var(--color-bg)',
	mint: 'var(--color-mint)',
	mintDark: 'var(--color-mint-dark)',
	indigo: 'var(--color-indigo)',
	indigoLight: 'var(--color-indigo-light)',
	textPrimary: 'var(--color-text-primary)',
	textMuted: 'var(--color-text-muted)',
	textFaint: 'var(--color-text-faint)',
	positive: 'var(--color-positive)',
	negative: 'var(--color-negative)',
} as const

export const monoFont = "'DM Mono', monospace"
export const displayFont = "'Outfit', sans-serif"
