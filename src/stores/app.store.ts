import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isMenuOpen = ref(false)
  const isLoading  = ref(false)

  function toggleMenu()               { isMenuOpen.value = !isMenuOpen.value }
  function closeMenu()                { isMenuOpen.value = false }
  function setLoading(val: boolean)   { isLoading.value = val }

  return { isMenuOpen, isLoading, toggleMenu, closeMenu, setLoading }
})
