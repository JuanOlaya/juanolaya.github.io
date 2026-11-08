import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { mountSketch } from '@shared/p5/mount.ts';
import { mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import { approach, fitAspect, planSteps } from './clock.ts';
import { attachControls, type Controls } from './input.ts';
import { VIEW_HEIGHT, VIEW_WIDTH, generateLevel, type Level } from './level.ts';
import { burst, stepParticles, type Particle } from './particles.ts';
import { RADIUS, createPlayer, stepPlayer, type Input, type Player, type StepEvents } from './physics.ts';
import {
  drawHud,
  drawOverlay,
  drawParticles,
  drawPlayer,
  drawSky,
  drawWorld,
  easeOutCubic,
} from './render.ts';

const MAX_FRAME_SECONDS = 0.1;
const OVERLAY_SECONDS = 0.25;
const EFFECT_SECONDS = 0.18;
const MAX_SHAKE = 5;
const HARD_LANDING = 14;
const MIN_TEXT_SCALE = 0.6;
const MAX_UI_SCALE = 1.6;

interface GameState {
  level: Level;
  player: Player;
  /** Position before the last physics step, for interpolated drawing. */
  previous: { x: number; y: number };
  carry: number;
  started: boolean;
  paused: boolean;
  /** Start/pause screen visibility, 0..1, eased in and out. */
  overlay: number;
  particles: Particle[];
  shake: number;
  flash: number;
  squash: number;
  reduced: boolean;
}

function createState(reduced: boolean): GameState {
  const player = createPlayer();
  return {
    level: generateLevel(),
    player,
    previous: { x: player.x, y: player.y },
    carry: 0,
    started: false,
    paused: false,
    overlay: 1,
    particles: [],
    shake: 0,
    flash: 0,
    squash: 0,
    reduced,
  };
}

function restart(state: GameState): void {
  Object.assign(state, createState(state.reduced), { started: true, overlay: state.overlay });
}

/** Any press starts the game or resumes it. */
function wake(state: GameState): void {
  state.started = true;
  state.paused = false;
}

function togglePause(state: GameState): void {
  if (!state.started) return wake(state);
  state.paused = !state.paused;
}

function landingDust(state: GameState, speed: number): void {
  const strength = Math.min(speed / 20, 1);
  const { x, y } = state.player;
  state.squash = 0.22 * strength;
  burst(state.particles, { x, y: y + RADIUS }, 4 + Math.round(8 * strength), {
    speed: 260 * strength + 80,
    angle: -Math.PI / 2,
    arc: Math.PI * 0.9,
    color: '#FFF1C9',
  });
  if (speed >= HARD_LANDING) state.shake = MAX_SHAKE * strength;
}

/** Dust, flash and shake are feedback only; with reduced motion they are skipped entirely. */
function react(state: GameState, events: StepEvents): void {
  if (state.reduced) return;
  if (events.landingSpeed > 2) landingDust(state, events.landingSpeed);
  if (!events.wallHit) return;
  state.flash = 0.8;
  burst(state.particles, state.player, 6, { speed: 220, angle: 0, arc: Math.PI * 2, color: '#FFFFFF' });
}

function fadeEffects(state: GameState, seconds: number): void {
  const active = state.started && !state.paused;
  state.overlay = approach(state.overlay, active ? 0 : 1, seconds, state.reduced ? 0 : OVERLAY_SECONDS);
  const decay = seconds / EFFECT_SECONDS;
  state.flash = Math.max(0, state.flash - decay);
  state.squash = Math.max(0, state.squash - decay * 0.25);
  state.shake = Math.max(0, state.shake - decay * MAX_SHAKE * 0.5);
}

/** Advances the game by real time in fixed physics steps; returns the interpolation factor. */
function update(state: GameState, input: Input, seconds: number): number {
  fadeEffects(state, seconds);
  if (!state.started || state.paused) return 1;
  stepParticles(state.particles, seconds);
  const plan = planSteps(state.carry, seconds);
  state.carry = plan.carry;
  for (let i = 0; i < plan.steps; i++) {
    state.previous = { x: state.player.x, y: state.player.y };
    react(state, stepPlayer(state.player, input, state.level));
  }
  return plan.alpha;
}

function overlayText(state: GameState): [string, string] {
  if (!state.started) return ['Platform Game', 'Press ← → ↑ or tap to start'];
  return ['Paused', 'Press Space or an arrow to resume'];
}

function renderPosition(state: GameState, alpha: number): { x: number; y: number } {
  const { player, previous } = state;
  // A respawn jumps from the floor to the top; interpolating across it would draw a streak.
  if (Math.abs(player.y - previous.y) > VIEW_HEIGHT / 2) return { x: player.x, y: player.y };
  return { x: previous.x + (player.x - previous.x) * alpha, y: previous.y + (player.y - previous.y) * alpha };
}

function draw(p: p5, state: GameState, alpha: number): void {
  const { x, y } = renderPosition(state, alpha);
  const scale = p.width / VIEW_WIDTH;
  p.push();
  p.scale(scale);
  if (state.shake > 0) p.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
  drawSky(p, x);
  // Camera locked on the ball, as in the original.
  p.translate(-x + VIEW_WIDTH / 2, 0);
  drawWorld(p, state.level);
  drawParticles(p, state.particles);
  drawPlayer(p, x, y, state.squash, state.flash);
  p.pop();
  // Text would be unreadably small on a phone-sized canvas, so the HUD and cards grow back up to 1.6x.
  const uiScale = Math.min(Math.max(MIN_TEXT_SCALE / scale, 1), MAX_UI_SCALE);
  // The HUD goes under the start/pause card: scaled up on phones it would otherwise cover the title.
  p.push();
  p.scale(scale * uiScale);
  drawHud(p, state.player);
  p.pop();
  p.push();
  p.scale(scale);
  const [title, hint] = overlayText(state);
  drawOverlay(p, easeOutCubic(state.overlay), title, hint, uiScale);
  p.pop();
}

function fitCanvas(p: p5, stage: HTMLElement): void {
  const { width, height } = fitAspect(stage.clientWidth, stage.clientHeight, VIEW_WIDTH / VIEW_HEIGHT);
  if (width === p.width && height === p.height) return;
  p.resizeCanvas(Math.max(width, 1), Math.max(height, 1));
}

function createSketch(state: GameState, stage: HTMLElement, controls: Controls, observer: ResizeObserver) {
  return (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(1, 1);
      canvas.attribute('role', 'img');
      canvas.attribute('aria-label', 'Platform game: a blue ball bouncing over red platforms');
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      fitCanvas(p, stage);
      observer.observe(stage);
    };
    p.draw = () => {
      const seconds = Math.min(p.deltaTime / 1000, MAX_FRAME_SECONDS);
      draw(p, state, update(state, controls.input, seconds));
    };
    p.mousePressed = () => wake(state);
  };
}

export interface GameHost {
  stage: HTMLElement;
  pad: HTMLElement;
}

/** Mounts the game; everything it adds is removed on pagehide so a bfcache restore can mount afresh. */
export function mountPlatformGame({ stage, pad }: GameHost): () => void {
  const state = createState(prefersReducedMotion());
  const controls = attachControls(pad, () => wake(state));
  let instance: p5 | undefined;
  const observer = new ResizeObserver(() => instance && fitCanvas(instance, stage));
  const unmountSketch = mountSketch((p) => {
    instance = p;
    createSketch(state, stage, controls, observer)(p);
  }, stage);
  const unmountUi = mountSketchUi(document.body, {
    title: 'Platform Game',
    caption: 'Bounce across random platforms. ← → move, hold ↑ while rising to jump higher.',
    placement: 'top',
    controls: [
      { label: 'Pause', key: ' ', action: () => togglePause(state), pressed: () => state.paused },
      { label: 'New level', key: 'r', action: () => restart(state) },
    ],
  });
  const onVisibility = () => {
    if (document.hidden && state.started) state.paused = true;
  };
  document.addEventListener('visibilitychange', onVisibility);
  const unmount = () => {
    window.removeEventListener('pagehide', unmount);
    document.removeEventListener('visibilitychange', onVisibility);
    observer.disconnect();
    controls.remove();
    unmountUi();
    unmountSketch();
  };
  window.addEventListener('pagehide', unmount);
  return unmount;
}
