import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Video } from '@/types'
import videosData from '@/data/videos.json'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>(videosData as Video[])

  return { videos }
})
