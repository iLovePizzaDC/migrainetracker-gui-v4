import type { NavigationLink } from "@/app/types/navigation/navigation";

export const NAV_LINK_STATES = {
  HOME: "Home",
  CALENDAR: "Calendar",
} as const;

export type NAV_LINK = typeof NAV_LINK_STATES[keyof typeof NAV_LINK_STATES];

export const NAVIGATION_LINKS: NavigationLink[] = Object.values(NAV_LINK_STATES).map((label) => ({
  label,
  to: `/${label.toLowerCase()}`,
}));
