'use client';
import { useState } from 'react';
import { useUploadReviewPhotos, useReportReview } from '@/src/hooks/provider/useProvider';
import { C, AVATAR_STYLES, initialsOf, fileToDataUrl } from './reviewUtils';

export default function ReviewCard({ review, index, onViewPhoto, onRequestDelete, onUploadComplete }) {
  const avatar = AVATAR_STYLES[index % AVATAR_STYLES.length];
  const [pendingFiles, setPendingFiles] = useState([]);
  const [reportedIds, setReportedIds] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const savedReports = localStorage.getItem('crewsync_reported_reviews');
      return savedReports ? JSON.parse(savedReports) : {};
    } catch {
      return {};
    }
  });
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const uploadPhotos = useUploadReviewPhotos();
  const reportReviewMutation = useReportReview();

  const savedPhotos = Array.isArray(review.photos) ? review.photos : [];
  const reported = reportedIds[review.id];

  async function handlePickPhotos(files) {
    if (!files || !files.length) return;
    const fileArray = Array.from(files);
    const newItems = await Promise.all(
      fileArray.map(async (file, idx) => {
        const previewUrl = await fileToDataUrl(file);
        return { id: `pending-${Date.now()}-${idx}`, file, previewUrl };
      })
    );
    setPendingFiles(prev => [...prev, ...newItems]);
  }

  function removePendingPhoto(index) {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleUpdate() {
    if (pendingFiles.length === 0) return;
    try {
      setPendingFiles([]);

      const formData = new FormData();
      pendingFiles.forEach(item => {
        formData.append('photos[]', item.file);
        formData.append('images[]', item.file);
      });
      formData.append('review_id', review.id);

      await uploadPhotos.mutateAsync({ reviewId: review.id, formData });
      onUploadComplete?.(review.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save photos.');
    }
  }

  function handleRequestDelete(photoId, photoUrl) {
    onRequestDelete(review.id, photoId, photoUrl);
  }

  function toggleReport() {
    setReportOpen(prev => !prev);
  }

  async function submitReport() {
    const txt = reportText.trim();
    if (!txt) return;

    try {
      await reportReviewMutation.mutateAsync({
        reviewId: review.id,
        message: txt,
        reviewerName: review.name,
      });

      setReportedIds(prev => {
        const next = { ...prev, [review.id]: true };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('crewsync_reported_reviews', JSON.stringify(next));
          } catch {}
        }
        return next;
      });
      setReportText('');
      setReportOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit report.');
    }
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.2rem', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', background: avatar.bg, color: avatar.color, flexShrink: 0 }}>
          {initialsOf(review.name)}
        </div>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{review.name}</div>
          <div style={{ color: C.blue, fontSize: '0.85rem' }}>{'★'.repeat(review.stars)}</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>{review.date}</div>
      </div>

      <div style={{ fontSize: '0.84rem', color: C.slateLight, lineHeight: 1.6 }}>&ldquo;{review.text}&rdquo;</div>

      {reported && (
        <div style={{ marginTop: '0.7rem', padding: '0.5rem 0.8rem', background: '#FDECEC', borderRadius: '8px', fontSize: '0.75rem', color: '#B3261E', fontWeight: 600 }}>
          🚩 Reported to admin
        </div>
      )}

      <div style={{ marginTop: '0.8rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
          Project Images
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {savedPhotos.map((photo) => (
            <div key={photo.photo_id} style={{ position: 'relative', width: '64px', height: '64px' }}>
              <img src={photo.url} alt="Project" onClick={() => onViewPhoto(photo.url)}
                style={{ width: '64px', height: '64px', borderRadius: '8px', border: `1px solid ${C.border}`, objectFit: 'cover', cursor: 'pointer', display: 'block' }} />
              <button
                onClick={(e) => { e.stopPropagation(); handleRequestDelete(photo.photo_id, photo.url); }}
                title="Remove photo"
                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B3261E', color: '#fff', border: '2px solid #fff', fontSize: '0.65rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>
          ))}

          {pendingFiles.map((item, i) => (
            <div key={item.id || i} style={{ position: 'relative', width: '64px', height: '64px' }}>
              <img src={item.previewUrl} alt="Pending upload"
                style={{ width: '64px', height: '64px', borderRadius: '8px', border: `2px dashed ${C.blue}`, objectFit: 'cover', display: 'block' }} />
              <button onClick={() => removePendingPhoto(i)} title="Remove"
                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#B3261E', color: '#fff', border: '2px solid #fff', fontSize: '0.65rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}

          <input id={`job-photo-input-${review.id}`} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { handlePickPhotos(e.target.files); e.target.value = ''; }} />
          <label htmlFor={`job-photo-input-${review.id}`} title="Add project images"
            style={{ width: '64px', height: '64px', borderRadius: '8px', border: `1.5px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: C.muted, fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif" }}>
            <span>📷</span>
            <span style={{ fontSize: '0.6rem', marginTop: '2px' }}>Add</span>
          </label>
        </div>
        {pendingFiles.length > 0 && (
          <div style={{ fontSize: '0.72rem', color: C.blueDark, marginTop: '6px' }}>
            {pendingFiles.length} photo{pendingFiles.length > 1 ? 's' : ''} staged — click <strong>Update</strong> below to save.
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '8px' }}>
        <button
          onClick={handleUpdate}
          disabled={pendingFiles.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === review.id)}
          style={{ background: C.blue, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: (pendingFiles.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === review.id)) ? 'not-allowed' : 'pointer', opacity: (pendingFiles.length === 0 || (uploadPhotos.isPending && uploadPhotos.variables?.reviewId === review.id)) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
          {uploadPhotos.isPending && uploadPhotos.variables?.reviewId === review.id ? 'Saving…' : 'Update'}
        </button>
        {!reported ? (
          <button onClick={toggleReport}
            style={{ background: 'none', color: '#B3261E', border: '1px solid rgba(179,38,30,0.35)', padding: '8px 14px', borderRadius: C.radiusSm, fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
            🚩 Report
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#B3261E', fontWeight: 600, display: 'inline-flex', alignItems: 'center', padding: '8px 4px', gap: '4px' }}>
            ✓ Reported to Admin
          </span>
        )}
      </div>

      {reportOpen && !reported && (
        <div style={{ marginTop: '0.6rem', padding: '0.8rem', background: '#FDECEC', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B3261E', marginBottom: '6px' }}>Report this review to admin</div>
          <textarea value={reportText} onChange={e => setReportText(e.target.value)}
            placeholder="Explain why you're reporting this review…" rows={2}
            style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C.slate, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              onClick={submitReport}
              disabled={reportReviewMutation.isPending && reportReviewMutation.variables?.reviewId === review.id}
              style={{ background: '#B3261E', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: (reportReviewMutation.isPending && reportReviewMutation.variables?.reviewId === review.id) ? 'wait' : 'pointer', opacity: (reportReviewMutation.isPending && reportReviewMutation.variables?.reviewId === review.id) ? 0.6 : 1 }}>
              {reportReviewMutation.isPending && reportReviewMutation.variables?.reviewId === review.id ? 'Submitting…' : 'Submit Report'}
            </button>
            <button onClick={toggleReport}
              style={{ background: 'none', color: C.muted, border: `1px solid ${C.border}`, padding: '7px 14px', borderRadius: C.radiusSm, fontSize: '0.76rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}