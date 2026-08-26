'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusPill from '@/src/components/ui/StatusPill';

const TABLE_HEADERS = ['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Actions'];
const PAGE_SIZE = 10;

const ACTION_LABEL = {
  Processing: { text: 'In Progress', className: 'text-blue-600' },
  Delivered: { text: 'Delivered', className: 'text-green-600' },
  Rejected: { text: 'Rejected', className: 'text-red-500' },
  processing: { text: 'In Progress', className: 'text-blue-600' },
  delivered: { text: 'Delivered', className: 'text-green-600' },
  rejected: { text: 'Rejected', className: 'text-red-500' },
  accepted: { text: 'In Progress', className: 'text-blue-600' },
};

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default function OrdersTable({ orders = [], onAccept, onReject, hasActiveFilter = false, loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems, hasActiveFilter]);

  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginatedOrders = orders.slice(startIndex, endIndex);
  const pageNumbers = getPageNumbers(activePage, totalPages);

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-[#1A1D23] text-left">
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-5 text-muted">
                  Loading orders…
                </td>
              </tr>
            ) : totalItems === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-5 text-muted">
                  {hasActiveFilter ? 'No orders match the selected filters.' : 'No orders found.'}
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface transition-all">
                  <td className="px-4 py-3 text-muted">{order.id}</td>
                  <td className="px-4 py-3 text-muted">{order.customer}</td>
                  <td className="px-4 py-3 text-muted max-w-[200px] truncate">{order.items}</td>
                  <td className="px-4 py-3 text-muted">{order.amount}</td>
                  <td className="px-4 py-3 text-muted">{order.date}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    {(order.status === 'New' || order.status === 'pending') && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onAccept(order.id)}
                          className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onReject(order.id)}
                          className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {ACTION_LABEL[order.status] && (
                      <span className={`text-[11px] font-medium ${ACTION_LABEL[order.status].className}`}>
                        {ACTION_LABEL[order.status].text}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="border-t border-border px-4 py-3 bg-white flex items-center justify-between flex-wrap gap-3 text-xs">
          <span className="text-muted">
            Showing <span className="font-semibold text-slate">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate">{endIndex}</span> of{' '}
            <span className="font-semibold text-slate">{totalItems}</span> orders
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 mx-1">
              {pageNumbers.map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-muted text-[11px]">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 border rounded text-[11px] font-medium transition-all cursor-pointer ${
                      activePage === page
                        ? 'bg-[#1A1D23] border-[#1A1D23] text-white font-semibold'
                        : 'border-border text-slate hover:bg-surface'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
