export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
      <div>
        <h2 className="font-syne text-xl font-bold text-crewSlate [letter-spacing:-0.5px]">{title}</h2>
        {subtitle && <p className="text-xs text-crewMuted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
