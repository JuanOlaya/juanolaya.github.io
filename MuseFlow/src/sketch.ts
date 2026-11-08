import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { frameScale } from '@shared/p5/frame-scale.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { isTypingTarget, mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import { WORLD_HEIGHT, columnTop } from './columns.ts';
import { type Game, answerProbe, createGame, progress, stepGame } from './game.ts';
import { LEVELS, formatDuration, levelIndexFromSearch } from './levels.ts';
import { BALL_RADIUS } from './player.ts';
import { createProbeDialog } from './probe-dialog.ts';
import { summarize } from './probes.ts';
import {
  type HeldInput,
  cameraTarget,
  directionOf,
  pointerDirection,
  stepCamera,
  worldScale,
} from './view.ts';

const SKY = '#9FBDE3';
const COLUMN = '#043C62';
const VISITED_COLUMN = '#001F3C';
const FLAG = '#F04242';
const INK = '#001529';

interface MuseFlowState {
  levelIndex: number;
  game: Game;
  paused: boolean;
  input: HeldInput;
  camera: number;
  /** The how-to hint stays until the ball first moves. */
  moved: boolean;
  reduced: boolean;
}

function restart(state: MuseFlowState, levelIndex = state.levelIndex): void {
  state.levelIndex = levelIndex;
  state.game = createGame(LEVELS[levelIndex].platforms);
  state.camera = 0;
  state.moved = false;
}

function drawColumns(p: p5, game: Game, left: number, right: number): void {
  p.noStroke();
  game.columns.forEach((column, index) => {
    if (column.x > right || column.x + column.width < left) return;
    p.fill(index <= game.reached ? VISITED_COLUMN : COLUMN);
    p.rect(column.x, columnTop(column), column.width, WORLD_HEIGHT);
  });
}

function drawFlag(p: p5, game: Game): void {
  const goal = game.columns[game.columns.length - 1];
  if (!goal) return;
  const x = goal.x + goal.width / 2 - 20;
  const y = columnTop(goal) - 110;
  p.noStroke();
  p.fill(FLAG);
  p.rect(x, y, 6, 110, 3);
  p.triangle(x + 6, y, x + 76, y + 25, x + 6, y + 50);
}

function drawBall(p: p5, state: MuseFlowState): void {
  const { x, y } = state.game.ball;
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(7);
  p.circle(x, y, BALL_RADIUS * 2 - 7);
  if (state.reduced) return;
  // A spoke that turns with the distance rolled, so the ball reads as rolling, not sliding.
  const angle = x / BALL_RADIUS;
  p.strokeWeight(4);
  p.line(x, y, x + Math.cos(angle) * BALL_RADIUS * 0.6, y + Math.sin(angle) * BALL_RADIUS * 0.6);
}

function drawWorld(p: p5, state: MuseFlowState, scale: number): void {
  const visibleWidth = p.width / scale;
  p.push();
  p.translate(0, p.height - WORLD_HEIGHT * scale);
  p.scale(scale);
  p.translate(-state.camera, 0);
  drawColumns(p, state.game, state.camera, state.camera + visibleWidth);
  drawFlag(p, state.game);
  drawBall(p, state);
  p.pop();
}

/** Along the bottom, over the columns: the panel sits on top so it never hides the ball. */
function drawHud(p: p5, game: Game): void {
  const barWidth = Math.min(240, p.width * 0.4);
  const y = p.height - 28;
  p.noStroke();
  p.fill(255, 255, 255, 70);
  p.rect(16, y, barWidth, 12, 6);
  p.fill(255);
  p.rect(16, y, barWidth * progress(game), 12, 6);
  p.textSize(16);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`Platforms ${game.reached}  ·  ${formatDuration(game.elapsedMs)}`, p.width - 16, y + 6);
}

function message(state: MuseFlowState): string | undefined {
  const { game } = state;
  if (game.finished) {
    const { onTask, offTask } = summarize(game.answers);
    return `Goal reached in ${formatDuration(game.elapsedMs)}\nOn-task ${onTask} · Off-task ${offTask}\nPress R to play again`;
  }
  if (state.paused) return 'Paused';
  if (!state.moved)
    return 'Roll with ← → or hold the left / right side of the screen.\nWait for the next column to line up.';
  return undefined;
}

function drawMessage(p: p5, text: string): void {
  p.noStroke();
  p.fill(INK);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(Math.max(16, Math.min(24, p.width / 30)));
  p.textLeading(Math.max(22, Math.min(34, p.width / 22)));
  p.text(text, 16, p.height * 0.2, p.width - 32, p.height * 0.3);
}

function update(
  state: MuseFlowState,
  deltaMs: number,
  scale: number,
  width: number,
  onProbe: () => void,
): void {
  const frames = frameScale(deltaMs);
  const direction = directionOf(state.input);
  if (direction !== 0) state.moved = true;
  if (!state.paused) {
    const wasProbing = state.game.probing;
    stepGame(state.game, direction, frames, Math.min(deltaMs, 250));
    if (!wasProbing && state.game.probing) onProbe();
  }
  const target = cameraTarget(state.game.ball.x, width / scale);
  state.camera = stepCamera(state.camera, target, frames, state.reduced);
}

function bindPointer(canvas: HTMLCanvasElement, input: HeldInput): void {
  const press = (event: PointerEvent) => {
    if (event.type === 'pointerdown') canvas.setPointerCapture(event.pointerId);
    else if (!canvas.hasPointerCapture(event.pointerId)) return;
    input.pointer = pointerDirection(event.offsetX, canvas.clientWidth);
  };
  const release = () => (input.pointer = 0);
  canvas.addEventListener('pointerdown', press);
  canvas.addEventListener('pointermove', press);
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
}

function createSketch(state: MuseFlowState, onProbe: () => void): (p: p5) => void {
  return (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      canvas.elt.setAttribute('aria-label', 'MuseFlow game: roll the ball from column to column');
      bindPointer(canvas.elt as HTMLCanvasElement, state.input);
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw = () => {
      const scale = worldScale(p.width, p.height);
      update(state, p.deltaTime, scale, p.width, onProbe);
      p.background(SKY);
      drawWorld(p, state, scale);
      drawHud(p, state.game);
      const text = message(state);
      if (text) drawMessage(p, text);
    };
  };
}

const ARROWS: Record<string, keyof Omit<HeldInput, 'pointer'>> = { ArrowLeft: 'left', ArrowRight: 'right' };

function bindKeys(input: HeldInput): () => void {
  const onKey = (event: KeyboardEvent) => {
    const side = ARROWS[event.key];
    if (!side || isTypingTarget(event.target)) return;
    event.preventDefault();
    input[side] = event.type === 'keydown';
  };
  const release = () => Object.assign(input, { left: false, right: false, pointer: 0 });
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  window.addEventListener('blur', release);
  return () => {
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('keyup', onKey);
    window.removeEventListener('blur', release);
  };
}

/** Holds the loop while the tab is hidden; nothing moves that nobody can see. */
function bindVisibility(getSketch: () => p5 | undefined): () => void {
  const onChange = () => (document.hidden ? getSketch()?.noLoop() : getSketch()?.loop());
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** MuseFlow: the mind-wandering study game, roll a ball over rising and sinking columns to the flag. */
export function mountMuseFlow(host: HTMLElement): Unmount {
  const levelIndex = levelIndexFromSearch(window.location.search);
  const state = {
    paused: false,
    input: { left: false, right: false, pointer: 0 },
    reduced: prefersReducedMotion(),
  } as MuseFlowState;
  restart(state, levelIndex);
  let sketch: p5 | undefined;
  const probe = createProbeDialog(host, (attention) => answerProbe(state.game, attention));
  const unmountSketch = mountSketch((p) => {
    sketch = p;
    createSketch(state, () => probe.show())(p);
  }, host);
  const unbindKeys = bindKeys(state.input);
  const unbindVisibility = bindVisibility(() => sketch);
  const unmountUi = mountSketchUi(host, {
    title: 'MuseFlow',
    placement: 'top',
    caption:
      'A mind-wandering study game: roll the ball over moving columns to the flag and answer the thought probes.',
    controls: [
      { label: 'Pause', key: 'p', action: () => (state.paused = !state.paused), pressed: () => state.paused },
      { label: 'Restart', key: 'r', action: () => restart(state) },
      { label: 'Next level', key: 'l', action: () => restart(state, (state.levelIndex + 1) % LEVELS.length) },
    ],
  });
  let mounted = true;
  return () => {
    if (!mounted) return;
    mounted = false;
    unmountUi();
    unbindKeys();
    unbindVisibility();
    probe.remove();
    unmountSketch();
  };
}
