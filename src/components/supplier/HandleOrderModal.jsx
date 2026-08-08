'use client';
import StatusPill from '@/src/components/ui/StatusPill';

export default function HandleOrderModal({ order, onAccept, onReject, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-56 pointer-events-none">
      <div
        className="pointer-events-auto flex w-[340px] flex-col gap-3 rounded-[14px] border border-[rgba(26,29,35,0.1)] bg-white p-[22px] shadow-[0_8px_32px_rgba(26,29,35,0.15)] font-sans"
      >

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="m-0 font-syne text-sm font-bold text-[#1A1D23]">
            Handle Order Details
          </h3>
          <button
            onClick={onClose}
            className="text-[#8A8FA8] hover:text-[#1A1D23] text-sm font-bold border-none bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Order Details */}
        <div className="flex flex-col gap-2 rounded-md bg-[#F7F6F2] p-3 text-[12px]">
          <div className="flex justify-between items-center">
            <span className="text-[#8A8FA8]">Order ID:</span>
            <span className="font-semibold text-[#1A1D23]">{order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8A8FA8]">Customer:</span>
            <span className="font-medium text-[#1A1D23]">{order.customer}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8A8FA8]">Items Requested:</span>
            <span className="font-medium text-[#4A5068]">{order.items}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8A8FA8]">Total Amount:</span>
            <span className="font-bold text-[#1A1D23]">{order.amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8A8FA8]">Order Date:</span>
            <span className="text-[#8A8FA8]">{order.date}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-[rgba(26,29,35,0.06)]">
            <span className="text-[#8A8FA8]">Status:</span>
            <StatusPill status={order.status} withDot />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-1 flex justify-end gap-2">
          <button
            className="rounded-md border border-[rgba(26,29,35,0.1)] bg-transparent px-3 py-[6px] font-sans text-xs font-medium text-[#C0392B] hover:bg-[#FDECEA] transition-colors cursor-pointer"
            onClick={() => onReject(order.order_id ?? order.id)}
          >
            Reject
          </button>
          <button
            className="rounded-md border-none bg-[#1B6E3A] px-3.5 py-[6px] font-sans text-xs font-semibold text-white hover:bg-[#14532d] transition-colors cursor-pointer"
            onClick={() => onAccept(order.order_id ?? order.id)}
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}
