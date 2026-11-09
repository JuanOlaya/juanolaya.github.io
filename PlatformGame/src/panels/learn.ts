import type { InputState, World } from '../domain/world.ts';
import { mountArchitecturePanel } from './architecture.ts';
import { initialCollapsed } from './panel.ts';
import { mountPhysicsPanel } from './physics.ts';

export interface LearnPanels {
  onFrame(world: World, input: InputState, seconds: number): void;
  remove(): void;
}

/** Both explanatory panels, fed once per frame by the game. */
export function mountLearnPanels(host: HTMLElement, reduced: boolean): LearnPanels {
  const collapsed = initialCollapsed(window.innerWidth);
  const physics = mountPhysicsPanel(host, collapsed);
  const architecture = mountArchitecturePanel(host, collapsed, reduced);
  return {
    onFrame(world, input, seconds) {
      physics.update(world, seconds);
      architecture.update(world, input, seconds);
    },
    remove() {
      host.replaceChildren();
    },
  };
}
