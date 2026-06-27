import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import ReviewCard from '@/Components/dashboard/propertyOwner/ReviewCard';

export default function PropertyOwnerReviewsPage() {
  return (
    <div>
      <DashHeader
        title="Ratings & Reviews"
        subtitle="Your feedback helps the community"
        action={
          <button className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors">
            + Write Review
          </button>
        }
      />

      <ReviewCard
        avatarInitials="SK"
        avatarBg="#FFF3E0"
        avatarColor="#B85A00"
        name="Sunil Karunaratne – Mason"
        rating={5}
        badge={{ label: 'Your Review', variant: 'green' }}
        date="Posted April 5, 2026"
        text="Excellent work on the foundation. Very professional and completed everything on time. Highly recommended for any masonry work in the Kandy region."
      />

      <ReviewCard
        avatarInitials="RP"
        avatarBg="#E6F4EC"
        avatarColor="#1B6E3A"
        name="Ruwan Perera – Electrician"
        rating={4}
        date="Posted April 28, 2026"
        text="Good work overall. A bit delayed by 2 days but communicated well. Would hire again for the finishing phase electrical work."
      />
    </div>
  );
}