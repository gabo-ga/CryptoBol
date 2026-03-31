"use client"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Alert, AlertDescription } from "@/app/components/ui/alert"
import { Loader2, BarChart3 } from "lucide-react"
import ExchangeChart from "./exchange-chart"
import LivePriceComponent from "./liveprice-component"
import { PriceData } from "@/types/types"

export default function DashboardClient() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLoadingChange = useCallback((isLoading: boolean) => {
  }, [])

  const handleWarningChange = useCallback((warning: string | null) => {
    setWarning(warning)
  }, [])

  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 backdrop-blur-md mx-4">
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Warning Alert */}
      {warning && !error && (
        <Alert className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-md mx-4">
          <AlertDescription className="text-yellow-300">{warning}</AlertDescription>
        </Alert>
      )}

      {/* HERO SECTION - MASSIVE PRICE DISPLAY */}
      <LivePriceComponent
        onDataPoint={handleDataPoint}
        onErrorChange={handleErrorChange}
        onLoadingChange={handleLoadingChange}
        onWarningChange={handleWarningChange}
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
    </>
  )
}
