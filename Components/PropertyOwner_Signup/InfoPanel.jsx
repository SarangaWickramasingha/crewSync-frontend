import Link from 'next/link';

const features = [
    {
        icon: '📋',
        title: 'Manage Your Projects',
        desc: 'Track progress, timelines, and milestones in one place.',
    },
    {
        icon: '🔧',
        title: 'Hire Verified Crews',
        desc: 'Find skilled, reviewed service providers near you.',
    },
    {
        icon: '📦',
        title: 'Source Materials',
        desc: 'Compare local suppliers and request quotes instantly.',
    },
    {
        icon: '💬',
        title: 'Communicate Directly',
        desc: 'Message your crews and suppliers in real-time.',
    },
];

export default function InfoPanel() {
    return (
        <aside className="w-[260px] flex-shrink-0 sticky top-20">
            {/* Brand */}
            <div className="font-syne text-[1.6rem] font-extrabold text-[#E8820C] tracking-tight mb-1">
                Crew<span className="text-[#1A1D23]">Sync</span>
            </div>
            <p className="text-sm text-[#8A8FA8] mb-6 leading-relaxed">
                Sri Lanka's construction management platform — built for property owners.
            </p>

            {/* Role badge */}
            <div className="inline-flex items-center gap-2 bg-[#E6F4EC] text-[#145A2E] border border-[#1B6E3A]/25 rounded-full text-xs font-semibold px-4 py-1.5 mb-6">
                🏠 Property Owner
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2.5 mb-6">
                {features.map((f) => (
                    <div
                        key={f.title}
                        className="flex items-start gap-2.5 bg-white border border-black/10 rounded-xl p-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#E6F4EC] text-[#1B6E3A] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                            {f.icon}
                        </div>
                        <div className="text-xs text-[#4A5068] leading-snug">
                            <strong className="block text-[0.82rem] text-[#1A1D23] mb-0.5 font-semibold">
                                {f.title}
                            </strong>
                            {f.desc}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sign in link */}
            <p className="text-xs text-[#8A8FA8]">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#1B6E3A] font-semibold hover:underline">
                    Sign in here
                </Link>
            </p>
        </aside>
    );
}
