import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VocabEntry {
  original: string
  translated: string
  targetLanguage: string
  level: 0 | 1 | 2 | 3 | 4
  correctCount: number
  incorrectCount: number
  seenCount: number
  lastSeen: number
  nextReviewAt: number
  context?: string
}

interface DailyStats {
  date: string
  wordsSeen: number
  challengesAttempted: number
  challengesCorrect: number
}

interface VocabState {
  vocab: Record<string, VocabEntry>
  todayStats: DailyStats

  addWord: (original: string, translated: string, targetLanguage: string, context?: string) => void
  recordSeen: (originals: string[]) => void
  updateLevel: (original: string, correct: boolean) => void
  getWordsForDisplay: () => VocabEntry[]
}

function freshStats(): DailyStats {
  return { date: new Date().toDateString(), wordsSeen: 0, challengesAttempted: 0, challengesCorrect: 0 }
}

const REVIEW_INTERVALS = [0, 1, 3, 7, 21]

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      vocab: {},
      todayStats: freshStats(),

      addWord: (original, translated, targetLanguage, context) => {
        const key = original.toLowerCase()
        if (get().vocab[key]) return
        set((s) => ({
          vocab: {
            ...s.vocab,
            [key]: {
              original: key,
              translated,
              targetLanguage,
              level: 0,
              correctCount: 0,
              incorrectCount: 0,
              seenCount: 0,
              lastSeen: Date.now(),
              nextReviewAt: Date.now(),
              context,
            },
          },
        }))
      },

      recordSeen: (originals) => {
        const now = Date.now()
        set((s) => {
          const vocab = { ...s.vocab }
          let added = 0
          for (const original of originals) {
            const key = original.toLowerCase()
            if (vocab[key]) {
              vocab[key] = { ...vocab[key], seenCount: vocab[key].seenCount + 1, lastSeen: now }
              added++
            }
          }
          const stats = s.todayStats.date === new Date().toDateString()
            ? { ...s.todayStats, wordsSeen: s.todayStats.wordsSeen + added }
            : { ...freshStats(), wordsSeen: added }
          return { vocab, todayStats: stats }
        })
      },

      updateLevel: (original, correct) => {
        const key = original.toLowerCase()
        set((s) => {
          const entry = s.vocab[key]
          if (!entry) return {}

          const newLevel = correct
            ? Math.min(4, entry.level + 1) as VocabEntry['level']
            : Math.max(0, entry.level - 1) as VocabEntry['level']

          const daysUntilReview = REVIEW_INTERVALS[newLevel] ?? 21
          const nextReviewAt = Date.now() + daysUntilReview * 86400000

          const stats = s.todayStats.date === new Date().toDateString()
            ? {
                ...s.todayStats,
                challengesAttempted: s.todayStats.challengesAttempted + 1,
                challengesCorrect: s.todayStats.challengesCorrect + (correct ? 1 : 0),
              }
            : freshStats()

          return {
            vocab: {
              ...s.vocab,
              [key]: {
                ...entry,
                level: newLevel,
                correctCount: entry.correctCount + (correct ? 1 : 0),
                incorrectCount: entry.incorrectCount + (correct ? 0 : 1),
                nextReviewAt,
              },
            },
            todayStats: stats,
          }
        })
      },

      getWordsForDisplay: () => {
        return Object.values(get().vocab)
          .sort((a, b) => b.lastSeen - a.lastSeen)
          .slice(0, 20)
      },
    }),
    { name: 'lingualens-vocab' },
  ),
)
