const VARIANTS = {
  green: "bg-[#E6F4EC] text-[#1B6E3A]",
  amber: "bg-[#FFF3E0] text-[#B85A00]",
  red:   "bg-[#FDECEA] text-[#C0392B]",
  blue:  "bg-[#E8F0FB] text-[#1A56A0]",
  gray:  "bg-[#EEECEA] text-[#8A8FA8]",
};

export default function StatusPill({ variant = "gray", children }) {
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-0.5 rounded-full ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}