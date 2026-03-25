"use client"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2, BarChart3 } from "lucide-react"
import ExchangeChart from "./components/exchange-chart"
import AdSection from "./components/ad-section"
import LiveComponent from "@/app/components/ui/liveComponent"
import Header from "@/app/components/ui/header"
import Footer from "@/app/components/ui/footer"
import Disclaimer from "./components/disclaimer-component"
import InformationComponent from "./components/information-component"
import LivePriceComponent from "./components/liveprice-component"
import Background from "./components/ui/background"

interface PriceData {
  timestamp: number
  price: number
  change24h: number
}

export default function USDTBOBExchange() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleDataPoint = useCallback((dataPoint: PriceData) => {
    setPriceData((prev) => {
      const updated = [...prev, dataPoint]
      return updated.slice(-50)
    })
    setError(null)
  }, [])

  const handleErrorChange = useCallback((message: string | null) => {
    setError(message)
    if (message) {
    }
  }, [])

  const handleLoadingChange = useCallback((isLoading: boolean) => {
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      <Background />

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
        <LivePriceComponent
          onDataPoint={handleDataPoint}
          onErrorChange={handleErrorChange}
          onLoadingChange={handleLoadingChange}
        />

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

        {/* Second Ad Section
        <AdSection
          title="Crypto Wallet & Exchange"
          description="Secure wallet with instant USDT/BOB conversion"
          type="card"
        />
        */}

        {/* Info Section - Moved to bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          <InformationComponent/>
          <Disclaimer/>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
