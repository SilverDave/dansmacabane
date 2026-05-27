<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import CommonGallery from '@/components/sections/CommonGallery.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import LocalCard from '@/components/common/LocalCard.vue'
import { useLocauxStore } from '@/stores/locaux.store'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { t } = useI18n()
const locauxStore = useLocauxStore()
const heroRef = ref<HTMLElement | null>(null)
const mainRef = ref<HTMLElement | null>(null)


useScrollReveal(
  mainRef,
  {},
  computed(() => locauxStore.availableLocauxOrRandom)
)

// Trigger hero entrance animation after mount
onMounted( () => {
  setTimeout(() => {
    const hero = document.querySelector('.hero')
    hero?.classList.add('is-ready')
  }, 100)
})

</script>

<template>
  <main ref="mainRef">
    <HeroSection ref="heroRef" />
    <AboutSection />

    <!-- Aperçu locaux -->
    <section class="preview container">
      <div class="preview__header" data-reveal>
        <div>
          <p class="preview__label">{{ t('locaux.title') }}</p>
          <h2 class="preview__title">{{ t('locaux.subtitle' , {n: locauxStore.locaux.length}) }}</h2>
        </div>
        <BaseButton to="/locaux" variant="ghost">
          {{ t('locaux.seeAll') }}
        </BaseButton>
      </div>
      <div 
        class="preview__grid" 
        v-if="locauxStore.availableLocauxOrRandom?.length"
      >    
        <LocalCard
          v-for="local in locauxStore.availableLocauxOrRandom"
          :key="local.id"
          :local="local"
          data-reveal
        />
      </div>
    </section>

    <!-- Les Communs -->
    <CommonGallery class="container"/>

    <!-- CTA final -->
    <section class="home-cta container" data-reveal>
      <div class="home-cta__inner">
        <h2 class="home-cta__title">{{ t('home.cta.title') }}</h2>
        <p class="home-cta__sub">{{ t('home.cta.subtitle') }}</p>
        <BaseButton to="/contact" size="lg">{{ t('home.cta.btn') }}</BaseButton>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
// ── Preview locaux ────────────────────────────────────────────
.preview {
  padding-block: $space-24;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-6;
    margin-bottom: $space-12;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity $transition-slow, transform $transition-slow;

    &.is-visible { opacity: 1; transform: none; }
  }

  &__label {
    @include heading-ui(0.7rem, 700);
    color: $color-accent;
    letter-spacing: 0.2em;
    margin-bottom: $space-2;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 4rem);
    color: $color-text;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-6;

    @include md { grid-template-columns: repeat(2, 1fr); }
    @include lg { grid-template-columns: repeat(3, 1fr); }

    [data-reveal] {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity $transition-slow, transform $transition-slow;

      @for $i from 1 through 6 {
        &:nth-child(#{$i}) { transition-delay: #{($i - 1) * 0.1}s; }
      }

      &.is-visible { opacity: 1; transform: none; }
    }
  }
}

// ── CTA section ───────────────────────────────────────────────
.home-cta {
  padding-block: $space-24;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity $transition-slow, transform $transition-slow;

  &.is-visible { opacity: 1; transform: none; }

  &__inner {
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: $space-16 $space-12;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba($color-accent, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 6vw, 5rem);
    color: $color-text;
    margin-bottom: $space-4;
  }

  &__sub {
    @include text-mono;
    color: $color-text-muted;
    margin-bottom: $space-8;
  }
}
</style>
