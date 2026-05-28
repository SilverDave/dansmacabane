<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBookingForm } from '@/composables/useBookingForm'
import LocalesInfo from '@/components/sections/LocalesInfo.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const { t } = useI18n()
const { form, errors, status, submit } = useBookingForm()

const projectTypes = ['repetition', 'autre'] as const
</script>

<template>
  <main class="page">
    <div class="page-hero container">
      <p class="page-hero__label">{{ t('nav.contact') }}</p>
      <p class="page-hero__sub">{{ t('contact.subtitle') }}</p>
    </div>

    <div class="contact container">
      <div class="contact__layout">

        <!-- ── Form ─────────────────────────────────── -->
        <div class="contact__form-wrap">
          <form class="contact__form" @submit.prevent="submit" novalidate>
            <!-- Name -->
            <BaseInput
              id="name"
              v-model="form.name"
              :label="t('contact.form.name')"
              :placeholder="t('contact.form.namePlaceholder')"
              :error="errors.name ? t(`contact.form.${errors.name}`) : undefined"
              required
            />

            <!-- Email -->
            <BaseInput
              id="email"
              v-model="form.email"
              type="email"
              :label="t('contact.form.email')"
              :placeholder="t('contact.form.emailPlaceholder')"
              :error="errors.email ? t(`contact.form.${errors.email}`) : undefined"
              required
            />

            <!-- Phone -->
            <BaseInput
              id="phone"
              v-model="form.phone!"
              type="tel"
              :label="t('contact.form.phone')"
              :placeholder="t('contact.form.phonePlaceholder')"
            />

            <!-- Project type -->
            <div class="contact__field">
              <label for="projectType" class="contact__label">
                {{ t('contact.form.projectType') }}
              </label>
              <select id="projectType" v-model="form.projectType" class="contact__select">
                <option v-for="pt in projectTypes" :key="pt" :value="pt">
                  {{ t(`contact.form.projectTypes.${pt}`) }}
                </option>
              </select>
            </div>

            <!-- Message -->
            <BaseInput
              id="message"
              v-model="form.message"
              type="textarea"
              :label="t('contact.form.message')"
              :placeholder="t('contact.form.messagePlaceholder')"
              :error="errors.message ? t(`contact.form.${errors.message}`) : undefined"
              :rows="6"
              required
            />

            <!-- Submit -->
            <div class="contact__submit">
              <BaseButton
                type="submit"
                size="lg"
                :loading="status === 'sending'"
                :disabled="status === 'sending'"
              >
                {{ status === 'sending' ? t('contact.form.sending') : t('contact.form.submit') }}
              </BaseButton>

              <p v-if="status === 'success'" class="contact__feedback contact__feedback--ok">
                {{ t('contact.form.success') }}
              </p>
              <p v-if="status === 'error'" class="contact__feedback contact__feedback--err">
                {{ t('contact.form.error') }}
              </p>
            </div>
          </form>
        </div>

        <!-- ── Locales Info ─────────────────────────────────── -->
        <LocalesInfo />

      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.contact {
  padding-bottom: $space-24;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
  }

  // ── Form ─────────────────────────────────────────────────
  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__label {
    @include heading-ui(0.72rem, 600);
    color: $color-text-muted;
    letter-spacing: 0.1em;
  }

  &__select {
    width: 100%;
    padding: $space-3 $space-4;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    color: $color-text;
    font-family: $font-ui;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color $transition-fast;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba($color-accent, 0.12);
    }

    option { background: $color-surface; }
  }

  &__submit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-4;
    padding-top: $space-4;
  }

  &__feedback {
    @include text-mono(0.8rem);
    padding: $space-3 $space-4;
    border-radius: $radius-sm;

    &--ok {
      background: rgba(#2ecc71, 0.1);
      color: #2ecc71;
      border: 1px solid rgba(#2ecc71, 0.3);
    }

    &--err {
      background: rgba($color-red, 0.1);
      color: $color-red;
      border: 1px solid rgba($color-red, 0.3);
    }
  }
}
</style>
