import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Local } from '@/types'
import locauxData from '@/data/locaux.json'

export const useLocauxStore = defineStore('locaux', () => {

  const locaux = ref<Local[]>(locauxData as Local[])

  // ── Computed ──────────────────────────────────────────────────────────────
  const availableLocaux = computed(() =>
    locaux.value.filter(l => l.available)
  )

  const notAvailableLocaux = computed(() =>
    locaux.value.filter(l => !l.available)
  )

  // Retourne les locaux disponibles, ou 3 locaux aléatoires si aucun dispo
  const availableLocauxOrRandom = computed(() => {
    const available = availableLocaux.value
    const needed    = 3

    if (available.length >= needed) return available
    if (available.length === 0)     return getRandomLocaux(locaux.value, needed)

    const fill = getRandomLocaux(notAvailableLocaux.value, needed - available.length)
    return [...available, ...fill]
  })

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getRandomLocaux<T>(array: T[], count: number): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, count)
  }

  function getLocalById(id: string): Local | undefined {
    return locaux.value.find(l => l.id === id)
  }

  // ── Actions (si tu veux modifier un local depuis l'UI) ────────────────────
  function setAvailability(id: string, available: boolean): void {
    const local = getLocalById(id)
    if (local) local.available = available
  }

  return {
    locaux,
    availableLocaux,
    notAvailableLocaux,
    availableLocauxOrRandom,
    getLocalById,
    setAvailability,
  }
})
