export const SplitMode = {
  MANUAL: 'MANUAL',
  EQUAL_DIVISION: 'EQUAL_DIVISION'
} as const;

export type SplitMode = (typeof SplitMode)[keyof typeof SplitMode];
