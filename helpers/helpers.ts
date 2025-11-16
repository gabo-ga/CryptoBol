export const formatChange =  (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-BO",{
        style: "currency",
        currency: "BOB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(price)
}