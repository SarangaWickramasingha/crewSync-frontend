'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import RequestServiceModal from '@/src/components/propertyOwner/RequestServiceModal';
import ServiceProviderCard from '@/src/components/propertyOwner/ServiceProviderCard';
import { useAuth } from '@/context/AuthContext';
import { searchProviders } from '@/src/api/searchApi';
import { fetchUnassignedTasks } from '@/src/api/taskApi';
import { SKILL_NAME_TO_ID } from '@/constants/registerMaps';
import { DISTRICTS } from '@/constants/districts';

const AVATAR_COLORS = [
  { avatarBg: '#FFF3E0', avatarColor: '#B85A00' },
  { avatarBg: '#E6F4EC', avatarColor: '#1B6E3A' },
  { avatarBg: '#E8F0FB', avatarColor: '#1A56A0' },
  { avatarBg: '#F0E8FB', avatarColor: '#6B3FA0' },
  { avatarBg: '#FCE8E8', avatarColor: '#B01E1E' },
  { avatarBg: '#FFF9E0', avatarColor: '#8A6D00' },
];

function mapProvider(p) {
  const palette = AVATAR_COLORS[p.provider_id % AVATAR_COLORS.length];
  const skillLabel = p.skills && p.skills.length ? p.skills.join(', ') : 'General';
  return {
    providerId: p.provider_id,
    initials: p.initials,
    avatarBg: palette.avatarBg,
    avatarColor: palette.avatarColor,
    name: p.name,
    role: `${skillLabel} · ${p.district || 'N/A'} District`,
    rating: Math.round(p.rating),
    reviewCount: p.review_count,
    location: p.district || 'Not specified',
    contactNo: p.contact_no || '+94 77 123 4567',
    price: p.daily_rate != null ? `LKR ${Number(p.daily_rate).toLocaleString()} / day` : 'Rate on request',
  };
}

export default function PropertyOwnerServicesPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const [requesting, setRequesting] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Colombo');
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [selectedRatingRange, setSelectedRatingRange] = useState('all');
  const [providers, setProviders] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const loadProviders = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const params = {};
      if (searchVal.trim()) params.q = searchVal.trim();
      if (selectedDistrict !== 'All Districts') params.district = selectedDistrict;
      if (selectedSkillId) params.skill_id = selectedSkillId;
      if (selectedRatingRange !== 'all') {
        const ranges = {
          '5':     { min: 5.0, max: 5.0 },
          '4.5-5': { min: 4.5, max: 5.0 },
          '4-4.5': { min: 4.0, max: 4.5 },
          '3.5-4': { min: 3.5, max: 4.0 },
          'below3.5': { min: 0, max: 3.5 },
        };
        const range = ranges[selectedRatingRange];
        if (range) {
          params.min_rating = range.min;
          params.max_rating = range.max;
        }
      }
      const result = await searchProviders(params);
      setProviders(result.map(mapProvider));
    } catch (e) {
      setError(e.message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadProviders, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchUnassignedTasks()
      .then((data) => {
        if (cancelled) return;
        setUnassignedTasks(
          (data.tasks || []).map((t) => ({
            id: t.task_id,
            name: t.task_name,
            projectName: t.project_name,
          }))
        );
      })
      .catch((e) => console.error('Failed to load unassigned tasks:', e));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRequestClick = (provider, isGuest) => {
    if (isGuest) {
      router.push('/register');
    } else {
      setRequesting(provider);
    }
  };

  const handleSeeReviewsClick = (provider) => {
    const id = provider?.providerId || provider?.provider_id || 1;
    window.open(`/provider/${id}`, '_blank');
  };

  return (
    <div>
      <DashHeader title="Find Service Providers" subtitle="Browse and hire qualified tradespeople near you" />

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="flex-1 min-w-[200px] bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#16a34a]"
        />
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#16a34a]"
        >
          <option value="All Districts">All Districts</option>
          {DISTRICTS.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        <select
          value={selectedSkillId || ''}
          onChange={(e) => setSelectedSkillId(e.target.value ? Number(e.target.value) : null)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#16a34a]"
        >
          <option value="">All Skills</option>
          {Object.entries(SKILL_NAME_TO_ID).map(([skillName, skillId]) => (
            <option key={skillId} value={skillId}>{skillName}</option>
          ))}
        </select>
        <select
          value={selectedRatingRange}
          onChange={(e) => setSelectedRatingRange(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#16a34a]"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4.5-5">5 - 4.5 Stars</option>
          <option value="4-4.5">4.5 - 4 Stars</option>
          <option value="3.5-4">4 - 3.5 Stars</option>
          <option value="below3.5">Below 3.5 Stars</option>
        </select>
        <button
          onClick={loadProviders}
          className="bg-[#16a34a] hover:opacity-85 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          Loading service providers...
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#C0392B]">
          {error}
        </div>
      ) : !searched ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          Use the search options above and click Search to find service providers.
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          No service providers found matching your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {providers.map((p) => (
            <ServiceProviderCard
              key={p.providerId}
              provider={p}
              isGuest={isGuest}
              onRequestClick={handleRequestClick}
              onSeeReviewsClick={handleSeeReviewsClick}
            />
          ))}
        </div>
      )}

      {requesting && (
        <RequestServiceModal
          provider={requesting}
          tasks={unassignedTasks}
          onClose={() => setRequesting(null)}
        />
      )}
    </div>
  );
}
