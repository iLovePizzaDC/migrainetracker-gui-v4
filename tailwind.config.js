/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			transitionTimingFunction: {
				smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
				soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			transitionDuration: {
				250: '250ms',
				350: '350ms',
			},
			keyframes: {
				shimmer: {
					'0%': { width: '0%', marginLeft: '0%' },
					'50%': { width: '60%', marginLeft: '20%' },
					'100%': { width: '0%', marginLeft: '100%' },
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(6px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-up': 'fade-up 350ms cubic-bezier(0.22, 1, 0.36, 1) both',
			},
		},
	},
	plugins: [],
};
