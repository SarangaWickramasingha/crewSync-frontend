import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 h-[60px] sticky top-0 z-50"
            style={{ background: '#1A1D23' }}>
            <Link href="/"
                className="text-[1.4rem] font-extrabold tracking-tight no-underline"
                style={{ fontFamily: 'Syne, sans-serif', color: '#E8820C' }}>
                Crew<span style={{ color: '#fff' }}>Sync</span>
            </Link>
            <span className="text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                New to CrewSync?{' '}
                <Link href="/signup"
                    className="font-semibold no-underline hover:underline"
                    style={{ color: '#E8820C' }}>
                    Get Started
                </Link>
            </span>
        </nav>
    );
}