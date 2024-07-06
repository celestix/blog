/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'sfbold': ['sfbold'],
				'sfregular': ['sfregular'],
				'sfsemibold': ['sfsemibold'],
				'stregular': ['stregular'],
			},
		},
	},
	plugins: [],
	darkMode: 'selector'
}
