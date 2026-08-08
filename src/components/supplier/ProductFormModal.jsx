'use client';
import ProductForm from '@/src/components/supplier/ProductForm';

export default function ProductFormModal({ open, title, defaultValues, onSubmit, onClose, submitLabel, isSubmitting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-bold text-crewSlate">{title}</h3>
          <button onClick={onClose} className="text-crewMuted hover:text-crewSlate text-lg leading-none cursor-pointer bg-transparent border-none">
            ✕
          </button>
        </div>
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
