export const BUTTON_TYPES = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];
