'use client';

const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle',
];

const inputCls =
    'px-3 py-2.5 border border-black/10 rounded-lg text-sm text-[#1A1D23] bg-white outline-none transition-all focus:border-[#1B6E3A] focus:ring-2 focus:ring-[#1B6E3A]/10 placeholder:text-[#8A8FA8]';

export default function Step2PersonalInfo({ data, onChange }) {
    return (
        <div>
            {/* Personal Info */}
            <div className="mb-6">
                <div className="flex items-center gap-2 font-syne text-xs font-bold text-[#1A1D23] uppercase tracking-wider mb-4 pb-2 border-b border-black/10">
                    <span>👤</span> Personal Information
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            First Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nimal"
                            value={data.firstName}
                            onChange={(e) => onChange('firstName', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            Last Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Perera"
                            value={data.lastName}
                            onChange={(e) => onChange('lastName', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            Mobile Number <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="+94 77 123 4567"
                            value={data.mobile}
                            onChange={(e) => onChange('mobile', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            NIC / Passport No. <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="200012345678"
                            value={data.nic}
                            onChange={(e) => onChange('nic', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="mb-6">
                <div className="flex items-center gap-2 font-syne text-xs font-bold text-[#1A1D23] uppercase tracking-wider mb-4 pb-2 border-b border-black/10">
                    <span>📍</span> Location
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            District <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={data.district}
                            onChange={(e) => onChange('district', e.target.value)}
                            className={`${inputCls} cursor-pointer`}
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            City / Town <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Nugegoda"
                            value={data.city}
                            onChange={(e) => onChange('city', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-xs font-semibold text-[#4A5068] uppercase tracking-wide">
                            Full Address
                        </label>
                        <textarea
                            placeholder="No. 12, High Level Road, Nugegoda"
                            value={data.address}
                            onChange={(e) => onChange('address', e.target.value)}
                            rows={3}
                            className={`${inputCls} resize-y min-h-[80px]`}
                        />
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-[#1A1D23]">
                    <input
                        type="checkbox"
                        checked={data.agreeTerms}
                        onChange={(e) => onChange('agreeTerms', e.target.checked)}
                        className="w-4 h-4 mt-0.5 flex-shrink-0 accent-[#1B6E3A] cursor-pointer"
                    />
                    <span>
                        I agree to the{' '}
                        <a href="#" className="text-[#1B6E3A] font-semibold hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#1B6E3A] font-semibold hover:underline">Privacy Policy</a>.{' '}
                        <span className="text-red-600">*</span>
                    </span>
                </label>
            </div>
        </div>
    );
}
