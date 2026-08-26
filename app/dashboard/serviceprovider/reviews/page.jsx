"use client";
import { useState, useEffect } from "react";
import {
  useAllReviews,
  useUploadReviewPhotos,
  useDeleteReviewPhoto,
} from "@/src/hooks/provider/useProvider";
import PhotoDeleteModal from "@/src/components/serviceProvider/PhotoDeleteModal";

const C = {
  blue: '#2563eb', blueLight: '#dbeafe', blueDark: '#1d4ed8',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const AVATAR_STYLES = [
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#E6F4EC', color: '#1B6E3A' },
  { bg: '#FFF3E0', color: '#B85A00' },
];

function initialsOf(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getPhotoUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('http://localhost/') && !url.includes(':8080')) {
    url = url.replace('http://localhost/', 'http://localhost:8080/');
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseHost = 'http://localhost:8080/CrewSync-backend/backend/uploads';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseHost}${cleanPath}`;
}

export default function ReviewsPage() {
  const [reportOpen, setReportOpen] = useState({});
  const [reportText, setReportText] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({}); // { [reviewId]: [{ id, file, previewUrl }] }
  const [reportedIds, setReportedIds] = useState({}); // { reviewId: true } — UI-only flag
  const [deletedPhotos, setDeletedPhotos] = useState({}); // { photoId: true }
  const [localAddedPhotos, setLocalAddedPhotos] = useState({}); // { [reviewId]: [{ photo_id, url }] }
  const [confirmDelete, setConfirmDelete] = useState(null); // { reviewId, photoId, photoUrl }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crewsync_provider_review_photos');
        if (saved) setLocalAddedPhotos(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const { data, isLoading, isError, error } = useAllReviews();
  const uploadPhotos = useUploadReviewPhotos();
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

  // Stage newly picked files with immediate dataUrl preview
  async function handlePickPhotos(id, files) {
    if (!files || !files.length) return;
    const fileArray = Array.from(files);
    const newItems = await Promise.all(
      fileArray.map(async (file, idx) => {
        const previewUrl = await fileToDataUrl(file);
        return {
          id: `pending-${Date.now()}-${idx}`,
          file,
          previewUrl,
        };
      })
    );

    setPendingFiles(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), ...newItems],
    }));
  }

  function removePendingPhoto(id, index) {
    setPendingFiles(prev => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  }

  // "Update" — persists photos locally & syncs to backend
  async function handleUpdate(id) {
    const staged = pendingFiles[id] || [];
    if (staged.length === 0) return;

    try {
      // Clear staged files immediately
      setPendingFiles(prev => ({ ...prev, [id]: [] }));

      // Send multipart form data to PHP backend
      const formData = new FormData();
      staged.forEach(item => {
        formData.append('photos[]', item.file);
        formData.append('images[]', item.file);
      });
      formData.append('review_id', id);

      await uploadPhotos.mutateAsync({ reviewId: id, formData });

      // Clean local cache for this review since server is now updated
      setLocalAddedPhotos(prev => {
        const updated = { ...prev };
        delete updated[id];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('crewsync_provider_review_photos', JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save photos.');
    }
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
        } catch (e) {}
      }
      return updated;
    });

    try {
      await deletePhoto.mutateAsync(photoId);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleReport(id) {
    setReportOpen(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function submitReport(id) {
    // TODO: wire to backend endpoint once report feature is built
    const txt = (reportText[id] || '').trim();
    if (!txt) return;
    setReportedIds(prev => ({ ...prev, [id]: true }));
    setReportText(prev => ({ ...prev, [id]: '' }));
    setReportOpen(prev => ({ ...prev, [id]: false }));
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

      {reviews.map((r, idx) => {
        const avatar = AVATAR_STYLES[idx % AVATAR_STYLES.length];
        const staged = pendingFiles[r.id] || [];
        const savedPhotos = Array.isArray(r.photos) ? r.photos : [];
        return (
          <div key={r.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.2rem', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', background: avatar.bg, color: avatar.color, flexShrink: 0 }}>
                {initialsOf(r.name)}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{r.name}</div>
                <div style={{ color: C.blue, fontSize: '0.85rem' }}>{'★'.repeat(r.stars)}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>{r.date}</div>
            </div>

            <div style={{ fontSize: '0.84rem', color: C.slateLight, lineHeight: 1.6 }}>&ldquo;{r.text}&rdquo;</div>

            {reportedIds[r.id] && (
              <div style={{ marginTop: '0.7rem', padding: '0.5rem 0.8rem', background: '#FDECEC', borderRadius: '8px', fontSize: '0.75rem', color: '#B3261E', fontWeight: 600 }}>
                🚩 Reported to admin
              </div>
            )}

            <div style={{ marginTop: '0.8rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                Project Images
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {/* Already saved photos */}
                {savedPhotos.map((photo) => (
                  <div key={photo.photo_id} style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <img src={photo.url} alt="Project" onClick={() => setLightbox(photo.url)}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', border: `1px solid ${C.border}`, objectFit: 'cover', cursor: 'pointer', display: 'block' }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete({ reviewId: r.id, photoId: photo.photo_id, photoUrl: photo.url }); }}
                      title="Remove photo"
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B3261E', color: '#fff', border: '2px solid #fff', fontSize: '0.65rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Staged, not-yet-uploaded photos preview */}
                {staged.map((item, i) => (
                  <div key={item.id || i} style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <img src={item.previewUrl} alt="Pending upload"
                      style={{ width: '64px', height: '64px', borderRadius: '8px', border: `2px dashed ${C.blue}`, objectFit: 'cover', display: 'block' }} />
                    <button onClick={() => removePendingPhoto(r.id, i)} title="Remove"
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B3261E', color: '#fff', border: '2px solid #fff', fontSize: '0.65rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}

                <input id={`job-photo-input-${r.id}`} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => { handlePickPhotos(r.id, e.target.files); e.target.value = ''; }} />
                <label htmlFor={`job-photo-input-${r.id}`} title="Add project images"
                  style={{ width: '64px', height: '64px', borderRadius: '8px', border: `1.5px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: C.muted, fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif" }}>
                  <span>📷</span>
                  <span style={{ fontSize: '0.6rem', marginTop: '2px' }}>Add</span>
                </label>
              </div>
              {staged.length > 0 && (
                <div style={{ fontSize: '0.72rem', color: C.blueDark, marginTop: '6px' }}>
                  {staged.length} photo{staged.length > 1 ? 's' : ''} staged — click <strong>Update</strong> below to save.
                </div>
              )}
            </div>

            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleUpdate(r.id)}
                disabled={staged.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === r.id)}
                style={{ background: C.blue, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: (staged.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === r.id)) ? 'not-allowed' : 'pointer', opacity: (staged.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === r.id)) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                {uploadPhotos.isPending && uploadPhotos.variables?.reviewId === r.id ? 'Saving…' : 'Update'}
              </button>
              {!reportedIds[r.id] && (
                <button onClick={() => toggleReport(r.id)}
                  style={{ background: 'none', color: '#B3261E', border: '1px solid rgba(179,38,30,0.35)', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  🚩 Report
                </button>
              )}
            </div>

            {reportOpen[r.id] && !reportedIds[r.id] && (
              <div style={{ marginTop: '0.6rem', padding: '0.8rem', background: '#FDECEC', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B3261E', marginBottom: '6px' }}>Report this review to admin</div>
                <textarea value={reportText[r.id] || ''} onChange={e => setReportText(prev => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Explain why you're reporting this review…" rows={2}
                  style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C.slate, resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => submitReport(r.id)}
                    style={{ background: '#B3261E', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                    Submit Report
                  </button>
                  <button onClick={() => toggleReport(r.id)}
                    style={{ background: 'none', color: C.muted, border: `1px solid ${C.border}`, padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

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