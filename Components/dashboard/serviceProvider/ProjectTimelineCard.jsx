"use client";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', muted: '#8A8FA8', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  blue: '#1A56A0', blueLight: '#E8F0FB',
  border: 'rgba(26,29,35,0.1)', radius: '12px',
};

const DOT  = { done: { background: '#E6F4EC', color: '#1B6E3A' }, pending: { background: '#EEECEA', color: '#8A8FA8' } };
const PILL = { done: { background: '#E6F4EC', color: '#1B6E3A' }, pending: { background: '#EEECEA', color: '#8A8FA8' } };

export default function ProjectTimelineCard({ projectName, projectStatus, tasks, assignedTaskNames }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}>{projectName}</h3>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px',
          background: projectStatus === 'Completed' ? C.greenLight : C.amberLight,
          color: projectStatus === 'Completed' ? C.green : C.amberDark,
        }}>
          {projectStatus}
        </span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((task, i) => (
          <li key={task.task_id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: i < tasks.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px', ...DOT[task.status] }}>
              {task.status === 'done' ? '✓' : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{task.name}</div>
              <div style={{ fontSize: '0.74rem', color: C.muted, marginTop: '2px' }}>{task.dates}</div>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginTop: '4px', ...PILL[task.status] }}>{task.label}</span>
          </li>
        ))}
      </ul>

      {assignedTaskNames && assignedTaskNames.length > 0 && (
        <div style={{ background: C.blueLight, border: '1px solid rgba(26,86,160,0.25)', borderRadius: C.radius, padding: '1rem 1.5rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: C.blue }}>
            <strong>Your assigned task{assignedTaskNames.length > 1 ? 's' : ''}:</strong> {assignedTaskNames.join(', ')}. You are responsible for {assignedTaskNames.length > 1 ? 'these tasks' : 'this task'}.
          </div>
        </div>
      )}
    </div>
  );
}