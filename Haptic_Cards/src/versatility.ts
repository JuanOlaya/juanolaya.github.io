import type { Device } from './data/types';

export const MAX_STARS = 5;

/** Research topics derived from the audited sensations, as the original card computed them. */
export function researchFocus(device: Device): string[] {
  const has = (...names: string[]) =>
    names.some((name) => (device.audit.sensations as readonly string[]).includes(name));
  const focus: string[] = [];
  if (has('Impact', 'Vibration')) focus.push('Transient Cues');
  if (has('Stiffness', 'Resistance')) focus.push('Compliance & Force');
  if (has('Weight magnitude', 'Weight distribution')) focus.push('Mass & Inertia');
  if (has('Shape', 'Friction')) focus.push('Surface & Form');
  if (has('Thermal')) focus.push('Thermal Feedback');
  return focus.length > 0 ? focus : ['Active Actuation'];
}
