"use client"

import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PriceData {
  timestamp: number
  price: number
  change24h: number
}

interface ExchangeChartProps {
  data: PriceData[]
}

export default function ExchangeChart({ data }: ExchangeChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: item.price,
    timestamp: item.timestamp,
  }))

  // Calculate average for reference line
  const avgPrice = chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.price, 0) / chartData.length : 0

  const chartConfig = {
    price: {
      label: "Price (BOB)",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="relative">
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-cyan-400/10 pointer-events-none rounded-lg"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent pointer-events-none rounded-lg"></div>

      <ChartContainer config={chartConfig} className="h-[400px] md:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity={0.6} />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(99, 102, 241)" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#93C5FD", fontWeight: 500 }}
              className="text-blue-300"
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#93C5FD", fontWeight: 500 }}
              tickFormatter={(value) => `${value.toFixed(2)}`}
              className="text-blue-300"
              width={70}
              domain={["dataMin - 0.01", "dataMax + 0.01"]}
            />
            {/* Average price reference line */}
            {avgPrice > 0 && (
              <ReferenceLine
                y={avgPrice}
                stroke="rgba(34, 211, 238, 0.5)"
                strokeDasharray="5 5"
                label={{ value: "Avg", position: "right", fill: "#22D3EE" }}
              />
            )}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-blue-900/95 backdrop-blur-md border-cyan-400/30 text-white shadow-2xl"
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      const timestamp = payload[0].payload.timestamp
                      return new Date(timestamp).toLocaleString()
                    }
                    return value
                  }}
                  formatter={(value: number) => [
                    new Intl.NumberFormat("es-BO", {
                      style: "currency",
                      currency: "BOB",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    }).format(value),
                    "Exchange Rate",
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="url(#strokeGradient)"
              strokeWidth={4}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{
                r: 8,
                stroke: "rgb(34, 211, 238)",
                strokeWidth: 4,
                fill: "white",
                filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
