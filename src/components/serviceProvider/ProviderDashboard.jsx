'use client';
import Link from 'next/link';
import {
  useAvailability,
  useToggleAvailability,
  useDashboardStats,
  useCurrentWork,
  useRecentReviews,
} from '@/src/hooks/provider/useProvider';

export default function ProviderDashboard() {
  const availability = useAvailability();
  const stats = useDashboardStats();
  const currentWork = useCurrentWork();
  const recentReviews = useRecentReviews();
  const toggleAvailability = useToggleAvailability();

  const available = availability.data?.is_available ?? true;
  const loadingAvailability = availability.isPending;

  const statsData = stats.data ?? {};
  const statsLoading = stats.isPending;
  const workLoading = currentWork.isPending;
  const currentWorkList = currentWork.data?.current_work ?? [];
  const reviewsLoading = recentReviews.isPending;
  const recentReviewsList = recentReviews.data?.reviews ?? [];

  const pendingCount = statsData.pending_requests ?? 0;
  const metrics = [
    { val: statsLoading ? '…' : `${statsData.total_reviews ?? 0}`, label: 'Total Reviews', change: statsLoading ? null : `★ ${statsData.avg_rating ?? 0} avg`, up: true },
    { val: statsLoading ? '…' : `${statsData.active_projects ?? 0}`, label: 'Active Projects', change: null },
    { val: statsLoading ? '…' : `${statsData.jobs_completed ?? 0}`, label: 'Jobs Completed', change: null },
  ];

  async function handleToggleAvailability() {
    try {
      await toggleAvailability.mutateAsync();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const toggling = toggleAvailability.isPending;

  return (
    <div className="font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h2 className="font-syne text-[1.3rem] font-bold text-crewSlate">
            Welcome, Sunil 👋
          </h2>
          <p className="text-[0.82rem] text-crewMuted mt-0.5">
            {statsLoading ? 'Loading…' : pendingCount > 0 ? `You have ${pendingCount} new job request${pendingCount !== 1 ? 's' : ''} this week` : 'No new job requests this week'}
          </p>
        </div>
        <button
          onClick={handleToggleAvailability}
          disabled={toggling || loadingAvailability}
          title="Click to toggle your availability"
          className="text-[0.8rem] font-semibold px-3 py-1.5 rounded-xl border-none cursor-pointer font-sans disabled:opacity-60 disabled:cursor-wait"
          style={{
            background: available ? '#dbeafe' : '#FDECEC',
            color: available ? '#2563eb' : '#B3261E',
          }}
        >
          ● {loadingAvailability ? 'Loading…' : toggling ? 'Updating…' : available ? 'Available for Work' : 'Not Available'}
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
            <Link href="/dashboard/serviceprovider/timeline" className="text-[0.78rem] text-provider-dark no-underline font-medium">
              View Timeline
            </Link>
          </div>

          {workLoading ? (
            <p className="text-[0.8rem] text-crewMuted">Loading…</p>
          ) : currentWorkList.length === 0 ? (
            <p className="text-[0.8rem] text-crewMuted">No assigned work yet.</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {currentWorkList.map((item, i) => (
                <li
                  key={item.task_id}
                  className={`flex items-start gap-3 py-2.5 ${i < currentWorkList.length - 1 ? 'border-b border-crewSlate/10' : ''
                    }`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[0.7rem] font-bold mt-0.5 ${item.status === 'Active' ? 'bg-provider-light text-provider-dark' : 'bg-crewSurface2 text-crewMuted'
                    }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[0.88rem] font-semibold">{item.task_name}</div>
                    <div className="text-[0.72rem] text-crewMuted">{item.project_name}</div>
                    <div className="text-[0.74rem] text-crewMuted mt-0.5">
                      {item.status === 'Upcoming' ? `Starts ${item.start_date}` : `${item.start_date} – ${item.end_date ?? 'ongoing'}`}
                    </div>
                  </div>
                  <span className={`text-[0.72rem] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-1 ${item.status === 'Active' ? 'bg-provider-light text-provider-dark' : 'bg-crewSurface2 text-crewMuted'
                    }`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/dashboard/serviceprovider/job-requests"
            className="block mt-4 text-center bg-provider text-white py-2 rounded-lg text-[0.82rem] font-semibold no-underline"
          >
            View Job Requests {pendingCount > 0 ? `(${pendingCount})` : ''}
          </Link>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-crewSlate/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne text-base font-bold">Recent Reviews</h3>
            <Link href="/dashboard/serviceprovider/reviews" className="text-[0.78rem] text-provider-dark no-underline font-medium">
              All Reviews
            </Link>
          </div>

          {reviewsLoading ? (
            <p className="text-[0.8rem] text-crewMuted">Loading…</p>
          ) : recentReviewsList.length === 0 ? (
            <p className="text-[0.8rem] text-crewMuted">No reviews yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentReviewsList.map((r, i) => {
                const name = r.name || r.reviewer_name || r.author || 'Property Owner';
                const stars = Math.max(1, Math.min(5, Number(r.rating || r.stars || 5)));
                const comment = r.comment || r.text || r.content || '';
                return (
                  <div key={r.id || i} className="border-b border-crewSlate/5 pb-2.5 last:border-none last:pb-0">
                    <div className="text-[0.83rem] font-semibold flex items-center justify-between">
                      <span>{name}</span>
                       <span className="text-provider text-[0.85rem]">{'★'.repeat(stars)}</span>
                    </div>
                    {comment && (
                      <div className="text-[0.78rem] text-crewMuted mt-0.5 leading-relaxed">&ldquo;{comment}&rdquo;</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 p-3 bg-provider-light rounded-lg border border-provider/20">
            <div className="text-[0.8rem] text-provider font-semibold">
              ★ {statsLoading ? '…' : statsData.avg_rating ?? 0} Average Rating
            </div>
            <div className="text-[0.73rem] text-provider mt-0.5">
              Based on {statsLoading ? '…' : statsData.total_reviews ?? 0} verified reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}