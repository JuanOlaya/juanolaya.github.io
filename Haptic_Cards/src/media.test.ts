import { describe, expect, it } from 'vitest';
import { mediaKind, youTubeEmbedUrl } from './media';

describe('carousel media', () => {
  it('classifies YouTube links, video files and images', () => {
    expect(mediaKind({ type: 'video', src: 'https://www.youtube.com/watch?v=abc' })).toBe('youtube');
    expect(mediaKind({ type: 'image', src: 'img/demo.webm' })).toBe('video');
    expect(mediaKind({ type: 'image', src: 'img/leverforce.png' })).toBe('image');
  });

  it('turns watch and short links into muted autoplay embeds', () => {
    expect(youTubeEmbedUrl('https://www.youtube.com/watch?v=abc')).toBe(
      'https://www.youtube.com/embed/abc?autoplay=1&mute=1&loop=1',
    );
    expect(youTubeEmbedUrl('https://youtu.be/abc')).toBe(
      'https://youtube.com/embed/abc?autoplay=1&mute=1&loop=1',
    );
  });
});
