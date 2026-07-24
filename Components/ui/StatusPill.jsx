// Reusable status pill badge
// Usage: <StatusPill status="Active" /> or <StatusPill status="Flagged" />

const STYLES = {
    Active: 'bg-green-50 text-green-700',
    Verified: 'bg-green-50 text-green-700',
    Approved: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    'Under Review': 'bg-amber-50 text-amber-700',
    Suspended: 'bg-red-50 text-red-600',
    Flagged: 'bg-red-50 text-red-600',
    Suggestion: 'bg-blue-50 text-blue-700',
    'Bug Report': 'bg-red-50 text-red-600',
    Complaint: 'bg-amber-50 text-amber-700',
};

export default function StatusPill({ status }) {
    const style = STYLES[status] ?? 'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style}`}>
            {status}
        </span>
    );
}
