import type { Document, WithId } from "mongodb"

export interface ExchangeRateDoc extends Document {
  date: Date
  priceBob: number
  tradeType: string
}

export interface ExchangeHistoryEntry {
  id: string
  date: string
  priceBob: number
  tradeType: string
}

export const COLLECTION_NAME = process.env.MONGODB_COLLECTION || "usdt_bob"
export const DB_NAME = process.env.MONGODB_DB || "cryptobol"
export const HISTORY_LIMIT = 200
export const MINIMUM_INTERVAL_MS = 60_000
export const PRICE_EPSILON = 0.0001

export function shouldPersistRate(latestDoc: WithId<ExchangeRateDoc> | null, incoming: ExchangeRateDoc) {
  if (!latestDoc) return true

  const latestDate = latestDoc.date instanceof Date ? latestDoc.date : new Date(latestDoc.date)
  const withinWindow = incoming.date.getTime() - latestDate.getTime() < MINIMUM_INTERVAL_MS
  const isSamePrice = Math.abs(latestDoc.priceBob - incoming.priceBob) < PRICE_EPSILON

  return !(withinWindow && isSamePrice)
}

export function mapHistoryDocuments(docs: WithId<ExchangeRateDoc>[]): ExchangeHistoryEntry[] {
  return docs.map((doc) => ({
    id: doc._id.toString(),
    date: doc.date instanceof Date ? doc.date.toISOString() : String(doc.date),
    priceBob: doc.priceBob,
    tradeType: doc.tradeType,
  }))
}
