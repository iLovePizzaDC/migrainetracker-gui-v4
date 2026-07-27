export const STRENGTH_MAP = {
	200: 'bg-purple-200',
	300: 'bg-purple-300',
	400: 'bg-purple-400',
	500: 'bg-purple-500',
	600: 'bg-purple-600',
	700: 'bg-purple-700',
	800: 'bg-purple-800',
	900: 'bg-purple-900',
	950: 'bg-purple-950',
} as const;

export type StrengthKey = keyof typeof STRENGTH_MAP;

export const MIGRAINOSUS_FLAG_THRESHOLD = 4;
