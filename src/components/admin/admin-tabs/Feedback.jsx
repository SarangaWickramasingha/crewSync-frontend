'use client';
import { useEffect, useState } from 'react';
import { Lightbulb, Bug, MessageSquare } from 'lucide-react';

// TODO: replace with real endpoint e.g. GET /api/admin/feedback
async function fetchFeedback() {
    // const res = await fetch('/api/admin/feedback');
    // return res.json();
    return [];
}

const TYPE_STYLES = {
    Suggestion: { pill: 'bg-blue-50 text-blue-700', icon: <Lightbulb className="w-3 h-3" /> },
    'Bug Report': { pill: 'bg-red-50 text-red-600', icon: <Bug className="w-3 h-3" /> },
    Complaint: { pill: 'bg-amber-50 text-amber-700', icon: <MessageSquare className="w-3 h-3" /> },
};

export default function Feedback() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback().then(data => { setItems(data); setLoading(false); });
    }, []);

    return (
        <div>
            <div className="mb-5">
                <h2 className="font-syne text-xl font-bold text-slate">Platform Feedback</h2>
                <p className="text-xs text-muted mt-0.5">User-submitted suggestions and complaints</p>
            </div>

            {loading ? (
                <p className="text-xs text-muted">Loading feedback…</p>
            ) : items.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-8 text-center">
                    <p className="text-xs text-muted">No feedback submitted yet.</p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-3">
                    {items.map((item, i) => {
                        const typeStyle = TYPE_STYLES[item.type] ?? TYPE_STYLES.Complaint;
                        return (
                            <div key={i} className="bg-surface rounded-lg p-3">
                                <div className="flex justify-between flex-wrap gap-2 mb-1">
                                    <p className="text-sm font-semibold text-slate">{item.title}</p>
                                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${typeStyle.pill}`}>
                                        {typeStyle.icon}
                                        {item.type}
                                    </span>
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}
