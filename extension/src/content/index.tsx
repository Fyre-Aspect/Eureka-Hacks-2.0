import React from 'react'
import { createRoot } from 'react-dom/client'
import { scanViewport, watchForNewContent } from './scanner'
import { replaceWords } from './replacer'
import { attachInteractors } from './interactor'
import LumiOverlay from '../components/LumiOverlay'
import { translateBatch } from '../services/translate'
import { useVocabStore } from '../stores/vocabStore'
import { useUserStore } from '../stores/userStore'

console.log('LinguaLens content script loaded')

async function run(): Promise<void> {
  const { difficulty } = useUserStore.getState()
  const { vocab } = useVocabStore.getState()

  const targets = scanViewport()
  const allWords = [...new Set(targets.flatMap((t) => t.words.map((w) => w.toLowerCase())))]

  if (allWords.length === 0) return

  const { targetLanguage } = useUserStore.getState()
  const translations = await translateBatch(allWords, 'en', targetLanguage)

  replaceWords(targets, translations, vocab, difficulty)
  attachInteractors()

  useVocabStore.getState().recordSeen(Object.keys(translations))
}

function mountLumi(): void {
  const host = document.createElement('div')
  host.id = 'lingualens-lumi-host'
  document.body.appendChild(host)

  const shadowRoot = host.attachShadow({ mode: 'open' })
  const mountPoint = document.createElement('div')
  shadowRoot.appendChild(mountPoint)

  createRoot(mountPoint).render(
    <React.StrictMode>
      <LumiOverlay />
    </React.StrictMode>,
  )
}

mountLumi()

setTimeout(run, 500)

watchForNewContent((subtree) => {
  setTimeout(() => {
    const targets = scanViewport()
    if (targets.length > 0) run()
    attachInteractors(subtree)
  }, 300)
})
