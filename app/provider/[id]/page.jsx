'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/layout/Navbar';
import RequestServiceModal from '@/src/components/propertyOwner/RequestServiceModal';
import ReviewItem from '@/src/components/propertyOwner/ReviewItem';
import { fetchPublicProvider } from '@/src/api/providerApi';

const AVATAR_COLORS = [
  { avatarBg: '#FFF3E0', avatarColor: '#B85A00' },
  { avatarBg: '#E6F4EC', avatarColor: '#1B6E3A' },
  { avatarBg: '#E8F0FB', avatarColor: '#1A56A0' },
  { avatarBg: '#F0E8FB', avatarColor: '#6B3FA0' },
  { avatarBg: '#FCE8E8', avatarColor: '#B01E1E' },
  { avatarBg: '#FFF9E0', avatarColor: '#8A6D00' },
];

export default function StandaloneProviderProfilePage({ params }) {
  const resolvedParams = use(params);
  const providerId = Number(resolvedParams?.id);

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    fetchPublicProvider(providerId)
      .then((data) => {
        if (!active) return;
        const palette = AVATAR_COLORS[(data.provider.provider_id || providerId) % AVATAR_COLORS.length];
        setProvider({ ...data.provider, avatarBg: palette.avatarBg, avatarColor: palette.avatarColor });
        setError(null);
      })
      .catch((e) => {
        if (active) setError(e.message || 'Could not load this service provider.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [providerId]);

  const handleCopyId = () => {
    if (!provider) return;
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

          {loading ? (
            <div className="text-center p-8 bg-white border border-black/10 rounded-2xl text-sm text-[#8A8FA8]">
              Loading service provider...
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white border border-black/10 rounded-2xl text-sm text-[#C0392B]">
              {error}
            </div>
          ) : provider ? (
            <>
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

                {provider.reviews.length === 0 ? (
                  <p className="text-sm text-[#8A8FA8] text-center py-6">No reviews yet for this service provider.</p>
                ) : (
                  <div className="divide-y divide-black/10">
                    {provider.reviews.map((rev) => (
                      <ReviewItem key={rev.id} review={rev} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>

      {requestModalOpen && provider && (
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
