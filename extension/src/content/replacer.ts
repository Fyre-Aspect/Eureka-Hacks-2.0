import type { TextTarget } from './scanner'
import type { VocabEntry } from '../stores/vocabStore'

export interface ReplacedWord {
  original: string
  translated: string
  level: number
  element: HTMLElement
}

const MAX_PER_VIEWPORT: Record<number, number> = { 1: 3, 2: 5, 3: 8 }

export function replaceWords(
  targets: TextTarget[],
  translations: Record<string, string>,
  vocab: Record<string, VocabEntry>,
  difficulty: number,
): ReplacedWord[] {
  const maxReplacements = MAX_PER_VIEWPORT[difficulty] ?? 5
  const replaced: ReplacedWord[] = []

  for (const target of targets) {
    if (replaced.length >= maxReplacements) break

    for (const word of target.words) {
      if (replaced.length >= maxReplacements) break
      const lower = word.toLowerCase()
      const translated = translations[lower]
      if (!translated) continue

      const entry = vocab[lower]
      if (entry && entry.level >= 3) continue

      const el = wrapWord(target.node, word, translated, entry?.level ?? 0)
      if (el) {
        replaced.push({ original: word, translated, level: entry?.level ?? 0, element: el })
      }
    }
  }

  return replaced
}

function wrapWord(
  textNode: Text,
  word: string,
  translated: string,
  level: number,
): HTMLElement | null {
  const text = textNode.textContent ?? ''
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`)
  const match = regex.exec(text)
  if (!match) return null

  const before = text.slice(0, match.index)
  const after = text.slice(match.index + word.length)

  const span = document.createElement('lingualens-word') as HTMLElement
  span.setAttribute('data-original', word)
  span.setAttribute('data-translated', translated)
  span.setAttribute('data-level', String(level))
  span.setAttribute('data-lingualens', 'true')
  span.textContent = translated
  span.style.cssText = `
    border-bottom: 2px dotted #1B7A6E;
    cursor: pointer;
    color: inherit;
    font: inherit;
    display: inline;
    position: relative;
  `

  const parent = textNode.parentNode
  if (!parent) return null

  parent.insertBefore(document.createTextNode(before), textNode)
  parent.insertBefore(span, textNode)
  parent.insertBefore(document.createTextNode(after), textNode)
  parent.removeChild(textNode)

  return span
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
