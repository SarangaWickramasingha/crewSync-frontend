'use client';

import { useState } from 'react';
import { useTasks } from './TasksContext';

export default function RequestMaterialModal({ product, onClose }) {
  const { addNotification } = useTasks();
  const [quantity, setQuantity] = useState(1);
  const [sent, setSent] = useState(false);

  const priceNum = Number(product.price.replace(/[^0-9]/g, '')) || 0;
  const totalPrice = priceNum * quantity;

  function handleSend() {
    addNotification(
      `Material request sent: <strong>${quantity}x ${product.name}</strong> from <strong>${product.supplier}</strong> (Total: LKR ${totalPrice.toLocaleString()})`
    );
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)] p-4">
      <div className="w-[360px] max-w-full rounded-[14px] bg-white p-6 text-center font-sans shadow-[0_8px_32px_rgba(26,29,35,0.15)]">
        {sent ? (
          <>
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EC]">
                <svg className="w-7 h-7 text-[#1B6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Request Sent</h3>
            <p className="text-sm text-[#4A5068] mb-4">
              Your request for {quantity}x {product.name} has been sent to {product.supplier}.
            </p>
            <button
              className="mt-2 rounded-lg border-none bg-[#E8820C] px-[18px] py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Request Materials</h3>
            <p className="mb-4 text-left text-[13px] text-[#8A8FA8]">
              Send a materials request to <strong>{product.supplier}</strong>.
            </p>

            <div className="bg-[#F7F6F2] rounded-lg p-3.5 mb-4 text-left border border-black/5">
              <div className="text-xs font-bold text-[#1A1D23]">{product.name}</div>
              <div className="text-[11px] text-[#8A8FA8] mt-0.5">{product.supplier}</div>
              <div className="text-xs text-[#E8820C] font-semibold mt-1.5">
                Price: {product.price}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-4 text-left">
              <label className="text-xs font-semibold text-[#4A5068]">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
              />
            </div>

            <div className="h-px bg-black/10 my-4" />

            <div className="flex justify-between items-center mb-5 text-sm font-semibold">
              <span className="text-[#4A5068]">Estimated Total</span>
              <span className="text-lg font-bold text-[#B85A00]">
                LKR {totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border border-[rgba(26,29,35,0.1)] bg-transparent px-4 py-2 text-[13px] text-[#4A5068] cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-lg border-none bg-[#E8820C] px-[18px] py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                onClick={handleSend}
              >
                Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
