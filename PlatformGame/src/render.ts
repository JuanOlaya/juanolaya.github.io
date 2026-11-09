import type p5 from 'p5';
import { GRAVITY, RADIUS, type Player } from './domain/player.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from './domain/view.ts';
import type { World } from './domain/world.ts';
import type { Particle } from './particles.ts';

/** The canvas keeps its warm sky and red platforms (DESIGN-LOG exception); the HUD uses the site tokens. */
export const COLORS = {
  skyTop: '#FFE48A',
  skyBottom: '#FFD04F',
  hills: 'rgba(255, 190, 60, 0.55)',
  platform: '#E85243',
  platformTop: '#F7735F',
  player: '#198BC6',
  hud: 'rgba(22, 22, 26, 0.78)',
  hudText: '#f8ecde',
  hudMuted: '#b9b2a6',
  ink: '#2A1A0C',
} as const;

// p5 quotes the whole name, so these must be single families (loaded in main.ts before first use).
export const SANS = 'Instrument Sans Variable';
export const MONO = 'IBM Plex Mono';
const WALL = 80;

function context(p: p5): CanvasRenderingContext2D {
  return p.drawingContext as CanvasRenderingContext2D;
}

export function drawSky(p: p5, cameraX: number): void {
  const ctx = context(p);
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  // Far hills scroll slower than the platforms, which gives depth without changing the playfield.
  p.noStroke();
  p.fill(COLORS.hills);
  const offset = -(cameraX * 0.3) % 600;
  for (let x = offset - 600; x < VIEW_WIDTH + 600; x += 600) p.ellipse(x, VIEW_HEIGHT * 0.95, 760, 420);
}

export function drawWorld(p: p5, world: World): void {
  p.noStroke();
  p.fill(COLORS.platform);
  p.rect(-WALL, 0, WALL, VIEW_HEIGHT);
  p.rect(world.width, 0, WALL, VIEW_HEIGHT);
  for (const platform of world.platforms) {
    p.fill(COLORS.platform);
    p.rect(platform.x, platform.y, platform.w, platform.h, 8, 8, 0, 0);
    p.fill(COLORS.platformTop);
    p.rect(platform.x, platform.y, platform.w, 6, 8, 8, 0, 0);
  }
}

/** Squash (landing) flattens the ball against the floor it sits on; flash fades the fill to white. */
export function drawPlayer(p: p5, x: number, y: number, squash: number, flash: number): void {
  const width = RADIUS * 2 * (1 + squash);
  const height = RADIUS * 2 * (1 - squash);
  const base = p.color(COLORS.player);
  p.noStroke();
  p.fill(p.lerpColor(base, p.color('#ffffff'), flash));
  p.ellipse(x, y + (RADIUS * 2 - height) / 2, width, height);
  p.fill(255, 255, 255, 70);
  p.ellipse(x - RADIUS * 0.35, y - RADIUS * 0.4, RADIUS * 0.55, RADIUS * 0.4);
}

export function drawParticles(p: p5, particles: readonly Particle[]): void {
  p.noStroke();
  for (const particle of particles) {
    const color = p.color(particle.color);
    color.setAlpha(255 * (particle.life / particle.maxLife));
    p.fill(color);
    p.circle(particle.x, particle.y, 4 + 6 * (particle.life / particle.maxLife));
  }
}

/** The original's physics readout, same values, in a readable card. */
export function drawHud(p: p5, player: Player): void {
  const rows: [string, string][] = [
    ['Velocity X', String(Math.round(player.velocity.x))],
    ['Velocity Y', String(Math.round(player.velocity.y))],
    ['Acceleration X', String(GRAVITY.x)],
    ['Acceleration Y', String(GRAVITY.y)],
    ['Min. speed going down', String(Math.round(player.minSpeed * 10) / 10)],
  ];
  p.noStroke();
  p.fill(COLORS.hud);
  p.rect(20, 20, 330, 34 + rows.length * 24, 12);
  p.textFont(MONO);
  p.textSize(16);
  rows.forEach(([label, value], index) => {
    const y = 48 + index * 24;
    p.textAlign(p.LEFT, p.BASELINE);
    p.fill(COLORS.hudMuted);
    p.text(label, 38, y);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.fill(COLORS.hudText);
    p.text(value, 332, y);
  });
}

/** Start and pause screens; `visibility` 0..1 is already eased so the card fades and settles in. */
export function drawOverlay(p: p5, visibility: number, title: string, hint: string, uiScale: number): void {
  if (visibility <= 0) return;
  p.noStroke();
  p.fill(42, 26, 12, 120 * visibility);
  p.rect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  p.push();
  p.translate(VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + (1 - visibility) * 24);
  p.scale(uiScale);
  const card = p.color('#FFF6E0');
  card.setAlpha(245 * visibility);
  p.fill(card);
  p.rectMode(p.CENTER);
  p.rect(0, 0, 620, 220, 24);
  const ink = p.color(COLORS.ink);
  ink.setAlpha(255 * visibility);
  p.fill(ink);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont(SANS);
  p.textStyle(p.BOLD);
  p.textSize(54);
  p.text(title, 0, -32);
  p.textStyle(p.NORMAL);
  p.textSize(24);
  p.text(hint, 0, 48);
  p.pop();
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}
