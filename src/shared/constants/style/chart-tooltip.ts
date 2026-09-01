import { FONT_FAMILY } from '@/shared/constants/style/font';

export const CHART_TOOLTIP_STYLE = {
	background: 'rgba(10, 10, 10, 0.85)',
	backdropFilter: 'blur(12px)',
	border: '1px solid rgba(255, 255, 255, 0.12)',
	borderRadius: '12px',
	color: 'rgba(255, 255, 255, 0.9)',
	boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
	fontFamily: FONT_FAMILY,
	fontSize: 13,
	padding: '8px 12px',
} as const;
