import type { PriceData } from "@/types/types"

export function mergePricePoints(existing: PriceData[], incoming: PriceData[], maxPoints = 200): PriceData[] {
  const byTimestamp = new Map<number, PriceData>()

  for (const point of existing) {
    byTimestamp.set(point.timestamp, point)
  }

  for (const point of incoming) {
    byTimestamp.set(point.timestamp, point)
  }

  return Array.from(byTimestamp.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-maxPoints)
}
