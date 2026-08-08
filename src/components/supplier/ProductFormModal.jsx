'use client';
import ProductForm from '@/src/components/supplier/ProductForm';

export default function ProductFormModal({ open, title, defaultValues, onSubmit, onClose, submitLabel, isSubmitting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(26,29,35,0.4)]" onClick={onClose}>
      <div
        className="flex w-[440px] flex-col gap-3 rounded-[14px] border border-[rgba(26,29,35,0.1)] bg-white p-[22px] shadow-[0_8px_32px_rgba(26,29,35,0.15)] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1">
          <h3 className="m-0 font-syne text-sm font-bold text-[#1A1D23]">{title}</h3>
          <button onClick={onClose} className="text-[#8A8FA8] hover:text-[#1A1D23] text-sm leading-none cursor-pointer bg-transparent border-none font-bold">
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
