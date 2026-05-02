import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserState {
  uid: string | null
  email: string | null
  sourceLanguage: string
  targetLanguage: string
  difficulty: 1 | 2 | 3
  dailyWordTarget: number
  pronunciationMode: 'hover' | 'click' | 'disabled'
  lumiVisibility: 'always' | 'challenges' | 'hidden'
  streak: number
  lastActiveDate: string | null
  pausedSites: string[]

  setUser: (uid: string | null, email: string | null) => void
  setLanguages: (source: string, target: string) => void
  setDifficulty: (level: 1 | 2 | 3) => void
  setDailyTarget: (n: number) => void
  togglePausedSite: (hostname: string) => void
  incrementStreak: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      uid: null,
      email: null,
      sourceLanguage: 'en',
      targetLanguage: 'fr',
      difficulty: 2,
      dailyWordTarget: 15,
      pronunciationMode: 'hover',
      lumiVisibility: 'always',
      streak: 0,
      lastActiveDate: null,
      pausedSites: [],

      setUser: (uid, email) => set({ uid, email }),

      setLanguages: (source, target) => set({ sourceLanguage: source, targetLanguage: target }),

      setDifficulty: (level) => set({ difficulty: level }),

      setDailyTarget: (n) => set({ dailyWordTarget: n }),

      togglePausedSite: (hostname) => {
        const sites = get().pausedSites
        if (sites.includes(hostname)) {
          set({ pausedSites: sites.filter((s) => s !== hostname) })
        } else {
          set({ pausedSites: [...sites, hostname] })
        }
      },

      incrementStreak: () => {
        const today = new Date().toDateString()
        const { lastActiveDate, streak } = get()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        if (lastActiveDate === today) return
        set({
          streak: lastActiveDate === yesterday ? streak + 1 : 1,
          lastActiveDate: today,
        })
      },
    }),
    { name: 'lingualens-user' },
  ),
)
