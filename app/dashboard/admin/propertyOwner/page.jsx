'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import StatusPill from '@/Components/ui/StatusPill';
import { useRouter } from 'next/navigation';


// TODO: fetch from GET /api/admin/property-owners
const SAMPLE_OWNERS = [
    { owner_id: 1, user_id: 1, email: 'nimal@example.com', contact_no: '0771234567', address: 'No. 12, Main Street, Kandy', status: 'Active' },
    { owner_id: 2, user_id: 4, email: 'chamari@example.com', contact_no: '0712345678', address: 'No. 5, Dambulla Road, Matale', status: 'Pending' },
];
export default function AdminPropertyOwnersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');

    const filtered = SAMPLE_OWNERS.filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.name.toLowerCase().includes(q) || o.district.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
        const matchDistrict = !districtFilter || o.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Property Owners</h2>
                    <p className="text-xs text-muted mt-0.5">All registered property owners</p>
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
                    <option value="">Search By</option>
                    <option value="User ID">Colombo</option>
                    <option value="Owner ID">Gampaha</option>
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

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Owner ID', 'User ID', 'Email', 'Contact No', 'Address', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-5 text-muted">No property owners found.</td></tr>
                        ) : filtered.map((o, i) => (
                            <tr key={i} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{o.owner_id}</td>
                                <td className="px-4 py-3 text-muted">{o.user_id}</td>
                                <td className="px-4 py-3 text-muted">{o.email}</td>
                                <td className="px-4 py-3 text-muted">{o.contact_no}</td>
                                <td className="px-4 py-3 text-muted">{o.address}</td>
                                <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                                <td className="px-4 py-3 flex gap-1.5">
                                    <button
                                        onClick={() => router.push(`/dashboard/admin/users/${i + 1}`)}
                                        className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                        View
                                    </button>                                    <button className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all">Suspend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}