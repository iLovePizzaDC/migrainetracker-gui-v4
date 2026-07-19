export const FEEDBACK_TYPES = {
  NULL: null,
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[keyof typeof FEEDBACK_TYPES];
