/** The 10 canonical sensations, split by haptic modality. */
export const cutaneousSensations = ['Thermal', 'Stiffness', 'Friction', 'Vibration'] as const;
export const kinestheticSensations = [
  'Impact',
  'Motion',
  'Resistance',
  'Weight magnitude',
  'Weight distribution',
  'Shape',
] as const;

export type Sensation = (typeof cutaneousSensations)[number] | (typeof kinestheticSensations)[number];

const cutaneous: ReadonlySet<string> = new Set(cutaneousSensations);

export function isCutaneous(sensation: Sensation): boolean {
  return cutaneous.has(sensation);
}
