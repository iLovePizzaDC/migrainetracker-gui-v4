/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			keyframes: {
				shimmer: {
					'0%': { width: '0%', marginLeft: '0%' },
					'50%': { width: '60%', marginLeft: '20%' },
					'100%': { width: '0%', marginLeft: '100%' },
				},
			},
		},
	},
	plugins: [],
};
