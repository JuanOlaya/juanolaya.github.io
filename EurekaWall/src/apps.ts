/** One tool of the EurekaWall toolkit, shown as a button on the half wheel. */
export interface WallApp {
  title: string;
  description: string;
  color: string;
  /** Where Start leads; relative URLs resolve against /EurekaWall/. */
  href: string;
  /** External pages open in a new tab so the wall stays open. */
  external: boolean;
}

// Order and colours of the original wheel, left to right.
export const WALL_APPS: readonly WallApp[] = [
  {
    title: 'Introduction',
    description: 'Watch this video to learn the concepts behind EurekaWall.',
    color: '#947BD3',
    href: 'https://www.youtube.com/watch?v=zMEej2gvtDo',
    external: true,
  },
  {
    title: 'MuseFlow',
    description: 'Play this undemanding video game to unlock your creativity.',
    color: '#E0AC00',
    href: '../MuseFlow/',
    external: false,
  },
  {
    title: 'SwarmCanvas',
    description: 'Create a visual work by exploring different brushes.',
    color: '#1E9CC9',
    href: '../ParticleCanvas/',
    external: false,
  },
  {
    title: 'Balcondipity',
    description: 'Find serendipitous inspiration by looking through this observation point.',
    color: '#f48c06',
    href: 'balconity/index.html',
    external: false,
  },
  {
    title: 'ShapyPresence',
    description: 'Feel a remote social presence by creating and sharing visual messages.',
    color: '#DC4141',
    href: 'pixelGrid/index.html',
    external: false,
  },
];

/** The original moved the highlight to the next tool every 12 seconds. */
export const CYCLE_MS = 12_000;

export interface CycleState {
  selected: number;
  /** Time spent on the current selection while auto-cycling. */
  elapsedMs: number;
}

/** Wraps in both directions, so Previous on the first tool selects the last one. */
export function stepSelection(selected: number, step: number, count: number): number {
  if (count <= 0) return 0;
  return (((selected + step) % count) + count) % count;
}

/** Advances the auto-cycle by `deltaMs`; at most one step per call so a long pause does not skip tools. */
export function advanceCycle(state: CycleState, deltaMs: number, count: number): CycleState {
  const elapsedMs = state.elapsedMs + Math.max(0, deltaMs);
  if (elapsedMs < CYCLE_MS) return { selected: state.selected, elapsedMs };
  return { selected: stepSelection(state.selected, 1, count), elapsedMs: 0 };
}

/** Picking a tool by hand restarts its 12 seconds. */
export function selectApp(index: number, count: number): CycleState {
  return { selected: stepSelection(index, 0, count), elapsedMs: 0 };
}
