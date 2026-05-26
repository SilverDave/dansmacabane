import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Local, Video, SocialLink } from '@/types'

// ─── App Store ────────────────────────────────────────────────────────────────
export const useAppStore = defineStore('app', () => {
  const isMenuOpen = ref(false)
  const isLoading = ref(false)

  function toggleMenu() { isMenuOpen.value = !isMenuOpen.value }
  function closeMenu()  { isMenuOpen.value = false }
  function setLoading(val: boolean) { isLoading.value = val }

  return { isMenuOpen, isLoading, toggleMenu, closeMenu, setLoading }
})

// ─── Locaux Store ─────────────────────────────────────────────────────────────
export const useLocauxStore = defineStore('locaux', () => {
  const locaux = ref<Local[]>([
    {
      id: 'big-foot',
      name: 'Big Foot',
      surface: 58,
      images: [
        '/images/locaux/big-foot/1.png',
        '/images/locaux/big-foot/2.png',
        '/images/locaux/big-foot/3.png'
      ],
      available: false,
      shared: false,
      groundFloor: false,
    },
    {
      id: 'da-vinci',
      name: 'Da Vinci',
      surface: 37,
      images: [
        '/images/locaux/da-vinci/2.png',
        '/images/locaux/da-vinci/1.png'
      ],
      available: false,
      shared: false,
      groundFloor: false,
    },
    {
      id: 'au-balcon',
      name: 'Au Balcon',
      surface: 37,
      images: [
        '/images/locaux/au-balcon/2.png',
        '/images/locaux/au-balcon/1.png',
        '/images/locaux/au-balcon/3.png'
      ],
      available: false,
      shared: false,
      groundFloor: false,
    },
    {
      id: 'dans-les-airs',
      name: 'Dans les Airs',
      surface: 32,
      images: [
        '/images/locaux/dans-les-airs/1.png',
        '/images/locaux/dans-les-airs/2.png',
      ],
      available: true,
      shared: true,
      groundFloor: false,
    },
    {
      id: 'montreal',
      name: 'Montreal',
      surface: 27,
      images: [
        '/images/locaux/montreal/1.png',
        '/images/locaux/montreal/2.png',
        '/images/locaux/montreal/3.png',
        '/images/locaux/montreal/4.png'
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
     {
      id: 'el-capo',
      name: 'El Capo',
      surface: 32,
      images: [
        '/images/locaux/el-capo/1.png',
        '/images/locaux/el-capo/2.png',
      ],
      available: false,
      shared: false,
      groundFloor: true
    },{
      id: 'fools',
      name: 'Fools',
      surface: 28,
      images: [
        '/images/locaux/fools/1.png',
        '/images/locaux/fools/2.png',
        '/images/locaux/fools/3.jpg',
        '/images/locaux/fools/4.png'
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'danilo',
      name: 'Danilo',
      surface: 18,
      images: ['/images/locaux/danilo/1.png'],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'diamante',
      name: 'Diamante',
      surface: 14,
      images: ['/images/locaux/diamante/1.png'],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'vigneron',
      name: 'Vigneron',
      surface: 15,
      images: [
        '/images/locaux/vigneron/1.png',
        '/images/locaux/vigneron/2.png',
        '/images/locaux/vigneron/3.png',
        '/images/locaux/vigneron/4.png'
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'dans-ma-cabane',
      name: 'Dans ma cabane',
      surface: 10,
      images: [
        '/images/locaux/dans-ma-cabane/1.png',
        '/images/locaux/dans-ma-cabane/2.png'
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'brooklyn',
      name: 'Brooklyn',
      surface: 15,
      images: [
        '/images/locaux/brooklyn/1.png',
        '/images/locaux/brooklyn/2.png'
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
    {
      id: 'siculiana',
      name: 'Siculiana',
      surface: 13,
      images: [
        '/images/locaux/siculiana/1.png',
      ],
      available: false,
      shared: false,
      groundFloor: true
    },
  ])

  const availableLocaux = computed(() => locaux.value.filter(l => l.available))
  const notAvailableLocaux = computed(() => locaux.value.filter(l => !l.available))

  const availableLocauxOrRandomn = computed(() => {
    return availableLocaux.value.length <= 0 ? 
      getRandomLocaux(locaux.value, 3) : 
      availableLocaux.value.length < 3 ? 
        [...availableLocaux.value, ...getRandomLocaux(notAvailableLocaux.value, 3-availableLocaux.value.length)] : 
        availableLocaux.value
  });

  function getRandomLocaux<T>(array: T[], count: number): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }

  function getLocalById(id: string) {
    return locaux.value.find(l => l.id === id)
  }

  return { locaux, availableLocaux, notAvailableLocaux, availableLocauxOrRandomn, getLocalById }
})

// ─── Video Store ──────────────────────────────────────────────────────────────
export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([
    {
      id: 'aSiPJns7uzk',
      youtubeId: 'aSiPJns7uzk'
    },{
      id: 'h7k5nOYbqPA',
      youtubeId: 'h7k5nOYbqPA'
    },{
      id: '-zwnexDobSw',
      youtubeId: '-zwnexDobSw'
    },{
      id: 'Jynupyrm7n4',
      youtubeId: 'Jynupyrm7n4'
    },{
      id: 'WYj18gqHKbA',
      youtubeId: 'WYj18gqHKbA'
    },{
      id: 'sbBW_k-JV0w',
      youtubeId: 'sbBW_k-JV0w'
    },{
      id: 'TLgKRxIExfg',
      youtubeId: 'TLgKRxIExfg'
    },{
      id: 'NRgRL7NGDd8',
      youtubeId: 'NRgRL7NGDd8'
    },{
      id: '-AuqmaxQOPs',
      youtubeId: '-AuqmaxQOPs'
    },{
      id: 'k2W9BC7qqJo',
      youtubeId: 'k2W9BC7qqJo'
    },{
      id: 'RTLPq2gtNs8',
      youtubeId: 'RTLPq2gtNs8'
    },
  ])

  return { videos }
})

// ─── Social Store ─────────────────────────────────────────────────────────────
export const useSocialStore = defineStore('social', () => {
  const links = ref<SocialLink[]>([
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=61589245965623',
      label: 'Facebook',
    },
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/dansmacabanelocaux/',
      label: 'Instagram',
    },
    {
      platform: 'spotify',
      url: 'https://open.spotify.com/playlist/7EJNB6eJGHIbYoWvbRxosK?si=ac434cc7db0649d0',
      label: 'Spotify',
    },
  ])

  return { links }
})
