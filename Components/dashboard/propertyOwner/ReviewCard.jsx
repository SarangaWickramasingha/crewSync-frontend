import StatusPill from './StatusPill';

function Stars({ rating }) {
  return (
    <span className="text-[#E8820C] text-sm">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function ReviewCard({
  avatarInitials,
  avatarBg,
  avatarColor,
  name,
  rating,
  badge,   // optional: { label, variant }
  date,
  text,
  footer,  // optional: role-specific actions (buttons, reply box, etc.)
}) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 mb-3">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ background: avatarBg, color: avatarColor }}
        >
          {avatarInitials}
        </div>
        <div>
          <div className="text-sm font-bold">{name}</div>
          <Stars rating={rating} />
        </div>
        {badge && (
          <span className="ml-auto">
            <StatusPill variant={badge.variant}>{badge.label}</StatusPill>
          </span>
        )}
      </div>

      <div className="text-sm text-[#4A5068] leading-relaxed">{text}</div>

      {date && <div className="text-xs text-[#8A8FA8] mt-1.5">{date}</div>}

      {footer && <div className="mt-2.5">{footer}</div>}
    </div>
  );
}