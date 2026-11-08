import { describe, expect, it } from 'vitest';
import { burst, stepParticles, type Particle } from './particles.ts';

describe('particles', () => {
  it('spawn at the origin and expire after their life', () => {
    const particles: Particle[] = [];
    burst(particles, { x: 10, y: 20 }, 5, { speed: 100, angle: 0, arc: 0, color: '#fff' }, () => 0.5);
    expect(particles).toHaveLength(5);
    expect(particles[0]).toMatchObject({ x: 10, y: 20 });
    stepParticles(particles, 0.1);
    expect(particles[0]?.x).toBeGreaterThan(10);
    stepParticles(particles, 1);
    expect(particles).toHaveLength(0);
  });
});
