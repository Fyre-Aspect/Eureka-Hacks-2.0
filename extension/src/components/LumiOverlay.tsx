import React, { useState, useEffect, useCallback } from 'react'
import Lumi, { type LumiState } from './Lumi'
import Challenge from './Challenge'
import WordCard from './WordCard'

interface HoverDetail {
  original: string
  translated: string
  level: number
  rect: DOMRect
}

interface ChallengeDetail {
  original: string
  translated: string
  sentence: string
  level: number
}

type Position = { x: number; y: number }

const CORNER_SNAP: Position = { x: window.innerWidth - 100, y: window.innerHeight - 100 }

export default function LumiOverlay() {
  const [lumiState, setLumiState] = useState<LumiState>('waving')
  const [minimized, setMinimized] = useState(false)
  const [position, setPosition] = useState<Position>(CORNER_SNAP)
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null)
  const [hoverCard, setHoverCard] = useState<HoverDetail | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragOffset = React.useRef<Position>({ x: 0, y: 0 })

  // Transition to idle after waving on mount
  useEffect(() => {
    const t = setTimeout(() => setLumiState('idle'), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onHover = (e: Event) => {
      const detail = (e as CustomEvent<HoverDetail>).detail
      setHoverCard(detail)
      setLumiState('curious')
    }

    const onChallenge = (e: Event) => {
      const detail = (e as CustomEvent<ChallengeDetail>).detail
      if (detail.level < 2) {
        setChallenge(detail)
        setLumiState('prompting')
      }
    }

    const onResult = (e: Event) => {
      const { correct } = (e as CustomEvent<{ correct: boolean }>).detail
      setLumiState(correct ? 'celebrating' : 'encouraging')
      setTimeout(() => setLumiState('idle'), 2000)
    }

    document.addEventListener('lingualens:hover', onHover)
    document.addEventListener('lingualens:challenge-start', onChallenge)
    document.addEventListener('lingualens:challenge-result', onResult)

    return () => {
      document.removeEventListener('lingualens:hover', onHover)
      document.removeEventListener('lingualens:challenge-start', onChallenge)
      document.removeEventListener('lingualens:challenge-result', onResult)
    }
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }, [position])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.current.y)),
      })
    }
    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  return (
    <>
      {hoverCard && (
        <WordCard
          original={hoverCard.original}
          translated={hoverCard.translated}
          rect={hoverCard.rect}
          onClose={() => { setHoverCard(null); setLumiState('idle') }}
        />
      )}

      <div
        className="fixed z-[99998] select-none"
        style={{ left: position.x, top: position.y }}
      >
        {challenge && !minimized && (
          <div className="absolute bottom-full right-0 mb-2" style={{ transition: 'all 300ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <Challenge
              original={challenge.original}
              translated={challenge.translated}
              sentence={challenge.sentence}
              onClose={() => { setChallenge(null); setLumiState('idle') }}
            />
          </div>
        )}

        <div
          onMouseDown={onMouseDown}
          className={`cursor-grab active:cursor-grabbing ${dragging ? 'opacity-80' : ''}`}
        >
          {minimized ? (
            <button
              onClick={() => setMinimized(false)}
              className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-md text-lg"
              title="Open LinguaLens"
            >
              🦉
            </button>
          ) : (
            <div className="relative">
              <Lumi state={lumiState} size={72} />
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized(true) }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-subtle/70 hover:bg-subtle text-white rounded-full text-xs flex items-center justify-center leading-none"
                title="Minimize"
              >
                −
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
