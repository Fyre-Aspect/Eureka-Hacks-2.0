import { Router } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

const VOICE_MAP: Record<string, string> = {
  es: 'pNInz6obpgDQGcFmaJgB',
  fr: 'EXAVITQu4vr4xnSDxMaL',
  de: 'VR6AewLTigWG4xSOukaG',
  pt: 'AZnzlk1XvdvUeBnXmlld',
  it: 'IKne3meq5aSn9XLyUdCD',
  ja: 'pqHfZKP75CvOlQylNhV4',
  ko: 'onwK4e9ZLuTAKqWW03F9',
  zh: 'XB0fDUnXU5powFXDhCwa',
}

router.post('/', requireAuth, async (req, res) => {
  const { text, language, voice_id } = req.body as { text: string; language: string; voice_id?: string }
  if (!text || !language) {
    res.status(400).json({ error: 'text and language are required' })
    return
  }

  const voiceId = voice_id ?? VOICE_MAP[language] ?? VOICE_MAP['es']
  const apiKey = process.env.ELEVENLABS_API_KEY

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey ?? '',
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    )

    if (!response.ok) {
      res.status(502).json({ error: 'TTS API error' })
      return
    }

    res.setHeader('Content-Type', 'audio/mpeg')
    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch {
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
