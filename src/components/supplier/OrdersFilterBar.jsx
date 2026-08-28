'use client';
import { MONTHS } from '@/src/hooks/supplier/useOrdersFilters';
import StatusPill from '@/src/components/ui/StatusPill';

const selectClass =
  'w-full border border-border rounded-lg px-3 py-2 text-xs text-slate bg-white outline-none ' +
  'focus:border-supplier focus:ring-1 focus:ring-supplier/20 transition-all cursor-pointer';

export default function OrdersFilterPanel({
  filters,
  appliedFilters,
  years,
  items,
  onSelectYear,
  onSetMonth,
  onSetItem,
  onSetStatus,
  onApply,
  onClear,
  hasActiveFilter,
}) {
  const { year, month, item, status } = filters;
  const label = 'text-[0.7rem] font-semibold text-muted uppercase tracking-wide';

  return (
    <div className="bg-white border border-border rounded-xl px-5 py-4 mb-4 shadow-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-end">
        <div className="flex flex-col gap-1 min-w-[110px]">
          <label className={label}>Year</label>
          <select
            value={year}
            onChange={(e) => onSelectYear(e.target.value)}
            className={selectClass}
          >
            <option value="">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className={`${label} ${year ? 'text-muted' : 'text-slate/30'}`}>
            Month{!year && <span className="ml-1 normal-case font-normal">(select year first)</span>}
          </label>
          <select
            value={month}
            onChange={(e) => onSetMonth(e.target.value)}
            disabled={!year}
            className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <option value="">All months</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="self-stretch w-px bg-border hidden sm:block" />

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className={label}>Item</label>
          <select value={item} onChange={(e) => onSetItem(e.target.value)} className={selectClass}>
            <option value="">All items</option>
            {items.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className={label}>Status</label>
          <div className="flex gap-1.5 flex-wrap">
            {['', 'New', 'Processing', 'Delivered', 'Rejected'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSetStatus(s)}
                className={`text-[0.7rem] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer
                  ${status === s
                    ? s === ''
                      ? 'bg-supplier text-white border-supplier'
                      : 'bg-supplier-light text-supplier-dark border-supplier/30'
                    : 'bg-white text-muted border-border hover:border-slate/30'
                  }`}
              >
                {s === '' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end ml-auto">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-supplier hover:bg-supplier-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </button>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={onClear}
              className="text-[0.72rem] font-medium text-muted hover:text-supplier-dark transition-colors cursor-pointer underline underline-offset-2 bg-transparent border-none px-2 py-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {hasActiveFilter && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-border">
          <span className="text-[0.68rem] text-muted font-medium mr-1">Active filters:</span>
          {appliedFilters?.year && appliedFilters?.month && (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold bg-supplier-light text-supplier-dark border border-supplier/20 px-2.5 py-1 rounded-full">
              📅 {appliedFilters.month} {appliedFilters.year}
            </span>
          )}
          {appliedFilters?.year && !appliedFilters?.month && (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold bg-supplier-light text-supplier-dark border border-supplier/20 px-2.5 py-1 rounded-full">
              📅 {appliedFilters.year}
            </span>
          )}
          {appliedFilters?.item && (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold bg-supplier-light text-supplier-dark border border-supplier/20 px-2.5 py-1 rounded-full">
              📦 {appliedFilters.item}
            </span>
          )}
          {appliedFilters?.status && <StatusPill status={appliedFilters.status} />}
        </div>
      )}
    </div>
  );
}
