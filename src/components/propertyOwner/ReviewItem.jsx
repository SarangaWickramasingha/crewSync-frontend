'use client';

import { useState } from 'react';

function ReviewPhotoCarousel({ photos }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!photos || photos.length === 0) return null;

  const nextPhoto = () => {
    setActiveIdx((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="mt-3">
      <div className="relative w-full h-64 md:h-80 bg-black/5 rounded-lg overflow-hidden flex items-center justify-center border border-black/10 group">
        <img
          src={photos[activeIdx]}
          alt={`Review photo ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
              title="Previous photo"
            >
              ❮
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
              title="Next photo"
            >
              ❯
            </button>

            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md font-mono">
              {activeIdx + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {photos.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-14 h-14 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                activeIdx === idx ? 'border-[#E8820C] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewItem({ review }) {
  const { author, name, rating, comment, text, date, photos } = review || {};
  const reviewerName = author || name || 'Anonymous Client';
  const descriptionText = comment || text || '';
  const starRating = rating || 5;

  return (
    <div className="py-4">
      {/* Name of reviewer & date */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="font-semibold text-[#1A1D23] text-sm">{reviewerName}</div>
        {date && <div className="text-xs text-[#8A8FA8]">{date}</div>}
      </div>

      {/* Stars */}
      <div className="text-[#E8820C] text-sm mb-2">
        {'★'.repeat(starRating)}{'☆'.repeat(5 - starRating)}
      </div>

      {/* Description */}
      <p className="text-sm text-[#4A5068] leading-relaxed mb-2">{descriptionText}</p>

      {/* Photos */}
      <ReviewPhotoCarousel photos={photos} />
    </div>
  );
}
