import { mapHistoryDocuments, shouldPersistRate } from "@/app/api/p2p-price/shared"
import type { ExchangeRateDoc } from "@/app/api/p2p-price/shared"
import type { WithId } from "mongodb"

const baseRate: ExchangeRateDoc = {
  date: new Date("2024-01-01T00:00:00Z"),
  priceBob: 7,
  tradeType: "BUY",
}

describe("shouldPersistRate", () => {
  it("persists when there is no previous rate", () => {
    expect(shouldPersistRate(null, baseRate)).toBe(true)
  })

  it("skips when price and time match recent snapshot", () => {
    const latest = {
      _id: "1",
      ...baseRate,
    } as WithId<ExchangeRateDoc>

    const incoming = {
      ...baseRate,
      date: new Date(baseRate.date.getTime() + 30_000),
    }

    expect(shouldPersistRate(latest, incoming)).toBe(false)
  })

  it("persists when price changes within the same window", () => {
    const latest = {
      _id: "1",
      ...baseRate,
    } as WithId<ExchangeRateDoc>

    const incoming = {
      ...baseRate,
      priceBob: 7.1,
      date: new Date(baseRate.date.getTime() + 30_000),
    }

    expect(shouldPersistRate(latest, incoming)).toBe(true)
  })

  it("persists when snapshot is older than window", () => {
    const latest = {
      _id: "1",
      ...baseRate,
    } as WithId<ExchangeRateDoc>

    const incoming = {
      ...baseRate,
      date: new Date(baseRate.date.getTime() + 90_000),
    }

    expect(shouldPersistRate(latest, incoming)).toBe(true)
  })
})

describe("mapHistoryDocuments", () => {
  it("maps raw mongo docs into API-friendly objects", () => {
    const docs: WithId<ExchangeRateDoc>[] = [
      {
        _id: "abc123",
        ...baseRate,
      } as WithId<ExchangeRateDoc>,
    ]

    const mapped = mapHistoryDocuments(docs)

    expect(mapped).toEqual([
      {
        id: "abc123",
        date: "2024-01-01T00:00:00.000Z",
        priceBob: 7,
        tradeType: "BUY",
      },
    ])
  })
})
