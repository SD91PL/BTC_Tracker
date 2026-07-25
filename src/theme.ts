// Design tokens used across the card. The actual color values live in
// src/styles/theme.css (as CSS custom properties, themed per data-theme
// attribute) — this file just re-exports them as `var(--x)` strings so
// components can keep using `colors.mint` etc. in inline styles, while
// still reacting correctly when the light/dark theme changes.

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
