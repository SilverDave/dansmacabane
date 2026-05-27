<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signInWithGoogle } = useAuth()

const loading = ref(false)
const error   = ref('')

async function handleGoogleLogin() {
  error.value   = ''
  loading.value = true

  const result = await signInWithGoogle()

  if (result === 'ok') {
    router.push('/admin/dashboard')
  } else if (result === 'unauthorized') {
    error.value = 'Ce compte Google n\'est pas autorisé à accéder à l\'admin.'
  } else {
    error.value = 'Erreur de connexion. Réessaie.'
  }

  loading.value = false
}
</script>

<template>
  <main class="login">
    <div class="login__box">

      <div class="login__header">
        <p class="login__site">Dans Ma Cabane</p>
        <h1 class="login__title">Espace Admin</h1>
      </div>

      <p v-if="error" class="login__error" role="alert">{{ error }}</p>

      <button
        class="login__btn-google"
        @click="handleGoogleLogin"
        :disabled="loading"
      >
        <!-- Logo Google SVG -->
        <svg v-if="!loading" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
        </svg>
        <span v-if="loading" class="login__spinner" aria-hidden="true" />
        {{ loading ? 'Connexion...' : 'Se connecter avec Google' }}
      </button>

    </div>
  </main>
</template>

<style lang="scss" scoped>
.login {
  min-height: 100svh;
  @include flex-center;
  background: $color-bg;
  padding: $space-6;

  &__box {
    width: 100%;
    max-width: 380px;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: $space-12 $space-8;
    display: flex;
    flex-direction: column;
    gap: $space-8;
  }

  &__header { text-align: center; }

  &__site {
    font-family: $font-display;
    font-size: 1.6rem;
    color: $color-accent;
    letter-spacing: 0.04em;
    margin-bottom: $space-2;
  }

  &__title {
    font-family: $font-display;
    font-size: 2rem;
    color: $color-text;
  }

  &__error {
    @include text-mono(0.78rem);
    color: $color-red;
    background: rgba($color-red, 0.08);
    border: 1px solid rgba($color-red, 0.2);
    border-radius: $radius-sm;
    padding: $space-3 $space-4;
    text-align: center;
  }

  // ── Bouton Google ─────────────────────────────────────
  &__btn-google {
    @include flex-center;
    gap: $space-3;
    width: 100%;
    padding: $space-4 $space-6;
    background: $color-text;
    color: $color-bg;
    border: none;
    border-radius: $radius-sm;
    font-family: $font-ui;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
      background: #e8e5de;
      transform: translateY(-1px);
    }

    &:active { transform: translateY(0); }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
