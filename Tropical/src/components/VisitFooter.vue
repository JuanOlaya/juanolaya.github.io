<script setup lang="ts">
import { useLanguage } from '../use-language';

const { t } = useLanguage();
</script>

<template>
  <footer id="visit" class="bg-stone-50 py-24 border-t border-stone-200">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-16">
        <div>
          <h2 class="i18n text-4xl mb-8 font-unbounded uppercase">{{ t('footer_h2') }}</h2>
          <div class="space-y-6">
            <div>
              <h4 class="i18n font-bold uppercase text-xs text-stone-400 tracking-widest mb-2">
                {{ t('footer_loc') }}
              </h4>
              <p class="text-xl italic font-sans">{{ t('footer_address') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-tropical rounded-3xl p-8 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="i18n text-2xl mb-4 italic font-unbounded uppercase">{{ t('footer_club') }}</h3>
            <p class="i18n text-stone-400 mb-8 font-sans">{{ t('footer_p') }}</p>
            <!-- Like the original, the newsletter form has no backend: submitting only stays on the page. -->
            <form class="flex flex-col gap-4" @submit.prevent>
              <input
                type="email"
                :placeholder="t('footer_email')"
                :aria-label="t('footer_email')"
                class="bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:outline-none focus:border-accent-green transition-colors font-sans"
              />
              <button
                type="submit"
                class="i18n bg-accent-green text-tropical font-bold rounded-full py-4 hover:scale-105 transition-transform uppercase tracking-tighter font-sans"
              >
                {{ t('footer_btn') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
