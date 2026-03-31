import { NextResponse } from "next/server"
import { getMongoCollection, isMongoConfigured } from "@/lib/mongodb"
import { COLLECTION_NAME, DB_NAME, HISTORY_LIMIT, mapHistoryDocuments, shouldPersistRate } from "@/app/api/p2p-price/shared"
import type { ExchangeHistoryEntry, ExchangeRateDoc } from "@/app/api/p2p-price/shared"
import type { WithId } from "mongodb"

const BINANCE_P2P_API_URL = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"

async function fetchBinanceP2PRate() {
  const binanceP2PResponse = await fetch(BINANCE_P2P_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; Exchange-Rate-App/1.0)",
    },
    body: JSON.stringify({
      asset: "USDT",
      fiat: "BOB",
      tradeType: "BUY",
      page: 1,
      rows: 1,
      payTypes: [],
      publisherType: null,
    }),
    next: { revalidate: 900 },
  })

  if (!binanceP2PResponse.ok) {
    throw new Error(`Binance P2P API error: ${binanceP2PResponse.status}`)
  }

  const p2pData = await binanceP2PResponse.json()

  if (!p2pData?.data?.length) {
    throw new Error("No P2P offers available")
  }

  const [{ adv, advertiser }] = p2pData.data
  const price = Number.parseFloat(adv.price)
  return {
    price: Number.parseFloat(price.toFixed(2)),
    tradeType: adv?.tradeType ?? "UNKNOWN",
    merchantName: advertiser?.nickName ?? "Unknown Merchant",
  }
}

export async function GET() {
  try {
    const { price: usdtToBobRate, tradeType, merchantName } = await fetchBinanceP2PRate()
    const now = new Date()
    const rateDocument: ExchangeRateDoc = {
      date: now,
      priceBob: usdtToBobRate,
      tradeType,
    }

    let history: ExchangeHistoryEntry[] = []

    if (isMongoConfigured) {
      try {
        const collection = await getMongoCollection<ExchangeRateDoc>(COLLECTION_NAME, DB_NAME)
        const latestDoc = await collection.find({}).sort({ date: -1 }).limit(1).next()
        if (shouldPersistRate(latestDoc ?? null, rateDocument)) {
          await collection.insertOne(rateDocument)
        }

        const historyDocs: WithId<ExchangeRateDoc>[] = await collection
          .find({})
          .sort({ date: -1 })
          .limit(HISTORY_LIMIT)
          .toArray()

        history = mapHistoryDocuments(historyDocs).reverse()
      } catch (dbError) {
        console.error("Failed to persist exchange rate:", dbError)
      }
    }

    return NextResponse.json({
      price: usdtToBobRate,
      change24h: 0, // P2P doesn't provide 24h change
      timestamp: rateDocument.date.getTime(),
      source: "Binance P2P API (USDT/BOB)",
      merchantName,
      history,
    })
  } catch (error) {
    console.error("Error fetching P2P exchange rate:", error)

    let fallbackPrice = 6.96
    let fallbackSource = "Hardcoded fallback (API and DB unavailable)"

    try {
      const collectionName = process.env.MONGODB_COLLECTION || "usdt_bob"
      const dbName = process.env.MONGODB_DB || "cryptobol"
      const collection = await getMongoCollection<ExchangeRateDoc>(collectionName, dbName)
      const lastDoc = await collection.findOne({}, { sort: { date: -1 } })

      if (lastDoc) {
        fallbackPrice = lastDoc.priceBob
        fallbackSource = "Last known price from database"
      }
    } catch (dbError) {
      console.error("Failed to fetch fallback from DB:", dbError)
    }

    return NextResponse.json({
      price: fallbackPrice,
      change24h: 0,
      timestamp: Date.now(),
      source: fallbackSource,
      warning: `Using fallback data: ${fallbackSource}`,
      history: [],
    })
  }
}
