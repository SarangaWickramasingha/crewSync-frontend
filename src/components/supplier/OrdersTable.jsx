'use client';
import StatusPill from '@/src/components/ui/StatusPill';

const TABLE_HEADERS = ['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Actions'];

const ACTION_LABEL = {
  Processing: { text: 'In Progress', className: 'text-blue-600' },
  Delivered: { text: 'Delivered', className: 'text-green-600' },
  Rejected: { text: 'Rejected', className: 'text-red-500' },
  processing: { text: 'In Progress', className: 'text-blue-600' },
  delivered: { text: 'Delivered', className: 'text-green-600' },
  rejected: { text: 'Rejected', className: 'text-red-500' },
  accepted: { text: 'In Progress', className: 'text-blue-600' },
};

export default function OrdersTable({ orders = [], onAccept, onReject, hasActiveFilter = false, loading = false }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-x-auto">
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
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-5 text-muted">
                {hasActiveFilter ? 'No orders match the selected filters.' : 'No orders found.'}
              </td>
            </tr>
          ) : (
            orders.map((order) => (
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
  );
}
