'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import StatusPill from '@/Components/ui/StatusPill';
import { useRouter } from 'next/navigation';

const SAMPLE_PROVIDERS = [
    { provider_id: 1, user_id: 2, bio: 'Experienced mason', experience_yr: 10, charge_per_day: 3500, avg_rating: 4.9, is_available: true, willing_outside_region: false, status: 'Verified' },
    { provider_id: 2, user_id: 5, bio: 'Certified electrician', experience_yr: 7, charge_per_day: 4000, avg_rating: 4.7, is_available: true, willing_outside_region: true, status: 'Verified' },
    { provider_id: 3, user_id: 6, bio: 'Skilled plumber', experience_yr: 3, charge_per_day: 2800, avg_rating: 3.9, is_available: false, willing_outside_region: false, status: 'Under Review' },
];

export default function AdminProvidersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');

    const filtered = SAMPLE_PROVIDERS.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.name.toLowerCase().includes(q) || o.skill.toLowerCase().includes(q);
        const matchDistrict = !districtFilter || o.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Service Providers</h2>
                    <p className="text-xs text-muted mt-0.5">Monitor and verify professionals</p>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or city…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-xs text-slate
                            bg-white focus:outline-none focus:border-amber placeholder:text-muted"
                    />
                </div>
                <select
                    value={districtFilter}
                    onChange={e => setDistrictFilter(e.target.value)}
                    className="border border-border rounded-lg px-3 py-2.5 text-xs text-slate bg-white focus:outline-none focus:border-amber cursor-pointer"
                >
                    <option value="">All Districts</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Matale">Matale</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Puttalam">Puttalam</option>
                </select>
            </div>


            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Provider ID', 'User ID', 'Bio', 'Experience', 'Charge/Day', 'Avg Rating', 'Available', 'Outside Region', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {SAMPLE_PROVIDERS.map((p, i) => (
                            <tr key={i} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{p.provider_id}</td>
                                <td className="px-4 py-3 text-muted">{p.user_id}</td>
                                <td className="px-4 py-3 text-muted max-w-[120px] truncate">{p.bio}</td>
                                <td className="px-4 py-3 text-muted">{p.experience_yr} yrs</td>
                                <td className="px-4 py-3 text-muted">LKR {p.charge_per_day}</td>
                                <td className="px-4 py-3 text-amber-500 font-semibold">⭐ {p.avg_rating}</td>
                                <td className="px-4 py-3 text-muted">{p.is_available ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 text-muted">{p.willing_outside_region ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 flex gap-1.5">
                                    {/* TODO: wire to API */}
                                    <button
                                        onClick={() => router.push(`/dashboard/admin/users/${i + 1}`)}
                                        className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                        View
                                    </button>                                    {p.status !== 'Suspended' && (
                                        <button className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all">Suspend</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
