export const uid = (): string => Math.random().toString(36).slice(2) + '-' + Date.now().toString(36)
export const nowISO = (): string => new Date().toISOString()
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}