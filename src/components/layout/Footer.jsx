import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="text-center py-5 text-[0.75rem]"
            style={{ color: '#8A8FA8', borderTop: '1px solid rgba(26,29,35,0.1)', background: '#fff' }}>
            © 2025 CrewSync. All rights reserved. &nbsp;·&nbsp;
            <Link href="/privacy" className="no-underline hover:underline" style={{ color: '#E8820C' }}>
                Privacy Policy
            </Link>
            &nbsp;·&nbsp;
            <Link href="/terms" className="no-underline hover:underline" style={{ color: '#E8820C' }}>
                Terms of Service
            </Link>
        </footer>
    );
}
