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

export default function useOrdersFilters(orders = []) {
  // Draft filter selections (changed by UI inputs before clicking Filter)
  const [draftYear, setDraftYear] = useState('');
  const [draftMonth, setDraftMonth] = useState('');
  const [draftItem, setDraftItem] = useState('');
  const [draftStatus, setDraftStatus] = useState('');

  // Applied filter state (only updated when clicking the Filter button)
  const [appliedFilters, setAppliedFilters] = useState({
    year: '',
    month: '',
    item: '',
    status: '',
  });

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
        const { year, month, item, status } = appliedFilters;
        const { month: m, year: y } = parseDateParts(o.date);
        if (year && y !== year) return false;
        if (month && m !== month) return false;
        if (item && o.items.split('×')[0].trim() !== item) return false;
        if (status && o.status !== status) return false;
        return true;
      }),
    [orders, appliedFilters]
  );

  const hasActiveFilter = Boolean(
    appliedFilters.year || appliedFilters.month || appliedFilters.item || appliedFilters.status
  );

  function applyFilters() {
    setAppliedFilters({
      year: draftYear,
      month: draftMonth,
      item: draftItem,
      status: draftStatus,
    });
  }

  function clear() {
    setDraftYear('');
    setDraftMonth('');
    setDraftItem('');
    setDraftStatus('');
    setAppliedFilters({
      year: '',
      month: '',
      item: '',
      status: '',
    });
  }

  function selectYear(value) {
    setDraftYear(value);
    if (!value) setDraftMonth('');
  }

  return {
    filters: {
      year: draftYear,
      month: draftMonth,
      item: draftItem,
      status: draftStatus,
    },
    appliedFilters,
    setMonth: setDraftMonth,
    setItem: setDraftItem,
    setStatus: setDraftStatus,
    selectYear,
    applyFilters,
    clear,
    open,
    setOpen,
    years,
    items,
    filtered,
    hasActiveFilter,
  };
}
