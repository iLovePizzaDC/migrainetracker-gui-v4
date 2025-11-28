export const INPUT_TYPES = {
  NUMBER: "number",
  TEXT: "text",
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];
