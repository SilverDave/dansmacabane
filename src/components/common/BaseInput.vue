<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  id: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error, 'field--disabled': disabled }">
    <label v-if="label" :for="id" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      class="field__input field__input--textarea"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="field__input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__label {
    @include heading-ui(0.72rem, 600);
    color: $color-text-muted;
    letter-spacing: 0.1em;
  }

  &__required {
    color: $color-accent;
    margin-left: $space-1;
  }

  &__input {
    width: 100%;
    padding: $space-3 $space-4;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    color: $color-text;
    font-family: $font-ui;
    font-size: 0.9rem;
    line-height: 1.5;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    resize: none;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba($color-accent, 0.12);
    }

    &--textarea {
      resize: vertical;
      min-height: 120px;
    }
  }

  &__error {
    @include text-mono(0.72rem);
    color: $color-red;
    margin-top: $space-1;
  }

  &--error &__input {
    border-color: $color-red;
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
