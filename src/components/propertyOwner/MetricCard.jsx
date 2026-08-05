export default function MetricCard({ value, label, change, changeType }) {
  const changeColor =
    changeType === "up" ? "text-[#1B6E3A]" :
    changeType === "down" ? "text-[#C0392B]" :
    "text-[#8A8FA8]";

  return (
    <div className="bg-white border border-black/10 rounded-lg p-4">
      <div className="font-syne text-2xl font-bold text-[#1A1D23]">{value}</div>
      <div className="text-xs text-[#8A8FA8] mt-0.5">{label}</div>
      {change && <div className={`text-xs mt-1 ${changeColor}`}>{change}</div>}
    </div>
  );
}