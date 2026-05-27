<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  poster?: string
  label?: string        // aria-label pour l'accessibilité
}

withDefaults(defineProps<Props>(), {
  label: 'Vidéo',
})

const videoRef   = ref<HTMLVideoElement | null>(null)
const isMuted    = ref(true)
const isPlaying  = ref(false)

function toggleMute() {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

// Pause quand la vidéo sort du viewport (économie batterie)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!videoRef.value) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        videoRef.value?.play()
        isPlaying.value = true
      } else {
        videoRef.value?.pause()
        isPlaying.value = false
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(videoRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="vplayer" :aria-label="label">

    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      :muted="true"
      loop
      playsinline
      preload="metadata"
      class="vplayer__video"
    />

    <!-- Bouton son -->
    <button
      class="vplayer__mute"
      :class="{ 'vplayer__mute--on': !isMuted }"
      @click="toggleMute"
      :aria-label="isMuted ? 'Sound on' : 'Sounf off'"
      :aria-pressed="!isMuted"
    >
      <!-- Son coupé -->
      <svg v-if="isMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="23" y1="9" x2="17" y2="15" stroke-linecap="round"/>
        <line x1="17" y1="9" x2="23" y2="15" stroke-linecap="round"/>
      </svg>
      <!-- Son actif -->
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 010 7.07" stroke-linecap="round"/>
        <path d="M19.07 4.93a10 10 0 010 14.14" stroke-linecap="round"/>
      </svg>

      <span class="vplayer__mute-label">
        {{ isMuted ? 'Off' : 'On' }}
      </span>
    </button>

    <!-- Indicateur muet (visible qd muted, disparaît après 2s au hover) -->
    <div class="vplayer__muted-hint" :class="{ 'vplayer__muted-hint--hidden': !isMuted }" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="23" y1="9" x2="17" y2="15" stroke-linecap="round"/>
        <line x1="17" y1="9" x2="23" y2="15" stroke-linecap="round"/>
      </svg>
      <span>Appuie pour le son</span>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.vplayer {
  position: relative;
  width: 100%;
  max-width: 360px;          // largeur max smartphone portrait
  aspect-ratio: 9 / 16;     // vertical natif
  overflow: hidden;
  border-radius: $radius-lg;
  background: $color-bg;
  border: 1px solid $color-border;

  // ── Vidéo ──────────────────────────────────────────────
  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  // ── Bouton son ─────────────────────────────────────────
  &__mute {
    position: absolute;
    bottom: $space-4;
    right: $space-4;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    background: rgba($color-bg, 0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba($color-border, 0.8);
    border-radius: 20px;
    color: $color-text-muted;
    cursor: pointer;
    transition: all $transition-fast;
    @include focus-ring;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      transition: color $transition-fast;
    }

    &:hover {
      background: rgba($color-surface, 0.95);
      border-color: $color-accent;
      color: $color-accent;

      svg { color: $color-accent; }
    }

    // Son actif → accent
    &--on {
      background: rgba($color-accent, 0.15);
      border-color: rgba($color-accent, 0.5);
      color: $color-accent;

      svg { color: $color-accent; }
    }
  }

  &__mute-label {
    @include text-mono(0.65rem);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  // ── Hint "appuie pour le son" ──────────────────────────
  // Apparaît au centre au début, fade out après quelques secondes
  &__muted-hint {
    position: absolute;
    bottom: $space-16;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    background: rgba($color-bg, 0.7);
    backdrop-filter: blur(6px);
    border-radius: 20px;
    border: 1px solid $color-border;
    pointer-events: none;
    animation: fadeHint 3s ease forwards;
    animation-delay: 1.5s;
    opacity: 0;  // démarre invisible, l'animation gère

    svg {
      width: 14px;
      height: 14px;
      color: $color-text-muted;
    }

    span {
      @include text-mono(0.68rem);
      color: $color-text-muted;
      white-space: nowrap;
    }

    &--hidden { display: none; }  // caché si son déjà activé
  }
}

// Hint : apparaît → reste → disparaît
@keyframes fadeHint {
  0%   { opacity: 0; transform: translateX(-50%) translateY(4px); }
  15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
</style>
