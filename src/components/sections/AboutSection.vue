<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocauxStore } from '@/stores';
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
useScrollReveal()
const locauxStore = useLocauxStore()
const yearsOld = new Date().getFullYear() - 2001;
const stats = [
  { id: "years_old", value: yearsOld, labelKey: 'home.about.yearsLabel' },
  { id: "locaux", link: "/locaux", value: locauxStore.availableLocaux.length, labelKey: 'home.about.locauxLabel' },
  { id: "artistes", value: '100+', labelKey: 'home.about.artistsLabel' },
]
</script>

<template>
  <section class="about">
    <div class="about__inner container">

      <!-- Left: stats -->
      <div class="about__stats">
        <div
          v-for="stat in stats"
          :key="stat.labelKey"
          class="about__stat"
          data-reveal
        >

          <template v-if="stat.link">
            <RouterLink
              to="/locaux"
            >
              <span class="about__stat-value --link">{{ stat.value }}</span>
            </RouterLink>
          </template>
          <span v-else class="about__stat-value">{{ stat.value }}</span>
         
          <span class="about__stat-label">{{ t(stat.labelKey) }}</span>
        </div>
      </div>

      <!-- Right: text -->
      <div class="about__text" data-reveal>
        <p class="about__section-label">{{ t('home.about.title') }}</p>
        <p class="about__lead">{{ t('home.about.lead') }}</p>
        <p class="about__body">{{ t('home.about.body') }}</p>
        <p class="about__body">{{ t('home.about.body2') }}</p>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  padding-block: $space-24;
  border-top: 1px solid $color-border;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-16;

    @include lg {
      grid-template-columns: 1fr 2fr;
      align-items: start;
      gap: $space-24;
    }
  }

  // ── Stats ─────────────────────────────────────────────────
  &__stats {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: $space-8;

    @include lg {
      flex-direction: column;
      position: sticky;
      top: calc(#{$nav-height} + #{$space-8});
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    opacity: 0;
    transform: translateX(-16px);
    transition: opacity $transition-slow, transform $transition-slow;

    &.is-visible {
      opacity: 1;
      transform: none;
    }

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) { transition-delay: #{($i - 1) * 0.12}s; }
    }
  }

  &__stat-value {
    font-family: $font-display;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 1;
    color: $color-accent;
    transition: color $transition-slow 0.15s;

    &.--link:hover { color: $color-text; }
  }

  &__stat-label {
    @include text-mono(0.72rem);
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  // ── Text ─────────────────────────────────────────────────
  &__text {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity $transition-slow 0.15s, transform $transition-slow 0.15s;

    &.is-visible {
      opacity: 1;
      transform: none;
    }
  }

  &__section-label {
    @include heading-ui(0.7rem, 700);
    color: $color-accent;
    letter-spacing: 0.2em;
    margin-bottom: $space-6;
  }

  &__lead {
    font-family: $font-ui;
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: 600;
    line-height: 1.4;
    color: $color-text;
    margin-bottom: $space-6;
  }

  &__body {
    @include text-mono(0.88rem);
    color: $color-text-muted;
    line-height: 1.8;
    margin-bottom: $space-4;
  }
}
</style>
