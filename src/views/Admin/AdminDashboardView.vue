<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocauxStore } from '@/stores/locaux.store'
import { useAuth } from '@/composables/useAuth'

const router      = useRouter()
const locauxStore = useLocauxStore()
const { user, signOut } = useAuth()

// Écoute Firestore temps réel
let unsubscribe: (() => void) | null = null
onMounted(()  => { unsubscribe = locauxStore.subscribe() })
onUnmounted(() => unsubscribe?.())

async function handleSignOut() {
  await signOut()
  router.push('/admin')
}

async function toggleAvailable(id: string, current: boolean) {
  if(current) {
      await locauxStore.updateLocal(id, { shared: false })
  }
  await locauxStore.updateLocal(id, { available: !current })
}

async function toggleShared(id: string, current: boolean) {
  if(!current) {
      await locauxStore.updateLocal(id, { available: true })
  }
  await locauxStore.updateLocal(id, { shared: !current })
}
</script>

<template>
  <main class="admin">

    <!-- ── Top bar ──────────────────────────────────────── -->
    <header class="admin__header">
      <div class="admin__header-inner container">
        <div class="admin__header-brand">
          <span class="admin__header-badge">Admin</span>
        </div>
        <div class="admin__header-actions">
          <span class="admin__header-user">{{ user?.email }}</span>
          <button class="admin__logout" @click="handleSignOut">
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="admin__body container">

      <div class="admin__title-row">
        <h1 class="admin__title">Gestion des Locaux</h1>
        <p class="admin__subtitle">
          {{ locauxStore.availableLocaux.length }} disponible(s) sur {{ locauxStore.locaux.length }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="locauxStore.loading" class="admin__loading">
        Chargement...
      </div>

      <!-- Erreur -->
      <p v-else-if="locauxStore.error" class="admin__error">
        Erreur : {{ locauxStore.error }}
      </p>

      <!-- Tableau -->
      <div v-else class="admin__table-wrap">
        <table class="admin__table">
          <thead>
            <tr>
              <th>Local</th>
              <th>Surface</th>
              <th class="admin__th-center">Disponible</th>
              <th class="admin__th-center">Partagé</th>
              <th class="admin__th-center">RDC</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="local in locauxStore.locaux"
              :key="local.id"
              class="admin__row"
              :class="{ 'admin__row--available': local.available }"
            >
              <!-- Nom -->
              <td class="admin__td-name">
                <div class="admin__local-info">
                  <span class="admin__local-name">{{ local.name }}</span>
                </div>
              </td>

              <!-- Surface -->
              <td class="admin__td-surface">{{ local.surface }} m²</td>

              <!-- Toggle disponible -->
              <td class="admin__td-center">
                <button
                  class="admin__toggle"
                  :class="{ 'admin__toggle--on': local.available }"
                  @click="toggleAvailable(local.id, local.available)"
                  :aria-label="`${local.available ? 'Marquer indisponible' : 'Marquer disponible'} — ${local.name}`"
                  :aria-pressed="local.available"
                >
                  <span class="admin__toggle-knob" />
                </button>
              </td>

              <!-- Toggle partagé -->
              <td class="admin__td-center">
                <button
                  class="admin__toggle"
                  :class="{ 'admin__toggle--on': local.shared }"
                  @click="toggleShared(local.id, local.shared)"
                  :aria-label="`${local.shared ? 'Désactiver partage' : 'Activer partage'} — ${local.name}`"
                  :aria-pressed="local.shared"
                >
                  <span class="admin__toggle-knob" />
                </button>
              </td>

              <!-- RDC (lecture seule) -->
              <td class="admin__td-center">
                <span
                  class="admin__badge"
                  :class="local.groundFloor ? 'admin__badge--yes' : 'admin__badge--no'"
                >
                  {{ local.groundFloor ? 'Oui' : 'Non' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</template>

<style lang="scss" scoped>
.admin {
  min-height: 100svh;
  background: $color-bg;
  padding-top: $space-12;
  z-index: 0;
  position: relative;

  // ── Header ─────────────────────────────────────────────
  &__header {
    //background: rgba(#602424, 0.65);
    border-bottom: 1px solid rgba(#fe3f3f, 0.3);
    position: sticky;
    top: 0;
    z-index: $z-nav;
  }

  &__header-inner {
    @include flex-between;
    height: 60px;
    gap: $space-4;
  }

  &__header-brand {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__header-logo {
    font-family: $font-display;
    font-size: 1.4rem;
    color: $color-accent;
    letter-spacing: 0.04em;
  }

  &__header-badge {
    @include heading-ui(0.6rem, 700);
    background: rgba($color-accent, 0.12);
    color: $color-accent;
    border: 1px solid rgba($color-accent, 0.3);
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: $space-4;
  }

  &__header-user {
    @include text-mono(0.75rem);
    color: $color-text-muted;
    display: none;
    @include md { display: block; }
  }

  &__logout {
    @include heading-ui(0.7rem, 600);
    color: $color-text-muted;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    padding: $space-2 $space-4;
    background: none;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      color: $color-red;
      border-color: $color-red;
    }
  }

  // ── Body ───────────────────────────────────────────────
  &__body {
    padding-top: $space-12;
    padding-bottom: $space-16;
  }

  &__title-row {
    @include flex-between;
    flex-wrap: wrap;
    gap: $space-4;
    margin-bottom: $space-8;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: $color-text;
  }

  &__subtitle {
    @include text-mono(0.8rem);
    color: $color-text-muted;
  }

  &__loading {
    @include text-mono;
    color: $color-text-muted;
    padding: $space-12;
    text-align: center;
  }

  &__error {
    @include text-mono(0.85rem);
    color: $color-red;
    padding: $space-4;
    background: rgba($color-red, 0.08);
    border: 1px solid rgba($color-red, 0.2);
    border-radius: $radius-sm;
  }

  // ── Table ──────────────────────────────────────────────
  &__table-wrap {
    overflow-x: auto;
    border: 1px solid $color-border;
    border-radius: $radius-md;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th {
      @include heading-ui(0.65rem, 700);
      color: $color-text-muted;
      background: $color-bg-alt;
      padding: $space-3 $space-4;
      text-align: left;
      border-bottom: 1px solid $color-border;
      white-space: nowrap;
    }
  }

  &__th-center { text-align: center !important; }

  &__row {
    border-bottom: 1px solid $color-border;
    transition: background $transition-fast;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba($color-accent, 0.02); }

    &--available {
      background: rgba(#2ecc71, 0.03);
      &:hover { background: rgba(#2ecc71, 0.05); }
    }
  }

  &__td-name,
  &__td-surface {
    padding: $space-4;
  }

  &__td-center,
  &__td-surface {
    padding: $space-4;
    text-align: center;
    white-space: nowrap;
  }

  &__local-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__local-name {
    font-family: $font-ui;
    font-weight: 600;
    color: $color-text;
  }

  &__local-id {
    @include text-mono(0.68rem);
    color: $color-text-muted;
  }

  &__td-surface {
    @include text-mono(0.82rem);
    color: $color-text-muted;
  }

  // ── Toggle switch ─────────────────────────────────────
  &__toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: $color-border;
    border: none;
    cursor: pointer;
    transition: background $transition-base;
    @include focus-ring;

    &--on {
      background: #2ecc71;
    }
  }

  &__toggle-knob {
    position: absolute;
    left: 3px;
    width: 18px;
    height: 18px;
    background: $color-text;
    border-radius: 50%;
    transition: transform $transition-base;
    pointer-events: none;

    .admin__toggle--on & {
      transform: translateX(20px);
      background: white;
    }
  }

  // ── Badge RDC ─────────────────────────────────────────
  &__badge {
    @include heading-ui(0.6rem, 700);
    padding: $space-1 $space-2;
    border-radius: $radius-sm;

    &--yes {
      background: rgba($color-accent, 0.12);
      color: $color-accent;
      border: 1px solid rgba($color-accent, 0.3);
    }
    &--no {
      background: $color-bg-alt;
      color: $color-text-muted;
      border: 1px solid $color-border;
    }
  }
}
</style>
