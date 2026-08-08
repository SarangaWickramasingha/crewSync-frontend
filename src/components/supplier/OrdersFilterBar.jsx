'use client';
import { MONTHS } from '@/src/hooks/supplier/useOrdersFilters';
import StatusPill from '@/src/components/ui/StatusPill';
import { selectClass } from '@/src/components/supplier/formStyles';

export function OrdersFilterToggle({ open, hasActiveFilter, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-[0.78rem] font-semibold px-3.5 py-2 rounded-lg border transition-all cursor-pointer
        ${open
          ? 'bg-crewAmber-light text-crewAmber-dark border-crewAmber/30'
          : 'bg-white text-crewSlate border-black/10 hover:border-crewAmber/40 hover:text-crewAmber-dark'
        }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      Filter
      {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-crewAmber" />}
    </button>
  );
}

export default function OrdersFilterPanel({
  filters,
  years,
  items,
  onSelectYear,
  onSetMonth,
  onSetItem,
  onSetStatus,
  onClear,
  hasActiveFilter,
}) {
  const { year, month, item, status } = filters;
  const label = 'text-[0.7rem] font-semibold text-crewMuted uppercase tracking-wide';

  return (
    <div className="bg-white border border-black/10 rounded-xl px-5 py-4 mb-4 shadow-sm">
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
          <label className={`${label} ${year ? 'text-crewMuted' : 'text-black/25'}`}>
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

        <div className="self-stretch w-px bg-black/8 hidden sm:block" />

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
            {['', 'New', 'Processing', 'Delivered'].map((s) => (
              <button
                key={s}
                onClick={() => onSetStatus(s)}
                className={`text-[0.7rem] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer
                  ${status === s
                    ? s === ''
                      ? 'bg-crewSlate text-white border-crewSlate'
                      : 'bg-crewAmber-light text-crewAmber-dark border-transparent'
                    : 'bg-white text-crewMuted border-black/10 hover:border-black/20'
                  }`}
              >
                {s === '' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilter && (
          <button
            onClick={onClear}
            className="self-end text-[0.72rem] font-medium text-crewMuted hover:text-[#C0392B] transition-colors cursor-pointer underline underline-offset-2 bg-transparent border-none"
          >
            Clear filters
          </button>
        )}
      </div>

      {hasActiveFilter && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-black/6">
          {year && month && (
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-crewSurface text-crewSlate px-2.5 py-1 rounded-full">
              📅 {month} {year}
            </span>
          )}
          {year && !month && (
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-crewSurface text-crewSlate px-2.5 py-1 rounded-full">
              📅 {year} (select month to filter)
            </span>
          )}
          {item && (
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-crewSurface text-crewSlate px-2.5 py-1 rounded-full">
              📦 {item}
            </span>
          )}
          {status && <StatusPill status={status} withDot />}
        </div>
      )}
    </div>
  );
}
