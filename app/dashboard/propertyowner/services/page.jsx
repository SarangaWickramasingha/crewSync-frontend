'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import RequestServiceModal from '@/Components/dashboard/RequestServiceModal';
import { useAuth } from '@/context/AuthContext';

const PROVIDERS = [
  { initials: 'SK', avatarBg: '#FFF3E0', avatarColor: '#B85A00', name: 'Sunil Karunaratne', role: 'Mason · Kandy District', rating: 5, reviewCount: 47, location: 'Peradeniya, Kandy', price: 'LKR 3,500 / day' },
  { initials: 'RP', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', name: 'Ruwan Perera', role: 'Electrician · Kandy District', rating: 4, reviewCount: 32, location: 'Katugastota, Kandy', price: 'LKR 4,200 / day' },
  { initials: 'DW', avatarBg: '#E8F0FB', avatarColor: '#1A56A0', name: 'Dinesh Wickrama', role: 'Carpenter · Kandy District', rating: 5, reviewCount: 61, location: 'Gampola, Kandy', price: 'LKR 3,800 / day' },
  { initials: 'NJ', avatarBg: '#F0E8FB', avatarColor: '#6B3FA0', name: 'Nishantha Jayalath', role: 'Plumber · Matale District', rating: 4, reviewCount: 28, location: 'Dambulla, Matale', price: 'LKR 3,200 / day' },
];

function Stars({ rating }) {
  return <span className="text-[#E8820C]">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

export default function PropertyOwnerServicesPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const [requesting, setRequesting] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');

  const filteredProviders = PROVIDERS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.role.toLowerCase().includes(searchVal.toLowerCase());
    const matchesDistrict =
      selectedDistrict === 'All Districts' ||
      p.location.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
      p.role.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesSkill =
      selectedSkill === 'All Skills' ||
      p.role.toLowerCase().includes(selectedSkill.toLowerCase());
    return matchesSearch && matchesDistrict && matchesSkill;
  });

  return (
    <div>
      <DashHeader title="Find Service Providers" subtitle="Browse and hire qualified tradespeople near you" />

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="flex-1 min-w-[200px] bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        />
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        >
          <option value="All Districts">All Districts</option>
          <option value="Kandy">Kandy</option>
          <option value="Colombo">Colombo</option>
          <option value="Gampaha">Gampaha</option>
          <option value="Badulla">Badulla</option>
          <option value="Matale">Matale</option>
        </select>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        >
          <option value="All Skills">All Skills</option>
          <option value="Mason">Mason</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Painter">Painter</option>
        </select>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          No service providers found matching your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredProviders.map((p) => (
            <div key={p.name} className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mb-3" style={{ background: p.avatarBg, color: p.avatarColor }}>
                {p.initials}
              </div>
              <div className="text-sm font-bold">{p.name}</div>
              <div className="text-xs text-[#8A8FA8] mb-2">{p.role}</div>
              <div className="text-sm mb-1">
                <Stars rating={p.rating} />{' '}
                <span className="text-[#8A8FA8] text-xs">{p.rating}.0 ({p.reviewCount} reviews)</span>
              </div>
              <div className="text-xs text-[#8A8FA8]">{p.location}</div>
              <div className="text-sm font-semibold text-[#B85A00] mt-2">{p.price}</div>
              <button
                className="w-full mt-2.5 bg-[#E8820C] hover:opacity-85 text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
                onClick={() => {
                  if (isGuest) {
                    router.push('/register');
                  } else {
                    setRequesting(p.name);
                  }
                }}
              >
                Request
              </button>
            </div>
          ))}
        </div>
      )}

      {requesting && (
        <RequestServiceModal providerName={requesting} onClose={() => setRequesting(null)} />
      )}
    </div>
  );
}