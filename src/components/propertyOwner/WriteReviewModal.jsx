'use client';

import { useState } from 'react';

const PROVIDERS = [
  'Sunil Karunaratne – Mason',
  'Ruwan Perera – Electrician',
  'Dinesh Wickrama – Carpenter',
  'Nishantha Jayalath – Plumber',
];

export default function WriteReviewModal({ onClose, onSubmit }) {
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateStr = `Posted ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    onSubmit({
      name: provider,
      rating,
      text: text.trim(),
      date: dateStr,
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] max-w-full rounded-[14px] bg-white p-6 text-left font-sans shadow-[0_8px_32px_rgba(26,29,35,0.15)] flex flex-col gap-4"
      >
        <h3 className="font-syne text-base font-bold text-[#1A1D23] m-0">Write a Review</h3>
        <p className="text-xs text-[#8A8FA8] m-0">
          Share your experience with service providers in the Kandy district.
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4A5068]">Service Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4A5068]">Rating</label>
          <div className="flex gap-1.5 text-2xl text-[#E8820C]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#4A5068]">Review Message</label>
          <textarea
            required
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the quality of work, punctuality, and professionalism..."
            className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C] resize-none"
          />
        </div>

        <div className="h-px bg-black/10 my-1" />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-[rgba(26,29,35,0.1)] bg-transparent px-4 py-2 text-[13px] text-[#4A5068] cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg border-none bg-[#E8820C] px-[18px] py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
