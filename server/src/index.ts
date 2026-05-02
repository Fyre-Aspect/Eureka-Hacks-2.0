import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import ttsRouter from './routes/tts'
import translateRouter from './routes/translate'
import vocabRouter from './routes/vocab'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api/tts', ttsRouter)
app.use('/api/translate', translateRouter)
app.use('/api/vocab', vocabRouter)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`LinguaLens server running on port ${PORT}`))
