'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import RequestServiceModal from '@/src/components/propertyOwner/RequestServiceModal';
import ReviewItem from '@/src/components/propertyOwner/ReviewItem';

// Mock service provider database using exact schema fields
const MOCK_PROVIDERS = {
  '1': {
    provider_id: 1,
    user_id: 101,
    name: 'Sunil Karunaratne',
    email: 'sunil.karunaratne@crewsync.lk',
    bio: 'Certified master mason with over 8 years of experience building solid foundations, retaining walls, and custom stone masonry in Sri Lanka. Dedicated to high architectural quality and safety standards.',
    experience_yr: 8,
    charge_per_day: 4500.00,
    avg_rating: 4.85,
    is_available: 1,
    willing_outside_region: 1,
    district: 'Kandy',
    initials: 'SK',
    avatarBg: '#FFF3E0',
    avatarColor: '#B85A00',
    skills: ['Masonry', 'Foundation', 'Brickwork'],
    reviews: [
      {
        id: 101,
        author: 'Nimal Jayasinghe',
        date: 'August 2, 2026',
        rating: 5,
        comment: 'Sunil and his crew did an amazing job on our home foundation in Kandy. Punctual, extremely skilled, and left the site spotless!',
        photos: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 102,
        author: 'Kamal Silva',
        date: 'July 18, 2026',
        rating: 5,
        comment: 'Great craftsmanship on the perimeter brick wall. Would definitely recommend Sunil for any masonry work!',
        photos: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 103,
        author: 'Priyantha Fernando',
        date: 'June 29, 2026',
        rating: 4,
        comment: 'Solid work, completed 1 day ahead of schedule. Very communicative team.',
        photos: [
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  },
  '2': {
    provider_id: 2,
    user_id: 102,
    name: 'Ruwan Perera',
    email: 'ruwan.perera@crewsync.lk',
    bio: 'Licensed industrial and residential electrician specializing in complete wiring, breaker panels, solar inverter hookups, and safety inspections.',
    experience_yr: 6,
    charge_per_day: 4000.00,
    avg_rating: 4.60,
    is_available: 1,
    willing_outside_region: 0,
    district: 'Colombo',
    initials: 'RP',
    avatarBg: '#E6F4EC',
    avatarColor: '#1B6E3A',
    skills: ['Electrical', 'Wiring', 'Solar Setup'],
    reviews: [
      {
        id: 201,
        author: 'Mahesh Bandara',
        date: 'July 28, 2026',
        rating: 5,
        comment: 'Fixed our main distribution board and rewired the ground floor. Excellent safety compliance and precise work.',
        photos: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  }
};

export default function StandaloneProviderProfilePage({ params }) {
  const resolvedParams = use(params);
  const providerIdStr = resolvedParams?.id;

  const provider = MOCK_PROVIDERS[providerIdStr] || {
    provider_id: Number(providerIdStr) || 1,
    user_id: 100 + (Number(providerIdStr) || 1),
    name: 'Service Provider #' + (providerIdStr || '1'),
    email: `provider${providerIdStr || '1'}@crewsync.lk`,
    bio: 'Experienced tradesperson offering high quality property construction and maintenance services.',
    experience_yr: 5,
    charge_per_day: 4200.00,
    avg_rating: 4.70,
    is_available: 1,
    willing_outside_region: 1,
    district: 'Colombo',
    initials: 'SP',
    avatarBg: '#E8F0FB',
    avatarColor: '#1A56A0',
    skills: ['General Trades', 'Maintenance'],
    reviews: [
      {
        id: 999,
        author: 'Verified Client',
        date: 'July 10, 2026',
        rating: 5,
        comment: 'Punctual, professional, and very thorough with the work!',
        photos: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  };

  const [copied, setCopied] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(provider.provider_id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-['DM_Sans']">
      {/* Top Header Navbar Only */}
      <Navbar variant="propertyOwnerDashboard" />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header Breadcrumbs / Back link */}
          <div className="flex items-center justify-between text-xs text-[#8A8FA8]">
            <Link href="/dashboard/propertyowner/services" className="hover:text-[#E8820C] flex items-center gap-1 font-medium">
              Back to Services
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center font-bold text-2xl md:text-3xl flex-shrink-0 shadow-inner"
                style={{ background: provider.avatarBg, color: provider.avatarColor }}
              >
                {provider.initials}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1A1D23]">{provider.name}</h1>
                    <p className="text-sm text-[#8A8FA8]">{provider.email}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-black/10">
                    <span className="text-[#E8820C] text-lg font-bold">★ {Number(provider.avg_rating).toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-sm text-[#4A5068] leading-relaxed pt-1">{provider.bio}</p>

                {/* Badges / Attributes */}
                <div className="flex flex-wrap gap-2 pt-3">
                  <span className="bg-[#FAF9F5] border border-black/10 text-xs px-2.5 py-1 rounded-md text-[#1A1D23] font-medium">
                    Experience: <strong>{provider.experience_yr} yrs</strong>
                  </span>
                  <span className="bg-[#FAF9F5] border border-black/10 text-xs px-2.5 py-1 rounded-md text-[#1A1D23] font-medium">
                    Rate: <strong>LKR {Number(provider.charge_per_day).toLocaleString()} / day</strong>
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${provider.is_available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {provider.is_available ? '● Available' : '○ Unavailable'}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${provider.willing_outside_region ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    Travel Outside Region: <strong>{provider.willing_outside_region ? 'Yes' : 'No'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-black/10">
              <button
                onClick={() => setRequestModalOpen(true)}
                className="flex-1 min-w-[150px] bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-center shadow-sm"
              >
                Request Service
              </button>
              <button
                onClick={handleCopyId}
                className="bg-white border border-black/10 hover:bg-[#F7F5F1] text-[#1A1D23] text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied ID!' : 'Copy ID'}
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1D23]">Client Reviews & Work Photos</h2>
              <span className="text-xs text-[#8A8FA8] bg-[#FAF9F5] px-2.5 py-1 rounded-md border border-black/10">
                {provider.reviews.length} {provider.reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="divide-y divide-black/10">
              {provider.reviews.map((rev) => (
                <ReviewItem key={rev.id} review={rev} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {requestModalOpen && (
        <RequestServiceModal
          provider={{
            providerId: provider.provider_id,
            name: provider.name,
            role: `${provider.skills?.join(', ') || 'Tradesperson'} · ${provider.district || 'N/A'}`
          }}
          onClose={() => setRequestModalOpen(false)}
        />
      )}
    </div>
  );
}
