// Formats a raw timestamp into a "dd.MM, HH:mm" label — used as the
// (hidden) X axis dataKey and shown in the chart tooltip.
export function formatDateTime(timestamp: number): string {
	return new Date(timestamp).toLocaleString('pl-PL', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	})
}
