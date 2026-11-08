<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import { flavors } from '../content';
import { vReveal } from '../reveal';
import { useLanguage } from '../use-language';

const { t } = useLanguage();
</script>

<template>
  <section id="flavors" v-reveal class="py-24 bg-tropical text-white overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span class="i18n text-accent-green uppercase tracking-widest text-sm font-bold">{{
            t('flavors_sub')
          }}</span>
          <h2 class="i18n text-4xl mt-2 font-unbounded italic">{{ t('flavors_h2') }}</h2>
        </div>
        <div class="md:text-right">
          <p class="i18n text-stone-400 max-w-xs font-sans">{{ t('flavors_p') }}</p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoCard
          v-for="flavor in flavors"
          :key="flavor.name"
          as="article"
          :class="['glass-card p-8 rounded-3xl transition-all group', flavor.cardClass]"
        >
          <div
            :class="[
              'w-full h-56 rounded-2xl mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform',
              flavor.imageClass,
            ]"
          >
            {{ flavor.emoji }}
          </div>
          <div class="flex justify-between items-start mb-2">
            <h3 :class="['i18n text-2xl font-unbounded', flavor.nameClass]">{{ t(flavor.name) }}</h3>
            <span :class="['i18n', flavor.badgeClass]">{{ t(flavor.badge) }}</span>
          </div>
          <p class="i18n text-stone-300 text-sm mb-6 leading-relaxed">{{ t(flavor.description) }}</p>
        </InfoCard>
      </div>
    </div>
  </section>
</template>
