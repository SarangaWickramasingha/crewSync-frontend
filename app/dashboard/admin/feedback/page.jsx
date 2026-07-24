'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

// TODO: fetch from GET /api/admin/feedback
const SAMPLE_FEEDBACK = [
    {
        id: 1,
        name: 'Nimal Kumarasinghe',
        email: 'nimal@example.com',
        subject: 'Suggestion: Add multi-language (Sinhala) support',
        message: 'It would be great if the platform supported Sinhala language for wider reach.',
        type: 'Suggestion',
        submittedAt: 'May 8, 2026',
        is_handled: false,
    },
    {
        id: 2,
        name: 'Supplier User',
        email: 'supplier@example.com',
        subject: 'Issue: Payment release button not working on mobile',
        message: 'The payment release button disappears on mobile screen sizes.',
        type: 'Bug Report',
        submittedAt: 'May 10, 2026',
        is_handled: false,
    },
    {
        id: 3,
        name: 'Chamari Perera',
        email: 'chamari@example.com',
        subject: 'Complaint: Provider did not show up',
        message: 'The service provider accepted my request but never showed up.',
        type: 'Complaint',
        submittedAt: 'May 12, 2026',
        is_handled: true,
    },
];

const TYPE_STYLES = {
    Suggestion: 'bg-blue-50 text-blue-700',
    'Bug Report': 'bg-red-50 text-red-600',
    Complaint: 'bg-amber-50 text-amber-700',
};

export default function AdminFeedbackPage() {
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState('subject');
    const [feedback, setFeedback] = useState(SAMPLE_FEEDBACK);

    const filtered = feedback.filter(item => {
        const q = search.toLowerCase();
        return !q || item[searchBy]?.toLowerCase().includes(q);
    });

    // TODO: call PATCH /api/admin/feedback/:id when backend is ready
    const toggleHandled = (id) => {
        setFeedback(prev =>
            prev.map(item => item.id === id ? { ...item, is_handled: !item.is_handled } : item)
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Platform Feedback</h2>
                    <p className="text-xs text-muted mt-0.5">User-submitted suggestions and complaints</p>
                </div>
            </div>

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
                    <option value="name">Search By: Name</option>
                    <option value="email">Search By: Email</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Name', 'Email', 'Subject', 'Type', 'Submitted', 'Handled'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-5 text-muted">No feedback found.</td></tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} className={`hover:bg-surface transition-all ${item.is_handled ? 'opacity-50' : ''}`}>
                                <td className="px-4 py-3 font-medium text-slate">{item.name}</td>
                                <td className="px-4 py-3 text-muted">{item.email}</td>
                                <td className="px-4 py-3 text-slate max-w-[200px] truncate">{item.subject}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_STYLES[item.type] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted">{item.submittedAt}</td>
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={item.is_handled}
                                        onChange={() => toggleHandled(item.id)}
                                        className="w-4 h-4 cursor-pointer accent-amber"
                                    // TODO: call PATCH /api/admin/feedback/:id { is_handled: true }
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
