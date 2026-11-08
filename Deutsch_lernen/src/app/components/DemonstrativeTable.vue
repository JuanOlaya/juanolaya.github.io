<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { GENDER_TITLES, hasExample, highlightForm, type DemonstrativeCase } from '../demonstratives/cases.ts';
import type { DemonstrativeRow } from '../demonstratives/types.ts';

const props = defineProps<{ entry: DemonstrativeCase; rows: DemonstrativeRow[]; showAll: boolean }>();

// Cells opened by tap, for touch screens where the hover reveal does not exist.
const openCells = ref(new Set<string>());

function toggleCell(id: string): void {
  const next = new Set(openCells.value);
  if (!next.delete(id)) next.add(id);
  openCells.value = next;
}

function isDark(genderIndex: number): boolean {
  // Neutral and Plural use the two darkest shades; light text keeps their examples legible.
  return genderIndex >= 2;
}

// Hiding all translations also closes the ones opened by tap, as the old pages did.
watch(
  () => props.showAll,
  (showAll) => {
    if (!showAll) openCells.value = new Set();
  },
);

const highlighted = computed(() =>
  props.rows.map((row) => row.forms.map((form) => highlightForm(form.example, form.form))),
);
const theme = computed(() => props.entry.theme);
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xl">
    <table class="w-full divide-y divide-gray-300 text-left">
      <thead class="bg-gray-100">
        <tr>
          <th
            :class="theme.header"
            class="cell border-r border-gray-300 text-xs font-semibold tracking-wider text-gray-700 uppercase"
          >
            Demostrativo
          </th>
          <th
            :class="theme.header"
            colspan="4"
            class="cell text-xs font-semibold tracking-wider text-gray-700 uppercase"
          >
            {{ entry.label }} Case (por Género)
          </th>
        </tr>
        <tr>
          <th
            :class="theme.genders[0]"
            class="cell border-r border-gray-300 text-xs font-semibold text-gray-700"
          >
            Tipo
          </th>
          <th
            v-for="(title, index) in GENDER_TITLES"
            :key="title"
            :class="theme.genders[index]"
            class="cell text-xs font-semibold text-gray-900"
          >
            {{ title }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(row, rowIndex) in rows" :key="row.type">
          <td :class="theme.header" class="cell min-w-32 align-top whitespace-normal">
            <span :class="theme.chip" class="rounded px-1 font-bold">{{ row.type }}</span>
            <div class="mt-1 text-xs text-gray-500 italic">{{ row.typeTranslation }}</div>
          </td>
          <td
            v-for="(form, genderIndex) in row.forms"
            :key="genderIndex"
            :class="theme.genders[genderIndex]"
            class="cell align-top whitespace-normal"
          >
            <span :class="theme.chip" class="rounded px-1 font-bold">{{ form.form }}</span>
            <button
              v-if="hasExample(form)"
              type="button"
              class="study-cell mt-1 flex w-full flex-col items-start text-left"
              :class="{ open: showAll || openCells.has(`${rowIndex}-${genderIndex}`) }"
              :aria-expanded="showAll || openCells.has(`${rowIndex}-${genderIndex}`)"
              @click="toggleCell(`${rowIndex}-${genderIndex}`)"
            >
              <span
                class="text-[0.8rem] leading-tight"
                :class="isDark(genderIndex) ? 'text-white' : 'text-gray-800'"
              >
                {{ highlighted[rowIndex][genderIndex].before
                }}<b>{{ highlighted[rowIndex][genderIndex].match }}</b
                >{{ highlighted[rowIndex][genderIndex].after }}
              </span>
              <span
                class="translation text-[0.8rem] italic"
                :class="isDark(genderIndex) ? 'text-gray-100' : 'text-gray-600'"
              >
                {{ form.translation }}
              </span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cell {
  padding: 0.3rem 0.4rem;
  font-size: 0.8rem;
}

.translation {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out;
}

.study-cell:hover .translation,
.study-cell:focus-visible .translation,
.study-cell.open .translation {
  max-height: 10rem;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .translation {
    transition: none;
  }
}
</style>
