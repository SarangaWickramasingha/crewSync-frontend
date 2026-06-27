'use client';
import { Lightbulb, Bug, MessageSquare } from 'lucide-react';
import StatusPill from '@/Components/ui/StatusPill';

// ── Sample data (replace with API calls when backend is ready) ──
// TODO: fetch from GET /api/admin/feedback
const SAMPLE_FEEDBACK = [
    {
        title: 'Suggestion: Add multi-language (Sinhala) support',
        type: 'Suggestion',
        submittedBy: 'Property Owner',
        submittedAt: 'May 8, 2026',
    },
    {
        title: 'Issue: Payment release button not working on mobile',
        type: 'Bug Report',
        submittedBy: 'Supplier',
        submittedAt: 'May 10, 2026',
    },
];

const TYPE_ICON = {
    Suggestion: <Lightbulb className="w-3 h-3" />,
    'Bug Report': <Bug className="w-3 h-3" />,
    Complaint: <MessageSquare className="w-3 h-3" />,
};

export default function AdminFeedbackPage() {
    return (
        <div>
            <div className="mb-5">
                <h2 className="font-syne text-xl font-bold text-slate">Platform Feedback</h2>
                <p className="text-xs text-muted mt-0.5">User-submitted suggestions and complaints</p>
            </div>

            <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3">
                {SAMPLE_FEEDBACK.map((item, i) => (
                    <div key={i} className="bg-surface rounded-lg p-3">
                        <div className="flex justify-between flex-wrap gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate">{item.title}</p>
                            <StatusPill status={item.type} />
                        </div>
                        <p className="text-[11px] text-muted mb-2">
                            Submitted by {item.submittedBy} · {item.submittedAt}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {/* TODO: wire to API */}
                            {item.type === 'Bug Report' ? (
                                <button className="px-3 py-1.5 border border-green-200 rounded-lg text-[11px] text-green-600 hover:bg-green-50 transition-all">
                                    Assign to Dev
                                </button>
                            ) : (
                                <button className="px-3 py-1.5 border border-border rounded-lg text-[11px] text-slate hover:bg-white transition-all">
                                    Mark Reviewed
                                </button>
                            )}
                            <button className="px-3 py-1.5 border border-red-200 rounded-lg text-[11px] text-red-500 hover:bg-red-50 transition-all">
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
