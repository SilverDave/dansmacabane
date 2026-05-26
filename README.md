# Dans Ma Cabane — Frontend

Site officiel de **Dans Ma Cabane**, locaux de répétition à Liège depuis 2001.

## Stack

| Outil | Rôle |
|-------|------|
| **Vue 3** (Composition API) | Framework UI |
| **TypeScript** | Typage statique |
| **SCSS** | Styles (variables + mixins globaux) |
| **vue-i18n v9** | Internationalisation (FR / EN) |
| **Pinia** | State management |
| **Vue Router 4** | Routing (lazy-loaded) |
| **Vite** | Build tool |

## Structure

```
src/
├── assets/           # Polices, images, icônes
├── components/
│   ├── common/       # BaseButton, BaseInput, LocalCard…
│   ├── layout/       # AppNav, AppFooter
│   └── sections/     # HeroSection, AboutSection…
├── composables/      # useLocale, useScrollReveal, useBookingForm
├── i18n/
│   ├── index.ts      # Setup vue-i18n
│   └── locales/
│       ├── fr.json
│       └── en.json
├── router/           # Routes + meta SEO auto
├── stores/           # Pinia stores (app, locaux, music, video, social)
├── styles/
│   ├── _variables.scss   # Tokens design (colors, fonts, spacing…)
│   ├── _mixins.scss      # Mixins réutilisables
│   └── global.scss       # Reset + styles globaux
├── types/            # Interfaces TypeScript
└── views/            # HomeView, MusicView, VideoView, LocauxView, BookingView
```

## Installation & démarrage

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Type check

```bash
npm run type-check
```

## Conventions

- **SCSS** : les variables et mixins sont auto-injectés via `vite.config.ts` (`additionalData`). Pas besoin de les importer dans chaque composant.
- **i18n** : toutes les clés de traduction sont dans `src/i18n/locales/[fr|en].json`. La langue est persistée dans `localStorage`.
- **Stores** : données mockées directement dans les stores — remplacer par des appels API dans les actions.
- **Scroll reveal** : utiliser l'attribut `data-reveal` sur les éléments à animer, le composable `useScrollReveal()` s'occupe du reste via IntersectionObserver.
- **SEO** : les balises `<title>` et `<meta description>` sont mises à jour automatiquement dans `router/index.ts` via les clés i18n définies dans les `meta` de route.

## À compléter

- [ ] Brancher un vrai endpoint pour le formulaire de booking (`useBookingForm.ts` → `submit()`)
- [ ] Ajouter les vraies photos dans `public/images/`
- [ ] Compléter les tracks et vidéos dans les stores
- [ ] Configurer le domaine dans `vite.config.ts` (`base`)
- [ ] Ajouter un favicon SVG (`public/favicon.svg`)
- [ ] Intégrer un lecteur audio pour les tracks (ex: Wavesurfer.js ou embed Spotify)

## Design system

| Token | Valeur |
|-------|--------|
| Fond principal | `#0d0d0d` |
| Accent (jaune scène) | `#e8c84a` |
| Texte | `#f0ede6` |
| Texte atténué | `#7a7166` |
| Police display | Bebas Neue |
| Police UI | Syne |
| Police mono | Space Mono |

---

© 2026 Dans Ma Cabane · Site réalisé par [David Caruana](https://davidcaruana.be)
