export interface ProjectPage {
  title: string;
  /** One line, shown under the title. */
  description: string;
  /** Root-relative URL of a page published by tooling/site-pages.ts. */
  href: string;
}

/**
 * Project pages linked from the home "Projects" section.
 * Each card points to the copy the owner maintains: Balcondipity and ShapyPresence live under
 * /EurekaWall/ (its Start button opens the same pages), not the older /Balconity/ and /PixelGrid/.
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
    title: 'ShapyPresence',
    description: 'EurekaWall: feel a remote social presence by sharing visual messages on a shape grid.',
    href: '/EurekaWall/pixelGrid/',
  },
  {
    title: 'Platform Game',
    description: 'Browser platform game prototype.',
    href: '/PlatformGame/',
  },
];

