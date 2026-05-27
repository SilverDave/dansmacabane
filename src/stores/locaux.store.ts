import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  ref as dbRef,
  onValue,
  update,
  get,
} from 'firebase/database'

import { db } from '@/lib/firebase'
import type { Local } from '@/types'
import locauxData from '@/data/locaux.json'

export const useLocauxStore = defineStore('locaux', () => {
  const locaux = ref<Local[]>(locauxData as Local[])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // ── Écoute temps réel Realtime Database ────────────────────────────────
  function subscribe() {
    loading.value = true

    const locauxRef = dbRef(db, 'locaux')

    const unsubscribe = onValue(
      locauxRef,
      (snapshot) => {
        const data = snapshot.val()

        if (!data) {
          locaux.value = []
          loading.value = false
          return
        }

        locaux.value = Object.entries(data).map(
          ([id, value]: any) => ({
          id,
          name: value.name ?? '',
          surface: value.surface ?? 0,
          images: value.images ?? [],
          available: value.available ?? false,
          shared: value.shared ?? false,
          groundFloor: value.groundFloor ?? false,
        })
        )

        // Tri par nom
        locaux.value.sort((a, b) =>
          a.name.localeCompare(b.name)
        )

        loading.value = false
      },
      (err) => {
        console.error('[locaux] Realtime Database error:', err)

        error.value = err.message
        loading.value = false
      }
    )

    return unsubscribe
  }

  // ── Mise à jour d'un local ─────────────────────────────────────────────
  async function updateLocal(
    id: string,
    fields: Partial<Pick<Local, 'available' | 'shared'>>
  ): Promise<void> {
    try {
      await update(dbRef(db, `locaux/${id}`), fields)
    } catch (err: unknown) {
      console.error(err)

      error.value =
        err instanceof Error
          ? err.message
          : 'Erreur inconnue'
    }
  }

  // ── Chargement unique ──────────────────────────────────────────────────
  async function fetchOnce(): Promise<void> {
    loading.value = true

    try {
      const snapshot = await get(dbRef(db, 'locaux'))

      if (snapshot.exists()) {
        const data = snapshot.val()

        locaux.value = Object.entries(data).map(
          ([id, value]: any) => ({
            id,
            name: value.name ?? '',
            surface: value.surface ?? 0,
            images: value.images ?? [],
            available: value.available ?? false,
            shared: value.shared ?? false,
            groundFloor: value.groundFloor ?? false,
          })
        )

        // Tri par nom
        locaux.value.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      } else {
        locaux.value = []
        console.log('Aucune donnée')
      }
    } catch (err: unknown) {
      console.error(err)

      error.value =
        err instanceof Error
          ? err.message
          : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  // ── Computed ───────────────────────────────────────────────────────────
  const availableLocaux = computed(() =>
    locaux.value.filter((l) => l.available)
  )

  const notAvailableLocaux = computed(() =>
    locaux.value.filter((l) => !l.available)
  )

  const availableLocauxOrRandom = computed(() => {
    const available = locaux.value.filter((l) => l.available)

    if (available.length >= 3) {
      return available
    }

    if (available.length === 0) {
      return getRandom(locaux.value, 3)
    }

    return [
      ...available,
      ...getRandom(
        notAvailableLocaux.value,
        3 - available.length
      ),
    ]
  })

  // ── Helpers ────────────────────────────────────────────────────────────
  function getLocalById(id: string) {
    return locaux.value.find((l) => l.id === id)
  }

  function getRandom<T>(arr: T[], n: number): T[] {
    return [...arr]
      .sort(() => Math.random() - 0.5)
      .slice(0, n)
  }

  return {
    locaux,
    loading,
    error,
    subscribe,
    updateLocal,
    fetchOnce,
    availableLocaux,
    notAvailableLocaux,
    availableLocauxOrRandom,
    getLocalById,
  }
})