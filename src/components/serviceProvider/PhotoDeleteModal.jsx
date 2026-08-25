'use client';
import { useEffect, useState } from 'react';

export default function PhotoDeleteModal({ photoUrl, onCancel, onConfirm }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true));
    });
  }, []);

  function handleClose() {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      onCancel();
    }, 200);
  }

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      style={{
        background: animating ? 'rgba(26,29,35,0.65)' : 'rgba(26,29,35,0)',
        backdropFilter: animating ? 'blur(3px)' : 'blur(0px)',
        WebkitBackdropFilter: animating ? 'blur(3px)' : 'blur(0px)',
        transition: 'background 200ms ease-out, backdrop-filter 200ms ease-out, -webkit-backdrop-filter 200ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] bg-white rounded-2xl p-6 text-center font-sans"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          opacity: animating ? 1 : 0,
          transform: animating ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transition: 'opacity 200ms ease-out, transform 200ms ease-out',
        }}
      >
        <h3 className="font-syne text-[1.15rem] font-bold text-crewSlate mb-2">
          Remove Photo?
        </h3>
        <p className="text-[0.84rem] text-muted leading-relaxed mb-4">
          Are you sure you want to remove this project photo? This action cannot be undone.
        </p>

        {photoUrl && (
          <div className="mb-5 flex justify-center">
            <img
              src={photoUrl}
              alt="To be deleted"
              className="w-20 h-20 rounded-lg object-cover border border-black/12"
            />
          </div>
        )}

        <div className="flex gap-2.5 justify-center">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-black/15 bg-white text-crewSlate-light text-[0.84rem] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => { setAnimating(false); setTimeout(() => { setVisible(false); onConfirm(); }, 200); }}
            className="flex-1 py-2.5 px-4 rounded-lg border-none bg-[#B3261E] text-white text-[0.84rem] font-semibold cursor-pointer"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}
