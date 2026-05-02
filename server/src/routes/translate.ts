import { Router } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const { texts, source, target } = req.body as { texts: string[]; source: string; target: string }
  if (!texts?.length || !source || !target) {
    res.status(400).json({ error: 'texts, source, and target are required' })
    return
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, source, target, format: 'text' }),
      },
    )

    if (!response.ok) {
      res.status(502).json({ error: 'Translation API error' })
      return
    }

    const data = await response.json() as { data: { translations: { translatedText: string }[] } }
    const translations = texts.map((original, i) => ({
      original,
      translated: data.data.translations[i]?.translatedText ?? original,
    }))

    res.json({ translations })
  } catch {
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
