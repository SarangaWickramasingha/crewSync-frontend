'use client';

import { useState } from 'react';

export default function ServiceProviderCard({ provider, isGuest, onRequestClick, onSeeReviewsClick }) {
  const [copied, setCopied] = useState(false);

  const handleCopyContact = (e) => {
    e.stopPropagation();
    if (!provider.contactNo) return;
    navigator.clipboard.writeText(provider.contactNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mb-3" style={{ background: provider.avatarBg, color: provider.avatarColor }}>
        {provider.initials}
      </div>
      <div className="text-sm font-bold">{provider.name}</div>
      <div className="text-xs text-[#8A8FA8] mb-2">{provider.role}</div>
      <div className="text-sm mb-1">
        <span className="text-[#8A8FA8] text-xs">Rating: {provider.rating} ({provider.reviewCount} reviews)</span>
      </div>
      <div className="text-xs text-[#8A8FA8]">{provider.location}</div>
      <div className="text-sm font-semibold text-[var(--color-owner-dark)] mt-2">{provider.price}</div>

      {/* Contact No with Copy Button */}
      <div className="mt-2.5 bg-slate-50 border border-slate-200/70 rounded-xl p-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-[var(--color-owner-light)] text-[var(--color-owner)] flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Contact No</div>
            <div className="text-xs font-semibold text-slate-800 tracking-tight truncate">{provider.contactNo}</div>
          </div>
        </div>

        <button
          onClick={handleCopyContact}
          type="button"
          title="Copy Contact Number"
          className={`flex items-center justify-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all duration-200 cursor-pointer flex-shrink-0 ${
            copied
              ? 'bg-[var(--color-owner)] text-white border-[var(--color-owner)] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[var(--color-owner)] hover:text-[var(--color-owner)] active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="grid gap-2 mt-2.5">
        <button
          className="w-full bg-[var(--color-owner)] hover:bg-[var(--color-owner-dark)] text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
          onClick={() => onRequestClick(provider, isGuest)}
        >
          Request
        </button>
        <button
          className="w-full bg-white border border-black/10 text-[#1A1D23] text-xs font-semibold py-2 rounded-md transition-colors hover:bg-[#F7F5F1] cursor-pointer"
          onClick={() => onSeeReviewsClick(provider)}
        >
          See reviews
        </button>
      </div>
    </div>
  );
}
