'use client';
import StatusPill from '@/src/components/ui/StatusPill';
import EmptyState from '@/src/components/supplier/EmptyState';

const ACTION_LABEL = {
  Processing: { text: 'In Progress', className: 'text-crewBlue' },
  Delivered: { text: 'Delivered', className: 'text-crewGreen' },
};

export default function OrdersTable({ orders, onAccept, onReject, hasActiveFilter = false }) {
  return (
    <div className="bg-white border border-black/10 overflow-hidden overflow-x-auto shadow-sm rounded-xl">
      <table className="w-full border-collapse text-[0.83rem] text-left">
        <thead>
          <tr className="bg-crewSurface2 border-b border-black/10 text-[0.72rem] font-semibold text-crewMuted uppercase tracking-wider">
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
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-crewSurface/60 transition-colors">
              <td className="p-3 font-semibold">{order.id}</td>
              <td className="p-3">{order.customer}</td>
              <td className="p-3 text-crewSlate-light">{order.items}</td>
              <td className="p-3 font-semibold">{order.amount}</td>
              <td className="p-3 text-crewMuted">{order.date}</td>
              <td className="p-3">
                <StatusPill status={order.status} withDot />
              </td>
              <td className="p-3">
                {order.status === 'New' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(order.id)}
                      className="text-[0.75rem] font-semibold border rounded-[7px] px-[11px] py-[6px] bg-crewGreen-light text-crewGreen border-crewGreen/20 hover:bg-[#d8edd3] transition-all cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onReject(order.id)}
                      className="text-[0.75rem] font-medium border border-black/10 rounded-[7px] px-[11px] py-[6px] text-crewSlate-light hover:bg-[#FDECEA] hover:text-[#C0392B] hover:border-[#C0392B]/30 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {ACTION_LABEL[order.status] && (
                  <span className={`text-[0.75rem] font-medium ${ACTION_LABEL[order.status].className}`}>
                    {ACTION_LABEL[order.status].text}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <EmptyState message={hasActiveFilter ? 'No orders match the selected filters.' : 'No orders yet.'} />
      )}
    </div>
  );
}
