'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminFeedback, useUpdateAdminFeedback } from '@/src/hooks/admin/useAdmin';

/** MySQL tinyint(1) arrives as 0/1 or "0"/"1". */
const bool = v => v === true || v === 1 || v === '1';

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value.replace(' ', 'T'));
    return Number.isNaN(d.getTime())
        ? value
        : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminFeedbackPage() {
    const { data, isPending: loading, error } = useAdminFeedback();
    const updateFeedback = useUpdateAdminFeedback();
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('subject');

    const feedback = data?.feedback ?? [];

    const filtered = feedback.filter(item => {
        const q = search.trim().toLowerCase();
        return !q || item[searchBy]?.toLowerCase().includes(q);
    });

    const toggleHandled = async (id, current) => {
        const next = !bool(current);
        try {
            await updateFeedback.mutateAsync({ id, payload: { is_handled: next } });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Platform Feedback</h2>
                    <p className="text-xs text-muted mt-0.5">User-submitted suggestions and complaints</p>
                </div>
            </div>

            {error && (
                <div className="px-3 py-2 mb-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error.message}
                </div>
            )}

            {/* Search + Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder={`Search by ${searchBy}…`}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={searchBy}
                    onChange={e => setSearchBy(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="subject">Search By: Subject</option>
                    <option value="message">Search By: Message</option>
                    <option value="name">Search By: Name</option>
                    <option value="email">Search By: Email</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Name', 'Email', 'Subject', 'Message', 'Submitted', 'Handled'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-5 text-muted">Loading feedback…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-5 text-muted">No feedback found.</td></tr>
                        ) : filtered.map(item => (
                            <tr key={item.feedback_id} className={`hover:bg-surface transition-all ${bool(item.is_handled) ? 'opacity-50' : ''}`}>
                                <td className="px-4 py-3 font-medium text-slate">{item.name}</td>
                                <td className="px-4 py-3 text-muted">{item.email}</td>
                                <td className="px-4 py-3 text-slate max-w-[200px] truncate">{item.subject}</td>
                                <td className="px-4 py-3 text-muted max-w-[260px] truncate">{item.message}</td>
                                <td className="px-4 py-3 text-muted">{formatDate(item.created_at)}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={bool(item.is_handled)}
                                        onChange={() => toggleHandled(item.feedback_id, item.is_handled)}
                                        className="w-4 h-4 cursor-pointer accent-amber"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
