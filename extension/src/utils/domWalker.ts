const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA',
  'SELECT', 'BUTTON', 'NOSCRIPT', 'IFRAME', 'SVG', 'MATH',
])

export function walkTextNodes(root: Element, callback: (node: Text) => void): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT
      if (parent.closest(Array.from(SKIP_TAGS).join(','))) return NodeFilter.FILTER_REJECT
      const text = node.textContent?.trim() ?? ''
      if (text.length < 3) return NodeFilter.FILTER_SKIP
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let node: Node | null
  while ((node = walker.nextNode())) {
    callback(node as Text)
  }
}

export function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  )
}
