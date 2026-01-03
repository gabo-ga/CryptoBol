import { NextRequest, NextResponse } from "next/server"
import { getMongoCollection, isMongoConfigured } from "@/lib/mongodb"
import { COLLECTION_NAME, DB_NAME, HISTORY_LIMIT, mapHistoryDocuments, type ExchangeRateDoc } from "@/app/api/p2p-price/shared"
import type { Filter } from "mongodb"

export async function GET(request: NextRequest) {
  if (!isMongoConfigured) {
    return NextResponse.json({
      history: [],
      error: "MongoDB is not configured. Set MONGODB_URI to enable history persistence.",
    })
  }

  const searchParams = request.nextUrl.searchParams
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10)
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : HISTORY_LIMIT
  const sinceParam = searchParams.get("since")
  const sinceDate = sinceParam ? new Date(sinceParam) : null

  const query: Filter<ExchangeRateDoc> = {}
  if (sinceDate && !Number.isNaN(sinceDate.getTime())) {
    query.date = { $gte: sinceDate }
  }

  try {
    const collection = await getMongoCollection<ExchangeRateDoc>(COLLECTION_NAME, DB_NAME)
    const docs = await collection.find(query).sort({ date: 1 }).limit(limit).toArray()
    const history = mapHistoryDocuments(docs)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Failed to read exchange rate history:", error)
    return NextResponse.json({ history: [], error: "Failed to read history" }, { status: 500 })
  }
}
