import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service — CrewSync',
};

export default function TermsOfServicePage() {
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
                <h1 className="font-syne text-3xl font-bold text-slate mb-2">Terms of Service</h1>
                <p className="text-xs text-muted mb-10">Last updated: August 2026</p>

                <div className="space-y-8 text-sm text-slate-light leading-relaxed">
                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account on CrewSync, you agree to be bound by these Terms of Service. If
                            you do not agree to these terms, please do not use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">2. Description of Service</h2>
                        <p>
                            CrewSync is a platform connecting property owners with skilled service providers and
                            material suppliers across Sri Lanka. CrewSync facilitates these connections but is not a
                            party to any agreement, service, or transaction made between users.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">3. Account Registration</h2>
                        <p>
                            You must provide accurate and complete information when registering, and verify your
                            email address as part of the sign-up process. You are responsible for maintaining the
                            confidentiality of your account credentials and for all activity that occurs under your
                            account.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">4. User Responsibilities</h2>
                        <p>
                            Service providers and material suppliers are responsible for the accuracy of their listed
                            experience, pricing, and product information. Property owners are responsible for
                            providing accurate project details when submitting service requests. All users agree to
                            interact with others on the platform honestly and respectfully.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">5. Reviews and Ratings</h2>
                        <p>
                            Reviews submitted on CrewSync must reflect genuine experiences. CrewSync reserves the
                            right to remove reviews that are fraudulent, abusive, or violate these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">6. Limitation of Liability</h2>
                        <p>
                            CrewSync is not responsible for the quality, safety, timeliness, or outcome of any
                            service performed or materials supplied by users of the platform. Disputes arising from
                            transactions between users should be resolved directly between those parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">7. Account Suspension</h2>
                        <p>
                            CrewSync reserves the right to suspend or terminate accounts that violate these terms,
                            engage in fraudulent activity, or misuse the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">8. Changes to These Terms</h2>
                        <p>
                            We may update these Terms of Service from time to time. Continued use of CrewSync after
                            changes are posted constitutes acceptance of the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-syne text-lg font-bold text-slate mb-2">9. Contact Us</h2>
                        <p>
                            If you have questions about these Terms of Service, you can reach us at{' '}
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
