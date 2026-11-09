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
 * (`multitouchTest`, `TestingSoSci`) and personal pages.
 * (UX Infographic, Project Management, HCI BHT, ShapyPresence - see TODO.md).
 * (`multitouchTest`, `TestingSoSci`) and personal pages.
 * (MemoDeutsch, Project Management, HCI BHT, ShapyPresence - see TODO.md).
 * (`multitouchTest`, `TestingSoSci`) and personal pages.
 * (MemoDeutsch, UX Infographic, HCI BHT, ShapyPresence - see TODO.md).
 * (`multitouchTest`, `TestingSoSci`) and personal pages.
 * (MemoDeutsch, UX Infographic, Project Management - see TODO.md).
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
    description: 'Teaching game for OOP, physics simulation and DDD.',
    href: '/PlatformGame/',
  },
  {
    title: 'MemoDeutsch',
    description: 'German-learning PWA: verb trainer, grammar tables and the Einbürgerungstest.',
    href: '/Deutsch_lernen/',
  },
  {
    title: 'UX Infographic',
    description: 'Interactive infographic on UX laws with a Gemini AI co-pilot (in Spanish).',
    href: '/UX/',
  },
  {
    title: 'Project Management',
    description:
      'Interactive PMBOK 7 guide in Spanish: principles, performance domains and agile practice cases.',
    href: '/Project_Management/',
  },
  {
    title: 'ShapyPresence',
    description: 'EurekaWall: a shared board of shapes to feel a remote social presence.',
    href: '/EurekaWall/pixelGrid/',
  },
  {
    title: 'HCI BHT',
    description: 'Generative p5.js circles for Human-Computer Interaction at BHT Berlin.',
    href: '/HCI_BHT_Website/',
  },
];
