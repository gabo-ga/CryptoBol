import { mergePricePoints } from "@/helpers/price-history"
import type { PriceData } from "@/types/types"

describe("mergePricePoints", () => {
  const base: PriceData[] = [
    { timestamp: 1_700_000_000_000, price: 7, change24h: 0 },
    { timestamp: 1_700_000_100_000, price: 7.01, change24h: 0 },
  ]

  it("merges and sorts unique timestamps", () => {
    const incoming: PriceData[] = [
      { timestamp: 1_700_000_050_000, price: 7.005, change24h: 0 },
      { timestamp: 1_700_000_200_000, price: 7.02, change24h: 0 },
    ]

    const result = mergePricePoints(base, incoming)

    expect(result.map((r) => r.timestamp)).toEqual([
      1_700_000_000_000, 1_700_000_050_000, 1_700_000_100_000, 1_700_000_200_000,
    ])
  })

  it("deduplicates by timestamp keeping latest entry", () => {
    const incoming: PriceData[] = [
      { timestamp: 1_700_000_100_000, price: 8, change24h: 0 },
    ]

    const result = mergePricePoints(base, incoming)

    const updated = result.find((item) => item.timestamp === 1_700_000_100_000)
    expect(updated?.price).toBe(8)
    expect(result).toHaveLength(2)
  })

  it("applies maxPoints limit after sorting", () => {
    const incoming: PriceData[] = [
      { timestamp: 1_700_000_300_000, price: 7.03, change24h: 0 },
      { timestamp: 1_700_000_400_000, price: 7.04, change24h: 0 },
    ]

    const result = mergePricePoints(base, incoming, 3)

    expect(result.map((r) => r.timestamp)).toEqual([
      1_700_000_100_000, 1_700_000_300_000, 1_700_000_400_000,
    ])
  })
})
