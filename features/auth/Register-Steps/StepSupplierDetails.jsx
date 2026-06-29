'use client';
import { SectionHeading, FormLabel, FormInput, FormSelect } from './StepPersonalInfo';
import DistrictSelect from '@/Components/ui/DistrictSelect';

const MATERIALS = [
    { value: 'Sand' },
    { value: 'Cement' },
    { value: 'Gravel / Metal' },
    { value: 'Stone / Rubble' },
    { value: 'Cement Blocks' },
    { value: 'Timber' },
    { value: 'Bricks' },
    { value: 'Glass' },
    { value: 'Other' },
];

export default function StepSupplierDetails({ data, onChange }) {
    const set = (field) => (e) =>
        onChange({ ...data, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    const toggleMaterial = (val) => {
        const current = data.materials || [];
        const next = current.includes(val)
            ? current.filter(m => m !== val)
            : [...current, val];
        onChange({ ...data, materials: next });
    };

    return (
        <>
            {/* Business Details */}
            <div className="mb-5">
                <SectionHeading icon={
                    <svg className="w-3.5 h-3.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                }>Business Details</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <FormLabel required>Business Name</FormLabel>
                        <FormInput placeholder="e.g. Malshan Enterprises" value={data.businessName} onChange={set('businessName')} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel>Business Registration Number</FormLabel>
                        <FormInput placeholder="e.g. PV 12345678" value={data.brn} onChange={set('brn')} />
                        <p className="text-[11px] text-muted">Optional — helps build buyer trust.</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel required>District</FormLabel>
                        <DistrictSelect value={data.district} onChange={set('district')} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel required>City / Town</FormLabel>
                        <FormInput placeholder="e.g. Peradeniya" value={data.city} onChange={set('city')} />
                    </div>

                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <FormLabel required>Business Address</FormLabel>
                        <FormInput placeholder="e.g. No. 45, Peradeniya Road, Kandy" value={data.address} onChange={set('address')} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel>Delivery Available?</FormLabel>
                        <FormSelect value={data.delivery} onChange={set('delivery')}>
                            <option value="">Select option</option>
                            <option>Yes – we deliver</option>
                            <option>No – pickup only</option>
                            <option>Yes – bulk orders only</option>
                        </FormSelect>
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel>Delivery Coverage</FormLabel>
                        <FormSelect value={data.deliveryCoverage} onChange={set('deliveryCoverage')}>
                            <option value="">Select coverage area</option>
                            <option value="within">Within my region only</option>
                            <option value="outside">Outside my region (island-wide)</option>
                            <option value="both">Both within and outside my region</option>
                        </FormSelect>
                        <p className="text-[11px] text-muted">Leave blank if pickup only.</p>
                    </div>

                </div>
            </div>

            {/* Materials */}
            <div className="mb-5">
                <SectionHeading icon={
                    <svg className="w-3.5 h-3.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                }>Materials &amp; Products Supplied</SectionHeading>
                <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                    Select all raw materials you supply <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {MATERIALS.map(({ value }) => {
                        const active = (data.materials || []).includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => toggleMaterial(value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  border transition-all
                  ${active
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-slate-light border-border hover:border-primary/50'}`}
                            >
                                {value}
                            </button>
                        );
                    })}
                </div>

                {/* Hardware store toggle */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
          ${data.hasHardwareStore ? 'border-primary bg-primary-light' : 'border-border bg-white hover:border-primary/40'}`}>
                    <input
                        type="checkbox"
                        checked={data.hasHardwareStore || false}
                        onChange={set('hasHardwareStore')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                    />
                    <div>
                        <p className="text-sm font-semibold text-slate">I also operate a hardware store</p>
                        <p className="text-xs text-muted mt-0.5">
                            Buyers will see you carry additional hardware beyond raw materials — tools, fittings, and more.
                        </p>
                    </div>
                </label>

                {/* Conditional hardware store fields */}
                {data.hasHardwareStore && (
                    <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary-light/50">
                        <p className="font-syne text-sm font-bold text-slate mb-3">🏪 Hardware Store Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 sm:col-span-2">
                                <FormLabel required>Hardware Store Name</FormLabel>
                                <FormInput placeholder="e.g. Malshan Hardware" value={data.hwStoreName} onChange={set('hwStoreName')} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormLabel>BR Number (Hardware Business)</FormLabel>
                                <FormInput placeholder="e.g. PV 87654321" value={data.hwBRN} onChange={set('hwBRN')} />
                                <p className="text-[11px] text-muted">Optional — separate BR number if different.</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormLabel required>Store Address</FormLabel>
                                <FormInput placeholder="e.g. No. 47, Peradeniya Road, Kandy" value={data.hwAddress} onChange={set('hwAddress')} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-2 mb-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input type="checkbox" checked={data.agreeTerms} onChange={set('agreeTerms')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                    <span>
                        I agree to the{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>.
                        {' '}<span className="text-red-500">*</span>
                    </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input type="checkbox" checked={data.agreeVerification || false} onChange={set('agreeVerification')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                    <span>
                        I consent to CrewSync verifying my identity and business details for trust and safety.
                        {' '}<span className="text-xs text-muted">(Recommended)</span>
                    </span>
                </label>
            </div>
        </>
    );
}
