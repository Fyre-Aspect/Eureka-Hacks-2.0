import React, { useState } from 'react'
import { useUserStore } from '../stores/userStore'
import { useVocabStore } from '../stores/vocabStore'

const LANGUAGES: Record<string, string> = {
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
  it: 'Italian', ja: 'Japanese', ko: 'Korean', zh: 'Mandarin',
}

const MASTERY_LABELS = ['New', 'Seen', 'Familiar', 'Practiced', 'Mastered']

function MasteryDots({ level, max = 4 }: { level: number; max?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < level ? 'bg-primary' : 'bg-subtle/30'}`}
        />
      ))}
    </span>
  )
}

function DifficultyDots({ value, onChange }: { value: 1 | 2 | 3; onChange: (v: 1 | 2 | 3) => void }) {
  return (
    <span className="flex gap-1">
      {([1, 2, 3] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-3 h-3 rounded-full transition-colors ${v <= value ? 'bg-accent' : 'bg-subtle/30'}`}
          title={`Difficulty ${v}`}
        />
      ))}
    </span>
  )
}

export default function Popup() {
  const {
    targetLanguage, sourceLanguage, difficulty, streak,
    dailyWordTarget, setDifficulty, setLanguages, togglePausedSite, pausedSites,
  } = useUserStore()
  const { todayStats, getWordsForDisplay } = useVocabStore()
  const [showSettings, setShowSettings] = useState(false)

  const recentWords = getWordsForDisplay().slice(0, 5)
  const isPaused = pausedSites.some((s) => window.location.hostname.includes(s))

  return (
    <div className="w-[400px] bg-surface font-sans text-text-main">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle/20">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦉</span>
          <span className="font-semibold text-base tracking-tight">LinguaLens</span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-subtle hover:text-text-main transition-colors p-1 rounded"
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {showSettings ? (
        <SettingsPanel
          targetLanguage={targetLanguage}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          setLanguages={setLanguages}
          onClose={() => setShowSettings(false)}
        />
      ) : (
        <div className="p-4 space-y-4">
          {/* Streak */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="font-semibold text-accent">{streak}-day streak</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              value={`${todayStats.wordsSeen} / ${dailyWordTarget}`}
              label="words today"
            />
            <StatCard
              value={`${todayStats.challengesCorrect} / ${Math.max(1, todayStats.challengesAttempted)}`}
              label="correct"
            />
          </div>

          {/* Language pair + difficulty */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-subtle">
              {sourceLanguage.toUpperCase()} → {LANGUAGES[targetLanguage] ?? targetLanguage}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-subtle">Difficulty</span>
              <DifficultyDots value={difficulty} onChange={setDifficulty} />
            </div>
          </div>

          {/* Recent words */}
          {recentWords.length > 0 && (
            <div className="bg-white/60 rounded-xl border border-subtle/20 overflow-hidden">
              <p className="px-3 pt-3 pb-1 text-xs font-semibold text-subtle uppercase tracking-wider">
                Recent words
              </p>
              <div className="divide-y divide-subtle/10">
                {recentWords.map((entry) => (
                  <div key={entry.original} className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-primary">{entry.translated}</span>
                    <MasteryDots level={entry.level} />
                    <span className="text-sm text-subtle">{entry.original}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pause toggle */}
          <button
            onClick={() => togglePausedSite(window.location.hostname)}
            className={`w-full py-2 rounded-xl text-sm font-medium border transition-colors ${
              isPaused
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-subtle border-subtle/30 hover:border-primary hover:text-primary'
            }`}
          >
            {isPaused ? '▶ Resume on this site' : '⏸ Pause on this site'}
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/60 rounded-xl border border-subtle/20 p-3 text-center">
      <p className="text-xl font-semibold text-text-main">{value}</p>
      <p className="text-xs text-subtle mt-0.5">{label}</p>
    </div>
  )
}

function SettingsPanel({
  targetLanguage, difficulty, setDifficulty, setLanguages, onClose,
}: {
  targetLanguage: string
  difficulty: 1 | 2 | 3
  setDifficulty: (v: 1 | 2 | 3) => void
  setLanguages: (src: string, tgt: string) => void
  onClose: () => void
}) {
  const [tgt, setTgt] = useState(targetLanguage)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onClose} className="text-subtle hover:text-text-main">←</button>
        <h2 className="font-semibold text-sm">Settings</h2>
      </div>

      <div>
        <label className="text-xs text-subtle font-medium block mb-1">Target language</label>
        <select
          value={tgt}
          onChange={(e) => { setTgt(e.target.value); setLanguages('en', e.target.value) }}
          className="w-full border border-subtle/30 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-primary"
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-subtle font-medium block mb-2">Difficulty</label>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((v) => (
            <button
              key={v}
              onClick={() => setDifficulty(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                difficulty === v
                  ? 'bg-primary text-white border-primary'
                  : 'border-subtle/30 text-subtle hover:border-primary hover:text-primary'
              }`}
            >
              {v === 1 ? 'Beginner' : v === 2 ? 'Intermediate' : 'Advanced'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
