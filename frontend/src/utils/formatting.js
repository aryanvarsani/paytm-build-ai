/** Format number as Indian currency */
export function formatCurrency(amount) {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format large number with L/Cr suffixes */
export function formatCompact(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatCurrency(amount);
}

/** Format number with commas Indian style */
export function formatNumber(n) {
  if (n == null) return '';
  return new Intl.NumberFormat('en-IN').format(n);
}

/** Calculate percentage progress between from and target */
export function calcProgress(from, current, target) {
  if (typeof from !== 'number' || typeof current !== 'number' || typeof target !== 'number') return 50;
  const total = Math.abs(target - from);
  if (total === 0) return 100;
  const done = Math.abs(current - from);
  return Math.min(100, Math.round((done / total) * 100));
}

/** Get impact color class */
export function getImpactClass(impact) {
  switch (impact) {
    case 'high': return 'impact-high';
    case 'medium': return 'impact-medium';
    case 'low': return 'impact-low';
    default: return 'impact-low';
  }
}

/** Get impact label */
export function getImpactLabel(impact) {
  switch (impact) {
    case 'high': return 'High impact';
    case 'medium': return 'Medium impact';
    case 'low': return 'Low impact';
    default: return '';
  }
}
