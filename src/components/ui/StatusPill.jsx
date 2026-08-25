const VARIANTS = {
  green: 'bg-[#E6F4EC] text-[#1B6E3A]',
  amber: 'bg-[#FFF3E0] text-[#B85A00]',
  red: 'bg-[#FDECEA] text-[#C0392B]',
  blue: 'bg-[#E8F0FB] text-[#1A56A0]',
  gray: 'bg-[#EEECEA] text-[#8A8FA8]',
};

const DOTS = {
  green: 'bg-[#1B6E3A]',
  amber: 'bg-[#B85A00]',
  red: 'bg-[#C0392B]',
  blue: 'bg-[#1A56A0]',
  gray: 'bg-[#8A8FA8]',
};

const STATUS_META = {
  Active: { variant: 'green' },
  Verified: { variant: 'green' },
  Approved: { variant: 'green' },
  Pending: { variant: 'amber' },
  'Under Review': { variant: 'amber' },
  Complaint: { variant: 'amber' },
  Suspended: { variant: 'red' },
  Flagged: { variant: 'red' },
  'Bug Report': { variant: 'red' },
  Suggestion: { variant: 'blue' },
  in: { label: 'In Stock', variant: 'green' },
  low: { label: 'Low Stock', variant: 'amber' },
  out: { label: 'Out of Stock', variant: 'red' },
  New: { label: 'New', variant: 'amber' },
  Processing: { label: 'Processing', variant: 'blue' },
  Delivered: { label: 'Delivered', variant: 'green' },
  Rejected: { label: 'Rejected', variant: 'red' },
  pending: { label: 'New', variant: 'amber' },
  accepted: { label: 'Processing', variant: 'blue' },
  delivered: { label: 'Delivered', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
};

export default function StatusPill({ status, variant, note, withDot = false, children, className = '' }) {
  const meta = status ? STATUS_META[status] : null;
  const resolvedVariant = variant ?? meta?.variant ?? 'gray';
  const resolvedLabel = children ?? meta?.label ?? status ?? '';
  const label = note ? `${resolvedLabel} (${note})` : resolvedLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${VARIANTS[resolvedVariant]} ${className}`}
    >
      {withDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOTS[resolvedVariant]}`} />}
      {label}
    </span>
  );
}
