export default function FormField({ label, error, hint, className = '', children }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-crewSlate-light">{label}</label>}
      {children}
      {error ? (
        <p className="text-[0.7rem] font-medium text-[#C0392B]">{error}</p>
      ) : hint ? (
        <p className="text-[0.7rem] text-crewMuted">{hint}</p>
      ) : null}
    </div>
  );
}
