export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectPage {
  title: string;
  /** One line, shown under the title. */
  description: string;
  /** Root-relative URL of a page published by tooling/site-pages.ts. */
  href: string;
  /** Optional secondary or external links (e.g. publication DOI). */
  links?: readonly ProjectLink[];
}

export interface ProjectCategory {
  name: string;
  projects: readonly ProjectPage[];
}

/**
 * Projects categorized by theme for the home page showcase:
 * - Teaching: Haptic Cards, Platform Game
 * - Research: MuseFlow (with DOI publication link)
 * - Interaction: Balcondipity, Particle Canvas
 *
 * EXCLUSION RULE: By explicit user instruction, the following projects MUST NEVER
 * be listed on the home page:
 * - MemoDeutsch (/Deutsch_lernen/)
 * - UX Infographics (/UX/)
 * - Project Management (/Project_Management/)
 * - ShapyPresence (/EurekaWall/pixelGrid/ or /PixelGrid/)
 * - HCI BHT (/HCI_BHT_Website/)
 */
export const projectCategories: readonly ProjectCategory[] = [
  {
    name: 'Teaching',
    projects: [
      {
        title: 'Haptic Cards',
        description: 'Dashboard of 21 mechanism patterns for haptic VR controllers.',
        href: '/Haptic_Cards/',
      },
      {
        title: 'Platform Game',
        description: 'Teaching game for OOP, physics simulation and DDD.',
        href: '/PlatformGame/',
      },
    ],
  },
  {
    name: 'Research',
    projects: [
      {
        title: 'MuseFlow',
        description: 'Relaxing game that promotes mind-wandering to unlock creativity during breaks.',
        href: '/MuseFlow/',
        links: [
          {
            label: 'doi.org/10.1007/978-3-030-85613-7_9',
            href: 'https://doi.org/10.1007/978-3-030-85613-7_9',
          },
        ],
      },
    ],
  },
  {
    name: 'Interaction',
    projects: [
      {
        title: 'Balcondipity',
        description: 'EurekaWall: a digital balcony for serendipitous inspiration in coworking spaces.',
        href: '/EurekaWall/balconity/',
      },
      {
        title: 'Particle Canvas',
        description: 'InspirationalWall: generative flocking art in p5.js.',
        href: '/ParticleCanvas/',
      },
    ],
  },
];

/**
 * Flat list of unique project pages across all categories.
 */
export const projectPages: readonly ProjectPage[] = Array.from(
  new Map(
    projectCategories.flatMap((category) => category.projects).map((page) => [page.href, page])
  ).values()
);
