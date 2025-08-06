import { NextResponse } from "next/server"

export async function GET() {
  try {
    //llamada a la api de binance
    const binanceP2PResponse = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
      method: 'POST',
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
        publisherType: null
      }),
      next: { revalidate: 30 },
    })

    if (!binanceP2PResponse.ok) {
      throw new Error(`Binance P2P API error: ${binanceP2PResponse.status}`)
    }

    const p2pData = await binanceP2PResponse.json()
    
    if (!p2pData.data || p2pData.data.length === 0) {
      throw new Error('No P2P offers available')
    }

    //extrae el precio
    const usdtToBobRate = Number.parseFloat(p2pData.data[0].adv.price)


    return NextResponse.json({
      price: Number.parseFloat(usdtToBobRate.toFixed(2)),
      change24h: 0, // P2P doesn't provide 24h change
      timestamp: Date.now(),
      source: "Binance P2P API (USDT/BOB)",
      merchantName: p2pData.data[0].advertiser.nickName
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
    })
  }
}
