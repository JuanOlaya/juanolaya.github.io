<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { GENDER_TITLES, hasExample, highlightForm, type DemonstrativeCase } from '../demonstratives/cases.ts';
import type { DemonstrativeRow } from '../demonstratives/types.ts';
import { tableLayoutForWidth } from '../layout/table-layout.ts';
import { useViewportWidth } from '../layout/use-viewport-width.ts';
import DemonstrativeExample from './DemonstrativeExample.vue';

const props = defineProps<{ entry: DemonstrativeCase; rows: DemonstrativeRow[]; showAll: boolean }>();

// Cells opened by tap, for touch screens where the hover reveal does not exist.
const openCells = ref(new Set<string>());

function toggleCell(id: string): void {
  const next = new Set(openCells.value);
  if (!next.delete(id)) next.add(id);
  openCells.value = next;
}

function isOpen(id: string): boolean {
  return props.showAll || openCells.value.has(id);
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

// Five columns never fit a phone: below the contract's `sm` breakpoint each row becomes a card.
const viewportWidth = useViewportWidth();
const stacked = computed(() => tableLayoutForWidth(viewportWidth.value) === 'cards');
</script>

<template>
  <div v-if="stacked" class="flex flex-col gap-3">
    <article
      v-for="(row, rowIndex) in rows"
      :key="row.type"
      class="flex flex-col gap-1.5 rounded-card border border-border bg-surface p-4 text-ink"
    >
      <h3 class="m-0 flex flex-wrap items-baseline gap-2 text-base font-medium">
        <span :class="theme.chip" class="rounded px-1">{{ row.type }}</span>
        <span class="text-sm text-ink-2 italic">{{ row.typeTranslation }}</span>
      </h3>
      <dl class="m-0 flex flex-col gap-1.5">
        <div
          v-for="(form, genderIndex) in row.forms"
          :key="genderIndex"
          :class="theme.genders[genderIndex]"
          class="rounded px-2 py-1.5"
        >
          <dt class="text-xs text-ink-2">{{ GENDER_TITLES[genderIndex] }}</dt>
          <dd class="m-0">
            <span :class="theme.chip" class="rounded px-1 font-medium">{{ form.form }}</span>
            <DemonstrativeExample
              v-if="hasExample(form)"
              :example="highlighted[rowIndex][genderIndex]"
              :translation="form.translation"
              :open="isOpen(`${rowIndex}-${genderIndex}`)"
              @toggle="toggleCell(`${rowIndex}-${genderIndex}`)"
            />
          </dd>
        </div>
      </dl>
    </article>
  </div>

  <div v-else class="overflow-x-auto rounded-card border border-border bg-surface text-ink">
    <table class="w-full divide-y divide-border text-left">
      <thead>
        <tr>
          <th
            :class="theme.header"
            class="cell border-r border-border text-xs tracking-wider text-ink-2 uppercase"
          >
            Demostrativo
          </th>
          <th :class="theme.header" colspan="4" class="cell text-xs tracking-wider text-ink-2 uppercase">
            {{ entry.label }} Case (por Género)
          </th>
        </tr>
        <tr>
          <th :class="theme.genders[0]" class="cell border-r border-border text-xs text-ink-2">Tipo</th>
          <th
            v-for="(title, index) in GENDER_TITLES"
            :key="title"
            :class="theme.genders[index]"
            class="cell text-xs text-ink"
          >
            {{ title }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr v-for="(row, rowIndex) in rows" :key="row.type">
          <td :class="theme.header" class="cell min-w-32 align-top whitespace-normal">
            <span :class="theme.chip" class="rounded px-1 font-medium">{{ row.type }}</span>
            <div class="mt-1 text-xs text-ink-2 italic">{{ row.typeTranslation }}</div>
          </td>
          <td
            v-for="(form, genderIndex) in row.forms"
            :key="genderIndex"
            :class="theme.genders[genderIndex]"
            class="cell align-top whitespace-normal"
          >
            <span :class="theme.chip" class="rounded px-1 font-medium">{{ form.form }}</span>
            <DemonstrativeExample
              v-if="hasExample(form)"
              :example="highlighted[rowIndex][genderIndex]"
              :translation="form.translation"
              :open="isOpen(`${rowIndex}-${genderIndex}`)"
              @toggle="toggleCell(`${rowIndex}-${genderIndex}`)"
            />
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
  font-weight: 500;
}
</style>
