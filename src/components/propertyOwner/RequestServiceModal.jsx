'use client';

import { useState } from 'react';
import { useTasks } from './TasksContext';
import { createServiceRequest } from '@/src/api/serviceRequestApi';

export default function RequestServiceModal({ provider, onClose }) {
  const { tasks } = useTasks();
  const [selected, setSelected] = useState([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  function toggle(taskId) {
    setSelected((s) => (s.includes(taskId) ? s.filter((id) => id !== taskId) : [...s, taskId]));
  }

  async function handleSend() {
    setSending(true);
    setError('');
    try {
      await createServiceRequest({ provider_id: provider.providerId, task_id: selected });
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  const hasSelectedAny = selected.length > 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)] p-4">
      <div className="w-[360px] max-w-full rounded-[14px] bg-white p-6 text-center font-sans shadow-[0_8px_32px_rgba(26,29,35,0.15)]">
        {sent ? (
          <>
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EC]">
                <svg className="w-7 h-7 text-[#1B6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Request Sent</h3>
            <p>
              Request sent to {provider.name} for {selected.length} task{selected.length !== 1 ? 's' : ''}.
            </p>
            <p className="mt-1 text-[13px] text-[#8A8FA8]">
              {provider.name} has 72 hours to respond before it expires.
            </p>
            <button
              className="mt-4 rounded-lg border-none bg-[#E8820C] px-[18px] py-2 text-[13px] font-semibold text-white"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Request {provider.name}</h3>
            <p className="mb-3.5 text-left text-[13px] text-[#8A8FA8]">
              Select which task(s) you want {provider.name} to work on. The request expires in 72 hours.
            </p>

            <div className="mb-4 flex max-h-[220px] flex-col gap-1.5 overflow-y-auto text-left">
              {tasks.length === 0 && (
                <p className="text-left text-[13px] text-[#8A8FA8]">
                  No tasks yet — add tasks in the Timeline tab first.
                </p>
              )}
              {tasks.map((t) => {
                const isSelected = selected.includes(t.id);
                const isDisabled = hasSelectedAny && !isSelected;
                return (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2 rounded-lg border border-[rgba(26,29,35,0.1)] px-2.5 py-2 text-[13px] ${
                      isDisabled ? 'cursor-not-allowed bg-[#F7F6F2] opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-[15px] w-[15px] cursor-pointer accent-[#E8820C]"
                      disabled={isDisabled}
                      checked={isSelected}
                      onChange={() => toggle(t.id)}
                    />
                    <span className="flex-1">
                      <span className="block">{t.name}</span>
                      {t.projectName && (
                        <span className="block text-[11px] text-[#8A8FA8]">{t.projectName}</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-[#FDEBEC] px-3 py-2 text-left text-[12px] text-[#C0392B]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="rounded-lg border border-[rgba(26,29,35,0.1)] bg-transparent px-4 py-2 text-[13px] text-[#4A5068]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-lg border-none bg-[#E8820C] px-[18px] py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={selected.length === 0 || sending}
                onClick={handleSend}
              >
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
