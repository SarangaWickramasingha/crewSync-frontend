'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminUsers, useDeleteAdminUser } from '@/src/hooks/admin/useAdmin';
import DeleteConfirmModal from '@/src/components/admin/DeleteConfirmModal';
import AdminSearchBar from '@/src/components/admin/AdminSearchBar';
import Pagination, { PAGE_SIZE } from '@/src/components/admin/Pagination';

const ROLE_LABEL = {
    property_owner: 'Property Owner',
    service_provider: 'Service Provider',
    material_supplier: 'Material Supplier',
    admin: 'Admin',
};

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

const SEARCH_CATEGORIES = [
    { value: 'user_id', label: 'User ID' },
    { value: 'name', label: 'Name' },
    { value: 'role', label: 'Role' },
];

export default function AdminUsersPage() {
    const router = useRouter();

    const { data, isPending: loading, error } = useAdminUsers();
    const deleteUser = useDeleteAdminUser();
    const [search, setSearch] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [districtFilter, setDistrictFilter] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);
    const [page, setPage] = useState(1);

    const users = data?.users ?? [];

    const filtered = users.filter(u => {
        const q = search.trim().toLowerCase();
        const fullName = `${u.fname ?? ''} ${u.lname ?? ''}`.toLowerCase();
        const roleLabel = (ROLE_LABEL[u.role] ?? u.role ?? '').toLowerCase();

        const matchSearch = !q ? true : !searchCategory
            ? (
                fullName.includes(q) ||
                String(u.user_id ?? '').toLowerCase().includes(q) ||
                u.district?.toLowerCase().includes(q) ||
                roleLabel.includes(q)
            )
            : searchCategory === 'user_id'
                ? String(u.user_id ?? '').toLowerCase().includes(q)
                : searchCategory === 'name'
                    ? fullName.includes(q)
                    : searchCategory === 'role'
                        ? (roleLabel.includes(q) || u.role?.toLowerCase().includes(q))
                        : true;

        const matchDistrict = !districtFilter || u.district === districtFilter;
        return matchSearch && matchDistrict;
    });

    useEffect(() => {
        setPage(1);
    }, [search, searchCategory, districtFilter]);

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const confirmDelete = async () => {
        try {
            await deleteUser.mutateAsync(userToDelete.id);
            setUserToDelete(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="font-syne text-xl font-bold text-slate">User Management</h2>
                    <p className="text-xs text-muted mt-0.5">All registered accounts</p>
                </div>
                <button
                    onClick={() => window.open('/dashboard/admin/users/new', '_blank')}
                    className="px-4 py-2 bg-amber text-white text-xs font-semibold rounded-lg hover:bg-amber-dark transition-all">
                    + Add User
                </button>
            </div>

            {error && (
                <div className="px-3 py-2 mb-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
                    {error.message}
                </div>
            )}

            <AdminSearchBar
                search={search}
                onSearchChange={setSearch}
                searchCategory={searchCategory}
                onCategoryChange={setSearchCategory}
                categories={SEARCH_CATEGORIES}
                placeholder="Search by name, role, or district…"
                secondaryFilter={{
                    value: districtFilter,
                    onChange: setDistrictFilter,
                    options: DISTRICTS,
                    allLabel: 'All Districts',
                }}
            />

            {userToDelete && (
                <DeleteConfirmModal
                    name={userToDelete.name}
                    isDeleting={deleteUser.isPending}
                    onCancel={() => setUserToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}

            {/* Table */}
            <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border bg-[#1A1D23] text-left">
                            {['User ID', 'Name', 'Email', 'Contact No', 'District', 'Role', 'Created At', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wide text-[11px]">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={8} className="px-4 py-5 text-muted">Loading users…</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-5 text-muted">No users found.</td></tr>
                        ) : paginated.map(u => (
                            <tr key={u.user_id} className="hover:bg-surface transition-all">
                                <td className="px-4 py-3 text-muted">{u.user_id}</td>
                                <td className="px-4 py-3 font-medium text-slate">{u.fname} {u.lname}</td>
                                <td className="px-4 py-3 text-muted">{u.email}</td>
                                <td className="px-4 py-3 text-muted">{u.contact_no}</td>
                                <td className="px-4 py-3 text-muted">{u.district}</td>
                                <td className="px-4 py-3 text-muted">{ROLE_LABEL[u.role] ?? u.role}</td>
                                <td className="px-4 py-3 text-muted">{u.created_at}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${u.user_id}/edit`)}
                                            className="px-2.5 py-1 border border-border rounded text-[11px] text-slate hover:bg-surface transition-all">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/admin/users/${u.user_id}`)}
                                            className="px-2.5 py-1 border border-blue-200 rounded text-[11px] text-blue-500 hover:bg-blue-50 transition-all">
                                            View
                                        </button>
                                        <button
                                            onClick={() => setUserToDelete({ id: u.user_id, name: `${u.fname} ${u.lname}` })}
                                            disabled={deleteUser.isPending && deleteUser.variables === u.user_id}
                                            className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                                            {deleteUser.isPending && deleteUser.variables === u.user_id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={page}
                    totalItems={filtered.length}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}