<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  alt?: string
  startIndex?: number
  modelValue: boolean  // v-model pour open/close
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  startIndex: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const current = ref(props.startIndex)
const isAnimating = ref(false)
const direction = ref<'next' | 'prev'>('next')

// ── Navigation ─────────────────────────────────────────────────────────────────
const total = computed(() => props.images.length)

function go(index: number, dir: 'next' | 'prev' = 'next') {
  if (isAnimating.value || index === current.value) return
  direction.value = dir
  isAnimating.value = true
  setTimeout(() => {
    current.value = (index + total.value) % total.value
    isAnimating.value = false
  }, 200)
}

function next() { go(current.value + 1, 'next') }
function prev() { go(current.value - 1, 'prev') }

function close() { emit('update:modelValue', false) }

// ── Keyboard ───────────────────────────────────────────────────────────────────
function onKey(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'Escape')     close()
}

// ── Swipe (touch) ──────────────────────────────────────────────────────────────
let touchStartX = 0
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 40) return
  dx < 0 ? next() : prev()
}

// ── Reset index quand on ouvre ─────────────────────────────────────────────────
watch(() => props.modelValue, (open) => {
  if (open) {
    current.value = props.startIndex
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Reset startIndex si ça change (click sur une photo différente)
watch(() => props.startIndex, (i) => { current.value = i })

onMounted(()  => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="modelValue"
        class="lb"
        role="dialog"
        aria-modal="true"
        :aria-label="alt || 'Diaporama'"
        @click.self="close"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- Backdrop -->
        <div class="lb__backdrop" @click="close" />

        <!-- Close -->
        <button class="lb__close" @click="close" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Counter -->
        <div class="lb__counter" aria-live="polite">
          {{ current + 1 }} / {{ total }}
        </div>

        <!-- Image -->
        <div class="lb__stage">
          <Transition :name="`lb-slide-${direction}`" mode="out-in">
            <img
              :key="current"
              :src="images[current]"
              :alt="`${alt} — photo ${current + 1}`"
              class="lb__img"
              draggable="false"
            />
          </Transition>
        </div>

        <!-- Prev / Next -->
        <button
          v-if="total > 1"
          class="lb__arrow lb__arrow--prev"
          @click="prev"
          aria-label="Photo précédente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button
          v-if="total > 1"
          class="lb__arrow lb__arrow--next"
          @click="next"
          aria-label="Photo suivante"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Thumbnails -->
        <div v-if="total > 1" class="lb__thumbs" role="tablist">
          <button
            v-for="(img, i) in images"
            :key="i"
            class="lb__thumb"
            :class="{ 'lb__thumb--active': i === current }"
            @click="go(i, i > current ? 'next' : 'prev')"
            :aria-label="`Photo ${i + 1}`"
            :aria-selected="i === current"
            role="tab"
          >
            <img :src="img" :alt="`${alt} miniature ${i + 1}`" loading="lazy" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: $z-modal;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // ── Backdrop ─────────────────────────────────────────────
  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(#080806, 0.95);
    backdrop-filter: blur(8px);
  }

  // ── Close ────────────────────────────────────────────────
  &__close {
    position: absolute;
    top: $space-6;
    right: $space-6;
    z-index: 1;
    width: 40px;
    height: 40px;
    @include flex-center;
    background: rgba($color-surface, 0.8);
    border: 1px solid $color-border;
    border-radius: 50%;
    color: $color-text-muted;
    cursor: pointer;
    transition: all $transition-fast;
    @include focus-ring;

    svg { width: 18px; height: 18px; }

    &:hover {
      background: $color-surface;
      color: $color-text;
      border-color: $color-text-muted;
    }
  }

  // ── Counter ──────────────────────────────────────────────
  &__counter {
    position: absolute;
    top: $space-6;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    @include text-mono(0.75rem);
    color: $color-text-muted;
    background: rgba($color-surface, 0.7);
    padding: $space-1 $space-4;
    border-radius: 20px;
    border: 1px solid $color-border;
    letter-spacing: 0.1em;
  }

  // ── Stage ────────────────────────────────────────────────
  &__stage {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: min(90vw, 1100px);
    max-height: calc(100svh - 180px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: 60px;
  }

  &__img {
    max-width: 100%;
    max-height: calc(100svh - 180px);
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: $radius-md;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
    user-select: none;
  }

  // ── Arrows ───────────────────────────────────────────────
  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    width: 48px;
    height: 48px;
    @include flex-center;
    background: rgba($color-surface, 0.8);
    border: 1px solid $color-border;
    border-radius: 50%;
    color: $color-text-muted;
    cursor: pointer;
    transition: all $transition-fast;
    @include focus-ring;

    svg { width: 20px; height: 20px; }

    &:hover {
      background: $color-accent;
      border-color: $color-accent;
      color: $color-bg;
      transform: translateY(-50%) scale(1.05);
    }

    &--prev { left: $space-4; @include md { left: $space-8; } }
    &--next { right: $space-4; @include md { right: $space-8; } }
  }

  // ── Thumbnails ───────────────────────────────────────────
  &__thumbs {
    position: absolute;
    bottom: $space-6;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    display: flex;
    gap: $space-2;
    padding: $space-2;
    background: rgba($color-surface, 0.7);
    border: 1px solid $color-border;
    border-radius: $radius-md;
    backdrop-filter: blur(8px);
    max-width: calc(100vw - #{$space-8});
    overflow-x: auto;
  }

  &__thumb {
    flex-shrink: 0;
    width: 52px;
    height: 40px;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all $transition-fast;
    opacity: 0.5;
    @include focus-ring;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--active {
      border-color: $color-accent;
      opacity: 1;
    }

    &:hover:not(&--active) { opacity: 0.8; }
  }
}

// ── Transitions ───────────────────────────────────────────────────────────────
.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity $transition-base; }
.lb-fade-enter-from,
.lb-fade-leave-to     { opacity: 0; }

.lb-slide-next-enter-active,
.lb-slide-next-leave-active,
.lb-slide-prev-enter-active,
.lb-slide-prev-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
  position: absolute;
}

.lb-slide-next-enter-from  { opacity: 0; transform: translateX(40px); }
.lb-slide-next-leave-to    { opacity: 0; transform: translateX(-40px); }
.lb-slide-prev-enter-from  { opacity: 0; transform: translateX(-40px); }
.lb-slide-prev-leave-to    { opacity: 0; transform: translateX(40px); }
</style>
