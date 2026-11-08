import type { PatternName } from './patterns';
import type { Sensation } from './sensations';

export type { PatternName } from './patterns';
export type { Sensation } from './sensations';

export interface Pattern {
  name: PatternName;
  icon: string;
}

export interface MechanismFamily {
  id: string;
  name: string;
  icon: string;
  patterns: readonly PatternName[];
}

export interface DeviceMedia {
  type: 'image' | 'video';
  /** A local `img/…` file or a YouTube URL, following the folder README's media rules. */
  src: string;
  caption?: string;
}

/** Result of the literature audit that backs the versatility rating (1–5 stars). */
export interface HapticAudit {
  score: number;
  ticks_str: string;
  sensations: readonly Sensation[];
  status: string;
}

export interface Device {
  name: string;
  /** The mechanism pattern the controller belongs to. */
  category: PatternName;
  author: string;
  title: string;
  mechanism: string;
  useCaseText: string;
  useCaseTags: readonly string[];
  generalUseCases: readonly string[];
  submodalities: readonly Sensation[];
  media: readonly DeviceMedia[];
  doi: string;
  publication: string;
  year: string;
  audit: HapticAudit;
}
