import { GET } from "@/app/api/p2p-price/route"

const mockInsertOne = jest.fn()
const mockFind = jest.fn()
const mockFindOne = jest.fn()
const mockSort = jest.fn()
const mockToArray = jest.fn()

jest.mock("@/lib/mongodb", () => ({
  getMongoCollection: jest.fn(() =>
    Promise.resolve({
      insertOne: mockInsertOne,
      findOne: mockFindOne,
      find: mockFind,
    })
  ),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockFind.mockReturnValue({ sort: mockSort })
  mockSort.mockReturnValue({ toArray: mockToArray })
  mockToArray.mockResolvedValue([])
  mockInsertOne.mockResolvedValue({ acknowledged: true })
  mockFindOne.mockResolvedValue(null)
})

describe("GET /api/p2p-price", () => {
  it("returns price data from Binance P2P on success", async () => {
    const mockBinanceResponse = {
      data: [
        {
          adv: { price: "6.98", tradeType: "BUY" },
          advertiser: { nickName: "TestMerchant" },
        },
      ],
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBinanceResponse),
    })

    const response = await GET()
    const data = await response.json()

    expect(data.price).toBe(6.98)
    expect(data.source).toBe("Binance P2P API (USDT/BOB)")
    expect(data.merchantName).toBe("TestMerchant")
    expect(data.warning).toBeUndefined()
    expect(mockInsertOne).toHaveBeenCalledTimes(1)
  })

  it("returns last known DB price when Binance API fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"))
    mockFindOne.mockResolvedValue({ priceBob: 7.05, date: new Date(), tradeType: "BUY" })

    const response = await GET()
    const data = await response.json()

    expect(data.price).toBe(7.05)
    expect(data.source).toBe("Last known price from database")
    expect(data.warning).toContain("Last known price")
    expect(data.history).toEqual([])
  })

  it("returns hardcoded fallback when both Binance and DB fail", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"))
    mockFindOne.mockRejectedValue(new Error("DB connection failed"))

    const response = await GET()
    const data = await response.json()

    expect(data.price).toBe(6.96)
    expect(data.warning).toContain("Hardcoded fallback")
  })

  it("returns hardcoded fallback when Binance fails and DB is empty", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"))
    mockFindOne.mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()

    expect(data.price).toBe(6.96)
    expect(data.warning).toContain("Hardcoded fallback")
  })

  it("returns Binance price even if MongoDB insert fails", async () => {
    const mockBinanceResponse = {
      data: [
        {
          adv: { price: "7.00", tradeType: "BUY" },
          advertiser: { nickName: "Merchant2" },
        },
      ],
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBinanceResponse),
    })

    mockInsertOne.mockRejectedValue(new Error("DB write failed"))

    const response = await GET()
    const data = await response.json()

    expect(data.price).toBe(7)
    expect(data.source).toBe("Binance P2P API (USDT/BOB)")
  })

  it("returns fallback when Binance returns empty data", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    })

    const response = await GET()
    const data = await response.json()

    expect(data.warning).toBeDefined()
  })

  it("returns fallback when Binance returns non-ok status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
    })

    const response = await GET()
    const data = await response.json()

    expect(data.warning).toBeDefined()
  })
})
