import { ref } from 'vue'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

// ── Whitelist des emails autorisés ────────────────────────────────────────────
// Seuls ces comptes Google peuvent accéder à l'admin
const ALLOWED_EMAILS: string[] = import.meta.env.VITE_FIREBASE_ALLOWED_EMAILS

// ── État global (singleton) ───────────────────────────────────────────────────
const user        = ref<User | null>(null)
const authLoading = ref(true)

export function useAuth() {

  function startAuthListener() {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // N'accepte que les emails de la whitelist
      if (firebaseUser && ALLOWED_EMAILS.includes(firebaseUser.email ?? '')) {
        user.value = firebaseUser
      } else {
        user.value = null
        // Si connecté mais pas autorisé → déconnecte proprement
        if (firebaseUser) firebaseSignOut(auth)
      }
      authLoading.value = false
    })
    return unsubscribe
  }

  // Ouvre la popup Google
  async function signInWithGoogle(): Promise<'ok' | 'unauthorized' | 'error'> {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const email  = result.user.email ?? ''

      if (!ALLOWED_EMAILS.includes(email)) {
        await firebaseSignOut(auth)
        return 'unauthorized'
      }

      return 'ok'
    } catch (err) {
      console.error('[useAuth] signInWithGoogle:', err)
      return 'error'
    }
  }

  async function signOut(): Promise<void> {
    await firebaseSignOut(auth)
  }

  const isAuthenticated = () => !!user.value

  return {
    user,
    authLoading,
    isAuthenticated,
    signInWithGoogle,
    signOut,
    startAuthListener,
  }
}
