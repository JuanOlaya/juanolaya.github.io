import { checkedValue } from './dom.ts';
import type { ForceKey, ServoMode } from './lever-physics.ts';

export type Task = 'motion' | 'resistance' | 'resistance_torque' | 'impact';
export type ForceFrame = 'global' | 'handle';
export type ForceType = 'mass' | 'reaction';

export interface ViewOptions {
  task: Task;
  servoMode: ServoMode;
  forceFrame: ForceFrame;
  forceType: ForceType;
  showAxes: boolean;
  showIndexes: boolean;
}

/** Reads every radio group of the control panel, as the original read them on each redraw. */
export function readViewOptions(): ViewOptions {
  return {
    task: checkedValue<Task>('task'),
    servoMode: checkedValue<ServoMode>('servoMode'),
    forceFrame: checkedValue<ForceFrame>('forceFrame'),
    forceType: checkedValue<ForceType>('forceType'),
    showAxes: checkedValue('axisVisibility') === 'on',
    showIndexes: checkedValue('axisIndex') === 'on',
  };
}

export function isResistanceTask(task: Task): boolean {
  return task === 'resistance' || task === 'resistance_torque';
}

export function forceKeyOf(options: ViewOptions): ForceKey {
  return `${options.forceType}_${options.forceFrame}`;
}
