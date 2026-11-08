/** Screen ids of the original sketch, where they were bare numbers spread over 15 scripts. */
export const Screen = {
  Menu: 0,
  PixelGrid: 10,
  GenerativeArt: 20,
  Webcam: 30,
  Profile: 31,
} as const;
export type Screen = (typeof Screen)[keyof typeof Screen];

/** Keys 1/2 switch between the wall and a plain brown screen. */
export const GeneralMode = { Wall: 1, Plain: 2 } as const;
export type GeneralMode = (typeof GeneralMode)[keyof typeof GeneralMode];
