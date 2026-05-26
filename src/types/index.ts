// =============================================================================
// TYPES — Dans Ma Cabane
// =============================================================================

// Navigation
export interface NavItem {
  key: string
  path: string
  icon?: string
}

// Locaux (salle de répétition)
export interface Local {
  id: string
  name: string
  surface: number        // m²
  images: string[]
  available: boolean
  shared: boolean
  groundFloor: boolean
}

// Musique / Track
export interface Track {
  id: string
  title: string
  artist: string
  duration: string       // "3:42"
  genre?: string
  spotifyUrl?: string
  soundcloudUrl?: string
  coverUrl?: string
}

// Vidéo
export interface Video {
  id: string
  youtubeId: string
}

// Contact / Booking form
export interface BookingForm {
  name: string
  email: string
  phone?: string
  projectType: ProjectType
  message: string
  preferredDates?: string
  localId?: string
}

export type ProjectType =
  | 'repetition'
  | 'enregistrement'
  | 'cours'
  | 'evenement'
  | 'autre'

// Social links
export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'spotify' | 'youtube' | 'soundcloud'
  url: string
  label: string
}

// API response wrapper
export interface ApiResponse<T> {
  data: T
  error?: string
  loading: boolean
}
