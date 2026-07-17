export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0)
  return `$ ${formatted}`
}
