"use client"
import { useMemo } from "react"
import { Button } from "@/app/components/ui/button"
import { formatChange, formatPrice } from "@/helpers/helpers"
import { Loader2, TrendingUp, TrendingDown, RefreshCw, Eye, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { PriceData } from "@/types/types"
import { useLivePrice } from "@/app/hooks/use-live-price"

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
  const { currentPrice, change24h, lastUpdate, loading, error, refresh } = useLivePrice({
    onDataPoint,
    onErrorChange,
    onLoadingChange,
  })

  const { changeClassName, changeIcon, changeLabel } = useMemo(() => {
    const hasChange = typeof change24h === "number"

    if (!hasChange) {
      return {
        changeClassName: "bg-white/10 border-white/30 text-white/80",
        changeIcon: <Loader2 className="h-5 w-5 animate-spin" />,
        changeLabel: "--",
      }
    }

    const isPositive = change24h >= 0
    return {
      changeClassName: isPositive
        ? "bg-green-500/20 border-green-400/50 text-green-300"
        : "bg-red-500/20 border-red-400/50 text-red-300",
      changeIcon: isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />,
      changeLabel: formatChange(change24h),
    }
  }, [change24h])

  return (
    <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border-white/30 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>

      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 ">
          <Eye className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-xl text-white">Tipo de cambio actual</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="text-center space-y-6 relative z-10">
        <div className="space-y-2" aria-live="polite" role="status">
          <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent leading-none animate-pulse-slow">
            {currentPrice === null ? "Loading..." : formatPrice(currentPrice)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border text-xl md:text-2xl font-bold ${changeClassName}`}
          >
            {changeIcon}
            {changeLabel}
            <span className="text-sm opacity-75">24h</span>
          </div>
        </div>

        {error ? (
          <div className="flex items-start gap-2 rounded-md border border-red-400/50 bg-red-500/10 px-3 py-2 text-left text-sm text-red-100">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/20">
          <div className="text-blue-200 text-sm">
            Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "--"}
          </div>
          <Button
            onClick={refresh}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 px-6"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Rate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
