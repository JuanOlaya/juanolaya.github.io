<script setup lang="ts">
import { computed, ref } from 'vue';
import { TARGET_OPTION, elapsedMs, improvementPercent, scenarioAOptions } from '../hick';

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
  <section
    id="concept-hick"
    class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-20"
  >
    <div class="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-5 space-y-4">
        <div class="flex items-center space-x-3 text-sky-500">
          <span class="p-2 bg-sky-50 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span class="text-sm font-bold tracking-wider uppercase">La Métrica</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-950">
            3. Ley de Hick <br /><span class="text-slate-500 text-lg font-medium">(Hick's Law)</span>
          </h2>
          <a
            href="https://lawsofux.com/hicks-law/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-all"
          >
            <span>Ver documentación en Laws of UX ↗</span>
          </a>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Establece que
          <strong
            >el tiempo que tarda una persona en tomar una decisión aumenta de forma logarítmica según el
            número y la complejidad de las opciones</strong
          >
          disponibles.
        </p>
        <p class="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          Fórmula científica:
          <!-- span, not code: MathJax skips <code> by default, which left the formula as raw TeX. -->
          <span class="text-indigo-700 font-mono text-xs">\(T = b \cdot \log_2(n + 1)\)</span>.
        </p>
      </div>

      <div class="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
        <div class="flex justify-between items-baseline">
          <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Laboratorio en vivo de UX</h3>
          <span class="text-xs text-indigo-600 font-semibold">¡Prueba la Ley de Hick!</span>
        </div>

        <p class="text-xs text-slate-500">
          Haremos un experimento sencillo. Te pediremos buscar y hacer clic en el botón
          <strong class="text-indigo-600 font-bold uppercase">"Guardar"</strong> bajo dos escenarios
          distintos. Mediremos cuántos milisegundos te toma reaccionar.
        </p>

        <div
          :class="[
            'rounded-xl border border-slate-200 p-6 min-h-[220px] flex flex-col justify-center items-center text-center',
            flashWrong ? 'bg-rose-50' : 'bg-white',
          ]"
        >
          <div v-if="stage === 'intro'" class="space-y-4">
            <span class="inline-block p-3 bg-indigo-50 text-indigo-600 rounded-full">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <h4 class="font-bold text-slate-800">¿Preparado para medir tus reflejos?</h4>
            <button
              type="button"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all shadow-md"
              @click="start"
            >
              Iniciar Experimento
            </button>
          </div>

          <div v-else-if="stage === 'scenario-a'" class="w-full space-y-4">
            <div class="text-sm font-semibold text-rose-500 mb-2">
              ESCENARIO A: Encuentra y haz clic en "GUARDAR" entre 24 opciones idénticas
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                v-for="option in options"
                :key="option"
                type="button"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-1 rounded-lg border border-slate-200 transition-colors duration-150 active:bg-slate-300"
                @click="pickOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <div v-else-if="stage === 'scenario-b'" class="w-full space-y-6">
            <div class="text-sm font-semibold text-emerald-600 mb-2">
              ESCENARIO B: Encuentra y haz clic en "GUARDAR" con un diseño enfocado
            </div>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 py-8">
              <button
                type="button"
                class="text-slate-400 hover:text-slate-600 text-sm font-medium order-3 sm:order-1"
                @click="wrongClick"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold py-3 px-10 rounded-xl shadow-md transform hover:scale-105 transition-all order-1 sm:order-2"
                @click="finishScenarioB"
              >
                Guardar
              </button>
              <button
                type="button"
                class="text-slate-400 hover:text-slate-600 text-sm font-medium order-2 sm:order-3"
                @click="wrongClick"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div v-else class="w-full space-y-4 text-left" aria-live="polite">
            <h4 class="font-bold text-lg text-slate-900 flex items-center justify-center space-x-2">
              <span>📊 Resultados de tu prueba</span>
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                <span class="text-xs text-rose-700 font-bold uppercase block">Escenario A (Saturado)</span>
                <span class="text-2xl font-black text-rose-900">{{ timeA }} ms</span>
                <p class="text-[11px] text-rose-700 mt-1">
                  Tuviste que escanear visualmente cada botón, aumentando el estrés visual.
                </p>
              </div>
              <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                <span class="text-xs text-emerald-700 font-bold uppercase block"
                  >Escenario B (Optimizado)</span
                >
                <span class="text-2xl font-black text-emerald-900">{{ timeB }} ms</span>
                <p class="text-[11px] text-emerald-700 mt-1">
                  La jerarquía visual te dirigió inmediatamente al botón principal.
                </p>
              </div>
            </div>

            <div
              class="p-3 bg-indigo-50 text-indigo-950 text-xs rounded-xl border border-indigo-100 text-center font-medium"
            >
              El diseño optimizado (B) fue un
              <span :class="['font-bold text-lg', improvement > 0 ? 'text-emerald-600' : 'text-slate-500']"
                >{{ improvement }}%</span
              >
              más rápido para tu cerebro.
            </div>

            <div class="text-center pt-2">
              <button
                type="button"
                class="text-indigo-600 hover:text-indigo-800 text-xs font-bold underline"
                @click="reset"
              >
                Volver a intentar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
