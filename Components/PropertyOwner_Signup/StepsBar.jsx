'use client';

export default function StepsBar({ currentStep }) {
    return (
        <div className="flex items-center px-8 py-4 border-b border-black/10 bg-[#F7F6F2] gap-0">
            {/* Step 1 */}
            <div className="flex items-center gap-2 flex-1">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${currentStep >= 1
                            ? 'bg-[#1B6E3A] border-[#1B6E3A] text-white'
                            : 'bg-white border-black/10 text-[#8A8FA8]'
                        }`}
                >
                    {currentStep > 1 ? '✓' : '1'}
                </div>
                <span
                    className={`text-xs font-medium transition-colors duration-300 ${currentStep === 1 ? 'text-[#1B6E3A] font-semibold' : 'text-[#8A8FA8]'
                        }`}
                >
                    Account Setup
                </span>
            </div>

            {/* Connector */}
            <div
                className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${currentStep > 1 ? 'bg-[#1B6E3A]' : 'bg-black/10'
                    }`}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${currentStep === 2
                            ? 'bg-[#1B6E3A] border-[#1B6E3A] text-white'
                            : 'bg-white border-black/10 text-[#8A8FA8]'
                        }`}
                >
                    2
                </div>
                <span
                    className={`text-xs font-medium transition-colors duration-300 ${currentStep === 2 ? 'text-[#1B6E3A] font-semibold' : 'text-[#8A8FA8]'
                        }`}
                >
                    Personal Information
                </span>
            </div>
        </div>
    );
}
