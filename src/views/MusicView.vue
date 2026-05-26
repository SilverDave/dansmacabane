<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
useScrollReveal()

</script>

<template>
  <main class="page">
    <div class="page-hero container">
      <p class="page-hero__label">{{ t('nav.music') }}</p>
      <p class="page-hero__sub">{{ t('music.subtitle') }}</p>
    </div>

    <div class="music container">
      <!-- Track list -->
        <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/7EJNB6eJGHIbYoWvbRxosK?utm_source=generator&theme=0" width="100%" height="720" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.music {
  padding-bottom: $space-24;

  &__playlist {
    @include flex-between;
    flex-wrap: wrap;
    gap: $space-6;
    padding: $space-8;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    margin-bottom: $space-12;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity $transition-slow, transform $transition-slow;

    &.is-visible { opacity: 1; transform: none; }

    h2 {
      font-family: $font-display;
      font-size: 2rem;
      margin-bottom: $space-1;
    }
  }

  &__playlist-sub {
    @include text-mono(0.78rem);
    color: $color-text-muted;
  }

  &__tracks { border-top: 1px solid $color-border; }

  &__track {
    display: grid;
    grid-template-columns: 2rem 1fr auto auto;
    align-items: center;
    gap: $space-6;
    padding: $space-4 $space-2;
    border-bottom: 1px solid $color-border;
    transition: background $transition-fast;
    opacity: 0;
    transform: translateX(-12px);
    transition: opacity $transition-slow, transform $transition-slow, background $transition-fast;

    &.is-visible { opacity: 1; transform: none; }

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) { transition-delay: #{($i - 1) * 0.05}s; }
    }

    &:hover { background: rgba($color-accent, 0.03); }
  }

  &__track-num {
    @include text-mono(0.78rem);
    color: $color-text-muted;
  }

  &__track-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__track-title {
    font-family: $font-ui;
    font-weight: 600;
    font-size: 0.95rem;
  }

  &__track-artist {
    @include text-mono(0.75rem);
    color: $color-text-muted;
  }

  &__track-genre {
    @include heading-ui(0.6rem, 600);
    color: $color-text-muted;
    background: $color-bg-alt;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    padding: $space-1 $space-2;
    display: none;
    @include md { display: block; }
  }

  &__track-duration {
    @include text-mono(0.78rem);
    color: $color-text-muted;
  }

  &__empty {
    @include text-mono;
    color: $color-text-muted;
    text-align: center;
    padding: $space-16;
  }
}
</style>
