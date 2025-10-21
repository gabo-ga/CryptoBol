"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, TrendingDown, RefreshCw, BarChart3, Eye } from "lucide-react"
import ExchangeChart from "./components/exchange-chart"
import AdSection from "./components/ad-section"
import LiveComponent from "@/components/ui/liveComponent"
import Header from "@/components/ui/header"

interface PriceData {
  timestamp: number
  price: number
  change24h: number
}

export default function USDTBOBExchange() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPriceData = async () => {
    try {
      setError(null)
      const response = await fetch("/api/exchange-rate")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const newDataPoint: PriceData = {
        timestamp: Date.now(),
        price: data.price,
        change24h: data.change24h,
      }

      setPriceData((prev) => {
        const updated = [...prev, newDataPoint]
        return updated.slice(-50)
      })

      setCurrentPrice(data.price)
      setChange24h(data.change24h)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (err) {
      console.error("Error fetching price data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch exchange rate")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPriceData()
    const interval = setInterval(fetchPriceData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  if (loading && priceData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Loader2 className="relative h-16 w-16 animate-spin mx-auto text-white" />
              </div>
              <p className="text-blue-100 text-xl">Loading exchange rate data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Cool Background Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400/30 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-cyan-300/25 rounded-full blur-xl animate-float"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-indigo-600/10 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Compact Header */}
        <div className="text-center space-y-3 pt-2">
          <Header />
          <LiveComponent />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            COTIZACIÓN USDT/BOB
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-md mx-4">
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* HERO SECTION - MASSIVE PRICE DISPLAY */}
        <div className="px-4">
          <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/30 shadow-2xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>

            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 ">
                <Eye className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-xl text-white">Tipo de cambio actual</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6 relative z-10">
              {/* MASSIVE PRICE */}
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent leading-none animate-pulse-slow">
                  {currentPrice ? formatPrice(currentPrice) : "Loading..."}
                </div>
              </div>

              {/* 24h Change - Prominent */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border text-xl md:text-2xl font-bold ${
                    change24h >= 0
                      ? "bg-green-500/20 border-green-400/50 text-green-300"
                      : "bg-red-500/20 border-red-400/50 text-red-300"
                  }`}
                >
                  {change24h >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                  {formatChange(change24h)}
                  <span className="text-sm opacity-75">24h</span>
                </div>
              </div>

              {/* Last Update & Refresh */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/20">
                <div className="text-blue-200 text-sm">
                  Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "--"}
                </div>
                <Button
                  onClick={fetchPriceData}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 px-6"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Refresh Rate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HERO CHART - Immediately after price */}
        <div className="px-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-white flex items-center justify-center gap-3">
                <BarChart3 className="h-7 w-7 text-cyan-400" />
                Live Price Chart
              </CardTitle>
              <CardDescription className="text-blue-200 text-lg">
                Real-time USDT/BOB exchange rate trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {priceData.length > 0 ? (
                <div className="relative">
                  {/* Chart enhancement overlay */}
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-cyan-400/10 to-transparent pointer-events-none rounded-t-lg"></div>
                  <ExchangeChart data={priceData} />
                </div>
              ) : (
                <div className="h-[400px] md:h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-cyan-400" />
                    <p className="text-blue-300 text-lg">Loading chart data...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* First Ad Section - Moved down */}
        <AdSection
          title="Crypto Trading Platform"
          description="Start trading cryptocurrencies with zero fees"
          type="banner"
        />

        {/* Additional Stats - Smaller, less prominent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-cyan-400 text-sm font-medium">Data Source</div>
              <div className="text-white text-lg font-bold">Binance API</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-blue-400 text-sm font-medium">Update Frequency</div>
              <div className="text-white text-lg font-bold">30 Seconds</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-indigo-400 text-sm font-medium">Market Status</div>
              <div className="text-green-400 text-lg font-bold">Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Second Ad Section */}
        <AdSection
          title="Crypto Wallet & Exchange"
          description="Secure wallet with instant USDT/BOB conversion"
          type="card"
        />

        {/* Info Section - Moved to bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Market Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>Live data from Binance API</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                <span>Auto-refresh every 30 seconds</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
                <span>Real-time price conversion</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-blue-200 text-sm">
                Prices are indicative and may vary across exchanges. For informational purposes only.
              </p>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                Educational Use
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-4 px-4">
          <p className="text-blue-300 text-sm">© 2024 USDT/BOB Exchange Tracker</p>
        </div>
      </div>
    </div>
  )
}
