# CryptoBol

Real-time USDT/BOB exchange rate tracker powered by Binance P2P data.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Charts:** Recharts
- **Database:** MongoDB
- **Language:** TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Setup

```bash
git clone <repo-url>
cd usdtbob
npm install
```

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
MONGODB_DB=cryptobol          # optional, defaults to "cryptobol"
MONGODB_COLLECTION=usdt_bob   # optional, defaults to "usdt_bob"
```

### Development

```bash
npm run dev       # Start dev server (Turbopack) on http://localhost:3000
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # ESLint checks
npm test          # Run Jest tests
```

## Project Structure

```
app/
  api/p2p-price/    API route for Binance P2P data
  components/       Feature components + ui/ primitives
  hooks/            Custom React hooks
helpers/            Formatting utilities
lib/                MongoDB client, shared utils
types/              TypeScript type definitions
```
