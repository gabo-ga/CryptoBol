import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type RateLimitEntry = {
  count: number
  resetTime: number
}

const WINDOW_MS = 60_000
const MAX_REQUESTS = 30

const rateLimitMap = new Map<string, RateLimitEntry>()

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < WINDOW_MS) return
  lastCleanup = now
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

export function middleware(request: NextRequest) {
  cleanup()

  const ip = getClientIp(request)
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return NextResponse.next()
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
