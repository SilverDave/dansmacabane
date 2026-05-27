import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SocialLink } from '@/types'
import socialData from '@/data/social.json'

export const useSocialStore = defineStore('social', () => {
  const links = ref<SocialLink[]>(socialData as SocialLink[])

  return { links }
})
