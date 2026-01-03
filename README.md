# USDT/BOB Tracker

Next.js app that tracks the USDT/BOB rate, persists snapshots to MongoDB, and renders a live chart.

## Setup
- Install deps: `npm install`
- Set env vars in `.env.local`:
  - `MONGODB_URI` (required for persistence)
  - `MONGODB_DB` (optional, default `cryptobol`)
  - `MONGODB_COLLECTION` (optional, default `usdt_bob`)
- Dev server: `npm run dev` (http://localhost:3000)
- Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm test`

## API
- `GET /api/p2p-price`
  - Pulls latest USDT/BOB rate from Binance P2P (BUY side) with a 15-minute revalidation window.
  - Persists `{ date, priceBob, tradeType }` when Mongo is configured, skipping duplicates within 60s when price is unchanged.
  - Response: `{ price, change24h, timestamp, source, merchantName, history[] }` with `history` limited to the most recent 200 records (ascending).
- `GET /api/p2p-price/history?limit=200&since=2024-01-01T00:00:00Z`
  - Returns stored snapshots sorted ascending.
  - `limit` caps at 500; `since` filters by ISO date.

## UI flow
- On load, `usePriceHistory` seeds the `ExchangeChart` with persisted history.
- `useLivePrice` polls `/api/p2p-price` every 15 minutes for fresh ticks and appends them (deduped and capped) so the chart stays current.

## Testing
- Jest + ts-jest are configured with `npm test`.
- Coverage focuses on persistence helpers (`shouldPersistRate`, history mapping) and chart data merging. Running tests requires dev deps installed.
