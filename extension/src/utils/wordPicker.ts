import type { VocabEntry } from '../stores/vocabStore'

export interface PickedWord {
  word: string
  reason: 'new' | 'review' | 'reinforce'
}

export function pickWords(
  candidates: string[],
  vocab: Record<string, VocabEntry>,
  maxCount: number,
): PickedWord[] {
  const now = Date.now()
  const picked: PickedWord[] = []
  const seen = new Set<string>()

  // Priority 1: words due for review
  for (const word of candidates) {
    if (picked.length >= maxCount) break
    const entry = vocab[word]
    if (entry && entry.level < 4 && entry.nextReviewAt <= now && !seen.has(word)) {
      picked.push({ word, reason: 'review' })
      seen.add(word)
    }
  }

  // Priority 2: new words not in vocab
  for (const word of candidates) {
    if (picked.length >= maxCount) break
    if (!vocab[word] && !seen.has(word) && word.length >= 4) {
      picked.push({ word, reason: 'new' })
      seen.add(word)
    }
  }

  // Priority 3: reinforcement of level 1-2 words
  for (const word of candidates) {
    if (picked.length >= maxCount) break
    const entry = vocab[word]
    if (entry && (entry.level === 1 || entry.level === 2) && !seen.has(word)) {
      picked.push({ word, reason: 'reinforce' })
      seen.add(word)
    }
  }

  return picked
}
