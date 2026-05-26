<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/common/BaseButton.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
useScrollReveal()

const charges = [
  { icon: '💧', key: 'eau' },
  { icon: '⚡️', key: 'electricite' },
  { icon: '📶', key: 'internet' },
  { icon: '🗑️', key: 'dechets' },
  { icon: '🧹', key: 'nettoyage' },
]

const amenities = [
  { icon: '🚚', key: 'dechargement' },
  { icon: '🚗', key: 'parking' },
  { icon: '🍳', key: 'cuisine' },
  { icon: '🔐', key: 'acces' },
  { icon: '📷', key: 'cameras' },
  { icon: '🚪', key: 'portes' },
  { icon: '🤝', key: 'ambiance' },
]
</script>

<template>
  <section class="locales-info">
    <div class="locales-info__inner">

      <!-- ── En-tête ──────────────────────────────────── -->
      <div class="locales-info__header" data-reveal>
        <p class="locales-info__label">{{ t('locaux.localesInfo.label') }}</p>
        <p class="locales-info__lead">{{ t('locaux.localesInfo.lead') }}</p>
      </div>

      <div class="locales-info__grid">

        <!-- ── Localisation ─────────────────────────── -->
        <div class="locales-info__card locales-info__card--location" data-reveal>
          <h3 class="locales-info__card-title">
            <span class="locales-info__card-icon" aria-hidden="true">📍</span> 
            {{ t('locaux.localesInfo.location.title') }}
          </h3>
          <p class="locales-info__card-text">{{ t('locaux.localesInfo.location.address') }}</p>
          <ul class="locales-info__transport">
            <li>
              <span class="locales-info__transport-icon">🚃</span>
              {{ t('locaux.localesInfo.location.tram') }}
            </li>
            <li>
              <span class="locales-info__transport-icon">🚌</span>
              {{ t('locaux.localesInfo.location.bus') }}
            </li>
          </ul>
        </div>

        <!-- ── Charges comprises ─────────────────────── -->
        <div class="locales-info__card" data-reveal>
          <h3 class="locales-info__card-title">
            <span class="locales-info__card-icon c-accent" aria-hidden="true">✔</span> 
            {{ t('locaux.localesInfo.charges.title') }}
          </h3>
          <ul class="locales-info__list">
            <li v-for="c in charges" :key="c.key">
              <span aria-hidden="true">{{ c.icon }}</span>
              {{ t(`locaux.localesInfo.charges.${c.key}`) }}
            </li>
          </ul>
        </div>

        <!-- ── Équipements ──────────────────────────── -->
        <div class="locales-info__card" data-reveal>
          <h3 class="locales-info__card-title">
            <span class="locales-info__card-icon" aria-hidden="true">🏢</span> 
            {{ t('locaux.localesInfo.amenities.title') }}
          </h3>
          <ul class="locales-info__list">
            <li v-for="a in amenities" :key="a.key">
              <span aria-hidden="true">{{ a.icon }}</span>
              {{ t(`locaux.localesInfo.amenities.${a.key}`) }}
            </li>
          </ul>
        </div>

        <!-- ── Location & conditions ────────────────── -->
        <div class="locales-info__card locales-info__card--highlight" data-reveal>
          <h3 class="locales-info__card-title">
            <span class="locales-info__card-icon" aria-hidden="true">💡</span>
            {{ t('locaux.localesInfo.conditions.title') }}
          </h3>
          <p class="locales-info__card-text">{{ t('locaux.localesInfo.conditions.body1') }}</p>
          <p class="locales-info__card-text">{{ t('locaux.localesInfo.conditions.body2') }}</p>
          <div class="locales-info__cta">
            <BaseButton to="/contact" variant="primary" size="md">
              {{ t('locaux.localesInfo.conditions.cta') }}
            </BaseButton>
          </div>
        </div>

      </div>

      <!-- ── Bandeau contact ─────────────────────────── -->
      <div class="locales-info__contact" data-reveal>
        <p class="locales-info__contact-icon" aria-hidden="true">📩</p>
        <p class="locales-info__contact-text">{{ t('locaux.localesInfo.contact') }}</p>
        <BaseButton to="/contact" variant="secondary" size="md">
          {{ t('locaux.localesInfo.contactCta') }}
        </BaseButton>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
$icon-list: 1rem;

.c-accent {
  color: $color-accent;
}

.locales-info {
  padding-top: $space-24;

  &__inner { display: flex; flex-direction: column; gap: $space-12; }

  // ── Header ─────────────────────────────────────────────
  &__header {
    max-width: 680px;
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
    margin-bottom: $space-4;
  }

  &__lead {
    @include text-mono(0.9rem);
    color: $color-text-muted;
    line-height: 1.7;
  }

  // ── Grid ───────────────────────────────────────────────
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-4;

    @include md { grid-template-columns: repeat(2, 1fr); }
    @include xl { grid-template-columns: repeat(4, 1fr); }
  }

  // ── Card ───────────────────────────────────────────────
  &__card {
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    transition: border-color $transition-base, transform $transition-base;
    opacity: 0;
    transform: translateY(20px);

    &.is-visible { opacity: 1; transform: none; }

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) { transition: opacity $transition-slow #{($i - 1) * 0.1}s, transform $transition-slow #{($i - 1) * 0.1}s, border-color $transition-base; }
    }

    &:hover { border-color: rgba($color-accent, 0.3); transform: translateY(-3px); }

    // Carte mise en avant
    &--highlight {
      border-color: rgba($color-accent, 0.25);
      background: linear-gradient(135deg, $color-surface 60%, rgba($color-accent, 0.04));

      &:hover { border-color: rgba($color-accent, 0.5); }
    }

    // Carte localisation
    &--location { background: $color-bg-alt; }
  }

  &__card-icon {
    font-size: 1.5rem;
    line-height: 1;
    margin-right: $space-1;
  }

  &__card-title {
    font-family: $font-display;
    font-size: 1.4rem;
    color: $color-text;
    letter-spacing: 0.02em;
  }

  &__card-text {
    @include text-mono(0.82rem);
    color: $color-text-muted;
    line-height: 1.7;
  }

  // ── Transport ─────────────────────────────────────────
  &__transport {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    padding-top: $space-3;
    border-top: 1px solid $color-border;

    li {
      @include text-mono(0.78rem);
      color: $color-text-muted;
      display: flex;
      align-items: center;
      gap: $space-2;
    }
  }

  &__transport-icon { font-size: $icon-list; }

  // ── Liste ─────────────────────────────────────────────
  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-2;

    li {
      @include text-mono(0.8rem);
      color: $color-text-muted;
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-1 0;
      border-bottom: 1px solid rgba($color-border, 0.5);

      &:last-child { border-bottom: none; }

      span { font-size: $icon-list; flex-shrink: 0; }
    }
  }

  // ── CTA dans la carte ─────────────────────────────────
  &__cta { margin-top: auto; padding-top: $space-4; }

  // ── Bandeau contact ───────────────────────────────────
  &__contact {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-6;
    padding: $space-8 $space-10;
    background: $color-bg-alt;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity $transition-slow, transform $transition-slow;

    &.is-visible { opacity: 1; transform: none; }

    // Trait accent gauche
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: $color-accent;
      border-radius: 2px 0 0 2px;
    }
  }

  &__contact-icon { font-size: 1.5rem; }

  &__contact-text {
    @include text-mono(0.85rem);
    color: $color-text-muted;
    line-height: 1.6;
    flex: 1;
    min-width: 200px;
  }
}
</style>
