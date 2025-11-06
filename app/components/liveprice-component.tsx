"use client"
import { Button } from "@/app/components/ui/button"
import { Loader2, TrendingUp, TrendingDown, RefreshCw, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useState, useEffect, useCallback } from "react"
import { PriceData } from "@/types/types"



interface LivePriceComponentProps {
  onDataPoint?: (dataPoint: PriceData) => void
  onErrorChange?: (message: string | null) => void
  onLoadingChange?: (isLoading: boolean) => void
}

export default function LivePriceComponent({
  onDataPoint,
  onErrorChange,
  onLoadingChange,
}: LivePriceComponentProps) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number>(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPriceData = useCallback(async () => {
    onErrorChange?.(null)
    onLoadingChange?.(true)
    setLoading(true)

    try {
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

      onDataPoint?.(newDataPoint)
      setCurrentPrice(data.price)
      setChange24h(data.change24h)
      setLastUpdate(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch exchange rate"
      console.error("Error fetching price data:", err)
      onErrorChange?.(message)
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }, [onDataPoint, onErrorChange, onLoadingChange])

  useEffect(() => {
    fetchPriceData()
    const interval = setInterval(fetchPriceData, 30000)
    return () => clearInterval(interval)
  }, [fetchPriceData])

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

  return (
    <>
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
            <div className="text-blue-200 text-sm">Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "--"}</div>
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
    </>
  )
}
