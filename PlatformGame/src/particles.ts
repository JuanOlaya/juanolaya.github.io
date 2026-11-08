/** Short-lived dots for landing dust and wall sparks; purely visual, never touches the physics. */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seconds left; removed at 0. */
  life: number;
  maxLife: number;
  color: string;
}

const PARTICLE_GRAVITY = 900;
const MAX_PARTICLES = 160;

export function burst(
  into: Particle[],
  origin: { x: number; y: number },
  count: number,
  spread: { speed: number; angle: number; arc: number; color: string },
  random: () => number = Math.random,
): void {
  for (let i = 0; i < count && into.length < MAX_PARTICLES; i++) {
    const angle = spread.angle + (random() - 0.5) * spread.arc;
    const speed = spread.speed * (0.4 + random() * 0.6);
    const life = 0.25 + random() * 0.3;
    into.push({
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      color: spread.color,
    });
  }
}

/** Moves every particle by `deltaSeconds` and drops the expired ones, in place. */
export function stepParticles(particles: Particle[], deltaSeconds: number): void {
  for (const particle of particles) {
    particle.vy += PARTICLE_GRAVITY * deltaSeconds;
    particle.x += particle.vx * deltaSeconds;
    particle.y += particle.vy * deltaSeconds;
    particle.life -= deltaSeconds;
  }
  let kept = 0;
  for (const particle of particles) if (particle.life > 0) particles[kept++] = particle;
  particles.length = kept;
}
