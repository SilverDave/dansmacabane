<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.store'
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const appStore = useAppStore()
const route = useRoute()

// Ferme le menu mobile à chaque changement de route
watch(() => route.path, () => appStore.closeMenu())
</script>

<template>
  <AppNav />

  <RouterView v-slot="{ Component, route: r }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="r.path" />
    </Transition>
  </RouterView>

  <AppFooter />
</template>
