'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PAGE_SIZE = 10;

/**
 * Reusable pagination footer for admin tables.
 * Purely presentational — the parent page owns `currentPage` state and
 * slices its own filtered array; this component just renders the
 * "Showing X–Y of Z" label and Prev/Next controls.
 */
export default function Pagination({ currentPage, totalItems, pageSize = PAGE_SIZE, onPageChange }) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    if (totalPages <= 1) return null;

    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-[11px] text-muted">
                Showing <span className="font-medium text-slate">{start}–{end}</span> of{' '}
                <span className="font-medium text-slate">{totalItems}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-border text-slate hover:bg-surface transition-all disabled:opacity-40 disabled:hover:bg-white"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate px-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded border border-border text-slate hover:bg-surface transition-all disabled:opacity-40 disabled:hover:bg-white"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
