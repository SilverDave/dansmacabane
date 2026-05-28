<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  src: string
  alt: string
  ratio?: string       // ex: "16/9", "4/3", "1/1"
  objectFit?: 'cover' | 'contain'
  eager?: boolean      // désactive le lazy loading
}

withDefaults(defineProps<Props>(), {
  ratio: 'inherit',
  objectFit: 'cover',
  eager: false,
})

const loaded = ref(false)
const error  = ref(false)

function onLoad()  { loaded.value = true }
function onError() { error.value  = true }
</script>

<template>
  <div
    class="base-img"
    :style="{ aspectRatio: ratio }"
  >
    <!-- Skeleton shimmer (visible tant que pas chargé) -->
    <div
      class="base-img__skeleton"
      :class="{ 'base-img__skeleton--hidden': loaded || error }"
      aria-hidden="true"
    />

    <!-- Image réelle -->
    <img
      v-if="!error"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :style="{ objectFit }"
      class="base-img__img"
      :class="{ 'base-img__img--loaded': loaded }"
      @load="onLoad"
      @error="onError"
    />

    <!-- Fallback si image cassée -->
    <div v-else class="base-img__error" aria-label="Image non disponible">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.base-img {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: $color-surface;

  // ── Skeleton ───────────────────────────────────────────
  &__skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      $color-surface         0%,
      color.adjust($color-surface, $lightness: 4%),
      $color-surface         80%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    transition: opacity 300ms ease;
    z-index: 1;

    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  // ── Image ─────────────────────────────────────────────
  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;

    // État initial — invisible + flou
    opacity: 0;
    filter: blur(8px);
    transform: scale(1.04);
    transition:
      opacity    500ms ease,
      filter     500ms ease,
      transform  500ms ease;

    // État chargé — net + visible
    &--loaded {
      opacity: 1;
      filter: blur(0);
      transform: scale(1);
    }
  }

  // ── Fallback erreur ───────────────────────────────────
  &__error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg-alt;

    svg {
      width: 32px;
      height: 32px;
      color: $color-border;
    }
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
