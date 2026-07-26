import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
	return {
		name: 'figma-asset-resolver',
		resolveId(id) {
			if (id.startsWith('figma:asset/')) {
				const filename = id.replace('figma:asset/', '')
				return path.resolve(__dirname, 'src/assets', filename)
			}
		},
	}
}

export default defineConfig({
	base: '/BTC_Tracker/',

	plugins: [
		figmaAssetResolver(),
		// Required for Make — do not remove.
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	// Raw import support (do not include .css/.ts/.tsx).
	assetsInclude: ['**/*.svg', '**/*.csv'],
})
