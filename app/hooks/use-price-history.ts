"use client"

import { useCallback, useEffect, useState } from "react"
import type { PriceData } from "@/types/types"

type UsePriceHistoryOptions = {
  limit?: number
}

type UsePriceHistoryResult = {
  history: PriceData[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function usePriceHistory({ limit = 200 }: UsePriceHistoryOptions = {}): UsePriceHistoryResult {
  const [history, setHistory] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/p2p-price/history?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!Array.isArray(data.history)) {
        throw new Error("Malformed history response")
      }

      const mappedHistory: PriceData[] = data.history
        .map((item: { date: string; priceBob: number }) => ({
          timestamp: new Date(item.date).getTime(),
          price: item.priceBob,
          change24h: 0,
        }))
        .filter((item) => Number.isFinite(item.timestamp) && Number.isFinite(item.price))
        .sort((a, b) => a.timestamp - b.timestamp)

      setHistory(mappedHistory)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load price history"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    history,
    loading,
    error,
    refresh: fetchHistory,
  }
}
