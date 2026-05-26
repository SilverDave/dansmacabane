<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/common/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <main class="not-found">
    <div class="not-found__inner container">
      <span class="not-found__code" aria-hidden="true">404</span>
      <h1 class="not-found__title">Page introuvable</h1>
      <p class="not-found__sub">Cette cabane n'existe pas.</p>
      <BaseButton to="/" size="lg">{{ t('common.back') }}</BaseButton>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: 100svh;
  @include flex-center;
  text-align: center;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
  }

  &__code {
    font-family: $font-display;
    font-size: clamp(8rem, 25vw, 18rem);
    line-height: 1;
    color: $color-border;
    display: block;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 4rem);
    color: $color-text;
  }

  &__sub {
    @include text-mono;
    color: $color-text-muted;
  }
}
</style>
