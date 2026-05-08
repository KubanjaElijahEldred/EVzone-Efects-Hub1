export const evzoneColors = {
  green: '#03cd8c',
  orange: '#f77f00',
  mediumGrey: '#a6a6a6',
  lightGrey: '#f2f2f2',
  ink: '#0f172a',
  muted: '#667085',
  white: '#ffffff',
} as const;

export type EvzoneColorName = keyof typeof evzoneColors;
