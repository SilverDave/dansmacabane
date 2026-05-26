<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageLightbox from '@/components/common/ImageLightbox.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
useScrollReveal()

// ── Types ──────────────────────────────────────────────────────────────────────
type MediaSpan = 'wide' | 'tall' | 'normal'

interface MediaItem {
  type: 'image' | 'video'
  src: string
  poster?: string        // vignette pour les vidéos
  captionKey: string
  span?: MediaSpan
}

// ── Médias — remplace src par tes vrais fichiers dans public/ ─────────────────
const items: MediaItem[] = [
  {
    type: 'image',
    src: '/images/communs/entree.png',
    captionKey: 'commonGallery.entree',
    span: 'wide',
  },
  {
    type: 'video',
    src: '/videos/communs/chargementInProgress.mp4',
    poster: '/images/communs/chargement2.jpeg',
    captionKey: '',
    span: 'tall',          // 2 lignes → parfait pour le 9/16
  },
  {
    type: 'image',
    src: '/images/communs/entreDiva.png',
    captionKey: '',
    span: 'normal',
  },
  {
    type: 'image',
    src: '/images/communs/badBoy.png',
    captionKey: '',
    span: 'normal',
  },
  {
    type: 'video',
    src: '/videos/communs/IT.mp4',
    poster: '/images/communs/IT.jpeg',
    captionKey: 'commonGallery.Ititatnita',
    span: 'tall',
  },
  {
    type: 'image',
    src: '/images/communs/escalier.png',
    captionKey: 'commonGallery.scale',
    span: 'normal',
  },
  {
    type: 'image',
    src: '/images/communs/chargement.png',
    captionKey: 'commonGallery.spaceLoad',
    span: 'normal',
  },
  {
    type: 'image',
    src: '/images/communs/salon.png',
    captionKey: 'commonGallery.spaceChill',
    span: 'wide',
  },
]

// ── Lightbox — uniquement les images (les vidéos jouent inline) ───────────────
const imageItems = items.filter(i => i.type === 'image')
const imageSrcs  = imageItems.map(i => i.src)

// Map index global → index image (pour le lightbox)
function imageIndexOf(globalIndex: number): number {
  let count = 0
  for (let i = 0; i < globalIndex; i++) {
    if (items[i].type === 'image') count++
  }
  return count
}

const lightboxOpen  = ref(false)
const lightboxIndex = ref(0)

function openLightbox(globalIndex: number) {
  lightboxIndex.value = imageIndexOf(globalIndex)
  lightboxOpen.value  = true
}

// ── Vidéo inline — lecture au clic ───────────────────────────────────────────
const playingIndex = ref<number | null>(null)

function toggleVideo(index: number) {
  playingIndex.value = playingIndex.value === index ? null : index
}

function onItemClick(item: MediaItem, index: number) {
  if (item.type === 'video') {
    toggleVideo(index)
  } else {
    openLightbox(index)
  }
}
</script>

<template>
  <section class="common-gallery">
    <div class="common-gallery__inner">

      <!-- Header -->
      <div class="common-gallery__header" data-reveal>
        <p class="common-gallery__label">{{ t('commonGallery.title') }}</p>
        <p class="common-gallery__sub">{{ t('commonGallery.subtitle') }}</p>
      </div>

      <!-- Grille -->
      <div class="common-gallery__grid">
        <button
          v-for="(item, i) in items"
          :key="i"
          class="common-gallery__item"
          :class="[
            `common-gallery__item--${item.span ?? 'normal'}`,
            item.type === 'video' && 'common-gallery__item--video',
            playingIndex === i  && 'common-gallery__item--playing',
          ]"
          @click="onItemClick(item, i)"
          :aria-label="t(item.captionKey)"
          data-reveal
        >

          <!-- ── IMAGE ── -->
          <template v-if="item.type === 'image'">
            <img :src="item.src" :alt="t(item.captionKey)" loading="lazy" />
            <div class="common-gallery__overlay">
              <span class="common-gallery__caption">{{ t(item.captionKey) }}</span>
              <svg class="common-gallery__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </template>

          <!-- ── VIDEO ── -->
          <template v-else>
            <video
              :src="item.src"
              :poster="item.poster"
              :muted="true"
              loop
              playsinline
              preload="none"
              :ref="(el) => { if (el) { (el as HTMLVideoElement)[playingIndex === i ? 'play' : 'pause']() } }"
              class="common-gallery__video"
            />

            <!-- Badge vidéo (toujours visible) -->
            <span class="common-gallery__video-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Vidéo
            </span>

            <!-- Overlay play/pause -->
            <div class="common-gallery__overlay common-gallery__overlay--video">
              <span class="common-gallery__caption">{{ t(item.captionKey) }}</span>
              <span class="common-gallery__play-btn" aria-hidden="true">
                <!-- Pause si en lecture, Play sinon -->
                <svg v-if="playingIndex === i" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </div>
          </template>
        </button>
      </div>

      <!-- Compteur -->
      <p class="common-gallery__count" data-reveal>
        <span>{{ t('commonGallery.countPhoto', { n: imageItems.length }) }}</span>
        <span class="common-gallery__count-sep">·</span>
        <span>{{ t('commonGallery.countVideo', { n: items.filter(i => i.type === 'video').length }) }}</span>
        <button class="common-gallery__count-btn" @click="openLightbox(0)">
          {{ t('commonGallery.seeAll') }}
        </button>
      </p>

    </div>

    <!-- Lightbox (photos uniquement) -->
    <ImageLightbox
      v-model="lightboxOpen"
      :images="imageSrcs"
      :alt="t('commonGallery.title')"
      :start-index="lightboxIndex"
    />
  </section>
</template>

<style lang="scss" scoped>
.common-gallery {
  padding-block: $space-24;

  &__inner {
    display: flex;
    flex-direction: column;
   //gap: $space-10;
  }

  // ── Header ─────────────────────────────────────────────
  &__header {
    max-width: 600px;
    margin-bottom: $space-10;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity $transition-slow, transform $transition-slow;
    &.is-visible { opacity: 1; transform: none; }
  }

  &__label {
    @include heading-ui(0.7rem, 700);
    color: $color-accent;
    letter-spacing: 0.2em;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 6vw, 5rem);
    line-height: 0.95;
    color: $color-text;
    margin-bottom: $space-3;
  }

  &__sub {
    @include text-mono(0.85rem);
    color: $color-text-muted;
    line-height: 1.7;
  }

  // ── Grille ─────────────────────────────────────────────
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;
    gap: $space-4;

    @include md {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 220px;
    }

    @include lg {
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 240px;
    }
  }

  // ── Item commun ────────────────────────────────────────
  &__item {
    position: relative;
    overflow: hidden;
    border-radius: $radius-md;
    cursor: pointer;
    background: $color-surface;
    border: 1px solid $color-border;
    padding: 0;
    display: block;
    // opacity: 0;
    // transform: scale(0.97);
    transition:
      opacity $transition-slow,
      transform $transition-slow,
      border-color $transition-base;

    &.is-visible { opacity: 1; transform: scale(1); }

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        transition-delay: #{($i - 1) * 0.06}s;
      }
    }

    &:hover {
      border-color: rgba($color-accent, 0.5);
      .common-gallery__overlay { opacity: 1; }
    }

    // Spans
    &--wide {
      grid-column: span 2;
      @include max-sm { grid-column: span 1; }
    }

    &--tall {
      grid-row: span 2;
      @include max-md { grid-row: span 1; }
    }

    // Image hover zoom
    &:not(&--video):hover img { transform: scale(1.06); }

    // Photo
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: bottom;
      display: block;
      transition: transform $transition-slow;
    }

    // Vidéo en lecture — bordure accent
    &--playing {
      border-color: $color-accent;
      box-shadow: 0 0 0 2px rgba($color-accent, 0.2);
    }
  }

  // ── Vidéo ──────────────────────────────────────────────
  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;  // couvre la cellule, crop propre même en 9/16
    display: block;
  }

  // Badge "Vidéo" en haut à droite (toujours visible)
  &__video-badge {
    position: absolute;
    top: $space-3;
    right: $space-3;
    display: flex;
    align-items: center;
    gap: $space-1;
    @include heading-ui(0.6rem, 700);
    color: $color-bg;
    background: $color-accent;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    pointer-events: none;
    z-index: 2;
  }

  // ── Overlay ────────────────────────────────────────────
  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba($color-bg, 0.85) 0%,
      rgba($color-bg, 0.05) 50%,
      transparent 100%
    );
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: $space-4;
    opacity: 0;
    transition: opacity $transition-base;
    z-index: 1;

    // Les vidéos ont toujours l'overlay visible (pour le play/pause)
    &--video { opacity: 1; background: linear-gradient(to top, rgba($color-bg, 0.7) 0%, transparent 60%); }
  }

  &__caption {
    @include text-mono(0.72rem);
    color: $color-text;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: $color-accent;
    flex-shrink: 0;
  }

  // Bouton play/pause centré verticalement dans l'overlay vidéo
  &__play-btn {
    @include flex-center;
    width: 36px;
    height: 36px;
    background: rgba($color-accent, 0.15);
    border: 1px solid rgba($color-accent, 0.5);
    border-radius: 50%;
    color: $color-accent;
    transition: all $transition-fast;
    flex-shrink: 0;

    .common-gallery__item:hover & {
      background: $color-accent;
      color: $color-bg;
    }
  }

  // ── Compteur ───────────────────────────────────────────
  &__count {
    @include text-mono(0.8rem);
    color: $color-text-muted;
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;
    opacity: 0;
    transition: opacity $transition-slow 0.3s;
    margin-top: $space-4;

    &.is-visible { opacity: 1; }
  }

  &__count-sep { color: $color-border; }

  &__count-btn {
    @include heading-ui(0.7rem, 700);
    color: $color-accent;
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.1em;
    padding: $space-1 0;
    border-bottom: 1px solid rgba($color-accent, 0.4);
    transition: border-color $transition-fast;
    margin-left: $space-2;
    @include focus-ring;

    &:hover { border-color: $color-accent; }
  }
}
</style>
