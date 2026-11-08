export type ProjectStatus = 'published' | 'hidden';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  links: ProjectLink[];
  /** Optional card image, relative to the site root. */
  image?: string;
  status: ProjectStatus;
}

/**
 * Research projects shown between the profile and the "Find me on" cards.
 * They were commented out in the original page, so they start hidden: switch a project
 * to `published` to show its card.
 */
export const projects: Project[] = [
  {
    title: 'MuseFlow Game',
    description:
      'Undemanding and relaxing video game to unlock creativity promoting mind-wandering episodes during break times.',
    links: [
      { label: 'Publication', url: 'https://link.springer.com/chapter/10.1007%2F978-3-030-85613-7_9' },
      { label: 'Online Game', url: '/MuseFlow/' },
      { label: 'Open Source', url: 'https://github.com/JuanOlaya/MuseFlow' },
    ],
    status: 'hidden',
  },
  {
    title: 'Balconity',
    description: 'Digital balcony to expand the mind and inspire new ideas in coworking spaces.',
    links: [{ label: 'Online Experience', url: '/EurekaWall/balconity/' }],
    status: 'hidden',
  },
  {
    title: 'InspirationalWall',
    description:
      'Two interactive experiences to facilitate positive moods, autonomy and personal meaningful.',
    links: [
      { label: 'Poster', url: 'https://dx.doi.org/10.13140/RG.2.2.25669.99046' },
      { label: 'futureWork on Gather', url: 'https://gather.town/app/G0SiADpC0D81VGYq/futurework' },
    ],
    status: 'hidden',
  },
  {
    title: 'Object-Oriented Game Development',
    description: 'Currillum to develop game physics using the Object-Oriented Programming (OOP) paradigm.',
    links: [
      { label: 'Course', url: 'https://openprocessing.org/class/57891' },
      { label: 'Github', url: 'https://github.com/JuanOlaya/OOP' },
    ],
    status: 'hidden',
  },
  {
    title: 'Full-Body for Live Coding',
    description: 'Interactive mat to generate visuals and sounds during live coding performances.',
    links: [{ label: 'Link paper', url: 'https://zenodo.org/record/3946303#.YOXrjugzaUk' }],
    status: 'hidden',
  },
  {
    title: 'Socializing with a Smart Space',
    description:
      'Visual affective cues to understand how to provide social capabilities to a mixed reality environment.',
    links: [
      {
        label: 'Report',
        url: 'https://www.researchgate.net/publication/352284845_Expresiones_del_XIM_Socializando_con_un_robot_no_antropomorfico',
      },
      {
        label: 'Demo Video',
        url: 'https://www.youtube.com/watch?v=acY4CaYMU7U&list=PLBD3ein1xee3-U3jtAEAsn_oqIB82Vh5B&index=4',
      },
    ],
    status: 'hidden',
  },
  {
    title: 'Agile Constru- Colectiva',
    description:
      'Automating project management based on Agile methodologies and Computer-supported cooperative work.',
    links: [
      { label: 'Poster', url: 'https://www.researchgate.net/publication/329915709_Agile_ConstruColectiva' },
      {
        label: 'Report',
        url: 'https://www.researchgate.net/publication/267808702_ConstruColectiva_Guia_metodologica_para_la_gestion_de_proyectos_de_software_basados_en_metodologias_agiles_utilizando_ambientes_de_desarrollo_colaborativo',
      },
    ],
    status: 'hidden',
  },
];

export function publishedProjects(list: readonly Project[]): Project[] {
  return list.filter((project) => project.status === 'published');
}
