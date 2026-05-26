import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import i18n from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      titleKey: 'meta.home.title',
      descriptionKey: 'meta.home.description',
    },
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('@/views/MusicView.vue'),
    meta: {
      titleKey: 'meta.music.title',
      descriptionKey: 'meta.music.description',
    },
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/views/VideoView.vue'),
    meta: {
      titleKey: 'meta.video.title',
      descriptionKey: 'meta.video.description',
    },
  },
  {
    path: '/locaux',
    name: 'locaux',
    component: () => import('@/views/LocauxView.vue'),
    meta: {
      titleKey: 'meta.locaux.title',
      descriptionKey: 'meta.locaux.description',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/contactView.vue'),
    meta: {
      titleKey: 'meta.contact.title',
      descriptionKey: 'meta.contact.description',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

// Update <title> and meta description on each navigation
router.afterEach((to) => {
  const { t } = i18n.global
  const titleKey = to.meta.titleKey as string | undefined
  const descKey = to.meta.descriptionKey as string | undefined

  document.title = titleKey ? t(titleKey) : 'Dans Ma Cabane'

  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc && descKey) {
    metaDesc.setAttribute('content', t(descKey))
  }
})

export default router
