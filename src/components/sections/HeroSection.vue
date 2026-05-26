<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/common/BaseButton.vue'
import hendrixGuitar from '@/assets/images/hendrix_guitar.png';
import pixelShadow from '@/assets/images/pixel_shadow.png';

const { t } = useI18n()

</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${pixelShadow}), url(${hendrixGuitar})` }">
    <!-- Background noise texture -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-grid" />
      <div class="hero__bg-gradient" />
    </div>

    <div class="hero__content container">
      <div class="hero__text">
        <h1 class="hero__title" data-reveal>
          <span class="hero__title-line">Dans</span>
          <span class="hero__title-line hero__title-line--accent">Ma</span>
          <span class="hero__title-line">Cabane</span>
        </h1>

        <p class="hero__tagline" data-reveal>{{ t('home.hero.tagline') }}</p>
        <p class="hero__subtitle" data-reveal>{{ t('home.hero.subtitle') }}</p>

        <div class="hero__ctas" data-reveal>
          <BaseButton to="/contact" size="lg">
            {{ t('home.hero.cta') }}
          </BaseButton>
          <BaseButton to="/locaux" variant="secondary" size="lg">
            {{ t('home.hero.ctaSecondary') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>

.hero {
  position: relative;
  height: 100vh;
  min-height: 650px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: $nav-height;
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;

  // ── Background ───────────────────────────────────────────
  &__bg {
    position: absolute;
    inset: 0;
    z-index: $z-below;
  }

  &__bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba($color-border, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba($color-border, 0.3) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
  }

  &__bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba($color-accent, 0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 20%, rgba($color-red, 0.04) 0%, transparent 60%);
  }

  // ── Content ──────────────────────────────────────────────
  &__content {
    position: relative;
    padding-top: $space-16;
    padding-bottom: $space-24;
  }

  // ── Since ────────────────────────────────────────────────
  &__since {
    @include text-mono(0.75rem);
    color: $color-text;
    text-shadow: $color-bg 1px 0 5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-6;
  }

  &__since-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $color-accent;
    animation: pulse 2s ease-in-out infinite;
  }

  // ── Title ────────────────────────────────────────────────
  &__title {
    @include flex-col;
    font-family: $font-display;
    font-size: clamp(5rem, 10vw, 8rem);
    line-height: 0.9;
    letter-spacing: -0.01em;
    margin-bottom: $space-8;

    &-line {
      display: block;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity $transition-slow, transform $transition-slow;

      @for $i from 1 through 3 {
        &:nth-child(#{$i}) {
          transition-delay: #{($i - 1) * 0.1}s;
        }
      }
    }

    &-line--accent { color: $color-accent; }
  }

  // ── Tagline ──────────────────────────────────────────────
  &__tagline {
    font-family: $font-ui;
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 600;
    line-height: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-text;
    margin-bottom: 0;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity $transition-slow 0.3s, transform $transition-slow 0.3s;
  }

  &__subtitle {
    @include text-mono;
    color: $color-text;
    margin-bottom: $space-8;
    opacity: 0;
    transition: opacity $transition-slow 0.4s;
  }

  // ── CTAs ─────────────────────────────────────────────────
  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: $space-4;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity $transition-slow 0.5s, transform $transition-slow 0.5s;
  }

  // ── Reveal animations (triggered by is-visible) ──────────
  [data-reveal].is-visible &__title-line,
  .hero__title-line { /* initially hidden handled above */ }

  // Trigger on mount via JS, or use CSS :not(.no-js)
  &.is-ready {
    .hero__title-line,
    .hero__tagline,
    .hero__subtitle,
    .hero__ctas {
      opacity: 1;
      transform: none;
    }
  }
}

// Animations
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
