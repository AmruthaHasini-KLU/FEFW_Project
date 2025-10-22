export function formatCurrency(amount = 0, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function roleDashboardPath(role) {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return '/dashboard/admin';
    case 'lender':
      return '/dashboard/lender';
    case 'analyst':
      return '/dashboard/analyst';
    case 'borrower':
    default:
      return '/dashboard/borrower';
  }
}
