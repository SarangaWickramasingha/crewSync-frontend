'use client';

const ROLE_COLORS = {
    owner: { border: 'border-green-500', bg: 'bg-green-50', titleText: 'text-green-800', check: 'bg-green-500' },
    provider: { border: 'border-blue-500', bg: 'bg-blue-50', titleText: 'text-blue-800', check: 'bg-blue-500' },
    supplier: { border: 'border-orange-500', bg: 'bg-orange-50', titleText: 'text-orange-800', check: 'bg-orange-500' },
};



const ROLES = [
    {
        id: 'owner',
        icon: '🏠',
        title: 'Property Owner',
        description: 'Post projects, hire service providers and suppliers for your construction needs.',
        badge: 'Most Popular',
    },
    {
        id: 'provider',
        icon: '🔧',
        title: 'Service Provider',
        description: 'Offer your trade skills — masonry, electrical, plumbing, carpentry and more.',
        badge: null,
    },
    {
        id: 'supplier',
        icon: '🧱',
        title: 'Supplier',
        description: 'Supply raw materials and hardware to construction projects across Sri Lanka.',
        badge: null,
    },
];

export default function RolePicker({ selected, onSelect }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ROLES.map(role => {
                const active = selected === role.id;
                return (
                    <button
                        key={role.id}
                        type="button"
                        onClick={() => onSelect(role.id)}
                        className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left
              transition-all duration-200 focus:outline-none
              ${active
                                ? `${ROLE_COLORS[role.id].border} ${ROLE_COLORS[role.id].bg} shadow-sm`
                                : 'border-border bg-white hover:border-slate-300 hover:bg-surface'
                            }`}
                    >
                        {role.badge && (
                            <span className="absolute top-3 right-3 rounded-full bg-amber px-2 py-0.5
                text-[10px] font-bold text-white tracking-wide">
                                {role.badge}
                            </span>
                        )}
                        <span className="text-4xl">{role.icon}</span>
                        <div>
                            <p className={`text-sm font-bold font-syne ${active ? ROLE_COLORS[role.id].titleText : 'text-slate'}`}>
                                {role.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted leading-relaxed">{role.description}</p>
                        </div>
                        {active && (
                            <span className={`absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center
    rounded-full text-white text-[10px] ${ROLE_COLORS[role.id].check}`}>✓</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}