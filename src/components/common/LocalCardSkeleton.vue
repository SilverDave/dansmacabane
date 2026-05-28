<script setup lang="ts">
// Pas de props — c'est un placeholder purement visuel
</script>

<template>
  <div class="card-skeleton" aria-hidden="true">
    <!-- Image -->
    <div class="card-skeleton__img" />

    <!-- Body -->
    <div class="card-skeleton__body">
      <div class="card-skeleton__title" />
      <div class="card-skeleton__meta" />

      <div class="card-skeleton__tags">
        <div class="card-skeleton__tag" />
        <div class="card-skeleton__tag card-skeleton__tag--sm" />
        <div class="card-skeleton__tag" />
      </div>

      <div class="card-skeleton__price" />
      <div class="card-skeleton__btn" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ── Mixin shimmer local ───────────────────────────────────────────────────────
%shimmer {
  background: linear-gradient(
    90deg,
    $color-surface         0%,
    lighten($color-surface, 5%) 40%,
    $color-surface         80%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: $radius-sm;
}

.card-skeleton {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;

  // ── Image ─────────────────────────────────────────────
  &__img {
    @extend %shimmer;
    aspect-ratio: 16 / 9;
    border-radius: 0;
  }

  // ── Body ─────────────────────────────────────────────
  &__body {
    padding: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__title {
    @extend %shimmer;
    height: 28px;
    width: 60%;
  }

  &__meta {
    @extend %shimmer;
    height: 14px;
    width: 40%;
  }

  &__tags {
    display: flex;
    gap: $space-2;
    flex-wrap: wrap;
  }

  &__tag {
    @extend %shimmer;
    height: 22px;
    width: 80px;
    border-radius: $radius-sm;

    &--sm { width: 55px; }
  }

  &__price {
    @extend %shimmer;
    height: 16px;
    width: 50%;
    margin-top: $space-2;
  }

  &__btn {
    @extend %shimmer;
    height: 36px;
    width: 100%;
    margin-top: $space-2;
    border-radius: $radius-sm;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
