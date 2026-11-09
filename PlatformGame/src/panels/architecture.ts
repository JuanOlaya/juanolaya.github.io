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

function inputStatus(input: InputState): string {
  const held = [input.left && '←', input.right && '→', input.up && '↑'].filter(Boolean);
  return held.length ? `held: ${held.join(' ')} → InputState` : 'no keys held; p5 draws the last state';
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
  const touched = report.side !== 0 || report.wallHit;
  return [
    {
      layer: 'UI · p5 + DOM',
      module: 'render.ts · input.ts · panels/',
      status: inputStatus(input),
      active: input.left || input.right || input.up,
    },
    {
      layer: 'Application',
      module: 'game.ts',
      status: report.steps
        ? `World.step(dt, input) → ${report.steps} fixed step${report.steps > 1 ? 's' : ''}`
        : 'World.step(dt, input) → 0 steps this frame',
      active: report.steps > 0,
    },
    {
      layer: 'Domain · entities',
      module: 'domain/world.ts · player.ts · vector.ts',
      status: playerStatus(report),
      active: report.steps > 0,
    },
    {
      layer: 'Domain · service',
      module: 'domain/collision.ts',
      status: collisionStatus(report),
      active: touched,
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
      layers.forEach((layer, index) => {
        const row = rows[index] as LayerRow;
        if (layer.active) row.lit = hold;
        else row.lit = Math.max(0, row.lit - seconds);
        row.item.classList.toggle('is-active', row.lit > 0);
      });
      if (elapsed < REFRESH_SECONDS && !world.lastStep.side && !world.lastStep.respawned) return;
      elapsed = 0;
      layers.forEach((layer, index) => ((rows[index] as LayerRow).status.textContent = layer.status));
    },
  };
}
