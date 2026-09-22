'use client';

import { useState, useEffect } from 'react';
import { useTasks } from './TasksContext';
import { createServiceRequest, fetchPendingServiceRequest } from '@/src/api/serviceRequestApi';
import { fetchPublicProvider } from '@/src/api/providerApi';

export default function RequestProviderByIdModal({ task, onClose }) {
  const { refreshNotifications, addNotification } = useTasks();
  const [providerId, setProviderId] = useState('');
  const [providerPreview, setProviderPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [pendingInfo, setPendingInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPendingServiceRequest(task.id)
      .then((data) => {
        if (!cancelled) setPendingInfo(data);
      })
      .catch(() => {
        if (!cancelled) setPendingInfo({ pending: false, request: null });
      });
    return () => {
      cancelled = true;
    };
  }, [task.id]);

  // Automatically lookup provider details when a valid numeric ID is typed/pasted
  async function handleIdChange(val) {
    setProviderId(val);
    setError('');
    const trimmed = val.trim();
    if (!trimmed || isNaN(trimmed)) {
      setProviderPreview(null);
      setPreviewError('');
      return;
    }

    setPreviewLoading(true);
    setPreviewError('');
    try {
      const data = await fetchPublicProvider(Number(trimmed));
      if (data?.provider) {
        setProviderPreview(data.provider);
      } else {
        setProviderPreview(null);
        setPreviewError('Service provider not found with this ID');
      }
    } catch (err) {
      setProviderPreview(null);
      setPreviewError(err?.message || 'Provider not found');
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handlePasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleIdChange(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  }

  async function handleSend() {
    const trimmedId = providerId.trim();
    if (!trimmedId || isNaN(trimmedId)) {
      setError('Please enter a valid numeric Provider ID.');
      return;
    }

    setSending(true);
    setError('');
    try {
      await createServiceRequest({
        provider_id: Number(trimmedId),
        task_id: [task.id],
      });
      setSent(true);
      if (addNotification) {
        const spName = providerPreview?.name || `Provider #${trimmedId}`;
        addNotification(`Request sent to <strong>${spName}</strong> for task <strong>${task.name}</strong>`);
      }
      if (refreshNotifications) {
        refreshNotifications();
      }
    } catch (e) {
      setError(e.message || 'Failed to send service request. Please check the ID and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)] p-4">
      <div className="w-[380px] max-w-full rounded-[14px] bg-white p-6 font-sans shadow-[0_8px_32px_rgba(26,29,35,0.15)] text-left">
        {pendingInfo === null ? (
          <div className="flex items-center justify-center py-10 text-[13px] text-[#8A8FA8] gap-2">
            <div className="w-3 h-3 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
            Checking pending requests...
          </div>
        ) : pendingInfo.pending ? (
          <div className="text-center py-4">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E0]">
                <svg className="w-7 h-7 text-[#B85A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Pending a Request</h3>
            <p className="text-[13px] text-[#4A5068]">
              A service request is already pending for <strong>{task.name}</strong>.
            </p>
            {pendingInfo.request?.provider_name && (
              <p className="mt-1 text-[13px] text-[#4A5068]">
                Sent to <strong>{pendingInfo.request.provider_name}</strong>
                <span className="text-[#8A8FA8]"> (Provider #{pendingInfo.request.provider_id})</span>.
              </p>
            )}
            <p className="mt-1 text-[12px] text-[#8A8FA8]">
              The provider has 72 hours to respond before the request expires.
            </p>
            <button
              className="mt-5 w-full rounded-lg border-none bg-[#16a34a] hover:bg-[#15803d] py-2.5 text-[13px] font-semibold text-white cursor-pointer transition-colors shadow-sm"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : sent ? (
          <div className="text-center py-2">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4EC]">
                <svg className="w-7 h-7 text-[#1B6E3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-1.5 font-syne text-base font-bold text-[#1A1D23]">Request Sent!</h3>
            <p className="text-[13px] text-[#4A5068]">
              Your service request for <strong>{task.name}</strong> has been sent to{' '}
              <strong>{providerPreview?.name || `Provider #${providerId}`}</strong>.
            </p>
            <p className="mt-1 text-[12px] text-[#8A8FA8]">
              The provider has 72 hours to respond before the request expires.
            </p>
            <button
              className="mt-5 w-full rounded-lg border-none bg-[#16a34a] hover:bg-[#15803d] py-2.5 text-[13px] font-semibold text-white cursor-pointer transition-colors shadow-sm"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2.5">
              <h3 className="font-syne text-base font-bold text-[#1A1D23]">Request Service Provider</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-[#8A8FA8] hover:text-[#1A1D23] text-lg font-semibold leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="mb-3 text-[13px] text-[#4A5068]">
              Assign a provider to task: <strong className="text-[#1A1D23]">{task.name}</strong>
            </p>

            <div className="mb-3">
              <label className="block text-[11px] font-semibold text-[#8A8FA8] uppercase tracking-wider mb-1">
                Service Provider ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-[rgba(26,29,35,0.15)] bg-white px-3 py-2 text-sm text-[#1A1D23] outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]"
                  placeholder="Paste Provider ID (e.g. 5)"
                  value={providerId}
                  onChange={(e) => handleIdChange(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="rounded-lg border border-[rgba(26,29,35,0.15)] bg-[#FAF9F5] hover:bg-[#F0EFEB] px-2.5 py-2 text-xs font-semibold text-[#4A5068] transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              </div>
            </div>

            {/* Provider Preview Card if ID is found */}
            {previewLoading && (
              <div className="mb-3 rounded-lg bg-[#FAF9F5] p-2.5 text-xs text-[#8A8FA8] flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
                Looking up provider details...
              </div>
            )}

            {providerPreview && (
              <div className="mb-3 rounded-lg border border-[#16a34a]/30 bg-[#F0FDF4] p-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[#15803d]">{providerPreview.name}</div>
                  <span className="text-[11px] font-semibold text-[#E8820C]">★ {Number(providerPreview.avg_rating || 0).toFixed(1)}</span>
                </div>
                <div className="text-xs text-[#4A5068] mt-0.5">
                  {providerPreview.skills?.join(', ') || 'Tradesperson'} · {providerPreview.district || 'Location N/A'}
                </div>
                {providerPreview.charge_per_day && (
                  <div className="text-[11px] text-[#8A8FA8] mt-1">
                    Rate: LKR {Number(providerPreview.charge_per_day).toLocaleString()} / day
                  </div>
                )}
              </div>
            )}

            {previewError && (
              <div className="mb-3 rounded-lg bg-[#FFF3F3] p-2.5 text-xs text-[#C0392B]">
                {previewError}
              </div>
            )}

            {error && (
              <div className="mb-3 rounded-lg bg-[#FDEBEC] p-2.5 text-xs text-[#C0392B]">
                {error}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2 border-t border-black/5 pt-3">
              <button
                type="button"
                className="rounded-lg border border-[rgba(26,29,35,0.15)] bg-transparent px-4 py-2 text-[13px] font-medium text-[#4A5068] hover:bg-black/[0.03] transition-colors cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!providerId.trim() || sending}
                className="rounded-lg border-none bg-[#16a34a] hover:bg-[#15803d] px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
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
