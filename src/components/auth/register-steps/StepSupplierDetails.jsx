'use client';
import StepPersonalInfo, {
    SectionHeading,
    FormLabel,
    FormInput,
} from './StepPersonalInfo';

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

export default function StepSupplierDetails({ register, errors, watch, setValue }) {
    const materials = watch('materials') || [];
    const hasHardwareStore = watch('hasHardwareStore');

    const toggleMaterial = (val) => {
        const next = materials.includes(val)
            ? materials.filter(m => m !== val)
            : [...materials, val];
        setValue('materials', next, { shouldValidate: true });
    };

    return (
        <>
            <StepPersonalInfo
                register={register}
                errors={errors}
            />
            {/* Business Details */}
            <div className="mb-5">
                <SectionHeading icon="🏢">Business Details</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <FormLabel required>Business Name</FormLabel>
                        <FormInput placeholder="e.g. Malshan Enterprises" {...register('businessName')} />
                        {errors.businessName && <p className="text-[11px] text-red-500">{errors.businessName.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel>Business Registration Number</FormLabel>
                        <FormInput placeholder="e.g. PV 12345678" {...register('brn')} />
                        <p className="text-[11px] text-muted">Optional — helps build buyer trust.</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <FormLabel required>City / Town</FormLabel>
                        <FormInput placeholder="e.g. Peradeniya" {...register('city')} />
                    </div>

                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <FormLabel required>Business Address</FormLabel>
                        <FormInput placeholder="e.g. No. 45, Peradeniya Road, Kandy" {...register('address')} />
                        {errors.address && <p className="text-[11px] text-red-500">{errors.address.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                            ${watch('delivery') ? 'border-primary bg-primary-light' : 'border-border bg-white hover:border-primary/40'}`}>
                            <input
                                type="checkbox"
                                {...register('delivery')}
                                className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate">We offer delivery</p>
                                <p className="text-xs text-muted mt-0.5">Enable this if you deliver materials to project sites.</p>
                            </div>
                        </label>
                    </div>

                </div>
            </div>

            {/* Materials */}
            <div className="mb-5">
                <SectionHeading icon="🧱">Materials &amp; Products Supplied</SectionHeading>
                <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wide mb-2">
                    Select all raw materials you supply <span className="text-red-500">*</span>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {MATERIALS.map(({ value }) => {
                        const active = materials.includes(value);
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
                {errors.materials && <p className="text-[11px] text-red-500 mb-2">{errors.materials.message}</p>}

                {/* Hardware store toggle */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
          ${hasHardwareStore ? 'border-primary bg-primary-light' : 'border-border bg-white hover:border-primary/40'}`}>
                    <input
                        type="checkbox"
                        {...register('hasHardwareStore')}
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
                {hasHardwareStore && (
                    <div className="mt-3 p-4 rounded-xl border border-primary/20 bg-primary-light/50">
                        <p className="font-syne text-sm font-bold text-slate mb-3">🏪 Hardware Store Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 sm:col-span-2">
                                <FormLabel required>Hardware Store Name</FormLabel>
                                <FormInput placeholder="e.g. Malshan Hardware" {...register('hwStoreName')} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormLabel>BR Number (Hardware Business)</FormLabel>
                                <FormInput placeholder="e.g. PV 87654321" {...register('hwBRN')} />
                                <p className="text-[11px] text-muted">Optional — separate BR number if different.</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormLabel required>Store Address</FormLabel>
                                <FormInput placeholder="e.g. No. 47, Peradeniya Road, Kandy" {...register('hwAddress')} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-2 mb-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input type="checkbox" checked={watch('agreeTerms')} {...register('agreeTerms')}
                        className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0" />
                    <span>
                        I agree to the{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>.
                        {' '}<span className="text-red-500">*</span>
                    </span>
                </label>
                {errors.agreeTerms && <p className="text-[11px] text-red-500">{errors.agreeTerms.message}</p>}
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate">
                    <input type="checkbox" {...register('agreeVerification')}
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
