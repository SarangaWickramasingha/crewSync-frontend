'use client';
import { useState } from 'react';

const COLORS = ['#E8820C', '#1B6E3A', '#1A56A0', '#C0392B', '#6B3FA0', '#2E7D9E', '#7B6E00'];

export default function EditTaskModal({ task, onSave, onClose }) {
  const [name, setName] = useState(task.name);
  const [color, setColor] = useState(task.color);
  const [cost, setCost] = useState(task.cost || 0);
  const [additionalCost, setAdditionalCost] = useState('');
  const [assignedSP, setAssignedSP] = useState(task.assignedSP);

  function handleSave() {
    if (!name.trim()) return;
    const finalCost = (Number(cost) || 0) + (Number(additionalCost) || 0);
    onSave({ name: name.trim(), color, cost: finalCost, assignedSP });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)]">
      <div className="flex w-[320px] flex-col gap-2.5 rounded-[14px] border border-[rgba(26,29,35,0.1)] bg-white p-[22px] shadow-[0_8px_32px_rgba(26,29,35,0.15)]">
        <h3 className="m-0 font-syne text-sm font-bold text-[#1A1D23]">Edit Task</h3>

        <div className="text-[11px] font-medium text-[#8A8FA8]">Task name</div>
        <input
          className="w-full rounded-md border border-[rgba(26,29,35,0.1)] bg-white px-2.5 py-[7px] font-sans text-[13px] text-[#1A1D23] outline-none focus:border-[#E8820C]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="flex justify-between items-center text-[11px] font-medium text-[#8A8FA8] mt-1 mb-0.5">
          <span>Current Cost:</span>
          <span className="font-bold text-[#1A1D23]">LKR {(task.cost || 0).toLocaleString()}</span>
        </div>

        <div className="text-[11px] font-medium text-[#8A8FA8]">+ Add Cost (LKR)</div>
        <input
          type="number"
          className="w-full rounded-md border border-[rgba(26,29,35,0.1)] bg-white px-2.5 py-[7px] font-sans text-[13px] text-[#1A1D23] outline-none focus:border-[#E8820C]"
          value={additionalCost}
          onChange={(e) => setAdditionalCost(e.target.value)}
          placeholder="e.g. 10000"
        />

        {Number(additionalCost) > 0 && (
          <div className="text-[11px] font-semibold text-[#1B6E3A] mt-0.5 bg-[#E6F4EC] px-2 py-1 rounded">
            New Total: LKR {((task.cost || 0) + Number(additionalCost)).toLocaleString()}
          </div>
        )}

        <div className="text-[11px] font-medium text-[#8A8FA8]">Assigned Service Provider</div>
        {assignedSP ? (
          <div className="flex items-center justify-between rounded-md bg-[#F7F6F2] px-2.5 py-1.5 text-[13px]">
            <span>{assignedSP}</span>
            <button
              type="button"
              className="bg-none text-xs font-semibold text-[#C0392B]"
              onClick={() => setAssignedSP(null)}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-xs italic text-[#8A8FA8]">Not assigned — assign from Find Services</div>
        )}

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
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}