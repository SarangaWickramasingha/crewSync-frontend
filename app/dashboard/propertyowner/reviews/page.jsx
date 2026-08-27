'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import ReviewCard from '@/src/components/propertyOwner/ReviewCard';
import WriteReviewModal from '@/src/components/propertyOwner/WriteReviewModal';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    avatarInitials: 'SK',
    avatarBg: '#FFF3E0',
    avatarColor: '#B85A00',
    name: 'Sunil Karunaratne – Mason',
    rating: 5,
    badge: { label: 'Your Review', variant: 'green' },
    date: 'Posted April 5, 2026',
    text: 'Excellent work on the foundation. Very professional and completed everything on time. Highly recommended for any masonry work in the Kandy region.',
  },
  {
    id: 2,
    avatarInitials: 'RP',
    avatarBg: '#E6F4EC',
    avatarColor: '#1B6E3A',
    name: 'Ruwan Perera – Electrician',
    rating: 4,
    date: 'Posted April 28, 2026',
    text: 'Good work overall. A bit delayed by 2 days but communicated well. Would hire again for the finishing task electrical work.',
  },
];

export default function PropertyOwnerReviewsPage() {
  const { addNotification } = useTasks();
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crewsync_reviews');
      if (saved) {
        try {
          setReviews(JSON.parse(saved));
        } catch (e) {
          setReviews(DEFAULT_REVIEWS);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save reviews to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crewsync_reviews', JSON.stringify(reviews));
    }
  }, [reviews, isLoaded]);

  function handleAddReview(newReview) {
    // Generate initials & color for avatar
    const words = newReview.name.split(' ');
    const initials = words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
    
    // Choose color based on provider name
    const colors = [
      { bg: '#E8F0FB', color: '#1A56A0' },
      { bg: '#FFF3E0', color: '#B85A00' },
      { bg: '#E6F4EC', color: '#1B6E3A' },
      { bg: '#F0E8FB', color: '#6B3FA0' },
    ];
    const colorCfg = colors[newReview.name.length % colors.length];

    const reviewObj = {
      id: Date.now(),
      avatarInitials: initials,
      avatarBg: colorCfg.bg,
      avatarColor: colorCfg.color,
      name: newReview.name,
      rating: newReview.rating,
      date: newReview.date,
      text: newReview.text,
      badge: { label: 'Your Review', variant: 'green' },
    };

    setReviews(prev => [reviewObj, ...prev]);
    setIsWriteOpen(false);
    addNotification(`Review submitted for <strong>${newReview.name}</strong>`);
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

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
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
        ))}
      </div>

      {isWriteOpen && (
        <WriteReviewModal
          onClose={() => setIsWriteOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}