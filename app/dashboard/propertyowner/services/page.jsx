import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';

const PROVIDERS = [
  {
    initials: 'SK', avatarBg: '#FFF3E0', avatarColor: '#B85A00',
    name: 'Sunil Karunaratne', role: 'Mason · Kandy District',
    rating: 5, reviewCount: 47, location: '📍 Peradeniya, Kandy', price: 'LKR 3,500 / day',
  },
  {
    initials: 'RP', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A',
    name: 'Ruwan Perera', role: 'Electrician · Kandy District',
    rating: 4, reviewCount: 32, location: '📍 Katugastota, Kandy', price: 'LKR 4,200 / day',
  },
  {
    initials: 'DW', avatarBg: '#E8F0FB', avatarColor: '#1A56A0',
    name: 'Dinesh Wickrama', role: 'Carpenter · Kandy District',
    rating: 5, reviewCount: 61, location: '📍 Gampola, Kandy', price: 'LKR 3,800 / day',
  },
  {
    initials: 'NJ', avatarBg: '#F0E8FB', avatarColor: '#6B3FA0',
    name: 'Nishantha Jayalath', role: 'Plumber · Matale District',
    rating: 4, reviewCount: 28, location: '📍 Dambulla, Matale', price: 'LKR 3,200 / day',
  },
];

function Stars({ rating }) {
  return <span className="text-[#E8820C]">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

export default function PropertyOwnerServicesPage() {
  return (
    <div>
      <DashHeader title="Find Service Providers" subtitle="Browse and hire qualified tradespeople near you" />

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or skill..."
          className="flex-1 min-w-[200px] bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        />
        <select className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]">
          <option>All Districts</option>
          <option>Kandy</option><option>Colombo</option><option>Gampaha</option>
          <option>Badulla</option><option>Matale</option>
        </select>
        <select className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]">
          <option>All Skills</option>
          <option>Mason</option><option>Carpenter</option><option>Electrician</option>
          <option>Plumber</option><option>Painter</option>
        </select>
        <button className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-semibold px-4.5 py-2 rounded-lg">
          Search
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PROVIDERS.map((p) => (
          <div
            key={p.name}
            className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base mb-3"
              style={{ background: p.avatarBg, color: p.avatarColor }}
            >
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
            <button className="w-full mt-2.5 bg-[#E8820C] hover:opacity-85 text-white text-xs font-semibold py-2 rounded-md">
              Request Hire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}