import { IDLE_STEP, type InputState, type StepReport, type World } from '../domain/world.ts';
import { createPanel, highlightSeconds } from './panel.ts';
import { contactName } from './physics.ts';

/** One architecture layer and what it did this frame; computed apart from the DOM so it can be tested. */
export interface LayerStatus {
  layer: string;
  module: string;
  status: string;
  /** Something happened in this layer during the frame, so it lights up. */
  active: boolean;
}

function fixed(value: number): string {
  return value.toFixed(1);
}

function heldKeys(input: InputState): string[] {
  return [input.left && '←', input.right && '→', input.up && '↑'].filter((key) => key !== false);
}

function inputStatus(held: string[]): string {
  return held.length ? `held: ${held.join(' ')} → InputState` : 'no keys held; p5 draws the last state';
}

function stepStatus(report: StepReport): string {
  if (!report.steps) return 'World.step(dt, input) → 0 steps this frame';
  return `World.step(dt, input) → ${report.steps} fixed step${report.steps > 1 ? 's' : ''}`;
}

function playerStatus(report: StepReport): string {
  if (report.respawned) return 'Player.keepInsideView(): fell out, respawned at the top';
  if (report.steps === 0) return 'idle until the next 1/30 s step';
  return 'Player.fall(): velocity += gravity, position += velocity';
}

function collisionStatus(report: StepReport): string {
  if (!report.side && !report.wallHit) return 'resolveCollisions(): no contact';
  const landing = report.landingSpeed ? ` · landed at ${fixed(report.landingSpeed)}, bounced ×1.05` : '';
  return `resolveCollisions(): ${contactName(report)}${landing}`;
}

/** The four layers, outermost first, each with a live one-liner. */
export function describeFrame(report: StepReport, input: InputState): LayerStatus[] {
  const held = heldKeys(input);
  const stepped = report.steps > 0;
  return [
    {
      layer: 'UI · p5 + DOM',
      module: 'render.ts · input.ts · panels/',
      status: inputStatus(held),
      active: held.length > 0,
    },
    { layer: 'Application', module: 'game.ts', status: stepStatus(report), active: stepped },
    {
      layer: 'Domain · entities',
      module: 'domain/world.ts · player.ts · vector.ts',
      status: playerStatus(report),
      active: stepped,
    },
    {
      layer: 'Domain · service',
      module: 'domain/collision.ts',
      status: collisionStatus(report),
      active: report.side !== 0 || report.wallHit,
    },
  ];
}

const REFRESH_SECONDS = 0.1;

interface LayerRow {
  item: HTMLLIElement;
  status: HTMLElement;
  /** Seconds of highlight left. */
  lit: number;
}

function layerRow(layer: LayerStatus): LayerRow {
  const item = document.createElement('li');
  item.className = 'arch-layer';
  const name = document.createElement('span');
  name.className = 'arch-layer__name';
  name.textContent = layer.layer;
  const module = document.createElement('code');
  module.className = 'arch-layer__module';
  module.textContent = layer.module;
  const status = document.createElement('span');
  status.className = 'arch-layer__status';
  status.textContent = layer.status;
  item.append(name, module, status);
  return { item, status, lit: 0 };
}

/** Keeps a layer lit for `hold` seconds after it last acted. */
function light(row: LayerRow, active: boolean, hold: number, seconds: number): void {
  row.lit = active ? hold : Math.max(0, row.lit - seconds);
  row.item.classList.toggle('is-active', row.lit > 0);
}

export interface ArchitecturePanel {
  update(world: World, input: InputState, seconds: number): void;
}

/** Shows the DDD layers and lights up the ones that did something this frame. */
export function mountArchitecturePanel(
  host: HTMLElement,
  collapsed: boolean,
  reduced: boolean,
): ArchitecturePanel {
  const panel = createPanel(
    'Architecture',
    'Dependencies point inwards: p5 and the DOM call the application, which drives a domain that knows nothing about either.',
    collapsed,
  );
  const list = document.createElement('ol');
  list.className = 'arch-layers';
  const rows = describeFrame(IDLE_STEP, { left: false, right: false, up: false }).map(layerRow);
  list.append(...rows.map((row) => row.item));
  panel.body.append(list);
  host.append(panel.element);
  const hold = highlightSeconds(reduced);
  let elapsed = REFRESH_SECONDS;
  return {
    update(world, input, seconds) {
      elapsed += seconds;
      const layers = describeFrame(world.lastStep, input);
      layers.forEach((layer, index) => light(rows[index] as LayerRow, layer.active, hold, seconds));
      const eventful = world.lastStep.side !== 0 || world.lastStep.respawned;
      if (elapsed < REFRESH_SECONDS && !eventful) return;
      elapsed = 0;
      layers.forEach((layer, index) => ((rows[index] as LayerRow).status.textContent = layer.status));
    },
  };
}
