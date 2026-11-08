import './style.css';
import { byId, checkedValue, context2d, radios } from './dom.ts';
import { HapticLeverSystem, clamp, type LeverState } from './lever-physics.ts';
import { drawForcePlot, drawHandleTorquePlot, drawTorquePlot } from './plots.ts';
import {
  renderAngleReadouts,
  renderAngularMomentum,
  renderForceReadouts,
  type ReadoutElements,
} from './readouts.ts';
import { drawScene } from './scene.ts';
import {
  forceKeyOf,
  isResistanceTask,
  readViewOptions,
  type Task,
  type ViewOptions,
} from './view-options.ts';

const ANIMATION_OMEGA = 0.6;

const system = new HapticLeverSystem();

const ui = {
  slider: byId('slider', HTMLInputElement),
  sliderLabel: byId('sliderLabel', HTMLLabelElement),
  sliderRange: byId('sliderRange', HTMLSpanElement),
  rangeSlider: byId('rangeSlider', HTMLInputElement),
  rangeSliderValue: byId('rangeSliderValue', HTMLSpanElement),
  rangeControl: byId('rangeControlContainer', HTMLDivElement),
  playPause: byId('playPauseBtn', HTMLButtonElement),
  stop: byId('stopBtn', HTMLButtonElement),
  mainTitle: byId('mainTitle', HTMLHeadingElement),
  jointPlotTitle: byId('jointPlotTitle', HTMLHeadingElement),
  forceReadoutTitle: byId('forceReadoutTitle', HTMLDivElement),
  angularPlotContainer: byId('angularMomentumPlotContainer', HTMLDivElement),
  angularFieldset: byId('angularMomentumFieldset', HTMLFieldSetElement),
  angularToggle: byId('toggleAngularMomentum', HTMLLegendElement),
  angularToggleIcon: byId('angularMomentumToggleIcon', HTMLSpanElement),
};

const canvases = {
  scene: context2d(byId('viz', HTMLCanvasElement)),
  joint: context2d(byId('jointPlot', HTMLCanvasElement)),
  torque: context2d(byId('torquePlot', HTMLCanvasElement)),
  handleTorque: context2d(byId('angularMomentumPlot', HTMLCanvasElement)),
};

const readouts: ReadoutElements = {
  thetaH: byId('thetaHBreakdown', HTMLDivElement),
  betaS: byId('betaSBreakdown', HTMLDivElement),
  psi: byId('psiBreakdown', HTMLDivElement),
  alpha: byId('alphaBreakdown', HTMLDivElement),
  gamma: byId('gammaBreakdown', HTMLDivElement),
  gammaDef: byId('gammaDef', HTMLSpanElement),
  forceFx: byId('forceReadoutBreakdownFx', HTMLDivElement),
  forceFy: byId('forceReadoutBreakdownFy', HTMLDivElement),
  torque: byId('torqueReadoutBreakdown', HTMLDivElement),
  angularMomentum: byId('angularMomentumBreakdown', HTMLDivElement),
};

const animation = { isPlaying: false, rafId: 0, lastT: null as number | null, phase: 0, amplitude: 45 };

function currentRange(): number {
  return parseFloat(ui.rangeSlider.value);
}

function computeState(options: ViewOptions, input: number): LeverState {
  switch (options.task) {
    case 'resistance':
      return system.updateResistance(input, options.servoMode);
    case 'resistance_torque':
      return system.updateResistanceTorque(input);
    case 'impact':
      return system.updateImpact(input);
    case 'motion':
      return system.updateMotion(input);
  }
}

function forceTitle(options: ViewOptions): string {
  if (options.forceFrame === 'global') return 'Forces at the Joint';
  return options.forceType === 'mass' ? 'Mass Force at Handle Frame' : 'Reaction Force at Handle Frame';
}

function drawAll() {
  const options = readViewOptions();
  const state = computeState(options, parseFloat(ui.slider.value));
  ui.angularFieldset.classList.toggle('hidden', !isResistanceTask(options.task));

  drawScene(canvases.scene, system, state, options, currentRange());
  drawForcePlot(
    canvases.joint,
    system.mg,
    state.forces[forceKeyOf(options)],
    options.forceFrame,
    options.showIndexes,
  );
  drawTorquePlot(canvases.torque, system, state);
  if (isResistanceTask(options.task)) drawHandleTorquePlot(canvases.handleTorque, system, currentRange());

  renderForceReadouts(readouts, system, state, options);
  renderAngleReadouts(readouts, state, options);
  renderAngularMomentum(readouts, system);
  const title = forceTitle(options);
  ui.jointPlotTitle.textContent = title;
  ui.forceReadoutTitle.textContent = title;
}

function setPlayUI(playing: boolean) {
  animation.isPlaying = playing;
  ui.playPause.setAttribute('aria-pressed', String(playing));
  ui.playPause.innerHTML = playing ? '❚❚ Pause' : '▶ Play';
}

function animate(t: number) {
  if (!animation.isPlaying) return;
  if (animation.lastT == null) animation.lastT = t;
  const dt = (t - animation.lastT) / 1000;
  animation.lastT = t;
  animation.phase += ANIMATION_OMEGA * dt;
  ui.slider.value = String(animation.amplitude * Math.sin(animation.phase));
  drawAll();
  animation.rafId = requestAnimationFrame(animate);
}

function togglePlay() {
  if (animation.isPlaying) {
    setPlayUI(false);
    cancelAnimationFrame(animation.rafId);
    return;
  }
  // Resume from the slider's current position instead of jumping to phase 0.
  animation.phase = Math.asin(clamp(parseFloat(ui.slider.value) / animation.amplitude, -1, 1));
  animation.lastT = null;
  setPlayUI(true);
  animate(performance.now());
}

function stop() {
  cancelAnimationFrame(animation.rafId);
  setPlayUI(false);
  ui.slider.value = '0';
  animation.phase = 0;
  animation.lastT = null;
  drawAll();
}

function onSliderInput() {
  if (animation.isPlaying) {
    setPlayUI(false);
    cancelAnimationFrame(animation.rafId);
  }
  drawAll();
}

function setSliderBounds(min: number, max: number, amplitude: number, rangeText: string) {
  ui.slider.min = String(min);
  ui.slider.max = String(max);
  animation.amplitude = amplitude;
  ui.sliderRange.textContent = rangeText;
}

function onRangeInput() {
  const range = currentRange();
  setSliderBounds(-range, range, range, `Range: [−${range}°, +${range}°]`);
  ui.rangeSliderValue.textContent = `${range}°`;
  const value = parseFloat(ui.slider.value);
  if (value > range || value < -range) ui.slider.value = '0';
  drawAll();
}

/** Titles, slider bounds and visible panels of a task. */
function applyTask(task: Task) {
  if (isResistanceTask(task)) {
    const range = currentRange();
    ui.mainTitle.textContent = 'Resistance Force Simulation';
    ui.sliderLabel.textContent = 'Handle Displacement (Δθh)';
    setSliderBounds(-range, range, range, `Range: [−${range}°, +${range}°]`);
  } else if (task === 'motion') {
    ui.mainTitle.textContent = 'Motion Force Simulation';
    ui.sliderLabel.textContent = 'Servo Angle (βs)';
    setSliderBounds(-81, 81, 81, 'Range: [−81°, +81°]');
  } else {
    ui.mainTitle.textContent = 'Impact Simulation';
    ui.sliderLabel.textContent = 'Impact Angle (γ)';
    setSliderBounds(270, 360, 90, 'Range: [270°, 360°]');
  }
  ui.rangeControl.style.display = isResistanceTask(task) ? 'block' : 'none';
  ui.angularFieldset.classList.toggle('hidden', !isResistanceTask(task));
}

function onTaskChange(event: Event) {
  const task = (event.target as HTMLInputElement).value as Task;
  applyTask(task);
  ui.slider.value = task === 'impact' ? '270' : '0';
  drawAll();
}

function toggleAngularMomentum() {
  readouts.angularMomentum.classList.toggle('hidden');
  ui.angularPlotContainer.classList.toggle('hidden');
  const collapsed = readouts.angularMomentum.classList.contains('hidden');
  ui.angularToggleIcon.textContent = collapsed ? '►' : '▼';
}

function bindEvents() {
  ui.playPause.addEventListener('click', togglePlay);
  ui.stop.addEventListener('click', stop);
  ui.slider.addEventListener('input', onSliderInput);
  ui.rangeSlider.addEventListener('input', onRangeInput);
  radios('task').forEach((radio) => radio.addEventListener('change', onTaskChange));
  // `axisIndex` had no listener in the original either: the index labels update on the next redraw.
  for (const group of ['forceType', 'forceFrame', 'servoMode', 'axisVisibility']) {
    radios(group).forEach((radio) => radio.addEventListener('change', drawAll));
  }
  window.addEventListener('resize', drawAll);
  ui.angularToggle.addEventListener('click', toggleAngularMomentum);
}

bindEvents();
applyTask(checkedValue<Task>('task'));
ui.slider.value = '0';
drawAll();
