<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useVideoStore } from '@/stores/video.store'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
const videoStore = useVideoStore()
useScrollReveal()
</script>

<template>
  <main class="page">
    <div class="page-hero container">
      <p class="page-hero__label m-none">{{ t('nav.video') }}</p>
      <p class="page-hero__sub">{{ t('video.subtitle') }}</p>
    </div>

    <div class="videos container">
      <div v-if="videoStore.videos.length" class="videos__grid">
        <article
          v-for="video in videoStore.videos"
          :key="video.id"
          class="video-card"
          data-reveal
        >
          <div class="video-card__embed">
            <iframe
              :src="`https://www.youtube.com/embed/${video.youtubeId}`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            />
          </div>
        </article>
      </div>
      <p v-else class="videos__empty">{{ t('video.empty') }}</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.videos {
  padding-bottom: $space-24;

  &__grid {
    display: grid;
    gap: $space-8;
    grid-template-columns: 1fr;
    @include md { grid-template-columns: repeat(2, 1fr); }
  }

  &__empty {
    @include text-mono;
    color: $color-text-muted;
    text-align: center;
    padding: $space-16;
  }
}

.video-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity $transition-slow, transform $transition-slow, border-color $transition-base;

  &.is-visible { opacity: 1; transform: none; }

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) { transition-delay: #{($i - 1) * 0.08}s; }
  }

  &:hover { border-color: rgba($color-accent, 0.4); }

  &__embed {
    position: relative;
    @include ratio(16, 9);

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    padding: $space-4 $space-6;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    margin-bottom: $space-2;
  }

  &__meta {
    @include text-mono(0.75rem);
    color: $color-text-muted;
  }

  &__sep { margin-inline: $space-2; }
}
</style>
