'use client';
import { Search } from 'lucide-react';
import { useState } from 'react';
import StatusPill from '@/Components/ui/StatusPill';
import { useRouter } from 'next/navigation';


// TODO: fetch from GET /api/admin/material-suppliers
const SAMPLE_SUPPLIERS = [
    { supplier_id: 1, user_id: 3, business_name: 'Malshan Hardware Pvt Ltd', business_address: 'No. 45, Peradeniya Road, Kandy', is_hardware_shop: true, avg_rating: 4.5, status: 'Active' },
    { supplier_id: 2, user_id: 7, business_name: 'Perera Timber', business_address: 'No. 12, Colombo 10', is_hardware_shop: false, avg_rating: 4.2, status: 'Active' },
];

export default function AdminMaterialSuppliersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');

    const filtered = SAMPLE_SUPPLIERS.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = !q || s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q) || s.materials.toLowerCase().includes(q);
        const matchDistrict = !districtFilter || s.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">Material Suppliers</h2>
                    <p className="text-xs text-muted mt-0.5">All registered material suppliers</p>
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

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['Supplier ID', 'User ID', 'Business Name', 'Address', 'Hardware Shop', 'Avg Rating', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-5 text-muted">No suppliers found.</td></tr>
                        ) : filtered.map((s, i) => (
                            <tr key={i} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{s.supplier_id}</td>
                                <td className="px-4 py-3 text-muted">{s.user_id}</td>
                                <td className="px-4 py-3 font-medium text-slate">{s.business_name}</td>
                                <td className="px-4 py-3 text-muted max-w-[150px] truncate">{s.business_address}</td>
                                <td className="px-4 py-3 text-muted">{s.is_hardware_shop ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 text-amber-500 font-semibold">⭐ {s.avg_rating}</td>
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
        </div>
    );
}