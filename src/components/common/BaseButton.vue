<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  target?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="!to && !href ? disabled || loading : undefined"
    :aria-disabled="disabled || loading"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--loading': loading, 'btn--disabled': disabled }]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.btn {
  @include btn-base;
  position: relative;
  overflow: hidden;

  // ── Variants ─────────────────────────────────────────────
  &--primary {
    background: $color-accent;
    color: $color-bg;

    &:hover:not(:disabled):not([aria-disabled="true"]) {
      background: $color-accent-dim;
      color: $color-bg;
      transform: translateY(-1px);
    }

    &:active { transform: translateY(0); }
  }

  &--secondary {
    background: transparent;
    color: $color-accent;
    border: 1.5px solid $color-accent;

    &:hover:not(:disabled):not([aria-disabled="true"]) {
      background: rgba($color-accent, 0.08);
    }
  }

  &--ghost {
    background: transparent;
    color: $color-text;
    border: 1.5px solid $color-border;

    &:hover:not(:disabled):not([aria-disabled="true"]) {
      border-color: $color-text-muted;
      color: $color-text;
    }
  }

  &--danger {
    background: $color-red;
    color: $color-text;

    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  }

  // ── Sizes ─────────────────────────────────────────────────
  &--sm {
    padding: $space-2 $space-4;
    font-size: 0.72rem;
  }

  &--md {
    padding: $space-3 $space-6;
    font-size: 0.8rem;
  }

  &--lg {
    padding: $space-4 $space-8;
    font-size: 0.9rem;
  }

  // ── States ────────────────────────────────────────────────
  &--disabled,
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    cursor: wait;
    pointer-events: none;
  }

  // ── Spinner ───────────────────────────────────────────────
  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
