<script setup lang="ts">
import { chaosButtons, chaosMeta, chaosTabs } from '../content';
</script>

<template>
  <section
    id="concept-overload"
    class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-20"
  >
    <div class="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-5 space-y-4">
        <div class="flex items-center space-x-3 text-rose-500">
          <span class="p-2 bg-rose-50 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </span>
          <span class="text-sm font-bold tracking-wider uppercase">El Problema</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-slate-950">
          1. Sobrecarga Cognitiva <br /><span class="text-slate-500 text-lg font-medium"
            >(Cognitive Overload)</span
          >
        </h2>
        <p class="text-slate-600 leading-relaxed">
          Ocurre cuando la cantidad de información, decisiones y elementos en pantalla supera la capacidad de
          procesamiento del cerebro humano.
        </p>
        <p class="text-slate-600 leading-relaxed">
          Al intentar procesar pestañas, tablas, botones de colores y textos simultáneamente en un espacio
          reducido, el usuario experimenta fatiga, confusión y finalmente abandona el sitio.
        </p>
        <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
          <p class="text-sm text-amber-800 font-medium">
            <strong>Síntoma clave:</strong> El usuario se queda "paralizado" mirando la pantalla, sin saber
            cuál es el siguiente paso lógico.
          </p>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-6">
        <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Demostración Visual</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Mal diseño: decorative mock, its buttons intentionally do nothing -->
          <div
            class="border-2 border-rose-100 rounded-2xl bg-rose-50/20 p-4 relative overflow-hidden flex flex-col justify-between min-h-[380px]"
          >
            <div
              class="absolute top-2 right-2 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded"
            >
              Mal Diseño (Caos)
            </div>

            <div>
              <h4 class="text-xs font-bold text-slate-400 mb-2">TAB COMPONENT V2.4</h4>
              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="(tab, index) in chaosTabs"
                  :key="tab"
                  :class="[
                    'text-[9px] px-2 py-0.5 rounded cursor-pointer',
                    index === 0 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-200 text-slate-600',
                  ]"
                  >{{ tab }}</span
                >
              </div>

              <div class="space-y-2 bg-white p-3 rounded-xl border border-rose-200">
                <div class="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span class="text-xs font-bold text-slate-700">Sprechen (hablar)</span>
                  <span class="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">Irregular</span>
                </div>
                <p class="text-[10px] text-slate-500">
                  Presens: ich spreche, du sprichst, er/sie/es spricht, wir sprechen, ihr sprecht, sie
                  sprechen.
                </p>
                <p class="text-[10px] font-semibold text-slate-700">Ejemplo principal:</p>
                <p class="text-[9px] italic text-slate-600">
                  "Ich spreche ein bisschen Deutsch, pero sigo aprendiendo con dedicación todos los días."
                </p>

                <div
                  class="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-[8px] text-slate-400"
                >
                  <span v-for="item in chaosMeta" :key="item">{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-rose-100">
              <button
                v-for="button in chaosButtons"
                :key="button.label"
                type="button"
                :class="['text-[9px] px-2 py-1 rounded', button.className]"
              >
                {{ button.label }}
              </button>
            </div>
          </div>

          <!-- Buen diseño -->
          <div
            class="border-2 border-emerald-100 rounded-2xl bg-emerald-50/20 p-4 relative flex flex-col justify-between min-h-[380px]"
          >
            <div
              class="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded"
            >
              Buen Diseño (Limpio)
            </div>

            <div>
              <h4 class="text-xs font-bold text-emerald-600 uppercase mb-2">Tarjeta de Estudio</h4>

              <div class="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm space-y-3">
                <div class="flex justify-between items-baseline">
                  <h5 class="text-lg font-bold text-slate-900">Sprechen</h5>
                  <span class="text-xs text-indigo-600 font-medium">hablar</span>
                </div>

                <div class="space-y-1">
                  <span class="text-[10px] text-slate-400 uppercase font-semibold">Presente simple</span>
                  <p class="text-xs text-slate-700 font-medium">
                    du <span class="text-indigo-600 font-bold">sprichst</span> • er/sie/es
                    <span class="text-indigo-600 font-bold">spricht</span>
                  </p>
                </div>

                <div
                  class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"
                >
                  <span>Nivel A1</span>
                  <span class="flex items-center text-emerald-600">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span> Regularizado
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between pt-3 border-t border-emerald-100">
              <button type="button" class="text-slate-500 hover:text-slate-700 text-xs font-semibold">
                Opciones
              </button>
              <button
                type="button"
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all"
              >
                Marcar aprendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
