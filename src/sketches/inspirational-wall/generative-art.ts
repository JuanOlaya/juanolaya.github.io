import { frameScale } from '@shared/p5/frame-scale.ts';
import type p5 from 'p5';
import {
  align,
  cohesion,
  createAgent,
  move,
  seek,
  separate,
  wrap,
  type Agent,
  type AgentRandom,
} from './flocking.ts';
import type { Point } from './layout.ts';
import { BACKGROUND_COLOR, BUTTON_COLOR, type WallState } from './state.ts';
import { Vec2 } from './vec2.ts';

const VELOCITY_ROTATION = 0.09;
const SEEK_STRENGTH = 5;
const LINE_HALF_LENGTH = 20;
/** Toolbar row: icons sit on discs this far above the bottom edge. */
const TOOLBAR_OFFSET_Y = 50;
const BUTTON_DISC_DIAMETER = 57;

/** Screen 20: two flocks of shapes; with two fingers each flock follows its own finger. */
export function drawGenerativeArt(p: p5, state: WallState, touches: readonly Point[]): void {
  if (state.clearBackground) p.background(BACKGROUND_COLOR);
  const rng = agentRandom(p);
  if (state.groupA.length < state.amountShapes) state.groupA.push(createAgent(rng, p.width, p.height));
  if (state.groupB.length < state.amountShapes) state.groupB.push(createAgent(rng, p.width, p.height));

  const [targetA, targetB] = flockTargets(p, touches);
  const frames = frameScale(p.deltaTime);
  updateFlock(p, state, state.groupA, targetA, frames);
  updateFlock(p, state, state.groupB, targetB, frames);
  drawToolbar(p, state);
}

function agentRandom(p: p5): AgentRandom {
  return {
    random: (min, max) => (max === undefined ? p.random(min) : p.random(min, max)),
    pick: (choices) => p.random([...choices]),
  };
}

/** One pointer (or none) drives both flocks; two or more touches split them. */
function flockTargets(p: p5, touches: readonly Point[]): [Vec2, Vec2] {
  if (touches.length > 1) return [new Vec2(touches[0].x, touches[0].y), new Vec2(touches[1].x, touches[1].y)];
  const pointer = new Vec2(p.mouseX, p.mouseY);
  return [pointer, pointer];
}

function updateFlock(p: p5, state: WallState, group: Agent[], target: Vec2, frames: number): void {
  for (const agent of group) {
    if (!state.paused) {
      if (p.mouseIsPressed) seek(agent, target, SEEK_STRENGTH);
      separate(agent, group, 1);
      align(agent, group);
      cohesion(agent, group, p.mouseY < p.height / 2, 1);
      move(agent, state.speedFactor, frames);
      wrap(agent, p.width, p.height);
    }
    renderAgent(p, state, agent, frames);
  }
}

function renderAgent(p: p5, state: WallState, agent: Agent, frames: number): void {
  if (state.shape === 1) {
    p.rectMode(p.CENTER);
    p.strokeWeight(1);
    p.stroke(agent.color);
    p.noFill();
    p.push();
    p.translate(agent.pos.x, agent.pos.y);
    p.rotate(agent.vel.heading());
    p.line(-LINE_HALF_LENGTH, 0, LINE_HALF_LENGTH, 0);
    p.pop();
    return;
  }
  if (state.shape !== 2 && state.shape !== 3) return;
  if (!state.paused) agent.rot = agent.rot + VELOCITY_ROTATION * frames;
  p.push();
  p.translate(agent.pos.x, agent.pos.y);
  p.rotate(agent.rot);
  p.rectMode(p.CENTER);
  p.fill(state.shape === 2 ? agent.crossColor : agent.rectColor);
  p.stroke(0);
  p.strokeWeight(2);
  if (state.shape === 2) {
    p.rect(0, 0, agent.ancho, agent.ancho / 4, 50);
    p.rect(0, 0, agent.ancho / 4, agent.ancho, 50);
  } else {
    p.rect(0, 0, agent.ancho, agent.ancho / 4);
  }
  p.pop();
}

/** Dark disc behind every toolbar icon. */
function buttonDisc(p: p5, x: number): void {
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.ellipse(x, p.height - TOOLBAR_OFFSET_Y, BUTTON_DISC_DIAMETER, BUTTON_DISC_DIAMETER);
}

function drawToolbar(p: p5, state: WallState): void {
  const y = p.height - TOOLBAR_OFFSET_Y;
  drawTraceButton(p, y);
  drawPauseButton(p, state, y);
  drawShapeButtons(p, y);
  drawSpeedAndAmountButtons(p, y);
  drawPrintButton(p, y);
  p.rectMode(p.CORNER);
}

function drawTraceButton(p: p5, y: number): void {
  buttonDisc(p, 50);
  p.rectMode(p.CENTER);
  p.noFill();
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(2);
  p.rect(40, y, 16, 16);
  p.rect(45, y, 16, 16);
  p.rect(50, y, 16, 16);
  p.fill(BUTTON_COLOR);
  p.rect(55, y, 16, 16);
}

function drawPauseButton(p: p5, state: WallState, y: number): void {
  buttonDisc(p, 120);
  p.fill(BUTTON_COLOR);
  if (state.paused) {
    p.triangle(111, y - 13, 111, y + 13, 134, y);
    return;
  }
  p.rectMode(p.CENTER);
  p.rect(114, y, 8, 25);
  p.rect(126, y, 8, 25);
}

function outlinedButton(p: p5, x: number): void {
  buttonDisc(p, x);
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(2);
  p.noFill();
  p.rectMode(p.CENTER);
}

function drawShapeButtons(p: p5, y: number): void {
  outlinedButton(p, 190);
  p.rect(190, y, 8, 25, 50);
  p.rect(190, y, 25, 8, 50);

  outlinedButton(p, 260);
  p.rect(260, y, 8, 25);

  outlinedButton(p, 330);
  p.strokeWeight(2);
  p.line(320, y + 5, 340, y - 5);
}

function filledButton(p: p5, x: number): void {
  buttonDisc(p, x);
  p.rectMode(p.CENTER);
  p.fill(BUTTON_COLOR);
}

function drawSpeedAndAmountButtons(p: p5, y: number): void {
  filledButton(p, 400);
  p.rect(400, y, 5, 20);
  p.rect(400, y, 20, 5);

  filledButton(p, 470);
  p.rect(470, y, 20, 5);

  filledButton(p, 540);
  p.triangle(540, y - 10, 530, y + 10, 550, y + 10);

  filledButton(p, 610);
  p.triangle(610, y + 10, 600, y - 10, 620, y - 10);
}

function drawPrintButton(p: p5, y: number): void {
  buttonDisc(p, 680);
  p.rectMode(p.CENTER);
  p.noFill();
  p.fill(BUTTON_COLOR);
  p.rect(680, y, 30, 16, 3);

  p.fill(BACKGROUND_COLOR);
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(3);
  p.rect(680, y + 6, 20, 12);
  p.strokeWeight(2);
  p.line(676, y + 6, 684, y + 6);

  p.fill(BACKGROUND_COLOR);
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(3);
  p.rect(680, y - 9, 20, 8);

  p.stroke(BACKGROUND_COLOR);
  p.strokeWeight(3);
  p.point(692, y - 3);
}
