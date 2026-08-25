'use client';
import { Check, X } from 'lucide-react';

export default function ConfirmHandledModal({ subject, willBeHandled, isSaving, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between px-5 pt-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber/10">
                        <Check className="w-5 h-5 text-amber" strokeWidth={2} />
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="text-muted hover:text-slate transition"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 pt-3 pb-5">
                    <h2 className="font-syne text-base font-bold text-slate">
                        {willBeHandled ? 'Mark as handled?' : 'Mark as unhandled?'}
                    </h2>
                    <p className="mt-1.5 text-xs text-muted leading-relaxed">
                        {willBeHandled
                            ? <>“<span className="font-medium text-slate">{subject}</span>” will be marked as handled and greyed out in the list.</>
                            : <>“<span className="font-medium text-slate">{subject}</span>” will be reopened and moved back into the active list.</>
                        }
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-5 pb-5">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-slate hover:bg-surface transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSaving}
                        className="flex-1 py-2 rounded-lg bg-amber text-xs font-medium text-white hover:bg-amber-dark transition disabled:opacity-70"
                    >
                        {isSaving ? 'Saving…' : willBeHandled ? 'Mark handled' : 'Mark unhandled'}
                    </button>
                </div>
            </div>
        </div>
    );
}
