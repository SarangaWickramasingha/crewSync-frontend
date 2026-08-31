'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import ReviewCard from '@/src/components/propertyOwner/ReviewCard';
import WriteReviewModal from '@/src/components/propertyOwner/WriteReviewModal';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';
import { reviewApi } from '@/src/api';

const AVATAR_COLORS = [
  { bg: '#FFF3E0', color: '#B85A00' },
  { bg: '#E6F4EC', color: '#1B6E3A' },
  { bg: '#E8F0FB', color: '#1A56A0' },
  { bg: '#F0E8FB', color: '#6B3FA0' },
];

export default function PropertyOwnerReviewsPage() {
  const { addNotification } = useTasks();
  const [reviews, setReviews] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the owner's own reviews + the providers assigned to their project tasks
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [reviewsData, providersData] = await Promise.all([
          reviewApi.fetchMyReviews(),
          reviewApi.fetchAssignedProviders(),
        ]);

        if (!active) return;

        const mapped = (reviewsData.reviews || []).map((r) => {
          const colorCfg = AVATAR_COLORS[r.provider_id % AVATAR_COLORS.length];
          const words = (r.name || '').split(' ');
          const initials = words.map((w) => w[0]).join('').substring(0, 2).toUpperCase() || 'RP';
          return {
            id: r.review_id,
            avatarInitials: initials,
            avatarBg: colorCfg.bg,
            avatarColor: colorCfg.color,
            name: r.name,
            rating: r.rating,
            badge: { label: 'Your Review', variant: 'green' },
            date: r.date,
            text: r.comment,
          };
        });

        setReviews(mapped);
        setProviders(providersData.providers || []);
        setError(null);
      } catch (e) {
        if (active) {
          setError(e.message || 'Could not load your reviews.');
          setReviews([]);
          setProviders([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleAddReview(newReview) {
    try {
      const data = await reviewApi.createReview({
        provider_id: newReview.provider_id,
        rating: newReview.rating,
        comment: newReview.text,
      });

      const colorCfg = AVATAR_COLORS[(newReview.provider_id || 0) % AVATAR_COLORS.length];
      const words = (newReview.name || '').split(' ');
      const initials = words.map((w) => w[0]).join('').substring(0, 2).toUpperCase() || 'RP';

      const reviewObj = {
        id: data.review_id || Date.now(),
        avatarInitials: initials,
        avatarBg: colorCfg.bg,
        avatarColor: colorCfg.color,
        name: newReview.name,
        rating: newReview.rating,
        badge: { label: 'Your Review', variant: 'green' },
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        text: newReview.text,
      };

      setReviews((prev) => [reviewObj, ...prev]);
      setIsWriteOpen(false);
      addNotification(`Review submitted for <strong>${newReview.name}</strong>`);
    } catch (e) {
      setError(e.message || 'Could not submit your review.');
    }
  }

  return (
    <div>
      <DashHeader
        title="Ratings & Reviews"
        subtitle="Your feedback helps the community"
        action={
          <button
            onClick={() => setIsWriteOpen(true)}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            + Write Review
          </button>
        }
      />

      {loading ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          Loading your reviews...
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#C0392B]">
          {error}
        </div>
      ) : (
        <>
          {providers.length === 0 && (
            <div className="mb-4 p-4 bg-[#FFF8EC] border border-[#E8820C]/20 rounded-xl text-sm text-[#8A5A00]">
              You can review service providers assigned to a task on your projects. No assigned providers found yet.
            </div>
          )}

          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
                You haven&apos;t written any reviews yet.
              </div>
            ) : (
              reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  avatarInitials={r.avatarInitials}
                  avatarBg={r.avatarBg}
                  avatarColor={r.avatarColor}
                  name={r.name}
                  rating={r.rating}
                  badge={r.badge}
                  date={r.date}
                  text={r.text}
                />
              ))
            )}
          </div>
        </>
      )}

      {isWriteOpen && (
        <WriteReviewModal
          providers={providers}
          onClose={() => setIsWriteOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}