import { getIdToken } from './firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
const DB_NAME = 'lingualens-audio'
const DB_VERSION = 1
const STORE_NAME = 'audio'
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000

let db: IDBDatabase | null = null

async function openDB(): Promise<IDBDatabase> {
  if (db) return db
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
    req.onsuccess = () => { db = req.result; resolve(db) }
    req.onerror = () => reject(req.error)
  })
}

async function getCachedAudio(key: string): Promise<ArrayBuffer | null> {
  const database = await openDB()
  return new Promise((resolve) => {
    const tx = database.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => {
      const record = req.result as { key: string; data: ArrayBuffer; expires: number } | undefined
      if (!record || record.expires < Date.now()) {
        resolve(null)
      } else {
        resolve(record.data)
      }
    }
    req.onerror = () => resolve(null)
  })
}

async function setCachedAudio(key: string, data: ArrayBuffer): Promise<void> {
  const database = await openDB()
  return new Promise((resolve) => {
    const tx = database.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put({ key, data, expires: Date.now() + CACHE_TTL_MS })
    tx.oncomplete = () => resolve()
    tx.onerror = () => resolve()
  })
}

const audioContext = new AudioContext()

export async function playTTS(text: string, language: string): Promise<void> {
  const cacheKey = `${text}:${language}`
  let buffer = await getCachedAudio(cacheKey)

  if (!buffer) {
    const token = await getIdToken()
    const res = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text, language }),
    })

    if (!res.ok) return
    buffer = await res.arrayBuffer()
    await setCachedAudio(cacheKey, buffer)
  }

  const decoded = await audioContext.decodeAudioData(buffer.slice(0))
  const source = audioContext.createBufferSource()
  source.buffer = decoded
  source.connect(audioContext.destination)
  source.start()
}
