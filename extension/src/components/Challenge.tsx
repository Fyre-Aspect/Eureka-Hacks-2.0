import React, { useState, useRef, useEffect } from 'react'
import { useVocabStore } from '../stores/vocabStore'

interface ChallengeProps {
  original: string
  translated: string
  sentence: string
  onClose: () => void
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[a.length][b.length]
}

export default function Challenge({ original, translated, sentence, onClose }: ChallengeProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [hint, setHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { updateLevel } = useVocabStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const blankedSentence = sentence.replace(
    new RegExp(`\\b${original}\\b`, 'gi'),
    '______',
  )

  function submit() {
    const normalized = input.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const answer = original.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const distance = levenshtein(normalized, answer)
    const isCorrect = distance <= 1

    setResult(isCorrect ? 'correct' : 'incorrect')
    updateLevel(original.toLowerCase(), isCorrect)

    document.dispatchEvent(new CustomEvent('lingualens:challenge-result', {
      detail: { original, correct: isCorrect },
    }))

    if (isCorrect) {
      setTimeout(onClose, 1500)
    } else {
      setTimeout(onClose, 3000)
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-xl border border-subtle/20 p-4 w-72">
      <p className="text-xs text-subtle mb-2">Fill in the blank:</p>
      <p className="text-sm text-text-main leading-relaxed mb-3">{blankedSentence}</p>

      <div className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !result && submit()}
          disabled={!!result}
          placeholder={hint ? original[0] + '...' : 'Type your answer...'}
          className={`flex-1 text-sm border rounded-lg px-3 py-2 outline-none transition-colors font-sans
            ${result === 'correct' ? 'border-green-500 bg-green-50' : ''}
            ${result === 'incorrect' ? 'border-error bg-red-50' : ''}
            ${!result ? 'border-subtle/40 focus:border-primary' : ''}
          `}
        />
        <button
          onClick={submit}
          disabled={!!result || !input.trim()}
          className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          ↵
        </button>
      </div>

      {result === 'incorrect' && (
        <p className="text-xs text-error mb-2">Answer: <strong>{original}</strong></p>
      )}
      {result === 'correct' && (
        <p className="text-xs text-green-600 mb-2">
          {levenshtein(input.trim().toLowerCase(), original.toLowerCase()) === 1 ? 'Close enough! 👍' : 'Correct! 🎉'}
        </p>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setHint(true)}
          disabled={hint || !!result}
          className="text-xs text-subtle hover:text-primary disabled:opacity-40 transition-colors"
        >
          Hint
        </button>
        <button
          onClick={onClose}
          className="text-xs text-subtle hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  )
}
