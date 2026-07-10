'use client';
import { useState } from 'react';
import Link from 'next/link';

const metrics = [
  { val: '47', label: 'Total Reviews', change: '★ 4.9 avg', up: true },
  { val: '4', label: 'Active Projects', change: null },
  { val: '156', label: 'Jobs Completed', change: null },
];

const currentWork = [
  {
    num: 1, name: 'Roofing – Nimal\'s House, Kandy',
    dates: 'May 5 – May 25, 2026', progress: 55, status: 'Active',
    dotClass: 'active',
  },
  {
    num: 2, name: 'Foundation Work – Gampola Site',
    dates: 'Starts Jun 1, 2026', progress: null, status: 'Upcoming',
    dotClass: 'pending',
  },
];

const recentReviews = [
  { name: 'Nimal K.', stars: 5, text: '"Excellent work on the foundation. Very professional."' },
  { name: 'Priya S.', stars: 5, text: '"On time and great quality. Will hire again."' },
];

export default function ProviderDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h2 className="font-syne text-[1.3rem] font-bold text-crewSlate">
            Welcome, Sunil 👋
          </h2>
          <p className="text-[0.82rem] text-crewMuted mt-0.5">You have 4 new job requests this week</p>
        </div>
        <button
          onClick={() => setAvailable(a => !a)}
          title="Click to toggle your availability"
          className="text-[0.8rem] font-semibold px-3 py-1.5 rounded-xl border-none cursor-pointer font-sans"
          style={{
            background: available ? '#E6F4EC' : '#FDECEC',
            color: available ? '#1B6E3A' : '#B3261E',
          }}
        >
          ● {available ? 'Available for Work' : 'Not Available'}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white border border-crewSlate/10 rounded-lg px-[1.1rem] py-4">
            <div className="font-syne text-[1.6rem] font-bold text-crewSlate">{m.val}</div>
            <div className="text-[0.73rem] text-crewMuted mt-0.5">{m.label}</div>
            {m.change && (
              <div className={`text-[0.72rem] mt-1 ${m.up ? 'text-crewGreen' : 'text-[#C0392B]'}`}>{m.change}</div>
            )}
          </div>
        ))}
      </div>

      {/* Two-column: Current Work + Recent Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Current Work */}
        <div className="bg-white border border-crewSlate/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne text-base font-bold">Current Work</h3>
            <Link href="/dashboard/serviceprovider/timeline" className="text-[0.78rem] text-crewAmber-dark no-underline font-medium">
              View Timeline →
            </Link>
          </div>
          <ul className="list-none p-0 m-0">
            {currentWork.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 py-2.5 ${
                  i < currentWork.length - 1 ? 'border-b border-crewSlate/10' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[0.7rem] font-bold mt-0.5 ${
                  item.dotClass === 'active' ? 'bg-crewAmber-light text-crewAmber-dark' : 'bg-crewSurface2 text-crewMuted'
                }`}>
                  {item.num}
                </div>
                <div className="flex-1">
                  <div className="text-[0.88rem] font-semibold">{item.name}</div>
                  <div className="text-[0.74rem] text-crewMuted mt-0.5">{item.dates}</div>
                  {item.progress !== null && (
                    <div className="h-[5px] bg-crewSurface2 rounded-full mt-1.5">
                      <div
                        className="h-full bg-crewAmber rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className={`text-[0.72rem] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-1 ${
                  item.dotClass === 'active' ? 'bg-crewAmber-light text-crewAmber-dark' : 'bg-crewSurface2 text-crewMuted'
                }`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/serviceprovider/job-requests"
            className="block mt-4 text-center bg-crewAmber text-white py-2 rounded-lg text-[0.82rem] font-semibold no-underline"
          >
            View Job Requests (4)
          </Link>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-crewSlate/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne text-base font-bold">Recent Reviews</h3>
            <Link href="/dashboard/serviceprovider/reviews" className="text-[0.78rem] text-crewAmber-dark no-underline font-medium">
              All Reviews →
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentReviews.map((r, i) => (
              <div key={i}>
                <div className="text-[0.83rem] font-semibold">
                  {r.name} <span className="text-crewAmber">{'★'.repeat(r.stars)}</span>
                </div>
                <div className="text-[0.78rem] text-crewMuted mt-0.5 leading-relaxed">{r.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 bg-crewGreen-light rounded-lg border border-crewGreen/20">
            <div className="text-[0.8rem] text-crewGreen font-semibold">★ 4.9 Average Rating</div>
            <div className="text-[0.73rem] text-crewGreen mt-0.5">Based on 47 verified reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
