'use client';

import { useState, useMemo } from 'react';
import { useTasks } from './TasksContext';
import EditTaskModal from './EditTaskModal';

const COLORS = ['#E8820C', '#1B6E3A', '#1A56A0', '#C0392B', '#6B3FA0', '#2E7D9E', '#7B6E00'];

const STATUS_CFG = {
  0: { label: 'Empty', bg: 'transparent', dot: '#ccc' },
  1: { label: 'Done', bg: '#E6F4EC', dot: '#1B6E3A' },
  2: { label: 'In Progress', bg: '#FFF3E0', dot: '#E8820C' },
  3: { label: 'Blocked', bg: '#FDECEA', dot: '#C0392B' },
};

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeekDays(base) {
  const d = new Date(base);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return x;
  });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function cycleStatus(cur) {
  const order = [0, 2, 1, 3];
  const i = order.indexOf(cur == null ? 0 : cur);
  return order[(i + 1) % order.length];
}
function fmtCompact(n) {
  if (n >= 1000000 || n <= -1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000 || n <= -1000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString();
}

function AddTaskModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)]">
      <div className="flex w-[300px] flex-col gap-2.5 rounded-[14px] border border-[rgba(26,29,35,0.1)] bg-white p-[22px] shadow-[0_8px_32px_rgba(26,29,35,0.15)]">
        <h3 className="m-0 font-syne text-sm font-bold text-[#1A1D23]">Add Task</h3>

        <div className="text-[11px] font-medium text-[#8A8FA8]">Task name</div>
        <input
          className="w-full rounded-md border border-[rgba(26,29,35,0.1)] bg-white px-2.5 py-[7px] font-sans text-[13px] text-[#1A1D23] outline-none focus:border-[#E8820C]"
          placeholder="e.g. Roofing Task 2"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onSave(name.trim(), color); }}
        />

        <div className="text-[11px] font-medium text-[#8A8FA8]">Colour</div>
        <div className="flex flex-wrap gap-1.5">
          {COLORS.map((c) => (
            <div
              key={c}
              className={`h-[22px] w-[22px] cursor-pointer rounded-full border-2 ${
                color === c ? 'border-[#1A1D23]' : 'border-transparent'
              }`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            className="rounded-md border border-[rgba(26,29,35,0.1)] bg-transparent px-3 py-[5px] font-sans text-xs text-[#8A8FA8]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md border-none bg-[#E8820C] px-3 py-[5px] font-sans text-xs font-semibold text-white"
            onClick={() => name.trim() && onSave(name.trim(), color)}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskCalendarGrid() {
  const {
    tasks, addTask, deleteTask, updateTask, toggleTaskCompleted,
    estimatedBudget, totalCost, remainingBudget,
    projectCompleted, finishProject, unlockProject,
  } = useTasks();

  const today = useMemo(() => new Date(), []);
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const days = useMemo(() => getWeekDays(baseDate), [baseDate]);
  const weekLabel = `${MONTHS[days[0].getMonth()]} ${days[0].getDate()} – ${MONTHS[days[6].getMonth()]} ${days[6].getDate()}, ${days[6].getFullYear()}`;

  function prevWeek() { const d = new Date(baseDate); d.setDate(d.getDate() - 7); setBaseDate(d); }
  function nextWeek() { const d = new Date(baseDate); d.setDate(d.getDate() + 7); setBaseDate(d); }
  function goToday() { setBaseDate(new Date()); }

  function toggleCell(taskId, day) {
    if (projectCompleted) return;
    const k = dayKey(day);
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { days: { ...task.days, [k]: cycleStatus(task.days[k] ?? 0) } });
  }

  return (
    <>
      {showAdd && (
        <AddTaskModal onSave={(name, color) => { addTask(name, color); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => { updateTask(editingTask.id, updates); setEditingTask(null); }}
        />
      )}

      {/* BUDGET BAR */}
      <div className="mb-3.5 flex flex-wrap items-center gap-6 rounded-xl border border-[rgba(26,29,35,0.1)] bg-white px-[18px] py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-[.4px] text-[#8A8FA8]">Estimated Budget</span>
          <span className="font-syne text-base font-bold text-[#1A1D23]">LKR {fmtCompact(estimatedBudget)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-[.4px] text-[#8A8FA8]">Total Cost</span>
          <span className="font-syne text-base font-bold text-[#B85A00]">LKR {fmtCompact(totalCost)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-[.4px] text-[#8A8FA8]">Remaining</span>
          <span
            className="font-syne text-base font-bold"
            style={{ color: remainingBudget >= 0 ? '#1B6E3A' : '#C0392B' }}
          >
            LKR {fmtCompact(remainingBudget)}
          </span>
        </div>
        <div className="ml-auto">
          {projectCompleted ? (
            <button
              className="rounded-lg border border-[rgba(26,29,35,0.2)] bg-white px-4 py-2 font-sans text-[13px] font-semibold text-[#1A1D23] hover:bg-[#F7F6F2] flex items-center gap-1.5"
              onClick={unlockProject}
            >
              <svg className="w-4 h-4 text-[#1A1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Unlock Project
            </button>
          ) : (
            <button
              className="rounded-lg bg-[#1B6E3A] px-4 py-2 font-sans text-[13px] font-semibold text-white hover:opacity-90"
              onClick={finishProject}
            >
              ✓ Finish Project
            </button>
          )}
        </div>
      </div>

      {projectCompleted && (
        <div className="mb-3.5 rounded-lg border border-[rgba(232,130,12,0.3)] bg-[#FFF3E0] px-4 py-2.5 text-[13px] text-[#B85A00] flex items-center gap-2">
          <svg className="w-4 h-4 text-[#B85A00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Project marked as completed — editing is locked. Click &quot;Unlock Project&quot; to make changes.</span>
        </div>
      )}

      {/* CALENDAR */}
      <div className="overflow-hidden rounded-xl border border-[rgba(26,29,35,0.1)] bg-white">
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[rgba(26,29,35,0.1)] bg-[#F7F6F2] px-3.5 py-2.5">
          <span className="mr-auto text-sm font-semibold text-[#1A1D23]">{weekLabel}</span>
          <div className="flex gap-1.5">
            <button
              className="rounded-md border border-[rgba(26,29,35,0.1)] bg-transparent px-2.5 py-1 font-sans text-xs text-[#4A5068] hover:bg-[#EEECEA]"
              onClick={prevWeek}
            >
              ‹ Prev
            </button>
            <button
              className="rounded-md border border-[rgba(26,29,35,0.1)] bg-transparent px-2.5 py-1 font-sans text-xs text-[#4A5068] hover:bg-[#EEECEA]"
              onClick={goToday}
            >
              Today
            </button>
            <button
              className="rounded-md border border-[rgba(26,29,35,0.1)] bg-transparent px-2.5 py-1 font-sans text-xs text-[#4A5068] hover:bg-[#EEECEA]"
              onClick={nextWeek}
            >
              Next ›
            </button>
          </div>
          <button
            className="rounded-md bg-[#E8820C] px-3 py-[5px] font-sans text-xs font-semibold text-white hover:bg-[#B85A00] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setShowAdd(true)}
            disabled={projectCompleted}
          >
            + Add Task
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-[3] min-w-[230px] border-b border-r border-[rgba(26,29,35,0.1)] bg-[#F7F6F2] px-2.5 py-[7px] text-left font-sans text-[11px] font-semibold text-[#8A8FA8]">
                  Task
                </th>
                {days.map((d, i) => {
                  const isT = isSameDay(d, today);
                  return (
                    <th
                      key={i}
                      className={`sticky top-0 z-[2] whitespace-nowrap border-b border-r border-[rgba(26,29,35,0.1)] bg-[#F7F6F2] px-2.5 py-[7px] text-center font-sans text-[11px] font-semibold text-[#8A8FA8] last:border-r-0 ${
                        isT ? 'bg-[rgba(232,130,12,0.05)]' : ''
                      }`}
                    >
                      <span className={isT ? '!font-bold !text-[#B85A00]' : ''}>
                        {DOW[d.getDay()]} {d.getDate()}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr className="border-b border-[rgba(26,29,35,0.1)]">
                  <td colSpan={8} className="p-6 text-center text-[13px] text-[#8A8FA8]">
                    No tasks yet — click &quot;+ Add Task&quot; to get started
                  </td>
                </tr>
              )}
              {tasks.map((t) => (
                <tr key={t.id} className="group border-b border-[rgba(26,29,35,0.1)] last:border-b-0 hover:bg-[#F7F6F2]">
                  <td className="border-r border-[rgba(26,29,35,0.1)] p-0 align-middle">
                    <div className="sticky left-0 z-[1] flex min-w-[230px] flex-col gap-1.5 bg-white px-3 py-2 group-hover:bg-[#F7F6F2]">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: t.color }} />
                        <span
                          className={`flex-1 truncate text-[13px] font-medium text-[#1A1D23] ${
                            t.completed ? 'text-[#8A8FA8] line-through' : ''
                          }`}
                          title={t.name}
                        >
                          {t.name}
                        </span>
                        {!projectCompleted && (
                          <button
                            className="px-0.5 text-sm leading-none text-[#8A8FA8] opacity-0 group-hover:opacity-100 hover:text-[#C0392B]"
                            onClick={() => deleteTask(t.id)}
                            title="Remove task"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#B85A00]">
                          LKR {(t.cost || 0).toLocaleString()}
                        </span>
                        {t.assignedSP && (
                          <span className="text-[11px] text-[#4A5068] flex items-center gap-1">
                            <svg className="w-3 h-3 text-[#4A5068]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {t.assignedSP}
                          </span>
                        )}
                        {!projectCompleted && (
                          <button
                            className="rounded-[5px] border border-[rgba(26,29,35,0.1)] px-1.5 py-px font-sans text-[10px] text-[#4A5068] hover:bg-[#EEECEA] inline-flex items-center gap-1"
                            onClick={() => setEditingTask(t)}
                          >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                        {t.completed ? (
                          <span className="rounded-[5px] bg-[#E6F4EC] px-1.5 py-px text-[10px] font-bold text-[#1B6E3A]">
                            ✓ Completed
                          </span>
                        ) : (
                          !projectCompleted && (
                            <button
                              className="rounded-[5px] border border-[#1B6E3A] px-1.5 py-px font-sans text-[10px] text-[#1B6E3A] hover:bg-[#E6F4EC]"
                              onClick={() => toggleTaskCompleted(t.id)}
                            >
                              Finish Task
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </td>
                  {days.map((d, i) => {
                    const k = dayKey(d);
                    const st = t.days[k] ?? 0;
                    const cfg = STATUS_CFG[st];
                    const isT = isSameDay(d, today);
                    return (
                      <td
                        key={i}
                        className={`h-16 border-r border-[rgba(26,29,35,0.1)] p-0 text-center last:border-r-0 ${
                          isT ? 'bg-[rgba(232,130,12,0.05)]' : ''
                        } ${projectCompleted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        onClick={() => toggleCell(t.id, d)}
                        title={`Click to cycle status: ${cfg.label}`}
                      >
                        <div className="flex h-full w-full items-center justify-center">
                          {st === 0 ? (
                            <div className="h-[22px] w-[22px] rounded border border-dashed border-[#ccc]" />
                          ) : (
                            <div
                              className="flex h-[30px] w-[30px] items-center justify-center rounded"
                              style={{ background: cfg.bg }}
                            >
                              <div className="h-2 w-2 rounded-full" style={{ background: cfg.dot }} />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-3.5 border-t border-[rgba(26,29,35,0.1)] bg-[#F7F6F2] px-3.5 py-2">
          <span className="text-[11px] text-[#8A8FA8]">Click a cell to cycle status:</span>
          {[2, 1, 3].map((s) => (
            <div key={s} className="flex items-center gap-1.5 font-sans text-[11px] text-[#8A8FA8]">
              <div
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: STATUS_CFG[s].bg, border: `1px solid ${STATUS_CFG[s].dot}` }}
              />
              {STATUS_CFG[s].label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#8A8FA8]">
            <div className="h-2.5 w-2.5 rounded-sm border border-dashed border-[#ccc]" />
            Not started
          </div>
        </div>
      </div>
    </>
  );
}