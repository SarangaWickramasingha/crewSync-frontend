'use client';
import DistrictSelect from '@/src/components/ui/DistrictSelect';

// Shared label + input primitives used by all step-2 components
export function FormLabel({ children, required }) {
    return (
        <label className="text-[11px] font-semibold text-slate-light uppercase tracking-wide">
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}

export function FormInput({ className = '', ...props }) {
    return (
        <input
            className={`w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
        bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
        placeholder:text-muted ${className}`}
            {...props}
        />
    );
}

export function FormSelect({ children, className = '', ...props }) {
    return (
        <select
            className={`w-full px-3 py-[10px] border border-border rounded-lg text-sm text-slate
        bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
        cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function SectionHeading({ icon, children }) {
    return (
        <div className="flex items-center gap-2 font-syne text-xs font-bold uppercase tracking-widest
      text-slate border-b border-border pb-2 mb-3">
            <span>{icon}</span>
            {children}
        </div>
    );
}

// ──────────────────────────────────────────────
// StepPersonalInfo: name, mobile, NIC, district, city
// Used as the top shared section in all 3 role step-2 flows
// ──────────────────────────────────────────────
export default function StepPersonalInfo({ register, errors }) {
    return (
        <div className="mb-5">
            <SectionHeading icon="👤">Personal Information</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="flex flex-col gap-1">
                    <FormLabel required>First Name</FormLabel>
                    <FormInput placeholder="Kamal" {...register('firstName')} />
                    {errors.firstName && <p className="text-[11px] text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>Last Name</FormLabel>
                    <FormInput placeholder="Silva" {...register('lastName')} />
                    {errors.lastName && <p className="text-[11px] text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>Mobile Number</FormLabel>
                    <FormInput type="tel" placeholder="+94 77 123 4567" {...register('mobile')} />
                    {errors.mobile && <p className="text-[11px] text-red-500">{errors.mobile.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>District</FormLabel>
                    <DistrictSelect {...register('district')} />
                    {errors.district && <p className="text-[11px] text-red-500">{errors.district.message}</p>}
                </div>

            </div>
        </div>
    );
}
