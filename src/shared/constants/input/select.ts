export const SELECT_TYPES = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
} as const;

export type SelectType = (typeof SELECT_TYPES)[keyof typeof SELECT_TYPES];
