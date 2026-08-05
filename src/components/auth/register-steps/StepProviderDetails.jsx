'use client';
import { SectionHeading, FormLabel, FormInput } from './StepPersonalInfo';

const SKILLS = [
    'Masonry', 'Carpentry', 'Electrical', 'Plumbing', 'Painting',
    'Tiling', 'Welding', 'Roofing', 'Waterproofing', 'Landscaping',
    'Aluminium Work', 'Interior Design',
];

export default function StepProviderDetails({ register, errors, watch, setValue }) {
    const skills = watch('skills') || [];

    const toggleSkill = (skill) => {
        const next = skills.includes(skill)
            ? skills.filter(s => s !== skill)
            : [...skills, skill];
        setValue('skills', next, { shouldValidate: true });
    };

    return (
        <>
            {/* Experience */}
            <div className="mb-5">
                <SectionHeading icon="🛠️">Trade & Skills</SectionHeading>

                <div className="flex flex-col gap-1 mb-3">

                    {/* Skills chips */}
                    <div className="mb-3">
                        <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                            Skills <span className="normal-case text-muted">(select all that apply)</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {SKILLS.map(skill => {
                                const active = skills.includes(skill);
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
                    <div className="mb-3">
                        <label
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
        ${watch('workOutsideRegion')
                                    ? 'border-primary bg-primary-light'
                                    : 'border-border bg-white hover:border-primary/40'
                                }`}
                        >
                            <input
                                type="checkbox"
                                {...register('workOutsideRegion')}
                                className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate">
                                    I can work outside my district
                                </p>
                                <p className="text-xs text-muted mt-0.5">
                                    Enable this if you&apos;re available to travel and take projects in other districts.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1 mb-3">
                        <FormLabel>Brief Bio / Description</FormLabel>
                        <textarea
                            placeholder="Describe your experience, specialties, and the kind of projects you handle…"
                            {...register('bio')}
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
                                {...register('dailyRate')}
                            />
                            <p className="text-[11px] text-muted">Optional — helps property owners shortlist you faster.</p>
                        </div>

                    </div>
                </div>

                {/* Terms */}
                <div className="mb-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                        <input
                            type="checkbox"
                            checked={watch('agreeTerms')}
                            {...register('agreeTerms')}
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
                    {errors.agreeTerms && <p className="text-[11px] text-red-500 mt-1">{errors.agreeTerms.message}</p>}
                </div>
            </div>
        </>
    );
}
