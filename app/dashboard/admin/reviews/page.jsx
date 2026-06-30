'use client';
import { Flag } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// ── Sample data (replace with API calls when backend is ready) ──
// TODO: fetch from GET /api/admin/reviews
const SAMPLE_REVIEWS = [
    {
        providerName: 'Sunil K.',
        reviewerName: 'Nimal K.',
        rating: 5,
        postedAt: 'April 5, 2026',
        content: 'Excellent work on the foundation. Very professional and completed everything on time.',
        status: 'Approved',
    },
    {
        providerName: 'Janaka S.',
        reviewerName: 'Unknown User',
        rating: 2,
        postedAt: 'May 10, 2026',
        content: 'Suspicious review content — reported by another user for potential fake review.',
        status: 'Flagged',
    },
];

const CARD_STYLE = {
    Approved: 'border-border bg-white',
    Flagged: 'border-red-200 bg-red-50',
    Pending: 'border-border bg-white',
};

export default function AdminReviewsPage() {
    return (
        <div>
            <div className="mb-5">
                <h2 className="font-syne text-xl font-bold text-slate">Reviews Management</h2>
                <p className="text-xs text-muted mt-0.5">Monitor and moderate platform reviews</p>
            </div>

            <div className="flex flex-col gap-3">
                {SAMPLE_REVIEWS.map((r, i) => (
                    <div key={i} className={`border rounded-xl p-4 ${CARD_STYLE[r.status] ?? 'border-border bg-white'}`}>
                        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                            <div>
                                <p className="text-sm font-bold text-slate">
                                    {r.providerName} — by {r.reviewerName}
                                    <span className="ml-2 text-amber-400">
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </span>
                                </p>
                                <p className="text-[11px] text-muted mt-0.5">
                                    Posted {r.postedAt}{r.status === 'Flagged' && ' · Flagged'}
                                </p>
                            </div>
                            <StatusPill status={r.status} />
                        </div>
                        <p className="text-xs text-muted leading-relaxed mb-3">"{r.content}"</p>
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
                ))}
            </div>
        </div>
    );
}
