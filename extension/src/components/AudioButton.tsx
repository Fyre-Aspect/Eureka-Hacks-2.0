import React, { useState } from 'react'
import { playTTS } from '../services/tts'

interface AudioButtonProps {
  word: string
  language: string
}

export default function AudioButton({ word, language }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false)

  async function handlePlay() {
    if (playing) return
    setPlaying(true)
    try {
      await playTTS(word, language)
    } finally {
      setPlaying(false)
    }
  }

  return (
    <button
      onClick={handlePlay}
      className="flex items-center gap-0.5 p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
      title="Play pronunciation"
    >
      {playing ? <WaveformIcon /> : <SpeakerIcon />}
    </button>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B7A6E" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function WaveformIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B7A6E" strokeWidth="2">
      <line x1="2" y1="12" x2="4" y2="12" className="animate-pulse" />
      <line x1="6" y1="8" x2="6" y2="16" className="animate-pulse [animation-delay:0.1s]" />
      <line x1="10" y1="5" x2="10" y2="19" className="animate-pulse [animation-delay:0.2s]" />
      <line x1="14" y1="8" x2="14" y2="16" className="animate-pulse [animation-delay:0.1s]" />
      <line x1="18" y1="10" x2="18" y2="14" className="animate-pulse" />
      <line x1="22" y1="12" x2="22" y2="12" className="animate-pulse [animation-delay:0.3s]" />
    </svg>
  )
}
