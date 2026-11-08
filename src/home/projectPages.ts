export interface ProjectPage {
  title: string;
  /** One line, shown under the title. */
  description: string;
  /** Root-relative URL of a page published by tooling/site-pages.ts. */
  href: string;
}

/**
 * Project pages linked from the home "Projects" section.
 * Left out on purpose: archived (`legacy/`) and redirect-stub folders, Sockets, test pages
 * (`tooling-check`, `multitouchTest`, `TestingSoSci`) and personal pages.
 */
export const projectPages: readonly ProjectPage[] = [
  {
    title: 'Haptic Cards',
    description: 'Dashboard of 21 mechanism patterns for haptic VR controllers.',
    href: '/Haptic_Cards/',
  },
  {
    title: 'Haptic Lever Simulator',
    description: 'Resistance force simulation of a haptic lever controller.',
    href: '/WeightLever/weightLever_simulation_Gemini_v4.html',
  },
  {
    title: 'Balconity',
    description: 'Digital balcony to expand the mind and inspire new ideas in coworking spaces.',
    href: '/Balconity/',
  },
  {
    title: 'MuseFlow',
    description: 'Relaxing game that promotes mind-wandering to unlock creativity during breaks.',
    href: '/MuseFlow/',
  },
  {
    title: 'EurekaWall',
    description: 'Research on mind-wandering, creativity and how a game can trigger them.',
    href: '/EurekaWall/',
  },
  {
    title: 'MemoDeutsch',
    description: 'German learning companion: grammar, verbs, vocabulary and the citizenship test.',
    href: '/Deutsch_lernen/',
  },
  {
    title: 'UX Infographic',
    description: 'Interactive infographic on UX and AI co-pilots (Spanish).',
    href: '/UX/',
  },
  {
    title: 'Project Management',
    description: 'Interactive PMBOK 7 project management guide (Spanish).',
    href: '/Project_Management/',
  },
  {
    title: 'HCI BHT',
    description: 'Animated p5.js circles landing page for HCI at BHT Berlin.',
    href: '/HCI_BHT_Website/',
  },
  {
    title: 'Particle Canvas',
    description: 'InspirationalWall: generative flocking art in p5.js.',
    href: '/ParticleCanvas/',
  },
  {
    title: 'Pixel Grid',
    description: 'InspirationalWall: a paintable pixel grid in p5.js.',
    href: '/PixelGrid/',
  },
  {
    title: 'Platform Game',
    description: 'Browser platform game prototype.',
    href: '/PlatformGame/',
  },
  {
    title: 'Tropical',
    description: 'Website for an artisan exotic gelato shop.',
    href: '/Tropical/',
  },
];
