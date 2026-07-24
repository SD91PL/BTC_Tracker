// Reduces an array to ~targetPoints evenly spaced items. Pure and synchronous —
// no fetching involved, so it's easy to test on its own and reusable for any
// series, not just BTC price history.
export function sampleEvenly<T>(items: T[], targetPoints: number): T[] {
	const step = Math.max(1, Math.floor(items.length / targetPoints))
	return items.filter((_, i) => i % step === 0)
}
