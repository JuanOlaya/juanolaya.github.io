<script setup lang="ts">
import ModalDialog from '@shared/components/ModalDialog.vue';
import { X } from 'lucide-vue-next';
import { computed } from 'vue';
import { type Topic, type TopicId, topics } from '../content';
import MeasurementDetails from './MeasurementDetails.vue';

const props = defineProps<{ topicId: TopicId | null }>();
const emit = defineEmits<{ close: [] }>();

const topic = computed<Topic | null>(() => (props.topicId ? topics[props.topicId] : null));
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
      <div class="mb-4 flex items-start justify-between gap-3 border-b border-border pb-4">
        <div class="min-w-0">
          <h2 id="modalTitle">{{ topic.title }}</h2>
          <p class="text-ink-2 m-0">{{ topic.sub }}</p>
        </div>
        <button type="button" class="btn btn-secondary px-0" aria-label="Cerrar" @click="emit('close')">
          <X :size="24" aria-hidden="true" />
        </button>
      </div>

      <div class="grid gap-4">
        <div :class="['lead-box', `tone-${topic.tone}`]">{{ topic.lead }}</div>
        <MeasurementDetails v-if="topic.kind === 'measurement'" :formulas="topic.items" />
        <ul v-else class="infographic-list">
          <li v-for="item in topic.items" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="mt-6 border-t border-border pt-4">
        <button type="button" class="btn btn-primary w-full" @click="emit('close')">
          Entendido, ¡continuemos!
        </button>
      </div>
    </template>
  </ModalDialog>
</template>
