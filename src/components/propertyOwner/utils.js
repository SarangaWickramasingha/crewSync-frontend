export function fmtCompact(n) {
  if (n >= 1000000 || n <= -1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000 || n <= -1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}