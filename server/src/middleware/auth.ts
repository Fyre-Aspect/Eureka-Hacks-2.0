import type { Request, Response, NextFunction } from 'express'
import { getAuth } from 'firebase-admin/auth'

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing auth token' })
    return
  }

  const token = header.slice(7)
  try {
    const decoded = await getAuth().verifyIdToken(token)
    res.locals.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
