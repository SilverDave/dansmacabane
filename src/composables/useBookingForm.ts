import { reactive, ref } from 'vue'
import type { BookingForm, ProjectType } from '@/types'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'
type FieldError  = 'required' | 'invalid'

const CONTACT_EMAIL = 'dansmacabane@gmail.com'

const PROJECT_LABELS: Record<string, string> = {
  repetition:     'Répétition',
  autre:          'Autre',
}

// ── Mailto builder ─────────────────────────────────────────────────────────────
function buildMailto(form: BookingForm): string {
  const type = PROJECT_LABELS[form.projectType] ?? form.projectType

  const subject = `[Dans Ma Cabane] Demande de ${form.name}`

  const body = [
    `Nom / Groupe : ${form.name}`,
    `Email        : ${form.email}`,
    `Téléphone    : ${form.phone?.trim() || '—'}`,
    `Type         : ${type}`,
    ``,
    `Message`,
    `-------`,
    form.message,
  ].join('\n')

  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  )
}

// ── Composable ─────────────────────────────────────────────────────────────────
export function useBookingForm() {
  const status = ref<FormStatus>('idle')

  const form = reactive<BookingForm>({
    name:        '',
    email:       '',
    phone:       '',
    projectType: 'repetition' as ProjectType,
    message:     '',
  })

  const errors = reactive<Partial<Record<keyof BookingForm, FieldError>>>({})

  // ── Validation ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    ;(Object.keys(errors) as Array<keyof BookingForm>).forEach(k => delete errors[k])

    if (!form.name.trim()) errors.name = 'required'

    if (!form.email.trim()) {
      errors.email = 'required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'invalid'
    }

    if (!form.message.trim()) errors.message = 'required'

    return Object.keys(errors).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  function submit(): void {
    if (!validate()) return

    status.value = 'sending'

    try {
      const mailto = buildMailto(form)
      window.location.href = mailto
      // Délai pour laisser le client mail s'ouvrir avant de reset
      setTimeout(() => {
        status.value = 'success'
        reset()
      }, 500)
    } catch {
      status.value = 'error'
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────────
  function reset(): void {
    form.name        = ''
    form.email       = ''
    form.phone       = ''
    form.projectType = 'repetition'
    form.message     = ''
    ;(Object.keys(errors) as Array<keyof BookingForm>).forEach(k => delete errors[k])
  }

  return { form, errors, status, submit, reset, validate }
}
