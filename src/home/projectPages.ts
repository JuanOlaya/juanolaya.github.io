export interface ProjectPage {
  title: string;
  /** One line, shown under the title. */
  description: string;
  /** Root-relative URL of a page published by tooling/site-pages.ts. */
  href: string;
}

/**
 * Project pages linked from the home "Projects" section.
 * Each card points to the copy the owner maintains: Balcondipity lives under
 * /EurekaWall/ (its Start button opens the same pages), not the older /Balconity/.
 * Left out on purpose: archived (`legacy/`) and redirect-stub folders, Sockets, test pages
 * (`multitouchTest`, `TestingSoSci`), personal pages, and projects pending improvement
 * (UX Infographic, Project Management, HCI BHT, ShapyPresence - see TODO.md).
 */
export const projectPages: readonly ProjectPage[] = [
  {
    title: 'Haptic Cards',
    description: 'Dashboard of 21 mechanism patterns for haptic VR controllers.',
    href: '/Haptic_Cards/',
  },
  {
    title: 'Balcondipity',
    description: 'EurekaWall: a digital balcony for serendipitous inspiration in coworking spaces.',
    href: '/EurekaWall/balconity/',
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
    title: 'Particle Canvas',
    description: 'InspirationalWall: generative flocking art in p5.js.',
    href: '/ParticleCanvas/',
  },
  {
    title: 'Platform Game',
    description: 'Browser platform game prototype.',
    href: '/PlatformGame/',
  },
  {
    title: 'MemoDeutsch',
    description: 'German-learning PWA: verb trainer, grammar tables and the Einbürgerungstest.',
    href: '/Deutsch_lernen/',
  },
];
