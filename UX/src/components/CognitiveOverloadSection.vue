<script setup lang="ts">
import { chaosButtons, chaosMeta, chaosTabs } from '../content';
import { CARD, EYEBROW, PANEL } from '../ui';
</script>

<template>
  <section id="concept-overload" :class="`${CARD} scroll-mt-20`">
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div class="space-y-4 lg:col-span-5">
        <div class="flex items-center gap-3 text-danger">
          <span class="rounded-button border border-danger/30 p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </span>
          <span :class="EYEBROW">El Problema</span>
        </div>
        <h2 class="text-[clamp(20px,1.1rem+0.5vw,26px)] leading-tight font-medium">
          1. Sobrecarga Cognitiva <br /><span class="text-[0.75em] text-ink-2">(Cognitive Overload)</span>
        </h2>
        <p class="text-ink-2">
          Ocurre cuando la cantidad de información, decisiones y elementos en pantalla supera la capacidad de
          procesamiento del cerebro humano.
        </p>
        <p class="text-ink-2">
          Al intentar procesar pestañas, tablas, botones de colores y textos simultáneamente en un espacio
          reducido, el usuario experimenta fatiga, confusión y finalmente abandona el sitio.
        </p>
        <div class="rounded-r-card border-l-4 border-accent bg-bg p-4">
          <p class="text-[0.92em]">
            <strong class="font-medium text-accent-text">Síntoma clave:</strong> El usuario se queda
            "paralizado" mirando la pantalla, sin saber cuál es el siguiente paso lógico.
          </p>
        </div>
      </div>

      <div class="space-y-6 lg:col-span-7">
        <h3 :class="`${EYEBROW} text-ink-2`">Demostración Visual</h3>
        <p class="sr-only">
          Comparativa ilustrativa: una tarjeta saturada de pestañas, metadatos y botones de colores frente a
          una tarjeta de estudio limpia con una sola acción principal.
        </p>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2" aria-hidden="true">
          <!-- Mal diseño: decorative mock; nothing inside is interactive. -->
          <div
            :class="`${PANEL} flex min-h-[380px] flex-col justify-between overflow-hidden border-danger/40`"
          >
            <div>
              <div class="mb-2 flex items-start justify-between gap-2">
                <h4 class="text-caption font-medium text-ink-2">TAB COMPONENT V2.4</h4>
                <span
                  class="shrink-0 rounded-[4px] border border-danger/40 px-2 py-0.5 text-[10px] font-medium text-danger uppercase"
                  >Mal Diseño (Caos)</span
                >
              </div>
              <div class="mb-3 flex flex-wrap gap-1">
                <span
                  v-for="(tab, index) in chaosTabs"
                  :key="tab"
                  :class="[
                    'rounded-[4px] px-2 py-0.5 text-[9px]',
                    index === 0 ? 'bg-info font-medium text-ink' : 'bg-white/10 text-ink-2',
                  ]"
                  >{{ tab }}</span
                >
              </div>

              <div class="space-y-2 rounded-card border border-danger/30 bg-surface p-3">
                <div class="flex items-center justify-between border-b border-border pb-1">
                  <span class="text-caption font-medium">Sprechen (hablar)</span>
                  <span class="rounded-[4px] bg-accent px-1 text-[9px] text-on-accent">Irregular</span>
                </div>
                <p class="text-[10px] text-ink-2">
                  Presens: ich spreche, du sprichst, er/sie/es spricht, wir sprechen, ihr sprecht, sie
                  sprechen.
                </p>
                <p class="text-[10px] font-medium">Ejemplo principal:</p>
                <p class="text-[9px] text-ink-2 italic">
                  "Ich spreche ein bisschen Deutsch, pero sigo aprendiendo con dedicación todos los días."
                </p>

                <div class="mt-2 grid grid-cols-2 gap-1 border-t border-border pt-2 text-[8px] text-ink-2">
                  <span v-for="item in chaosMeta" :key="item">{{ item }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-1.5 border-t border-danger/30 pt-3">
              <span
                v-for="button in chaosButtons"
                :key="button.label"
                :class="['rounded-[4px] px-2 py-1 text-[9px]', button.className]"
              >
                {{ button.label }}
              </span>
            </div>
          </div>

          <!-- Buen diseño -->
          <div :class="`${PANEL} flex min-h-[380px] flex-col justify-between border-success/40`">
            <div>
              <div class="mb-2 flex items-start justify-between gap-2">
                <h4 class="text-caption font-medium text-success uppercase">Tarjeta de Estudio</h4>
                <span
                  class="shrink-0 rounded-[4px] border border-success/40 px-2 py-0.5 text-[10px] font-medium text-success uppercase"
                  >Buen Diseño (Limpio)</span
                >
              </div>

              <div class="space-y-3 rounded-card border border-border bg-surface p-5">
                <div class="flex items-baseline justify-between">
                  <h5 class="text-lg font-medium">Sprechen</h5>
                  <span class="text-caption text-info-text">hablar</span>
                </div>

                <div class="space-y-1">
                  <span class="text-caption text-ink-2 uppercase">Presente simple</span>
                  <p class="text-[0.92em]">
                    du <span class="font-medium text-info-text">sprichst</span> • er/sie/es
                    <span class="font-medium text-info-text">spricht</span>
                  </p>
                </div>

                <div
                  class="flex items-center justify-between border-t border-border pt-2 text-caption text-ink-2"
                >
                  <span>Nivel A1</span>
                  <span class="flex items-center text-success">
                    <span class="mr-1 h-1.5 w-1.5 rounded-full bg-success"></span> Regularizado
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-success/30 pt-3">
              <span class="text-caption text-ink-2">Opciones</span>
              <span class="rounded-button bg-accent px-4 py-1.5 text-caption font-medium text-on-accent">
                Marcar aprendido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
