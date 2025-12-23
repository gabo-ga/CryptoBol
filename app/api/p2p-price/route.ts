import { NextResponse } from "next/server"
import { getMongoCollection } from "@/lib/mongodb"
import type { Document, WithId } from "mongodb"

const BINANCE_P2P_API_URL ="https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"

type ExchangeRateDoc = Document & {
  date: Date
  priceBob: number
  tradeType: string
}

type ExchangeHistoryEntry = {
  id: string
  date: string
  priceBob: number
  tradeType: string
}


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
    next: { revalidate: 60 },
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
    const rateDocument = {
      date: new Date(),
      priceBob: usdtToBobRate,
      tradeType,
    }

    let history: ExchangeHistoryEntry[] = []

    try {
      const collectionName = process.env.MONGODB_COLLECTION || "usdt_bob"
      const dbName = process.env.MONGODB_DB || "cryptobol"
      const collection = await getMongoCollection<ExchangeRateDoc>(collectionName, dbName)
      await collection.insertOne(rateDocument)
      const historyDocs: WithId<ExchangeRateDoc>[] = await collection
        .find({})
        .sort({ date: -1 })
        .toArray()

      history = historyDocs.map((doc) => ({
        id: doc._id.toString(),
        date: doc.date instanceof Date ? doc.date.toISOString() : String(doc.date),
        priceBob: doc.priceBob,
        tradeType: doc.tradeType,
      }))
    } catch (dbError) {
      console.error("Failed to persist exchange rate:", dbError)
    }

    return NextResponse.json({
      price: usdtToBobRate,
      change24h: 0, // P2P doesn't provide 24h change
      timestamp: Date.now(),
      source: "Binance P2P API (USDT/BOB)",
      merchantName,
      history,
    })
  } catch (error) {
    console.error("Error fetching P2P exchange rate:", error)

  
    const baseRate = 6.96 // precio aproximado

    return NextResponse.json({
      price: baseRate,
      change24h: 0,
      timestamp: Date.now(),
      source: "Simulated data (API unavailable)",
      warning: "Using simulated data due to API error",
      history: [],
    })
  }
}


