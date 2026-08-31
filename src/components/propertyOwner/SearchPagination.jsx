'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPagination({ currentPage, totalPages, total, onPageChange }) {
  if (!total || totalPages <= 1) return null;

  const perPage = Math.ceil(total / totalPages);
  const startItem = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border border-black/10 rounded-xl">
      <p className="text-[11px] text-[#8A8FA8]">
        Showing <span className="font-medium text-[#1A1D23]">{startItem}–{endItem}</span> of{' '}
        <span className="font-medium text-[#1A1D23]">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded border border-black/10 text-[#1A1D23] hover:bg-[#F7F6F2] transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] text-[#1A1D23] px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded border border-black/10 text-[#1A1D23] hover:bg-[#F7F6F2] transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
