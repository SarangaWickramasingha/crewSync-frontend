'use client';
import { useEffect, useState } from 'react';
import { Star, Flag } from 'lucide-react';

// TODO: replace with real endpoint e.g. GET /api/admin/reviews
async function fetchReviews() {
    // const res = await fetch('/api/admin/reviews');
    // return res.json();
    return [];
}

const STATUS_STYLES = {
    Approved: { pill: 'bg-green-50 text-green-700', card: 'border-border bg-white' },
    Flagged: { pill: 'bg-red-50 text-red-600', card: 'border-red-200 bg-red-50' },
    Pending: { pill: 'bg-amber-50 text-amber-700', card: 'border-border bg-white' },
};

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews().then(data => { setReviews(data); setLoading(false); });
    }, []);

    return (
        <div>
            <div className="mb-5">
                <h2 className="font-syne text-xl font-bold text-slate">Reviews Management</h2>
                <p className="text-xs text-muted mt-0.5">Monitor and moderate platform reviews</p>
            </div>

            {loading ? (
                <p className="text-xs text-muted">Loading reviews…</p>
            ) : reviews.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-8 text-center">
                    <p className="text-xs text-muted">No reviews to moderate.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {reviews.map((r, i) => {
                        const style = STATUS_STYLES[r.status] ?? STATUS_STYLES.Pending;
                        return (
                            <div key={i} className={`border rounded-xl p-4 ${style.card}`}>
                                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                                    <div>
                                        <p className="text-sm font-bold text-slate">
                                            {r.providerName} — by {r.reviewerName}
                                            <span className="ml-2 text-amber-400">
                                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                            </span>
                                        </p>
                                        <p className="text-[11px] text-muted mt-0.5">
                                            Posted {r.postedAt}
                                            {r.status === 'Flagged' && ' · Flagged'}
                                        </p>
                                    </div>
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${style.pill}`}>
                                        {r.status === 'Flagged' && <Flag className="w-3 h-3" />}
                                        {r.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted leading-relaxed mb-3">&ldquo;{r.content}&rdquo;</p>
                                <div className="flex gap-2 flex-wrap">
                                    {/* TODO: wire actions to API */}
                                    <button className="px-3 py-1.5 border border-red-200 rounded-lg text-[11px] text-red-500 hover:bg-red-50 transition-all">
                                        Remove Review
                                    </button>
                                    {r.status === 'Flagged' && (
                                        <>
                                            <button className="px-3 py-1.5 border border-border rounded-lg text-[11px] text-slate hover:bg-surface transition-all">
                                                Investigate
                                            </button>
                                            <button className="px-3 py-1.5 border border-green-200 rounded-lg text-[11px] text-green-600 hover:bg-green-50 transition-all">
                                                Approve
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
