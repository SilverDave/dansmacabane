<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocauxStore } from '@/stores'
import LocalCard from '@/components/common/LocalCard.vue'
import CommonGallery from '@/components/sections/CommonGallery.vue'
import LocalesInfo from '@/components/sections/LocalesInfo.vue'

import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
const locauxStore = useLocauxStore()
useScrollReveal()

// ── Sort Locaux  ─────────────────────────────────────────────────────────────────
const locaux = computed(() => {
    if(locauxStore.availableLocaux.length > 0) {
      return [
        ...locauxStore.availableLocaux.sort((a, b) => a.surface - b.surface),
        ...locauxStore.notAvailableLocaux
      ]
    } else {
      return locauxStore.locaux.sort((a, b) => a.surface - b.surface)
    }
})

</script>

<template>
  <main class="page">
    <div class="page-hero container">
      <p class="page-hero__label">{{ t('nav.locaux') }}</p>
      <p class="page-hero__sub">{{ t('locaux.subtitle', { n: locauxStore.locaux.length }) }}</p>
    </div>
    <div class="locaux container">
      <div class="locaux__grid">
        <LocalCard
          v-for="local in locaux"
          :key="local.id"
          :local="local"
          data-reveal
        />
      </div>
      <CommonGallery />
      <LocalesInfo />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.locaux {
  padding-bottom: $space-24;

  &__grid {
    display: grid;
    gap: $space-8;
    grid-template-columns: 1fr;
    @include md { grid-template-columns: repeat(2, 1fr); }
    @include lg { grid-template-columns: repeat(3, 1fr); }

    [data-reveal] {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity $transition-slow, transform $transition-slow;

      @for $i from 1 through 6 {
        &:nth-child(#{$i}) { transition-delay: #{($i - 1) * 0.1}s; }
      }

      &.is-visible { opacity: 1; transform: none; }
    }
  }
}
</style>
