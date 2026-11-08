<script setup lang="ts">
import ModalDialog from '@shared/components/ModalDialog.vue';
import { computed } from 'vue';
import { type Topic, type TopicId, leadClassByTone, topics } from '../content';
import MeasurementDetails from './MeasurementDetails.vue';

const props = defineProps<{ topicId: TopicId | null }>();
const emit = defineEmits<{ close: [] }>();

const topic = computed<Topic | null>(() => (props.topicId ? topics[props.topicId] : null));
const leadClass = computed(() =>
  topic.value ? (topic.value.leadClass ?? leadClassByTone[topic.value.tone]) : '',
);
</script>

<template>
  <ModalDialog
    :open="topic !== null"
    labelled-by="modalTitle"
    overlay-class="modal-overlay"
    panel-class="modal-content"
    @close="emit('close')"
  >
    <template v-if="topic">
      <div class="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h3 id="modalTitle" class="text-3xl font-black text-indigo-800 leading-tight">{{ topic.title }}</h3>
          <p class="text-lg font-medium text-indigo-500 italic mt-1">{{ topic.sub }}</p>
        </div>
        <button
          type="button"
          class="text-slate-400 hover:text-rose-500 transition-colors"
          aria-label="Cerrar"
          @click="emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="text-slate-700 leading-relaxed text-base space-y-6">
        <div :class="leadClass">{{ topic.lead }}</div>
        <MeasurementDetails v-if="topic.kind === 'measurement'" :formulas="topic.items" />
        <ul v-else class="infographic-list">
          <li v-for="item in topic.items" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="mt-8 pt-6 border-t">
        <button
          type="button"
          class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95"
          @click="emit('close')"
        >
          Entendido, ¡continuemos!
        </button>
      </div>
    </template>
  </ModalDialog>
</template>
