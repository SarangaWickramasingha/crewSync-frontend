'use client';
import { SectionHeading, FormLabel, FormInput } from './StepPersonalInfo';

export default function StepOwnerDetails({ data, onChange }) {
    const set = (field) => (e) =>
        onChange({ ...data, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    return (
        <>
            {/* Address */}
            <div className="mb-5">
                <SectionHeading icon={
                    <svg className="w-3.5 h-3.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }>Address</SectionHeading>
                <div className="flex flex-col gap-1">
                    <FormLabel>Full Address</FormLabel>
                    <textarea
                        placeholder="No. 12, High Level Road, Nugegoda"
                        value={data.address}
                        onChange={set('address')}
                        rows={3}
                        className="w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
              bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
              placeholder:text-muted resize-y"
                    />
                </div>
            </div>

            {/* Terms */}
            <div className="mb-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input
                        type="checkbox"
                        checked={data.agreeTerms}
                        onChange={set('agreeTerms')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0 cursor-pointer"
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
