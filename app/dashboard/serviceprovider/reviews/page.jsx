"use client";
import { useState, useEffect } from "react";
import { API_PROVIDER_ALL_REVIEWS, API_REVIEW_PHOTOS_UPLOAD, API_REVIEW_PHOTO_DELETE } from "@/config/api";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const AVATAR_STYLES = [
  { bg: '#FFF3E0', color: '#B85A00' },
  { bg: '#E8F0FB', color: '#1A56A0' },
  { bg: '#E6F4EC', color: '#1B6E3A' },
];

function initialsOf(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState({});
  const [reportText, setReportText] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({}); // { reviewId: File[] }
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(API_PROVIDER_ALL_REVIEWS, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (isMounted && data.success) setReviews(data.reviews);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReviews();
    return () => { isMounted = false; };
  }, []);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : '0.0';

  // Stage newly picked files locally — nothing sent to the server yet
function handlePickPhotos(id, files) {
  if (process.env.NODE_ENV === 'development') console.log('photos picked:', files?.length);
  if (!files || !files.length) return;
  setPendingFiles(prev => ({
    ...prev,
    [id]: [...(prev[id] || []), ...Array.from(files)],
  }));
}

  function removePendingPhoto(id, index) {
    setPendingFiles(prev => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  }

  // "Update" — actually uploads all staged photos for this review
  async function handleUpdate(id) {
    const files = pendingFiles[id] || [];
    if (files.length === 0) return;

    setSavingId(id);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('photos[]', file));

      const res = await fetch(API_REVIEW_PHOTOS_UPLOAD(id), {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, photos: [...r.photos, ...data.photos] } : r));
        setPendingFiles(prev => ({ ...prev, [id]: [] }));
      } else {
        alert(data.message || 'Failed to save photos.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach the server. Please try again.');
    } finally {
      setSavingId(null);
    }
  }

  // Removing an already-saved photo still deletes immediately
  async function removeSavedPhoto(reviewId, photoId) {
    try {
      const res = await fetch(API_REVIEW_PHOTO_DELETE(photoId), { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, photos: r.photos.filter(p => p.photo_id !== photoId) } : r));
      }
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
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reported: true } : r));
    setReportText(prev => ({ ...prev, [id]: '' }));
    setReportOpen(prev => ({ ...prev, [id]: false }));
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Loading reviews…</div>;
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
        return (
          <div key={r.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.2rem', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', background: avatar.bg, color: avatar.color, flexShrink: 0 }}>
                {initialsOf(r.name)}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{r.name}</div>
                <div style={{ color: C.amber, fontSize: '0.85rem' }}>{'★'.repeat(r.stars)}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>{r.date}</div>
            </div>

            <div style={{ fontSize: '0.84rem', color: C.slateLight, lineHeight: 1.6 }}>"{r.text}"</div>

            {r.reported && (
              <div style={{ marginTop: '0.7rem', padding: '0.5rem 0.8rem', background: '#FDECEC', borderRadius: '8px', fontSize: '0.75rem', color: '#B3261E', fontWeight: 600 }}>
                🚩 Reported to admin
              </div>
            )}

            <div style={{ marginTop: '0.8rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                Project Images
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {/* Already saved photos */}
                {r.photos.map((photo) => (
                  <div key={photo.photo_id} style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <img src={photo.url} alt="Project" onClick={() => setLightbox(photo.url)}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', border: `1px solid ${C.border}`, objectFit: 'cover', cursor: 'pointer', display: 'block' }} />
                    <button onClick={() => removeSavedPhoto(r.id, photo.photo_id)} title="Remove photo"
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B3261E', color: '#fff', border: '2px solid #fff', fontSize: '0.65rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}

                {/* Staged, not-yet-uploaded photos */}
                {staged.map((file, i) => (
                  <div key={i} style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <img src={URL.createObjectURL(file)} alt="Pending upload"
                      style={{ width: '64px', height: '64px', borderRadius: '8px', border: `2px dashed ${C.amber}`, objectFit: 'cover', display: 'block', opacity: 0.75 }} />
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
                <div style={{ fontSize: '0.72rem', color: C.amberDark, marginTop: '6px' }}>
                  {staged.length} photo{staged.length > 1 ? 's' : ''} not saved yet — click Update to save.
                </div>
              )}
            </div>

            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleUpdate(r.id)}
                disabled={staged.length === 0 || savingId === r.id}
                style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: (staged.length === 0 || savingId === r.id) ? 'not-allowed' : 'pointer', opacity: (staged.length === 0 || savingId === r.id) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                {savingId === r.id ? 'Saving…' : 'Update'}
              </button>
              {!r.reported && (
                <button onClick={() => toggleReport(r.id)}
                  style={{ background: 'none', color: '#B3261E', border: '1px solid rgba(179,38,30,0.35)', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  🚩 Report
                </button>
              )}
            </div>

            {reportOpen[r.id] && !r.reported && (
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