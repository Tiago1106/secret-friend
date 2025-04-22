'use client'

import { create } from 'zustand'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'

type AuthState = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
}))

export const initAuthListener = () => {
  onAuthStateChanged(auth, (firebaseUser) => {
    useAuthStore.setState({ user: firebaseUser, loading: false })
  })
}