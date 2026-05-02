import React from 'react'

export type LumiState = 'idle' | 'curious' | 'prompting' | 'celebrating' | 'encouraging' | 'waving'

interface LumiProps {
  state?: LumiState
  size?: number
}

const animationClass: Record<LumiState, string> = {
  idle: 'animate-breathe',
  curious: 'animate-tilt',
  prompting: '',
  celebrating: 'animate-bounce_lumi',
  encouraging: 'animate-nod',
  waving: 'animate-wave',
}

export default function Lumi({ state = 'idle', size = 64 }: LumiProps) {
  const eyeStyle = state === 'curious' ? { transform: 'scaleY(1.3)' } : {}

  return (
    <div className={`inline-block select-none ${animationClass[state]}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Body */}
        <ellipse cx="50" cy="62" rx="30" ry="32" fill="#F5A623" />

        {/* Chest */}
        <ellipse cx="50" cy="68" rx="18" ry="22" fill="#FFF3D6" />

        {/* Left wing */}
        <ellipse cx="22" cy="68" rx="10" ry="18" fill="#E8951F" transform="rotate(-15 22 68)" />
        {/* Left wing teal tip */}
        <ellipse cx="18" cy="80" rx="5" ry="7" fill="#1B7A6E" transform="rotate(-15 18 80)" />

        {/* Right wing */}
        <ellipse cx="78" cy="68" rx="10" ry="18" fill="#E8951F" transform="rotate(15 78 68)" />
        {/* Right wing teal tip */}
        <ellipse cx="82" cy="80" rx="5" ry="7" fill="#1B7A6E" transform="rotate(15 82 80)" />

        {/* Head */}
        <circle cx="50" cy="36" r="26" fill="#F5A623" />

        {/* Face */}
        <ellipse cx="50" cy="38" rx="18" ry="16" fill="#FFF3D6" />

        {/* Left eye white */}
        <ellipse cx="40" cy="34" rx="8" ry="8" fill="white" style={eyeStyle} />
        {/* Right eye white */}
        <ellipse cx="60" cy="34" rx="8" ry="8" fill="white" style={eyeStyle} />

        {/* Left pupil */}
        <circle cx="41" cy="35" r="4" fill="#1A1A1A" />
        <circle cx="42" cy="33" r="1.5" fill="white" />
        {/* Right pupil */}
        <circle cx="61" cy="35" r="4" fill="#1A1A1A" />
        <circle cx="62" cy="33" r="1.5" fill="white" />

        {/* Beak */}
        <polygon points="50,42 45,48 55,48" fill="#E8951F" />

        {/* Graduation cap base */}
        <rect x="30" y="13" width="40" height="6" rx="2" fill="#1B7A6E" transform="rotate(-8 50 16)" />
        {/* Cap top */}
        <rect x="38" y="7" width="24" height="10" rx="2" fill="#1B7A6E" transform="rotate(-8 50 12)" />
        {/* Tassel */}
        <line x1="66" y1="10" x2="72" y2="20" stroke="#F5A623" strokeWidth="2" />
        <circle cx="72" cy="21" r="2.5" fill="#F5A623" />

        {/* Feet */}
        <ellipse cx="42" cy="93" rx="8" ry="4" fill="#E8951F" />
        <ellipse cx="58" cy="93" rx="8" ry="4" fill="#E8951F" />
      </svg>
    </div>
  )
}
