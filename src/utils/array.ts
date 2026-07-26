// Evenly sample an array down to ~targetPoints items.
export function sampleEvenly<T>(items: T[], targetPoints: number): T[] {
	const step = Math.max(1, Math.floor(items.length / targetPoints))
	return items.filter((_, i) => i % step === 0)
}
