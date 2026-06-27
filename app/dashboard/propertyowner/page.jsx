import Card from '@/Components/dashboard/propertyOwner/Card';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import MetricCard from '@/Components/dashboard/propertyOwner/MetricCard';
import StatusPill from '@/Components/dashboard/propertyOwner/StatusPill';

export default function PropertyOwnerOverviewPage() {
  return (
    <div>
      <DashHeader
        title="My Project: House Build – Kandy"
        subtitle="Started March 2026 · Estimated Completion August 2026"
        action={
          <button className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
            + New Project
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        <MetricCard value="62%" label="Overall Progress" change="↑ 8% this week" changeType="up" />
        <MetricCard value="LKR 4.2M" label="Budget Spent" change="of LKR 7.5M total" />
        <MetricCard value="14" label="Tasks Completed" change="3 this week" changeType="up" />
        <MetricCard value="6" label="Hired Workers" change="Active now" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Project Progress */}
        <Card>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne text-base font-bold">Project Progress</h3>
            <StatusPill variant="amber">In Progress</StatusPill>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
              <circle cx="45" cy="45" r="36" fill="none" stroke="#EEECEA" strokeWidth="10" />
              <circle
                cx="45" cy="45" r="36" fill="none" stroke="#E8820C" strokeWidth="10"
                strokeDasharray="226" strokeDashoffset="86" strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="50" textAnchor="middle" fontFamily="Syne, sans-serif" fontSize="16" fontWeight="700" fill="#1A1D23">
                62%
              </text>
            </svg>
            <div className="flex-1 min-w-[160px]">
              {[
                ['Foundation', '✓ Done', '#1B6E3A'],
                ['Structure', '✓ Done', '#1B6E3A'],
                ['Roofing', '⏳ Active', '#B85A00'],
                ['Plumbing', 'Pending', '#8A8FA8'],
                ['Finishing', 'Pending', '#8A8FA8'],
              ].map(([label, status, color]) => (
                <div key={label} className="flex justify-between py-1.5 text-sm border-b border-black/10 last:border-0">
                  <span>{label}</span>
                  <span style={{ color }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Budget Overview */}
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Budget Overview</h3>
          {[
            ['Labour', 'LKR 2.1M', 56, '#E8820C'],
            ['Materials', 'LKR 1.6M', 43, '#1A56A0'],
            ['Equipment', 'LKR 0.5M', 13, '#1B6E3A'],
          ].map(([label, amount, pct, color]) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-semibold">{amount}</span>
              </div>
              <div className="h-2 bg-[#EEECEA] rounded">
                <div className="h-full rounded" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
          <div className="h-px bg-black/10 my-4" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Remaining Budget</span>
            <span className="text-[#1B6E3A]">LKR 3.3M</span>
          </div>
        </Card>
      </div>
    </div>
  );
}