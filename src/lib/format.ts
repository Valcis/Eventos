// Centralized formatting utilities for ES/Euro/Madrid

const currencyFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const number2Fmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const number4Fmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '';
  return currencyFmt.format(value);
}

export function formatNumber2(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '';
  return number2Fmt.format(value);
}

export function formatNumber4(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '';
  return number4Fmt.format(value);
}

export function formatDateISO(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' });
}
