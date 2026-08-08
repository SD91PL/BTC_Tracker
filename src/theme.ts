// Re-exports theme.css custom properties as var() strings for inline styles.

export const colors = {
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
