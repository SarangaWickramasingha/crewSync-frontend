'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost/CrewSync-backend/backend/index.php';

/** Clamp to 0–5 so a bad value can't throw on String.repeat. */
function stars(value) {
    const n = Math.round(Number(value));
    const filled = Number.isFinite(n) ? Math.min(Math.max(n, 0), 5) : 0;
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value.replace(' ', 'T'));
    return Number.isNaN(d.getTime())
        ? value
        : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        fetch(`${API_BASE}/api/admin/reviews`, {
            credentials: 'include',
            signal: controller.signal,
        })
            .then(res => {
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                return res.json();
            })
            .then(data => {
                if (!active) return;
                if (!data.success) throw new Error(data.message || 'Could not load reviews.');
                setReviews(data.reviews ?? []);
            })
            .catch(err => {
                if (active && err.name !== 'AbortError') setError(err.message);
            })
            .finally(() => { if (active) setLoading(false); });

        return () => { active = false; controller.abort(); };
    }, []);

    const filtered = reviews.filter(r => {
        const q = search.trim().toLowerCase();
        return (
            !q ||
            r.provider_name?.toLowerCase().includes(q) ||
            r.reviewer_name?.toLowerCase().includes(q) ||
            r.comment?.toLowerCase().includes(q)
        );
    });

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Remove this review? This cannot be undone.')) return;

        setDeletingId(reviewId);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Could not delete this review.');

            setReviews(prev => prev.filter(r => r.review_id !== reviewId));
        } catch (e) {
            setError(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="mb-5">
                <h2 className="font-syne text-xl font-bold text-slate">Reviews Management</h2>
                <p className="text-xs text-muted mt-0.5">Monitor and moderate platform reviews</p>
            </div>

            {error && (
                <div className="px-3 py-2 mb-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            {/* Search */}
            <div className="relative mb-4 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input
                    type="text"
                    placeholder="Search by provider, reviewer, or comment…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                        bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                />
            </div>

            {loading ? (
                <p className="text-xs text-muted">Loading reviews…</p>
            ) : filtered.length === 0 ? (
                <p className="text-xs text-muted">No reviews found.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(r => (
                        <div key={r.review_id} className="border border-border bg-white rounded-xl p-4">
                            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                                <div>
                                    <p className="text-sm font-bold text-slate">
                                        {r.provider_name} — by {r.reviewer_name}
                                        <span className="ml-2 text-amber-400">{stars(r.rating)}</span>
                                    </p>
                                    <p className="text-[11px] text-muted mt-0.5">
                                        Posted {formatDate(r.review_date)}
                                    </p>
                                </div>
                            </div>

                            {r.comment && (
                                <p className="text-xs text-muted leading-relaxed mb-3">&ldquo;{r.comment}&rdquo;</p>
                            )}

                            <button
                                onClick={() => handleDelete(r.review_id)}
                                disabled={deletingId === r.review_id}
                                className="px-3 py-1.5 border border-red-200 rounded-lg text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                {deletingId === r.review_id ? 'Removing…' : 'Remove Review'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}