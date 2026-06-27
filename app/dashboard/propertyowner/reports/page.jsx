import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import Card from '@/Components/dashboard/propertyOwner/Card';
import StatusPill from '@/Components/dashboard/propertyOwner/StatusPill';

const REPORTS = [
  { icon: '📄', name: 'Phase 1 – Foundation Report', meta: 'Completed Mar 28, 2026', status: 'ready' },
  { icon: '📄', name: 'Phase 2 – Structural Report', meta: 'Completed Apr 30, 2026', status: 'ready' },
  { icon: '📄', name: 'Phase 3 – Roofing Report', meta: 'In progress…', status: 'pending' },
  { icon: '📊', name: 'Cost Summary Report', meta: 'Auto-generated · May 12, 2026', status: 'ready' },
];

export default function PropertyOwnerReportsPage() {
  return (
    <div>
      <DashHeader title="Reports & Documentation" subtitle="Download project records at any stage" />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Available Reports */}
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Available Reports</h3>
          <div className="flex flex-col gap-2.5">
            {REPORTS.map((r) => (
              <div
                key={r.name}
                className={`flex justify-between items-center px-3.5 py-2.5 rounded-lg ${
                  r.status === 'pending' ? 'bg-[#EEECEA]' : 'bg-[#F7F6F2]'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${r.status === 'pending' ? 'text-[#8A8FA8]' : ''}`}>
                    {r.icon} {r.name}
                  </div>
                  <div className="text-xs text-[#8A8FA8] mt-0.5">{r.meta}</div>
                </div>
                {r.status === 'pending' ? (
                  <StatusPill variant="amber">Pending</StatusPill>
                ) : (
                  <button className="border border-black/10 rounded-md px-2.5 py-1 text-xs hover:bg-[#F7F6F2]">
                    ⬇ Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Generate Custom Report */}
        <Card>
          <h3 className="font-syne text-base font-bold mb-4">Generate Custom Report</h3>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-xs font-semibold text-[#4A5068]">Report Type</label>
            <select className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]">
              <option>Cost Summary</option>
              <option>Task Completion</option>
              <option>Labour Log</option>
              <option>Full Project Report</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mb-3.5">
            <label className="text-xs font-semibold text-[#4A5068]">Date Range</label>
            <input
              type="date"
              defaultValue="2026-03-01"
              className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-[#4A5068]">To</label>
            <input
              type="date"
              defaultValue="2026-05-12"
              className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
            />
          </div>

          <button className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Generate Report
          </button>
        </Card>
      </div>
    </div>
  );
}