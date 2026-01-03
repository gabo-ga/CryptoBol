"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { PriceData } from "@/types/types"

type UseLivePriceOptions = {
  pollMs?: number
  onDataPoint?: (dataPoint: PriceData) => void
  onErrorChange?: (message: string | null) => void
  onLoadingChange?: (isLoading: boolean) => void
}

type UseLivePriceResult = {
  currentPrice: number | null
  change24h: number | null
  lastUpdate: Date | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useLivePrice({
  pollMs = 900_000,
  onDataPoint,
  onErrorChange,
  onLoadingChange,
}: UseLivePriceOptions = {}): UseLivePriceResult {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFetchingRef = useRef(false)
  const mountedRef = useRef(true)
  const isVisibleRef = useRef(typeof document === "undefined" ? true : !document.hidden)

  const clearScheduled = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const fetchPriceData = useCallback(async () => {
    if (isFetchingRef.current || !mountedRef.current) return

    isFetchingRef.current = true
    setLoading(true)
    setError(null)
    clearScheduled()
    onErrorChange?.(null)
    onLoadingChange?.(true)

    try {
      const response = await fetch("/api/p2p-price")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const timestamp = typeof data.timestamp === "number" ? data.timestamp : Date.now()

      const newDataPoint: PriceData = {
        timestamp,
        price: data.price,
        change24h: data.change24h,
      }

      onDataPoint?.(newDataPoint)
      setCurrentPrice(typeof data.price === "number" ? data.price : null)
      setChange24h(typeof data.change24h === "number" ? data.change24h : null)
      setLastUpdate(new Date(timestamp))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch exchange rate"
      setError(message)
      onErrorChange?.(message)
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        onLoadingChange?.(false)
      }

      isFetchingRef.current = false

      if (mountedRef.current && isVisibleRef.current) {
        timeoutRef.current = setTimeout(fetchPriceData, pollMs)
      }
    }
  }, [clearScheduled, onDataPoint, onErrorChange, onLoadingChange, pollMs])

  useEffect(() => {
    mountedRef.current = true
    fetchPriceData()

    return () => {
      mountedRef.current = false
      clearScheduled()
    }
  }, [clearScheduled, fetchPriceData])

  useEffect(() => {
    if (typeof document === "undefined") return

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden

      if (!isVisibleRef.current) {
        clearScheduled()
        return
      }

      if (!isFetchingRef.current) {
        fetchPriceData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [clearScheduled, fetchPriceData])

  return {
    currentPrice,
    change24h,
    lastUpdate,
    loading,
    error,
    refresh: fetchPriceData,
  }
}
