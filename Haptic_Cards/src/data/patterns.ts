import type { Pattern } from './types';

/** The 21 canonical mechanism patterns, in navigation order. */
export const patternNames = [
  'Aerodynamic resistance',
  'Compressed air release',
  'Flexible surface deformation',
  'Joint actuation',
  'Band elasticity control',
  'Pin extension',
  'Flywheel torque',
  'Exchangeable actuator modules',
  'Liquid mass shifting',
  'Solid mass shifting',
  'Grip morphing',
  'Electrode stimulation',
  'Peltier cell actuation',
  'Propeller thrust',
  'Mass acceleration',
  'Surface rotation',
  'Plate shearing',
  'Spring loading',
  'Mass striking',
  'Plate tilting',
  'Vibration',
] as const;

export type PatternName = (typeof patternNames)[number];

const patternIcons: Record<PatternName, string> = {
  'Aerodynamic resistance': '🪁',
  'Compressed air release': '💨',
  'Flexible surface deformation': '〰️',
  'Joint actuation': '🦾',
  'Band elasticity control': '🪢',
  'Pin extension': '📍',
  'Flywheel torque': '🔄',
  'Exchangeable actuator modules': '🧩',
  'Liquid mass shifting': '💧',
  'Solid mass shifting': '⚖️',
  'Grip morphing': '🧊',
  'Electrode stimulation': '⚡',
  'Peltier cell actuation': '🌡️',
  'Propeller thrust': '🛸',
  'Mass acceleration': '🚀',
  'Surface rotation': '🔘',
  'Plate shearing': '↔️',
  'Spring loading': '🌀',
  'Mass striking': '💥',
  'Plate tilting': '📐',
  Vibration: '📳',
};

export const patterns: readonly Pattern[] = patternNames.map((name) => ({ name, icon: patternIcons[name] }));

/** Opens on the pattern that contains LeverForce, as the original page did. */
export const DEFAULT_PATTERN: PatternName = 'Solid mass shifting';

/** The original card looked its mechanism icon up by a category name that never matched, so every card shows this. */
export const MECHANISM_ICON = '⚙️';
