'use client';
import { useEffect, useRef, useState } from 'react';
import ProductForm from '@/src/components/supplier/ProductForm';

export default function ProductFormModal({ open, title, defaultValues, onSubmit, onClose, submitLabel, isSubmitting }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      ref={backdropRef}
      onClick={onClose}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 transition-all duration-200 ease-out"
      style={{
        background: animating ? 'rgba(26,29,35,0.65)' : 'rgba(26,29,35,0)',
        backdropFilter: animating ? 'blur(3px)' : 'blur(0px)',
        WebkitBackdropFilter: animating ? 'blur(3px)' : 'blur(0px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] bg-white rounded-2xl p-6 font-sans"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          opacity: animating ? 1 : 0,
          transform: animating ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'opacity 200ms ease-out, transform 200ms ease-out',
        }}
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
    </div>
  );
}
