'use client';

export default function ServiceProviderCard({ provider, isGuest, onRequestClick, onSeeReviewsClick }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mb-3" style={{ background: provider.avatarBg, color: provider.avatarColor }}>
        {provider.initials}
      </div>
      <div className="text-sm font-bold">{provider.name}</div>
      <div className="text-xs text-[#8A8FA8] mb-2">{provider.role}</div>
      <div className="text-sm mb-1">
        <span className="text-[#E8820C]">{'★'.repeat(provider.rating)}{'☆'.repeat(5 - provider.rating)}</span>
        {' '}
        <span className="text-[#8A8FA8] text-xs">{provider.rating}.0 ({provider.reviewCount} reviews)</span>
      </div>
      <div className="text-xs text-[#8A8FA8]">{provider.location}</div>
      <div className="text-sm font-semibold text-[#B85A00] mt-2">{provider.price}</div>
      <div className="grid gap-2 mt-2.5">
        <button
          className="w-full bg-[#E8820C] hover:opacity-85 text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
          onClick={() => onRequestClick(provider, isGuest)}
        >
          Request
        </button>
        <button
          className="w-full bg-white border border-black/10 text-[#1A1D23] text-xs font-semibold py-2 rounded-md transition-colors hover:bg-[#F7F5F1] cursor-pointer"
          onClick={() => onSeeReviewsClick(provider)}
        >
          See reviews
        </button>
      </div>
    </div>
  );
}
