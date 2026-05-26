<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Local } from '@/types'
import BaseButton from '@/components/common/BaseButton.vue'
import ImageLightbox from '@/components/common/ImageLightbox.vue'

const { t } = useI18n()
defineProps<{ local: Local }>()

const lightboxOpen  = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index = 0) {
  lightboxIndex.value = index
  lightboxOpen.value  = true
}
</script>

<template>
  <article class="local-card" :class="{ 'local-card--unavailable': !local.available }">

    <!-- ── Image / Galerie ─────────────────────────────── -->
    <div class="local-card__gallery">

      <!-- Photo principale — cliquable -->
      <button
        class="local-card__main-img"
        @click="openLightbox(0)"
        :aria-label="`Voir les photos de ${local.name}`"
        :disabled="!local.images.length"
      >
        <img
          v-if="local.images[0]"
          :src="local.images[0]"
          :alt="local.name"
          loading="lazy"
        />
        <div v-else class="local-card__img-placeholder">
          <span>{{ local.name }}</span>
        </div>

        <!-- Overlay hint -->
        <div v-if="local.images.length" class="local-card__img-hint">
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-camera">
            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
          </svg>
          <span>{{ local.images.length > 1 ? `${local.images.length} photos` : 'Voir' }}</span>
        </div>

        <span
          class="local-card__badge"
          :class="local.available ? 'local-card__badge--ok' : 'local-card__badge--off'"
        >
          {{ t(local.available ? 'locaux.available' : 'locaux.unavailable') }}
          <template v-if="local.available && local.shared">
            {{ t('locaux.shared') }}
          </template>
        </span>
      </button>

      <!-- Miniatures (si > 1 photo) -->
      <div v-if="local.images.length > 1" class="local-card__thumbs">
        <button
          v-for="(img, i) in local.images.slice(0, 4)"
          :key="i"
          class="local-card__thumb"
          :class="{ 'local-card__thumb--more': i === 3 && local.images.length > 4 }"
          @click="openLightbox(i)"
          :aria-label="`Photo ${i + 1} de ${local.name}`"
        >
          <img :src="img" :alt="`${local.name} — ${i + 1}`" loading="lazy"/>
          <!-- "+N" overlay sur la 4e vignette si > 4 photos -->
          <span v-if="i === 3 && local.images.length > 4" class="local-card__thumb-more">
            +{{ local.images.length - 3 }}
          </span>
        </button>
      </div>
    </div>

    <!-- ── Body ───────────────────────────────────────── -->
    <div class="local-card__body">
      <div class="local-card__info">
        <div class="local-card__text">
          <h3 class="local-card__name">{{ local.name }}</h3>        
          <div class="local-card__meta">
            <span>{{ t('locaux.surface', { n: local.surface }) }}</span>
          </div>
        </div>
        <p class="local-card__floor">
          {{ t(local.groundFloor ? 'locaux.groundFloor' : 'locaux.firstFoor') }}
        </p>
      </div>
      
      <BaseButton
        :to="local.available ? '/contact' : undefined"
        :disabled="!local.available"
        variant="secondary"
        size="sm"
        class="local-card__cta"
      >
        {{ t(local.available ? 'locaux.book' : 'locaux.unavailable') }}
      </BaseButton>
    </div>

    <!-- ── Lightbox ───────────────────────────────────── -->
    <ImageLightbox
      v-model="lightboxOpen"
      :images="local.images"
      :alt="local.name"
      :start-index="lightboxIndex"
    />

  </article>
</template>

<style lang="scss" scoped>
.local-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  transition: border-color $transition-base, transform $transition-base;

  &:hover { border-color: rgba($color-accent, 0.4); transform: translateY(-4px); }
  &--unavailable { opacity: 0.6; &:hover { transform: none; } }

  // ── Gallery ───────────────────────────────────────────
  &__gallery { display: flex; flex-direction: column; gap: 2px; }

  // ── Main image ────────────────────────────────────────
  &__main-img {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    cursor: pointer;
    background: $color-bg-alt;
    border: none;
    padding: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-slow;
      display: block;
    }

    &:hover img { transform: scale(1.04); }

    &:hover .local-card__img-hint { opacity: 1; }
  }

  // ── Hover hint ────────────────────────────────────────
  &__img-hint {
    position: absolute;
    inset: 0;
    @include flex-center;
    flex-direction: column;
    gap: $space-2;
    background: rgba($color-bg, 0.5);
    backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity $transition-base;
    color: $color-text;

    svg {
      width: 28px;
      height: 28px;
      color: $color-accent;
    }

    span {
      @include text-mono(0.72rem);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $color-text;
    }
  }

  // ── Badge ─────────────────────────────────────────────
  &__badge {
    position: absolute;
    top: $space-3;
    right: $space-3;
    @include heading-ui(0.6rem, 700);
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    z-index: 1;

    &--ok  { background: rgba(#2ecc71, 0.15); color: #2ecc71; border: 1px solid rgba(#2ecc71, 0.3); }
    &--off { background: rgba(#602424, 0.65); color: #fe3f3f; border: 1px solid rgba(#fe3f3f, 0.3); }
  }

  // ── Placeholder ───────────────────────────────────────
  &__img-placeholder {
    @include flex-center;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg, $color-bg-alt, $color-bg-alt 10px, $color-border 10px, $color-border 11px
    );
    span { font-family: $font-display; font-size: 2rem; color: $color-text-muted; }
  }

  // ── Thumbnails ────────────────────────────────────────
  &__thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }

  &__thumb {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    cursor: pointer;
    background: $color-bg-alt;
    border: none;
    padding: 0;
    display: block;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-base, opacity $transition-base;
      display: block;
    }

    &:hover img { transform: scale(1.06); opacity: 0.85; }
  }

  // "+N" overlay
  &__thumb-more {
    position: absolute;
    inset: 0;
    @include flex-center;
    background: rgba($color-bg, 0.7);
    @include heading-ui(1rem, 700);
    color: $color-text;
    pointer-events: none;
  }

  // ── Body ──────────────────────────────────────────────
  &__body { padding: $space-6; }

  &__info {
    margin-bottom: $space-4;
  }

  &__text {
    display: flex;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.8rem;
    color: $color-text;
  }

  &__meta {
    @include text-mono(0.75rem);
    color: $color-text-muted;
    margin-left: $space-2;
  }

  &__floor {
    @include text-mono(0.75rem);
    color: $color-text-muted;
    line-height: 1rem;
  }

  &__cta { width: 100%; justify-content: center; }
}
</style>
