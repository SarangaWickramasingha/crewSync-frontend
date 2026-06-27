'use client';

import { useState, useMemo } from 'react';

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

const INIT_TASKS = [
  { id: 1, name: 'Site Preparation', color: '#1B6E3A', days: {} },
  { id: 2, name: 'Foundation Work', color: '#E8820C', days: {} },
  { id: 3, name: 'Structural Walls', color: '#1A56A0', days: {} },
  { id: 4, name: 'Roofing', color: '#C0392B', days: {} },
  { id: 5, name: 'Plumbing & Electrical', color: '#6B3FA0', days: {} },
];

function AddTaskModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  return (
    <div className="tcg-modal-bg">
      <div className="tcg-modal">
        <h3>Add Construction Task</h3>
        <div className="tcg-modal-lbl">Task name</div>
        <input
          placeholder="e.g. Roofing Phase 2"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onSave(name.trim(), color);
          }}
        />
        <div className="tcg-modal-lbl">Colour</div>
        <div className="tcg-color-row">
          {COLORS.map((c) => (
            <div
              key={c}
              className={`tcg-cp${color === c ? ' sel' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="tcg-modal-actions">
          <button className="tcg-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="tcg-btn-save" onClick={() => name.trim() && onSave(name.trim(), color)}>
            Add Task
          </button>
        </div>
      </div>

      <style jsx>{`
        .tcg-modal-bg { position:fixed; inset:0; background:rgba(26,29,35,0.4); display:flex; align-items:center; justify-content:center; z-index:9999; }
        .tcg-modal { background:#fff; border:1px solid rgba(26,29,35,0.1); border-radius:14px; padding:22px; width:300px; display:flex; flex-direction:column; gap:10px; box-shadow:0 8px 32px rgba(26,29,35,0.15); }
        .tcg-modal h3 { font-size:14px; font-weight:700; font-family:'Syne',sans-serif; color:#1A1D23; margin:0; }
        .tcg-modal input { width:100%; font-size:13px; padding:7px 10px; border-radius:6px; border:1px solid rgba(26,29,35,0.1); color:#1A1D23; background:#fff; font-family:'DM Sans',sans-serif; outline:none; }
        .tcg-modal input:focus { border-color:#E8820C; }
        .tcg-modal-lbl { font-size:11px; color:#8A8FA8; font-weight:500; }
        .tcg-modal-actions { display:flex; gap:8px; justify-content:flex-end; margin-top:4px; }
        .tcg-btn-cancel { background:none; border:1px solid rgba(26,29,35,0.1); border-radius:6px; padding:5px 12px; font-size:12px; cursor:pointer; color:#8A8FA8; font-family:'DM Sans',sans-serif; }
        .tcg-btn-save { background:#E8820C; border:none; border-radius:6px; padding:5px 12px; font-size:12px; color:#fff; cursor:pointer; font-weight:600; font-family:'DM Sans',sans-serif; }
        .tcg-color-row { display:flex; gap:6px; flex-wrap:wrap; }
        .tcg-cp { width:22px; height:22px; border-radius:50%; cursor:pointer; border:2px solid transparent; }
        .tcg-cp.sel { border-color:#1A1D23; }
      `}</style>
    </div>
  );
}

export default function TaskCalendarGrid() {
  const today = useMemo(() => new Date(), []);
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [nextId, setNextId] = useState(20);
  const [showAdd, setShowAdd] = useState(false);

  const days = useMemo(() => getWeekDays(baseDate), [baseDate]);
  const weekLabel = `${MONTHS[days[0].getMonth()]} ${days[0].getDate()} – ${MONTHS[days[6].getMonth()]} ${days[6].getDate()}, ${days[6].getFullYear()}`;

  function prevWeek() {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  }
  function nextWeek() {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  }
  function goToday() {
    setBaseDate(new Date());
  }
  function toggleCell(taskId, day) {
    const k = dayKey(day);
    setTasks((ts) =>
      ts.map((t) => (t.id !== taskId ? t : { ...t, days: { ...t.days, [k]: cycleStatus(t.days[k] ?? 0) } }))
    );
  }
  function addTask(name, color) {
    setTasks((ts) => [...ts, { id: nextId, name, color, days: {} }]);
    setNextId((n) => n + 1);
    setShowAdd(false);
  }
  function deleteTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  }

  return (
    <>
      {showAdd && <AddTaskModal onSave={addTask} onClose={() => setShowAdd(false)} />}

      <div className="tcg-wrap">
        <div className="tcg-toolbar">
          <span className="tcg-title">{weekLabel}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="tcg-nav-btn" onClick={prevWeek}>‹ Prev</button>
            <button className="tcg-nav-btn" onClick={goToday}>Today</button>
            <button className="tcg-nav-btn" onClick={nextWeek}>Next ›</button>
          </div>
          <button className="tcg-add-btn" onClick={() => setShowAdd(true)}>+ Add Task</button>
        </div>

        <div className="tcg-scroll">
          <table className="tcg-table">
            <thead>
              <tr>
                <th>Task / Phase</th>
                {days.map((d, i) => {
                  const isT = isSameDay(d, today);
                  return (
                    <th key={i} className={isT ? 'tcg-today-col' : ''}>
                      <span className={isT ? 'tcg-today-hdr' : ''}>{DOW[d.getDay()]} {d.getDate()}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr className="tcg-empty">
                  <td colSpan={8}>No tasks yet — click &quot;+ Add Task&quot; to get started</td>
                </tr>
              )}
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="tcg-task-cell">
                      <div className="tcg-task-dot" style={{ background: t.color }} />
                      <span className="tcg-task-name" title={t.name}>{t.name}</span>
                      <button className="tcg-task-del" onClick={() => deleteTask(t.id)} title="Remove task">×</button>
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
                        className={`tcg-day-cell${isT ? ' tcg-today-col' : ''}`}
                        onClick={() => toggleCell(t.id, d)}
                        title={`Click to cycle status: ${cfg.label}`}
                      >
                        <div className="tcg-cell-inner">
                          {st === 0 ? (
                            <div style={{ width: 22, height: 22, borderRadius: 4, border: '1px dashed #ccc' }} />
                          ) : (
                            <div className="tcg-cell-filled" style={{ background: cfg.bg }}>
                              <div className="tcg-status-dot" style={{ background: cfg.dot }} />
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

        <div className="tcg-legend">
          <span style={{ fontSize: 11, color: '#8A8FA8' }}>Click a cell to cycle status:</span>
          {[2, 1, 3].map((s) => (
            <div key={s} className="tcg-legend-item">
              <div className="tcg-legend-sw" style={{ background: STATUS_CFG[s].bg, border: `1px solid ${STATUS_CFG[s].dot}` }} />
              {STATUS_CFG[s].label}
            </div>
          ))}
          <div className="tcg-legend-item">
            <div style={{ width: 10, height: 10, borderRadius: 2, border: '1px dashed #ccc' }} />
            Not started
          </div>
        </div>
      </div>

      <style jsx>{`
        .tcg-wrap { border:1px solid rgba(26,29,35,0.1); border-radius:12px; overflow:hidden; background:#fff; }
        .tcg-toolbar { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid rgba(26,29,35,0.1); background:#F7F6F2; flex-wrap:wrap; }
        .tcg-title { font-size:14px; font-weight:600; margin-right:auto; color:#1A1D23; }
        .tcg-nav-btn { background:none; border:1px solid rgba(26,29,35,0.1); border-radius:6px; padding:4px 10px; font-size:12px; cursor:pointer; color:#4A5068; font-family:'DM Sans',sans-serif; }
        .tcg-nav-btn:hover { background:#EEECEA; }
        .tcg-add-btn { background:#E8820C; color:#fff; border:none; border-radius:6px; padding:5px 12px; font-size:12px; cursor:pointer; font-weight:600; font-family:'DM Sans',sans-serif; }
        .tcg-add-btn:hover { background:#B85A00; }
        .tcg-scroll { overflow-x:auto; }
        .tcg-table { width:100%; border-collapse:collapse; min-width:600px; }
        .tcg-table thead th { border-bottom:1px solid rgba(26,29,35,0.1); border-right:1px solid rgba(26,29,35,0.1); padding:7px 10px; font-size:11px; font-weight:600; color:#8A8FA8; text-align:center; white-space:nowrap; background:#F7F6F2; position:sticky; top:0; z-index:2; font-family:'DM Sans',sans-serif; }
        .tcg-table thead th:first-child { text-align:left; min-width:170px; position:sticky; left:0; z-index:3; background:#F7F6F2; }
        .tcg-table thead th:last-child { border-right:none; }
        .tcg-table tbody tr { border-bottom:1px solid rgba(26,29,35,0.1); }
        .tcg-table tbody tr:last-child { border-bottom:none; }
        .tcg-table tbody tr:hover { background:#F7F6F2; }
        .tcg-table td { border-right:1px solid rgba(26,29,35,0.1); padding:0; vertical-align:middle; height:46px; }
        .tcg-table td:last-child { border-right:none; }
        .tcg-task-cell { min-width:170px; padding:8px 12px; position:sticky; left:0; background:#fff; z-index:1; display:flex; align-items:center; gap:8px; }
        .tcg-table tbody tr:hover .tcg-task-cell { background:#F7F6F2; }
        .tcg-task-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
        .tcg-task-name { font-size:13px; font-weight:500; color:#1A1D23; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .tcg-task-del { background:none; border:none; cursor:pointer; color:#8A8FA8; font-size:14px; padding:0 2px; opacity:0; line-height:1; }
        .tcg-table tbody tr:hover .tcg-task-del { opacity:1; }
        .tcg-task-del:hover { color:#C0392B; }
        .tcg-day-cell { text-align:center; cursor:pointer; height:46px; padding:0; }
        .tcg-cell-inner { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .tcg-cell-filled { border-radius:4px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; }
        .tcg-status-dot { width:8px; height:8px; border-radius:50%; }
        .tcg-today-col { background:rgba(232,130,12,0.05); }
        .tcg-today-hdr { color:#B85A00 !important; font-weight:700 !important; }
        .tcg-legend { display:flex; align-items:center; gap:14px; padding:8px 14px; border-top:1px solid rgba(26,29,35,0.1); background:#F7F6F2; flex-wrap:wrap; }
        .tcg-legend-item { display:flex; align-items:center; gap:5px; font-size:11px; color:#8A8FA8; font-family:'DM Sans',sans-serif; }
        .tcg-legend-sw { width:10px; height:10px; border-radius:2px; }
        .tcg-empty td { text-align:center; padding:24px; font-size:13px; color:#8A8FA8; }
      `}</style>
    </>
  );
}