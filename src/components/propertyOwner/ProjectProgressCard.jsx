import Card from '@/src/components/propertyOwner/Card';
import StatusPill from '@/src/components/ui/StatusPill';

export default function ProjectProgressCard({
  progressPercent,
  circumference,
  dashOffset,
  projectCompleted,
  tasks,
}) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-syne text-base font-bold">Project Progress</h3>
        <StatusPill variant={projectCompleted ? 'blue' : 'green'}>
          {projectCompleted ? 'Completed' : 'In Progress'}
        </StatusPill>
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        <svg width="90" height="90" viewBox="0 0 90 90" className="flex-shrink-0">
          <circle cx="45" cy="45" r="36" fill="none" stroke="#EEECEA" strokeWidth="10" />
          <circle
            cx="45"
            cy="45"
            r="36"
            fill="none"
            stroke="var(--color-owner, #16a34a)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
          <text
            x="45"
            y="50"
            textAnchor="middle"
            fontFamily="Syne, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill="#1A1D23"
          >
            {progressPercent}%
          </text>
        </svg>
        <div className="flex-1 min-w-40">
          {tasks.length === 0 ? (
            <p className="text-sm text-[#8A8FA8]">No tasks yet — add some in the Timeline tab.</p>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="flex justify-between py-1.5 text-sm border-b border-black/10 last:border-0"
              >
                <span className="truncate max-w-[200px]">{t.name}</span>
                <span className={t.completed ? 'text-owner font-medium' : 'text-[#8A8FA8]'}>
                  {t.completed ? '✓ Done' : 'Pending'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}