'use client';
import { SectionHeading, FormLabel, FormInput, FormSelect } from './StepPersonalInfo';

const TRADES = [
    'Mason / Bricklayer', 'Carpenter', 'Electrician', 'Plumber', 'Painter',
    'Tiler', 'Steel Fabricator / Welder', 'Roof Carpenter',
    'Interior Designer', 'Civil Engineer', 'Architect',
    'General Labour Contractor', 'Other',
];

const SKILLS = [
    'Masonry', 'Carpentry', 'Electrical', 'Plumbing', 'Painting',
    'Tiling', 'Welding', 'Roofing', 'Waterproofing', 'Landscaping',
    'Aluminium Work', 'Interior Design',
];

export default function StepProviderDetails({ data, onChange }) {
    const set = (field) => (e) =>
        onChange({ ...data, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const toggleSkill = (skill) => {
        const current = data.skills || [];
        const next = current.includes(skill)
            ? current.filter(s => s !== skill)
            : [...current, skill];
        onChange({ ...data, skills: next });
    };

    return (
        <>
            {/* Experience */}
            <div className="mb-5">
                <SectionHeading icon={
                    <svg className="w-3.5 h-3.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }>Trade &amp; Skills</SectionHeading>

                <div className="flex flex-col gap-1 mb-3">
                    <FormLabel required>Primary Trade / Profession</FormLabel>
                    <FormSelect value={data.primaryTrade} onChange={set('primaryTrade')}>
                        <option value="">Select your main trade</option>
                        {TRADES.map(t => <option key={t}>{t}</option>)}
                    </FormSelect>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                    <FormLabel required>Years of Experience</FormLabel>
                    <FormSelect value={data.experience} onChange={set('experience')}>
                        <option value="">Select range</option>
                        <option>Less than 1 year</option>
                        <option>1 – 3 years</option>
                        <option>3 – 5 years</option>
                        <option>5 – 10 years</option>
                        <option>10+ years</option>
                    </FormSelect>
                </div>

                {/* Skills chips */}
                <div className="mb-3">
                    <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                        Additional Skills <span className="normal-case text-muted">(select all that apply)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map(skill => {
                            const active = (data.skills || []).includes(skill);
                            return (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${active
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-light border-border hover:border-primary/50'}`}
                                >
                                    {skill}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Work region */}
                <div className="flex flex-col gap-1 mb-3">
                    <FormLabel required>Where Can You Work?</FormLabel>
                    <FormSelect value={data.workRegion} onChange={set('workRegion')}>
                        <option value="">Select work availability</option>
                        <option value="within">Within my region only</option>
                        <option value="outside">Outside my region (island-wide)</option>
                        <option value="both">Both within and outside my region</option>
                    </FormSelect>
                    <p className="text-[11px] text-muted mt-0.5">
                        Helps property owners know if you're available for their area.
                    </p>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1 mb-3">
                    <FormLabel>Brief Bio / Description</FormLabel>
                    <textarea
                        placeholder="Describe your experience, specialties, and the kind of projects you handle…"
                        value={data.bio}
                        onChange={set('bio')}
                        rows={3}
                        className="w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
              bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
              placeholder:text-muted resize-y"
                    />
                </div>

                {/* Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1">
                        <FormLabel>Approximate Daily Rate (LKR)</FormLabel>
                        <FormInput
                            type="number"
                            placeholder="e.g. 4500"
                            value={data.dailyRate}
                            onChange={set('dailyRate')}
                        />
                        <p className="text-[11px] text-muted">Optional — helps property owners shortlist you faster.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <FormLabel>Quote Method</FormLabel>
                        <FormSelect value={data.rateType} onChange={set('rateType')}>
                            <option value="">Select preference</option>
                            <option>Fixed daily rate</option>
                            <option>Per square foot</option>
                            <option>Project-based quote</option>
                            <option>Negotiable</option>
                        </FormSelect>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="mb-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input
                        type="checkbox"
                        checked={data.agreeTerms}
                        onChange={set('agreeTerms')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                    />
                    <span>
                        I agree to the{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>.
                        {' '}<span className="text-red-500">*</span>
                    </span>
                </label>
            </div>
        </>
    );
}
