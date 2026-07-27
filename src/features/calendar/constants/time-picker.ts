export const PICKER_HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

export const PICKER_MINUTES = [
	'00',
	'05',
	'10',
	'15',
	'20',
	'25',
	'30',
	'35',
	'40',
	'45',
	'50',
	'55',
	'59',
];

export const ITEM_HEIGHT = 32;

export const VISIBLE_ITEMS = 5;

export const SECTION_PADDING = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;
