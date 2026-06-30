'use client';

const ROLE_THEME = {
    owner: { bg: 'bg-green-700', text: 'text-green-400' },
    provider: { bg: 'bg-blue-600', text: 'text-blue-400' },
    supplier: { bg: 'bg-orange-500', text: 'text-orange-400' },
};

const ROLES = [
    { id: 'owner', label: 'Property Owner' },
    { id: 'provider', label: 'Service Provider' },
    { id: 'supplier', label: 'Supplier' },
];

export default function RolePicker({ selected, onSelect }) {
    return (
        <div className="bg-[#1A1D23] rounded-xl p-1.5 flex gap-1">
            {ROLES.map(role => (
                <button
                    key={role.id}
                    type="button"
                    onClick={() => onSelect(role.id)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200
                        ${selected === role.id
                            ? `${ROLE_THEME[role.id].bg} text-white shadow-sm`
                            : 'text-white/50 hover:text-white/80'
                        }`}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
}