export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function discountPercent(mrp: number, price: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatRate(rate: number | string) {
  const value = typeof rate === "string" ? Number(rate) : rate;
  return value === 0 ? "0% interest" : `${value}% p.a.`;
}
