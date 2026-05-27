import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import i18n from '@/i18n'
import { useAuth } from '@/composables/useAuth'
import { useLocauxStore } from '@/stores/locaux.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresLocaux: true,
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
      requiresLocaux: true,
      titleKey: 'meta.locaux.title',
      descriptionKey: 'meta.locaux.description',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      titleKey: 'meta.contact.title',
      descriptionKey: 'meta.contact.description',
    },
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('@/views/Admin/AdminLoginView.vue'),
    meta: { guestOnly: true },   // redirige vers dashboard si déjà connecté
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/Admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true },  // redirige vers /admin si non connecté
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

// Guard de navigation AVANT export default router
router.beforeEach(async (to) => {

  if (to.meta.requiresLocaux) {
    const locauxStore = useLocauxStore()
    await locauxStore.fetchOnce()
  }

  // FIREABASE
  const { user, authLoading } = useAuth()
  // Attend que Firebase ait vérifié la session
  if (authLoading.value) return true

  if (to.meta.requiresAuth && !user.value) {
    return { name: 'admin-login' }
  }

  if (to.meta.guestOnly && user.value) {
    return { name: 'admin-dashboard' }
  }
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
