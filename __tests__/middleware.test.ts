import { middleware } from "@/middleware"
import { NextRequest } from "next/server"

function createRequest(ip = "127.0.0.1"): NextRequest {
  const request = new NextRequest("http://localhost:3000/api/p2p-price", {
    headers: { "x-forwarded-for": ip },
  })
  return request
}

describe("Rate limiting middleware", () => {
  it("allows requests under the limit", async () => {
    const ip = `test-allow-${Date.now()}`
    const request = createRequest(ip)
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("returns 429 after exceeding the limit", async () => {
    const ip = `test-block-${Date.now()}`

    for (let i = 0; i < 30; i++) {
      const response = middleware(createRequest(ip))
      expect(response.status).toBe(200)
    }

    const blocked = middleware(createRequest(ip))
    expect(blocked.status).toBe(429)

    const body = await blocked.json()
    expect(body.error).toBe("Too many requests")
  })

  it("tracks different IPs independently", async () => {
    const ip1 = `test-ip1-${Date.now()}`
    const ip2 = `test-ip2-${Date.now()}`

    for (let i = 0; i < 30; i++) {
      middleware(createRequest(ip1))
    }

    const blockedIp1 = middleware(createRequest(ip1))
    expect(blockedIp1.status).toBe(429)

    const allowedIp2 = middleware(createRequest(ip2))
    expect(allowedIp2.status).toBe(200)
  })
})
