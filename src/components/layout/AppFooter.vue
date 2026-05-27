<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSocialStore } from '@/stores/social.store'
import type { NavItem } from '@/types'

const { t } = useI18n()
const socialStore = useSocialStore()
const year = computed(() => new Date().getFullYear())

const navItems = computed<NavItem[]>(() => [
  { key: 'home',    path: '/' },
  { key: 'locaux',  path: '/locaux' },
  { key: 'music',   path: '/music' },
  { key: 'video',   path: '/video' },
  { key: 'contact', path: '/contact' },
])
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <!-- Brand -->
      <div class="footer__brand">
        <RouterLink to="/">
          <div class="footer__logo">
            <p>
              <img src="/images/logo.png" alt="Dans Ma Cabane"/> <br>
              Dans Ma Cabane
            </p>
          </div>
        </RouterLink>
        <p class="footer__tagline">
          {{ t('footer.tagline') }}
          <br>
          {{ t('footer.location') }}
        </p>
      </div>

      <!-- Nav -->
      <nav class="footer__nav" aria-label="Footer navigation">
        <p class="footer__nav-title">{{ t('footer.nav') }}</p>
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.path"
          class="footer__nav-link"
        >
          {{ t(`nav.${item.key}`) }}
        </RouterLink>
      </nav>

      <!-- Contact -->
      <div class="footer__contact">
        <!-- Social links -->
        <p class="footer__nav-title m-none">{{ t('footer.social') }}</p>
        <div class="footer__social">
          <a
            v-for="link in socialStore.links"
            :key="link.platform"
            :href="link.url"
            :aria-label="link.label"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__social-link"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Contact -->
        <p class="footer__nav-title m-none">Contact</p>
        <a href="mailto:dansmacabane@gmail.com" class="footer__nav-link m-none">
          dansmacabane@gmail.com
        </a>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer__bottom">
      <div class="container">
        <span>{{ t('footer.rights', { year }) }}</span>
        <span class="footer__credit">
          {{ t('footer.madeBy') }} <a href="http://www.silverdave.be" target="_blank" rel="noopener">SilverDave</a>
        </span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: $color-bg-alt;
  border-top: 1px solid $color-border;
  margin-top: $space-32;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-12;
    padding-top: $space-16;
    padding-bottom: $space-16;

    @include md {
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: $space-8;
    }
  }

  // ── Brand ────────────────────────────────────────────────
  &__logo {
    font-family: $font-display;
    font-size: 2rem;
    color: $color-accent;
    letter-spacing: 0.04em;
    display: block;
    margin-bottom: $space-3;
    display: flex;
    > p {
      text-align: center;
      line-height: 1.5rem;
      color: $color-accent;

      > img {
        display: inline-block;
        width: 8rem;
        margin-top: -1rem;
        margin-bottom: 0.5rem;
      }
    }
  }

  &__tagline {
    @include text-mono(0.8rem);
    color: $color-text-muted;
    max-width: 35ch;
    line-height: 1.6;
    margin-bottom: $space-6;
  }

  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: $space-3;
    padding: 0.25rem 0;
    margin-bottom: $space-6;
  }

  &__social-link {
    @include heading-ui(0.65rem, 600);
    color: $color-text-muted;
    padding: $space-1 $space-3;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    transition: all $transition-fast;

    &:hover {
      color: $color-accent;
      border-color: $color-accent;
    }
  }

  // ── Nav ──────────────────────────────────────────────────
  &__nav {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__nav-title {
    @include heading-ui(0.65rem, 700);
    color: $color-text-muted;
    margin-bottom: $space-3;
  }

  &__nav-link {
    @include text-mono(0.82rem);
    color: $color-text-muted;
    text-decoration: none;
    transition: color $transition-fast;
    padding: $space-1 0;

    &:hover { color: $color-accent; }
  }

  &__address {
    @include text-mono(0.82rem);
    color: $color-text-muted;
    margin-top: $space-2;
  }

  // ── Bottom ───────────────────────────────────────────────
  &__bottom {
    border-top: 1px solid $color-border;
    padding-block: $space-4;

    .container {
      @include flex-between;
      flex-wrap: wrap;
      gap: $space-3;
    }

    span {
      @include text-mono(0.72rem);
      color: $color-text-muted;
    }
  }

  &__credit {
    a {
      color: $color-accent;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }
}
</style>
