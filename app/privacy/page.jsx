import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy — CrewSync',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-surface">
            {/* Header bar */}
            <div className="bg-[#1A1D23] px-6 py-4 flex items-center gap-3">
                <Link
                    href="/"
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-white" />
                </Link>
                <div className="font-syne text-xl font-extrabold tracking-tight select-none" style={{ color: '#E8820C' }}>
                    Crew<span className="text-white">Sync</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="font-syne text-3xl font-bold text-slate mb-2">Privacy Policy</h1>
                <p className="text-xs text-muted mb-10">Last updated: August 2026</p>

                <div className="space-y-8 text-sm text-slate-light leading-relaxed">
                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">1. Information We Collect</h2>
                        <p>
                            When you register on CrewSync, we collect information you provide directly, including your
                            name, email address, contact number, district, and role-specific details (such as business
                            information for suppliers or skills and experience for service providers). We also collect
                            information generated through your use of the platform, such as project details, service
                            requests, reviews, and messages exchanged with other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to operate and improve CrewSync, including connecting
                            property owners with service providers and material suppliers, processing service requests
                            and orders, sending account-related notifications, and maintaining the security of your
                            account through email verification.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">3. Information Sharing</h2>
                        <p>
                            We share relevant profile information (such as your name, district, and role-specific
                            details) with other users as necessary for the platform to function — for example, a
                            property owner can see a service provider's experience and ratings before hiring them. We
                            do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">4. Data Security</h2>
                        <p>
                            We take reasonable technical measures to protect your information, including password
                            hashing, secure session tokens, and email verification during account creation. However,
                            no method of transmission or storage is completely secure, and we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">5. Your Choices</h2>
                        <p>
                            You may update your profile information at any time through your account settings. If you
                            wish to delete your account or request removal of your data, please contact us using the
                            details below.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">6. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, you can reach us at{' '}
                            <a href="mailto:crewsync2027@gmail.com" className="text-amber hover:underline">
                                crewsync2027@gmail.com
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
