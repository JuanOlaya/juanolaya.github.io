import type { MechanismFamily } from './types';

/** Five functional families grouping the 21 canonical patterns. */
export const mechanismFamilies: readonly MechanismFamily[] = [
  {
    id: 'mass-inertia',
    name: 'Mass & Inertia',
    icon: '⚖️',
    patterns: [
      'Solid mass shifting',
      'Liquid mass shifting',
      'Flywheel torque',
      'Mass acceleration',
      'Mass striking',
    ],
  },
  {
    id: 'fluids-pneumatics',
    name: 'Fluids & Pneumatics',
    icon: '💨',
    patterns: ['Aerodynamic resistance', 'Compressed air release', 'Propeller thrust'],
  },
  {
    id: 'surface-deformation',
    name: 'Surface & Deformation',
    icon: '✋',
    patterns: [
      'Flexible surface deformation',
      'Grip morphing',
      'Pin extension',
      'Plate shearing',
      'Plate tilting',
      'Surface rotation',
    ],
  },
  {
    id: 'mechanical-structural',
    name: 'Mechanical & Structural',
    icon: '⚙️',
    patterns: [
      'Joint actuation',
      'Band elasticity control',
      'Spring loading',
      'Exchangeable actuator modules',
    ],
  },
  {
    id: 'sensory-thermal',
    name: 'Sensory & Thermal',
    icon: '⚡',
    patterns: ['Vibration', 'Electrode stimulation', 'Peltier cell actuation'],
  },
];
