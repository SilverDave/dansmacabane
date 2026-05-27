<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import { useLocale } from '@/composables/useLocale'
import type { NavItem } from '@/types'

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const { currentLocale, toggleLocale } = useLocale()

const navItems = computed<NavItem[]>(() => [
  { key: 'home',    path: '/' },
  { key: 'locaux',  path: '/locaux' },
  { key: 'music',   path: '/music' },
  { key: 'video',   path: '/video' },
  { key: 'contact', path: '/contact' },
])

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)
</script>

<template>
  <header class="nav" :class="{ 'nav--open': appStore.isMenuOpen }">
    <div class="nav__inner container">
      <!-- Logo -->
      <RouterLink to="/" class="nav__logo" @click="appStore.closeMenu">
        <img src="/images/logo.png" alt="Dans Ma Cabane"/>
        <div class="nav__logo-text">
          <span class="nav__logo-main">Dans Ma Cabane</span>
          <span class="nav__logo-sub">Liège · Since 2001</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="nav__links" aria-label="Navigation principale">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.path"
          class="nav__link"
          :class="{ 'nav__link--active': isActive(item.path) }"
        >
          {{ t(`nav.${item.key}`) }}
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="nav__actions">
        <button
          class="nav__lang"
          @click="toggleLocale"
          :aria-label="t('common.lang.' + (currentLocale === 'fr' ? 'en' : 'fr'))"
        >
          {{ currentLocale === 'fr' ? 'EN' : 'FR' }}
        </button>

        <!-- Burger -->
        <button
          class="nav__burger"
          :class="{ 'nav__burger--open': appStore.isMenuOpen }"
          @click="appStore.toggleMenu"
          :aria-label="appStore.isMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')"
          :aria-expanded="appStore.isMenuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <nav
      class="nav__mobile"
      :class="{ 'nav__mobile--open': appStore.isMenuOpen }"
      :aria-hidden="!appStore.isMenuOpen"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.key"
        :to="item.path"
        class="nav__mobile-link"
        :class="{ 'nav__mobile-link--active': isActive(item.path) }"
        @click="appStore.closeMenu"
      >
        {{ t(`nav.${item.key}`) }}
      </RouterLink>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-nav;
  background: rgba($color-bg, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $color-border;
  transition: border-color $transition-base;

  &__inner {
    @include flex-between;
    height: $nav-height;
    gap: $space-8;
  }

  // ── Logo ────────────────────────────────────────────────
  &__logo {
    display: flex;
    align-items: center;
    gap: 2px;
    text-decoration: none;
    flex-shrink: 0;

    > img {
      width: 6rem;
      padding-top: 2rem;
      padding-right: 0.5rem;
    }

    &-text {
      @include flex-col;
    }

    &-main {
      font-family: $font-display;
      font-size: 1.5rem;
      line-height: 1;
      color: $color-accent;
      letter-spacing: 0.04em;
    }

    &-sub {
      @include text-mono(0.6rem);
      color: $color-text-muted;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
  }

  // ── Desktop links ────────────────────────────────────────
  &__links {
    display: none;
    align-items: center;
    gap: $space-6;

    @include lg {
      display: flex;
    }
  }

  &__link {
    @include heading-ui(0.72rem, 600);
    color: $color-text-muted;
    text-decoration: none;
    transition: color $transition-fast;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: $color-accent;
      transition: width $transition-base;
    }

    &:hover,
    &--active {
      color: $color-text;

      &::after { width: 100%; }
    }

    &--active { color: $color-accent; }
  }

  // ── Actions ──────────────────────────────────────────────
  &__actions {
    display: flex;
    align-items: center;
    gap: $space-4;
    
    @include max-xs { 
      gap: $space-1;
      flex-wrap: wrap;
    }
  }

  &__lang {
    @include text-mono(0.7rem);
    color: $color-text-muted;
    padding: $space-1 $space-2;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    background: none;
    cursor: pointer;
    transition: all $transition-fast;
    @include focus-ring;

    &:hover {
      color: $color-accent;
      border-color: $color-accent;
    }
  }

  // ── Burger ───────────────────────────────────────────────
  &__burger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
    @include focus-ring;

    @include lg { display: none; }

    span {
      display: block;
      height: 1.5px;
      background: $color-text;
      border-radius: 2px;
      transition: all $transition-base;
      transform-origin: center;

      &:nth-child(1) { width: 100%; }
      &:nth-child(2) { width: 70%; }
      &:nth-child(3) { width: 100%; }
    }

    &--open {
      span {
        &:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        &:nth-child(2) { opacity: 0; transform: scaleX(0); }
        &:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 100%; }
      }
    }
  }

  // ── Mobile nav ───────────────────────────────────────────
  &__mobile {
    display: flex;
    flex-direction: column;
    background: $color-bg-alt;
    border-top: 1px solid $color-border;
    max-height: 0;
    overflow: hidden;
    transition: max-height $transition-slow;

    @include lg { display: none; }

    &--open { max-height: 400px; }
  }

  &__mobile-link {
    @include heading-ui(0.9rem, 600);
    padding: $space-4 $space-6;
    color: $color-text-muted;
    text-decoration: none;
    border-bottom: 1px solid $color-border;
    transition: all $transition-fast;

    &:hover,
    &--active {
      color: $color-accent;
      background: rgba($color-accent, 0.05);
    }
  }
}
</style>
