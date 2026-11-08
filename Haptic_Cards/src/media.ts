import type { DeviceMedia } from './data/types';

export type MediaKind = 'youtube' | 'video' | 'image';

const VIDEO_FILE = /\.(mp4|webm|mov)$/;

export function mediaKind(media: DeviceMedia): MediaKind {
  if (media.src.includes('youtube.com') || media.src.includes('youtu.be')) return 'youtube';
  if (media.type === 'video' || VIDEO_FILE.test(media.src)) return 'video';
  return 'image';
}

/** Muted autoplay loop, as the original carousel embedded it. */
export function youTubeEmbedUrl(src: string): string {
  const embed = src.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
  return `${embed}?autoplay=1&mute=1&loop=1`;
}
