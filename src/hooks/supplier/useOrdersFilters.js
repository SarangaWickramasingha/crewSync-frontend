import { useMemo, useState } from 'react';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function parseDateParts(dateStr) {
  if (!dateStr) return { month: '', year: '' };
  const parts = dateStr.replace(',', '').split(' ');
  return { month: parts[0] || '', year: parts[2] || '' };
}

export { MONTHS };

export default function useOrdersFilters(orders) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [item, setItem] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);

  const years = useMemo(() => {
    const set = new Set(orders.map((o) => parseDateParts(o.date).year).filter(Boolean));
    return [...set].sort((a, b) => b - a);
  }, [orders]);

  const items = useMemo(() => {
    const set = new Set(orders.map((o) => o.items.split('×')[0].trim()).filter(Boolean));
    return [...set].sort();
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const { month: m, year: y } = parseDateParts(o.date);
        if (year && month && (y !== year || m !== month)) return false;
        if (item && o.items.split('×')[0].trim() !== item) return false;
        if (status && o.status !== status) return false;
        return true;
      }),
    [orders, year, month, item, status]
  );

  const hasActiveFilter = Boolean(year || month || item || status);

  function clear() {
    setYear('');
    setMonth('');
    setItem('');
    setStatus('');
  }

  function selectYear(value) {
    setYear(value);
    if (!value) setMonth('');
  }

  return {
    filters: { year, month, item, status },
    setMonth,
    setItem,
    setStatus,
    selectYear,
    clear,
    open,
    setOpen,
    years,
    items,
    filtered,
    hasActiveFilter,
  };
}
