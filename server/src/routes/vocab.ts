import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { getVocab, updateVocabEntry } from '../services/firestore'

const router = Router()

router.get('/', requireAuth, async (_req, res) => {
  try {
    const vocab = await getVocab(res.locals.uid as string)
    res.json({ vocab })
  } catch {
    res.status(500).json({ error: 'Failed to fetch vocab' })
  }
})

router.patch('/:wordId', requireAuth, async (req, res) => {
  const { wordId } = req.params
  const updates = req.body as Record<string, unknown>
  try {
    await updateVocabEntry(res.locals.uid as string, wordId, updates)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to update vocab' })
  }
})

export default router
