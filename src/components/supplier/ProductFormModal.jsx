'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ProductForm from '@/src/components/supplier/ProductForm';

export default function ProductFormModal({ open, title, defaultValues, onSubmit, onClose, submitLabel, isSubmitting }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] bg-white rounded-2xl p-6 font-sans shadow-2xl"
      >
        <h3 className="font-syne text-[1.15rem] font-bold text-crewSlate text-center mb-4">
          {title}
        </h3>
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>,
    document.body
  );
}


