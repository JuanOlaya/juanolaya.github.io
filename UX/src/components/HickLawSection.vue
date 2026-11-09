<script setup lang="ts">
import { computed, ref } from 'vue';
import { TARGET_OPTION, elapsedMs, improvementPercent, scenarioAOptions } from '../hick';
import { BUTTON_GHOST, BUTTON_PRIMARY, BUTTON_SECONDARY, CARD, EYEBROW, PANEL } from '../ui';

type Stage = 'intro' | 'scenario-a' | 'scenario-b' | 'results';

// The original waited 400 ms after scenario A before timing B, so the transition is not counted.
const SCENARIO_B_GRACE_MS = 400;
const WRONG_FLASH_MS = 250;

const stage = ref<Stage>('intro');
const options = ref<string[]>([]);
const timeA = ref(0);
const timeB = ref(0);
const flashWrong = ref(false);
let startedAt = 0;

const improvement = computed(() => improvementPercent(timeA.value, timeB.value));

function start(): void {
  options.value = scenarioAOptions();
  stage.value = 'scenario-a';
  startedAt = performance.now();
}

function wrongClick(): void {
  flashWrong.value = true;
  setTimeout(() => (flashWrong.value = false), WRONG_FLASH_MS);
}

function finishScenarioA(): void {
  timeA.value = elapsedMs(startedAt, performance.now());
  stage.value = 'scenario-b';
  startedAt = performance.now() + SCENARIO_B_GRACE_MS;
}

function finishScenarioB(): void {
  timeB.value = Math.max(0, elapsedMs(startedAt, performance.now()));
  stage.value = 'results';
}

function pickOption(option: string): void {
  if (option === TARGET_OPTION) finishScenarioA();
  else wrongClick();
}

function reset(): void {
  timeA.value = 0;
  timeB.value = 0;
  stage.value = 'intro';
}
</script>

<template>
  <section id="concept-hick" :class="`${CARD} scroll-mt-20`">
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div class="space-y-4 lg:col-span-5">
        <div class="flex items-center gap-3 text-accent-text">
          <span class="rounded-button border border-accent/40 p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span :class="EYEBROW">La Métrica</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-[clamp(20px,1.1rem+0.5vw,26px)] leading-tight font-medium">
            3. Ley de Hick <br /><span class="text-[0.75em] text-ink-2">(Hick's Law)</span>
          </h2>
          <a
            href="https://lawsofux.com/hicks-law/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center text-[0.92em]"
            >Ver documentación en Laws of UX ↗</a
          >
        </div>
        <p class="text-ink-2">
          Establece que
          <strong class="font-medium text-ink"
            >el tiempo que tarda una persona en tomar una decisión aumenta de forma logarítmica según el
            número y la complejidad de las opciones</strong
          >
          disponibles.
        </p>
        <p class="rounded-card border border-border bg-bg p-3 text-ink-2">
          Fórmula científica:
          <!-- span, not code: MathJax skips <code> by default, which left the formula as raw TeX. -->
          <span class="font-mono text-[0.92em] text-info-text">\(T = b \cdot \log_2(n + 1)\)</span>.
        </p>
      </div>

      <div :class="`${PANEL} space-y-6 p-[clamp(16px,1.6vw,24px)] lg:col-span-7`">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h3 :class="`${EYEBROW} text-ink-2`">Laboratorio en vivo de UX</h3>
          <span class="text-caption text-accent-text">¡Prueba la Ley de Hick!</span>
        </div>

        <p class="text-[0.92em] text-ink-2">
          Haremos un experimento sencillo. Te pediremos buscar y hacer clic en el botón
          <strong class="font-medium text-accent-text uppercase">"Guardar"</strong> bajo dos escenarios
          distintos. Mediremos cuántos milisegundos te toma reaccionar.
        </p>

        <div
          :class="[
            'flex min-h-[220px] flex-col items-center justify-center rounded-card border p-6 text-center motion-safe:transition-colors',
            flashWrong ? 'border-danger bg-danger/10' : 'border-border bg-surface',
          ]"
        >
          <div v-if="stage === 'intro'" class="space-y-4">
            <span class="inline-block rounded-full border border-border p-3 text-accent-text">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h4 class="font-medium">¿Preparado para medir tus reflejos?</h4>
            <button type="button" :class="BUTTON_PRIMARY" @click="start">Iniciar Experimento</button>
          </div>

          <div v-else-if="stage === 'scenario-a'" class="w-full space-y-4">
            <div class="mb-2 text-[0.92em] font-medium text-danger">
              ESCENARIO A: Encuentra y haz clic en "GUARDAR" entre 24 opciones idénticas
            </div>
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
              <button
                v-for="option in options"
                :key="option"
                type="button"
                :class="`${BUTTON_SECONDARY} px-1 text-caption active:bg-white/20`"
                @click="pickOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <div v-else-if="stage === 'scenario-b'" class="w-full space-y-6">
            <div class="mb-2 text-[0.92em] font-medium text-success">
              ESCENARIO B: Encuentra y haz clic en "GUARDAR" con un diseño enfocado
            </div>
            <div class="flex flex-col items-center justify-center gap-4 py-8 sm:flex-row">
              <button type="button" :class="`${BUTTON_GHOST} order-3 sm:order-1`" @click="wrongClick">
                Cancelar
              </button>
              <button
                type="button"
                :class="`${BUTTON_PRIMARY} order-1 px-10 text-lg sm:order-2`"
                @click="finishScenarioB"
              >
                Guardar
              </button>
              <button type="button" :class="`${BUTTON_GHOST} order-2 sm:order-3`" @click="wrongClick">
                Eliminar
              </button>
            </div>
          </div>

          <div v-else class="w-full space-y-4 text-left" aria-live="polite">
            <h4 class="text-center text-lg font-medium">📊 Resultados de tu prueba</h4>

            <div class="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-card border border-danger/40 bg-bg p-4">
                <span :class="`${EYEBROW} block text-danger`">Escenario A (Saturado)</span>
                <span class="font-mono text-2xl font-medium">{{ timeA }} ms</span>
                <p class="mt-1 text-caption text-ink-2">
                  Tuviste que escanear visualmente cada botón, aumentando el estrés visual.
                </p>
              </div>
              <div class="rounded-card border border-success/40 bg-bg p-4">
                <span :class="`${EYEBROW} block text-success`">Escenario B (Optimizado)</span>
                <span class="font-mono text-2xl font-medium">{{ timeB }} ms</span>
                <p class="mt-1 text-caption text-ink-2">
                  La jerarquía visual te dirigió inmediatamente al botón principal.
                </p>
              </div>
            </div>

            <div class="rounded-card border border-border bg-bg p-3 text-center text-[0.92em]">
              El diseño optimizado (B) fue un
              <span
                :class="['font-mono text-lg font-medium', improvement > 0 ? 'text-success' : 'text-ink-2']"
                >{{ improvement }}%</span
              >
              más rápido para tu cerebro.
            </div>

            <div class="pt-2 text-center">
              <button type="button" :class="BUTTON_GHOST" @click="reset">Volver a intentar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
