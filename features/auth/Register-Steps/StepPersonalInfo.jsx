'use client';
import DistrictSelect from '@/Components/ui/DistrictSelect';

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
export default function StepPersonalInfo({ data, onChange }) {
    const set = (field) => (e) => onChange({ ...data, [field]: e.target.value });

    return (
        <div className="mb-5">
            <SectionHeading icon={
                <svg className="w-3.5 h-3.5 text-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            }>Personal Information</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="flex flex-col gap-1">
                    <FormLabel required>First Name</FormLabel>
                    <FormInput placeholder="Kamal" value={data.firstName} onChange={set('firstName')} />
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>Last Name</FormLabel>
                    <FormInput placeholder="Silva" value={data.lastName} onChange={set('lastName')} />
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>Mobile Number</FormLabel>
                    <FormInput type="tel" placeholder="+94 77 123 4567" value={data.mobile} onChange={set('mobile')} />
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>NIC / Passport No.</FormLabel>
                    <FormInput placeholder="200012345678" value={data.nic} onChange={set('nic')} />
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>District</FormLabel>
                    <DistrictSelect value={data.district} onChange={set('district')} />
                </div>

                <div className="flex flex-col gap-1">
                    <FormLabel required>City / Town</FormLabel>
                    <FormInput placeholder="e.g. Nugegoda" value={data.city} onChange={set('city')} />
                </div>

            </div>
        </div>
    );
}
