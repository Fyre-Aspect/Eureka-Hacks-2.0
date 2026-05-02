export function attachInteractors(root: Element | Document = document): void {
  root.querySelectorAll('lingualens-word').forEach(attachToWord)

  root.addEventListener('mouseover', (e) => {
    const target = (e.target as HTMLElement).closest('lingualens-word')
    if (target) handleHover(target as HTMLElement)
  })

  root.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('lingualens-word')
    if (target) handleClick(target as HTMLElement)
  })
}

function attachToWord(el: Element): void {
  (el as HTMLElement).addEventListener('mouseenter', () => handleHover(el as HTMLElement))
  ;(el as HTMLElement).addEventListener('click', () => handleClick(el as HTMLElement))
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null

function handleHover(el: HTMLElement): void {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    document.dispatchEvent(new CustomEvent('lingualens:hover', {
      detail: {
        original: el.dataset.original,
        translated: el.dataset.translated,
        level: Number(el.dataset.level),
        rect: el.getBoundingClientRect(),
      },
    }))
  }, 500)
}

function handleClick(el: HTMLElement): void {
  document.dispatchEvent(new CustomEvent('lingualens:challenge-start', {
    detail: {
      original: el.dataset.original,
      translated: el.dataset.translated,
      level: Number(el.dataset.level),
      sentence: el.closest('p, li, td, div')?.textContent ?? '',
    },
  }))
}
