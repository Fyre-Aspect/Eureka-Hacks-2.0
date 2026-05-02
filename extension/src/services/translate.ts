import { getIdToken } from './firebase'

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3001'

const cache = new Map<string, string>()

export async function translateBatch(
  words: string[],
  source: string,
  target: string,
): Promise<Record<string, string>> {
  const uncached = words.filter((w) => !cache.has(`${w}:${source}:${target}`))
  const result: Record<string, string> = {}

  for (const w of words) {
    const cached = cache.get(`${w}:${source}:${target}`)
    if (cached) result[w] = cached
  }

  if (uncached.length === 0) return result

  try {
    const token = await getIdToken()
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ texts: uncached, source, target }),
    })

    if (!res.ok) return result

    const data = await res.json() as { translations: { original: string; translated: string }[] }
    for (const { original, translated } of data.translations) {
      cache.set(`${original}:${source}:${target}`, translated)
      result[original] = translated
    }
  } catch {
    // Silently fail — extension should not break page on API error
  }

  return result
}
