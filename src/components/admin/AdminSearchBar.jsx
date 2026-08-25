'use client';
import { Search } from 'lucide-react';

/**
 * Shared search bar for admin list pages.
 *
 * - `search` / `onSearchChange`: the free-text query
 * - `searchCategory` / `onCategoryChange`: which field the query matches against
 * - `categories`: [{ value, label }] — options for the "Search By" select
 * - `secondaryFilter` (optional): { value, onChange, options, allLabel }
 *    e.g. the "All Districts" dropdown some pages also have
 */
export default function AdminSearchBar({
    search,
    onSearchChange,
    searchCategory,
    onCategoryChange,
    categories,
    placeholder = 'Search…',
    secondaryFilter,
}) {
    const selectedCategoryLabel = categories.find(c => c.value === searchCategory)?.label;

    return (
        <div className="flex gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input
                    type="text"
                    placeholder={selectedCategoryLabel ? `Search by ${selectedCategoryLabel}…` : placeholder}
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                        bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                />
            </div>

            <select
                value={searchCategory}
                onChange={e => onCategoryChange(e.target.value)}
                className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
            >
                <option value="">Search By</option>
                {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </select>

            {secondaryFilter && (
                <select
                    value={secondaryFilter.value}
                    onChange={e => secondaryFilter.onChange(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">{secondaryFilter.allLabel ?? 'All'}</option>
                    {secondaryFilter.options.map(o => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
            )}
        </div>
    );
}