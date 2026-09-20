'use client';
import { useState } from 'react';
import { useAllReviews, useDeleteReviewPhoto } from '@/src/hooks/provider/useProvider';
import ReviewCard from './ReviewCard';
import PhotoDeleteModal from './PhotoDeleteModal';
import { C, getPhotoUrl } from './reviewUtils';

export default function ReviewsSection() {
  const [lightbox, setLightbox] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletedPhotos, setDeletedPhotos] = useState({});
  const [localAddedPhotos, setLocalAddedPhotos] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('crewsync_provider_review_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const { data, isLoading, isError, error } = useAllReviews();
  const deletePhoto = useDeleteReviewPhoto();

  const rawReviews = data?.reviews || (Array.isArray(data) ? data : []);
  const reviews = rawReviews.map((r, i) => {
    const id = r.id || r.review_id || i + 1;
    const name = r.name || r.reviewer_name || r.author || r.client || 'Property Owner';
    const stars = Math.max(1, Math.min(5, Number(r.stars ?? r.rating ?? 5)));
    const text = r.text || r.comment || r.content || '';
    const date = r.date || r.posted_at || r.created_at || 'Recently';

    const apiPhotos = Array.isArray(r.photos)
      ? r.photos.map((p, idx) => (typeof p === 'string' ? { photo_id: idx + 1, url: p } : p))
      : [];

    // Only include local photos if they aren't already represented in apiPhotos
    const userAdded = (localAddedPhotos[id] || []).filter(
      lp => !apiPhotos.some(ap => ap.url === lp.url)
    );

    // Combine and deduplicate
    const combined = [...apiPhotos, ...userAdded].filter(
      p => !deletedPhotos[p.photo_id ?? p.id ?? p]
    );

    // Deduplicate by URL
    const seenUrls = new Set();
    const photos = [];
    for (const p of combined) {
      const resolvedUrl = getPhotoUrl(p.url || p.path || p.image_path);
      if (!seenUrls.has(resolvedUrl)) {
        seenUrls.add(resolvedUrl);
        photos.push({ ...p, url: resolvedUrl });
      }
    }

    return { ...r, id, name, stars, text, date, photos };
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : '0.0';

  function handleUploadComplete(reviewId) {
    setLocalAddedPhotos(prev => {
      const updated = { ...prev };
      delete updated[reviewId];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('crewsync_provider_review_photos', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }

  // Removing an already-saved photo
  async function removeSavedPhoto(reviewId, photoId) {
    setDeletedPhotos(prev => ({ ...prev, [photoId]: true }));
    setLocalAddedPhotos(prev => {
      if (!prev[reviewId]) return prev;
      const filtered = prev[reviewId].filter(p => p.photo_id !== photoId);
      const updated = { ...prev, [reviewId]: filtered };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('crewsync_provider_review_photos', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    try {
      await deletePhoto.mutateAsync(photoId);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Loading reviews…</div>;
  }

  if (isError) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#B3261E', fontFamily: "'DM Sans', sans-serif" }}>Failed to load reviews: {error?.message || 'Unknown error'}</div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>Ratings and Reviews</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Feedback from property owners — add photos of the completed job</p>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '10px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: C.slate }}>{avgRating} ★</div>
          <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: '1px' }}>{reviews.length} reviews</div>
        </div>
      </div>

      {reviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontSize: '0.9rem' }}>No reviews yet.</div>
      )}

      {reviews.map((r, idx) => (
        <ReviewCard
          key={r.id}
          review={r}
          index={idx}
          onViewPhoto={setLightbox}
          onRequestDelete={(reviewId, photoId, photoUrl) => setConfirmDelete({ reviewId, photoId, photoUrl })}
          onUploadComplete={handleUploadComplete}
        />
      ))}

      {/* Confirmation Modal Before Removing Photo */}
      {confirmDelete && (
        <PhotoDeleteModal
          photoUrl={confirmDelete.photoUrl}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            const { reviewId, photoId } = confirmDelete;
            setConfirmDelete(null);
            await removeSavedPhoto(reviewId, photoId);
          }}
        />
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,29,35,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '2rem', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="Full size project image" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '28px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '38px', height: '38px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer' }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}