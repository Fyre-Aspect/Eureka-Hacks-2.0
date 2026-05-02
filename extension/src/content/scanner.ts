export interface TextTarget {
  node: Text
  text: string
  words: string[]
}

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA',
  'SELECT', 'BUTTON', 'NOSCRIPT', 'IFRAME', 'SVG', 'MATH',
])

function isEditable(node: Node): boolean {
  const el = node.parentElement
  if (!el) return false
  return el.isContentEditable || el.closest('[contenteditable]') !== null
}

function isVisible(node: Text): boolean {
  const el = node.parentElement
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

function shouldSkip(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true
  if (el.getAttribute('data-lingualens') !== null) return true
  return false
}

export function scanViewport(): TextTarget[] {
  const targets: TextTarget[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)

  let node: Node | null
  while ((node = walker.nextNode())) {
    const textNode = node as Text
    const text = textNode.textContent?.trim() ?? ''
    if (text.length < 3) continue

    const parent = textNode.parentElement
    if (!parent) continue
    if (shouldSkip(parent)) continue
    if (parent.closest(Array.from(SKIP_TAGS).join(','))) continue
    if (isEditable(textNode)) continue
    if (!isVisible(textNode)) continue

    const words = text.match(/\b[a-zA-Z]{3,}\b/g) ?? []
    if (words.length === 0) continue

    targets.push({ node: textNode, text, words })
  }

  return targets
}

export function watchForNewContent(callback: (subtree: Element) => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const added of mutation.addedNodes) {
        if (added.nodeType === Node.ELEMENT_NODE) {
          callback(added as Element)
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
  return observer
}
