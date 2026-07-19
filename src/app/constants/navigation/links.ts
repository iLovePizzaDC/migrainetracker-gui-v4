import type { NavigationLink } from '@/app/types/navigation/navigation';

export const NAV_LINK_STATES = {
  HOME: {
    label: 'Home',
    allowAnonymous: false,
  },
  CALENDAR: {
    label: 'Calendar',
    allowAnonymous: false,
  },
} as const;

export type NAV_LINK = (typeof NAV_LINK_STATES)[keyof typeof NAV_LINK_STATES]['label'];

export const NAVIGATION_LINKS: NavigationLink[] = Object.values(NAV_LINK_STATES).map(
  ({ label, allowAnonymous }) => ({
    label,
    to: `/${label.toLowerCase()}`,
    allowAnonymous,
  }),
);
