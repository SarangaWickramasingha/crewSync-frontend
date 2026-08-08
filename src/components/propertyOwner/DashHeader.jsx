export default function DashHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
      <div>
        <h2 className="font-syne text-xl font-bold text-[#1A1D23]">{title}</h2>
        {subtitle && <p className="text-sm text-[#8A8FA8] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}