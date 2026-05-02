import React from 'react'
import AudioButton from './AudioButton'
import { useUserStore } from '../stores/userStore'

interface WordCardProps {
  original: string
  translated: string
  phonetic?: string
  rect: DOMRect
  onClose: () => void
}

export default function WordCard({ original, translated, phonetic, rect, onClose }: WordCardProps) {
  const { targetLanguage } = useUserStore()

  const top = rect.bottom + window.scrollY + 8
  const left = Math.max(8, rect.left + window.scrollX)

  return (
    <div
      className="fixed z-[99999] bg-surface border border-subtle/30 rounded-xl shadow-lg p-3 min-w-[180px] max-w-[260px]"
      style={{ top, left }}
      onMouseLeave={onClose}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-text-main">{translated}</p>
          {phonetic && (
            <p className="text-xs font-mono text-subtle mt-0.5">{phonetic}</p>
          )}
          <p className="text-xs text-subtle mt-1">{original}</p>
        </div>
        <AudioButton word={translated} language={targetLanguage} />
      </div>
    </div>
  )
}
