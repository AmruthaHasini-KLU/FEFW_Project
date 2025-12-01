export default function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
  if (value === null || value === undefined || value === '') return '';
  // Accept numbers or strings that may include commas or currency symbols
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
}
