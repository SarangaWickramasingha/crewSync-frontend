"use client";
import React, { useState, useMemo } from "react";

const STATUS_META = {
  New: { badge: "bg-[#FFF3E0] text-[#B85A00]", dot: "#E8820C" },
  Processing: { badge: "bg-[#E8F0FB] text-[#1A56A0]", dot: "#1A56A0" },
  Delivered: { badge: "bg-[#E6F4EC] text-[#1B6E3A]", dot: "#1B6E3A" },
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Parse "Jul 4, 2026" → { month: "Jul", year: "2026" }
function parseDateParts(dateStr) {
  if (!dateStr) return { month: "", year: "" };
  const parts = dateStr.replace(",", "").split(" ");
  // parts = ["Jul", "4", "2026"]
  return { month: parts[0] || "", year: parts[2] || "" };
}

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-041",
      customer: "Nimal Kumarasinghe",
      items: "Cement × 20 bags",
      amount: "LKR 57,000",
      date: "Jul 4, 2026",
      status: "New",
    },
    {
      id: "#ORD-040",
      customer: "Chamari Perera",
      items: "Steel Rod × 50m",
      amount: "LKR 44,500",
      date: "Jul 2, 2026",
      status: "Processing",
    },
    {
      id: "#ORD-039",
      customer: "Lasith Fernando",
      items: "Sand × 2 cubes",
      amount: "LKR 24,000",
      date: "Jun 28, 2026",
      status: "Delivered",
    },
  ]);

  // ── Filter state ──────────────────────────────────────────────
  const [filterYear, setFilterYear]   = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterItem, setFilterItem]   = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Derived unique years and items from orders
  const years = useMemo(() => {
    const s = new Set(orders.map(o => parseDateParts(o.date).year).filter(Boolean));
    return [...s].sort((a, b) => b - a);
  }, [orders]);

  const items = useMemo(() => {
    // Extract base item name (before ×)
    const s = new Set(orders.map(o => o.items.split("×")[0].trim()).filter(Boolean));
    return [...s].sort();
  }, [orders]);

  // ── Filtered orders ───────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const { month, year } = parseDateParts(o.date);

      // Year+Month: both must be set, otherwise skip date filter
      if (filterYear && filterMonth) {
        if (year !== filterYear || month !== filterMonth) return false;
      }

      // Item filter (independent)
      if (filterItem) {
        const baseItem = o.items.split("×")[0].trim();
        if (baseItem !== filterItem) return false;
      }

      // Status filter (independent)
      if (filterStatus && o.status !== filterStatus) return false;

      return true;
    });
  }, [orders, filterYear, filterMonth, filterItem, filterStatus]);

  const hasActiveFilter = filterYear || filterMonth || filterItem || filterStatus;

  function clearFilters() {
    setFilterYear("");
    setFilterMonth("");
    setFilterItem("");
    setFilterStatus("");
  }

  // ── Actions ───────────────────────────────────────────────────
  const handleAccept = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Processing" } : o)));
  };

  const handleReject = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="font-syne text-xl font-bold text-crewSlate [letter-spacing:-0.5px]">
            Orders
          </h2>
          <p className="text-xs text-crewMuted mt-0.5">
            Manage incoming material orders
          </p>
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className={`inline-flex items-center gap-2 text-[0.78rem] font-semibold px-3.5 py-2 rounded-lg border transition-all cursor-pointer
            ${filtersOpen
              ? "bg-[#FFF3E0] text-[#B85A00] border-[#E8820C]/30"
              : "bg-white text-crewSlate border-black/10 hover:border-[#E8820C]/40 hover:text-[#B85A00]"
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filter
          {hasActiveFilter && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8820C]" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="bg-white border border-black/10 rounded-xl px-5 py-4 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-end">

            {/* Year */}
            <div className="flex flex-col gap-1 min-w-[110px]">
              <label className="text-[0.7rem] font-semibold text-crewMuted uppercase tracking-wide">Year</label>
              <select
                value={filterYear}
                onChange={e => { setFilterYear(e.target.value); if (!e.target.value) setFilterMonth(""); }}
                className="border border-black/10 rounded-lg px-3 py-1.5 text-xs text-crewSlate bg-white outline-none focus:border-[#E8820C] cursor-pointer"
              >
                <option value="">All years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Month — requires Year */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className={`text-[0.7rem] font-semibold uppercase tracking-wide ${filterYear ? "text-crewMuted" : "text-black/25"}`}>
                Month
                {!filterYear && <span className="ml-1 normal-case font-normal">(select year first)</span>}
              </label>
              <select
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                disabled={!filterYear}
                className="border border-black/10 rounded-lg px-3 py-1.5 text-xs text-crewSlate bg-white outline-none focus:border-[#E8820C] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">All months</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Divider */}
            <div className="self-stretch w-px bg-black/8 hidden sm:block" />

            {/* Item */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[0.7rem] font-semibold text-crewMuted uppercase tracking-wide">Item</label>
              <select
                value={filterItem}
                onChange={e => setFilterItem(e.target.value)}
                className="border border-black/10 rounded-lg px-3 py-1.5 text-xs text-crewSlate bg-white outline-none focus:border-[#E8820C] cursor-pointer"
              >
                <option value="">All items</option>
                {items.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-[0.7rem] font-semibold text-crewMuted uppercase tracking-wide">Status</label>
              <div className="flex gap-1.5 flex-wrap">
                {["", "New", "Processing", "Delivered"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`text-[0.7rem] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer
                      ${filterStatus === s
                        ? s === ""
                          ? "bg-[#1A1D23] text-white border-[#1A1D23]"
                          : `${STATUS_META[s]?.badge ?? ""} border-transparent`
                        : "bg-white text-crewMuted border-black/10 hover:border-black/20"
                      }`}
                  >
                    {s === "" ? "All" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="self-end text-[0.72rem] font-medium text-crewMuted hover:text-[#C0392B] transition-colors cursor-pointer underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Active filter summary chips */}
          {hasActiveFilter && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-black/6">
              {filterYear && filterMonth && (
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-[#F7F6F2] text-crewSlate px-2.5 py-1 rounded-full">
                  📅 {filterMonth} {filterYear}
                </span>
              )}
              {filterYear && !filterMonth && (
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-[#F7F6F2] text-crewSlate px-2.5 py-1 rounded-full">
                  📅 {filterYear} (select month to filter)
                </span>
              )}
              {filterItem && (
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold bg-[#F7F6F2] text-crewSlate px-2.5 py-1 rounded-full">
                  📦 {filterItem}
                </span>
              )}
              {filterStatus && (
                <span className={`inline-flex items-center gap-1.5 text-[0.68rem] font-semibold px-2.5 py-1 rounded-full ${STATUS_META[filterStatus]?.badge}`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_META[filterStatus]?.dot }} />
                  {filterStatus}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table Wrapper */}
      <div className="bg-white border border-black/10 overflow-hidden overflow-x-auto shadow-sm rounded-xl">
        <table className="w-full border-collapse text-[0.83rem] text-left">
          <thead>
            <tr className="bg-[#EEECEA] border-b border-black/10 text-[0.72rem] font-semibold text-crewMuted uppercase tracking-wider">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-crewSlate">
            {filteredOrders.map((order) => {
              const meta = STATUS_META[order.status];
              return (
                <tr key={order.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                  <td className="p-3 font-semibold text-crewSlate">{order.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{order.customer}</span>
                    </div>
                  </td>
                  <td className="p-3 text-crewSlate-light">{order.items}</td>
                  <td className="p-3 font-semibold">{order.amount}</td>
                  <td className="p-3 text-crewMuted">{order.date}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-full ${meta.badge}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.status === "New" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(order.id)}
                          className="text-[0.75rem] font-semibold border rounded-[7px] px-[11px] py-[6px] bg-[#E6F4EC] text-[#1B6E3A] border-[#1B6E3A]/20 hover:bg-[#d8edd3] transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="text-[0.75rem] font-medium border border-black/10 rounded-[7px] px-[11px] py-[6px] text-crewSlate-light hover:bg-[#FDECEA] hover:text-[#C0392B] hover:border-[#C0392B]/30 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {order.status === "Processing" && (
                      <span className="text-[0.75rem] text-[#1A56A0] font-medium">In Progress</span>
                    )}
                    {order.status === "Delivered" && (
                      <span className="text-[0.75rem] text-[#1B6E3A] font-medium">Delivered</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-crewMuted text-sm">
            {hasActiveFilter ? "No orders match the selected filters." : "No orders yet."}
          </div>
        )}
      </div>
    </div>
  );
}
