import { formatChange, formatPrice } from "@/helpers/helpers"

describe("formatChange", () => {
  it("formats positive change with + prefix", () => {
    expect(formatChange(1.5)).toBe("+1.50%")
  })

  it("formats negative change with - prefix", () => {
    expect(formatChange(-2.3)).toBe("-2.30%")
  })

  it("formats zero as positive", () => {
    expect(formatChange(0)).toBe("+0.00%")
  })

  it("truncates to 2 decimal places", () => {
    expect(formatChange(1.999)).toBe("+2.00%")
    expect(formatChange(0.001)).toBe("+0.00%")
  })
})

describe("formatPrice", () => {
  it("formats a price as BOB currency", () => {
    const result = formatPrice(6.96)
    expect(result).toContain("6")
    expect(result).toContain("96")
  })

  it("formats zero", () => {
    const result = formatPrice(0)
    expect(result).toContain("0")
  })

  it("handles large numbers", () => {
    const result = formatPrice(1000.5)
    expect(result).toContain("1")
    expect(result).toContain("000")
  })

  it("respects up to 4 decimal places", () => {
    const result = formatPrice(6.9876)
    expect(result).toContain("9876")
  })
})
