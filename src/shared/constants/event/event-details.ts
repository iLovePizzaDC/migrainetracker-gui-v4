import type { InputContent } from '@/shared/types/calendar/calendar';
import type { DropdownOption } from '@/shared/types/input/input';

// --- INTENSITY START ---

export const INTENSITY_TYPES = {
	VERY_HIGH: 'very-high',
	HIGH: 'high',
	MEDIUM: 'medium',
	LOW: 'low',
} as const;

export type IntensityType = (typeof INTENSITY_TYPES)[keyof typeof INTENSITY_TYPES];

export const INTENSITY_OPTIONS: DropdownOption[] = [
	{ label: 'Very High', value: INTENSITY_TYPES.VERY_HIGH },
	{ label: 'High', value: INTENSITY_TYPES.HIGH },
	{ label: 'Medium', value: INTENSITY_TYPES.MEDIUM },
	{ label: 'Low', value: INTENSITY_TYPES.LOW },
];

// --- SYMPTOM START ---

export const SYMPTOM_TYPES = {
	NOISE: 'noi',
	LIGHT: 'lig',
	SMELL: 'sme',
	VISION: 'vis',
	DIZZY: 'diz',
	NAUSEA: 'nau',
	VOMIT: 'vom',
	NECK: 'ne',
	JAW: 'ja',
} as const;

export type SymptomType = (typeof SYMPTOM_TYPES)[keyof typeof SYMPTOM_TYPES];

export const SYMPTOM_OPTIONS: DropdownOption[] = [
	{ label: 'Noise Sensitive', value: SYMPTOM_TYPES.NOISE },
	{ label: 'Light Sensitive', value: SYMPTOM_TYPES.LIGHT },
	{ label: 'Smell Sensitive', value: SYMPTOM_TYPES.SMELL },
	{ label: 'Vision Problems', value: SYMPTOM_TYPES.VISION },
	{ label: 'Dizzy', value: SYMPTOM_TYPES.DIZZY },
	{ label: 'Nausea', value: SYMPTOM_TYPES.NAUSEA },
	{ label: 'Vomit', value: SYMPTOM_TYPES.VOMIT },
	{ label: 'Neck Pain', value: SYMPTOM_TYPES.NECK },
	{ label: 'Jaw Pain', value: SYMPTOM_TYPES.JAW },
];

// --- EFFECTIVENESS START ---

export const EFFECTIVENESS_TYPES = {
	EFFECTIVE: 'yes',
	INEFFECTIVE: 'no',
} as const;

export type EffectivenessType = (typeof EFFECTIVENESS_TYPES)[keyof typeof EFFECTIVENESS_TYPES];

export const EFFECTIVENESS_OPTIONS: DropdownOption[] = [
	{ label: 'Effective', value: EFFECTIVENESS_TYPES.EFFECTIVE },
	{ label: 'Ineffective', value: EFFECTIVENESS_TYPES.INEFFECTIVE },
];

// --- MIDAS START ---

export const MIDAS_TYPES = {
	WORK_MISSED: 'workMissed',
	WORK_IMPAIRED: 'workImpaired',
	CHORES_MISSED: 'choresMissed',
	CHORES_IMPAIRED: 'choresImpaired',
	SOCIAL_MISSED: 'socialMissed',
} as const;

export type MidasType = (typeof MIDAS_TYPES)[keyof typeof MIDAS_TYPES];

export const MIDAS_OPTIONS: DropdownOption[] = [
	{ label: 'I missed work', value: MIDAS_TYPES.WORK_MISSED },
	{ label: 'my work performance was reduced', value: MIDAS_TYPES.WORK_IMPAIRED },
	{ label: 'I missed household chores', value: MIDAS_TYPES.CHORES_MISSED },
	{ label: 'my ability to do household chores was reduced', value: MIDAS_TYPES.CHORES_IMPAIRED },
	{ label: 'I missed social activities', value: MIDAS_TYPES.SOCIAL_MISSED },
];

// --- OTHER START ---

export const ANY_FILTER_TYPE = {
	ANY: 'any',
} as const;

export type AnyFilterType = (typeof ANY_FILTER_TYPE)[keyof typeof ANY_FILTER_TYPE];

export const ANY_FILTER_OPTIONS: DropdownOption = { label: 'Any', value: ANY_FILTER_TYPE.ANY };

export const ANY_INPUT_FILTER_TYPES = {
	abbreviation: ANY_FILTER_TYPE.ANY,
	label: ANY_FILTER_OPTIONS.label,
} as const;

export type AnyInputFilterType = typeof ANY_INPUT_FILTER_TYPES;

export const ANY_INPUT_FILTER_OPTION: InputContent | AnyInputFilterType = ANY_INPUT_FILTER_TYPES;
