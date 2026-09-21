import Card from '@/src/components/propertyOwner/Card';
import { fmtCompact } from '@/src/components/propertyOwner/utils';

export default function BudgetOverviewCard({
  tasks,
  maxCost,
  remainingBudget,
  isLoading = false,
}) {
  return (
    <Card>
      <h3 className="font-syne text-base font-bold mb-4">Budget Overview</h3>
      {isLoading ? (
        <div className="py-2 space-y-4 animate-pulse">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 bg-black/5 rounded w-1/3" />
              <div className="h-4 bg-black/5 rounded w-1/4" />
            </div>
            <div className="h-2 bg-black/5 rounded w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 bg-black/5 rounded w-1/4" />
              <div className="h-4 bg-black/5 rounded w-1/5" />
            </div>
            <div className="h-2 bg-black/5 rounded w-full" />
          </div>
          <div className="h-px bg-black/10 my-4" />
          <div className="flex justify-between">
            <div className="h-4 bg-black/5 rounded w-1/3" />
            <div className="h-4 bg-black/5 rounded w-1/4" />
          </div>
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <p className="text-sm text-[#8A8FA8]">No task costs yet — add costs in the Timeline tab.</p>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate max-w-[200px]">{t.name}</span>
                  <span className="font-semibold">LKR {(t.cost || 0).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-owner-light rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-300 bg-owner"
                    style={{
                      width: `${Math.min(100, ((t.cost || 0) / maxCost) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
          <div className="h-px bg-black/10 my-4" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Remaining Budget</span>
            <span className={remainingBudget >= 0 ? 'text-owner font-bold' : 'text-danger font-bold'}>
              LKR {fmtCompact(remainingBudget)}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}