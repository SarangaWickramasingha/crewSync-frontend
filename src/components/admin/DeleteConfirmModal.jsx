'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
    name,
    isDeleting,
    onCancel,
    onConfirm,
    title = 'Delete this user?',
    message,
    confirmLabel = 'Delete user',
    confirmingLabel = 'Deleting…',
}) {
    // Portals need document.body, which only exists client-side after mount.
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-start justify-between px-5 pt-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                        <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={2} />
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="text-muted hover:text-slate transition"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 pt-3 pb-5">
                    <h2 className="font-syne text-base font-bold text-slate">
                        {title}
                    </h2>
                    <p className="mt-1.5 text-xs text-muted leading-relaxed">
                        {message ?? (
                            <>
                                <span className="font-medium text-slate">{name}</span> will be
                                permanently removed. This can&apos;t be undone.
                            </>
                        )}
                    </p>
                </div>

                <div className="flex gap-2 px-5 pb-5">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-slate hover:bg-surface transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2 rounded-lg bg-red-500 text-xs font-medium text-white hover:bg-red-600 transition disabled:opacity-70"
                    >
                        {isDeleting ? confirmingLabel : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}