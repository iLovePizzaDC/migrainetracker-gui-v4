export type PendingScroll = {
	timeoutId: number | null;
	flush: (() => void) | null;
};
