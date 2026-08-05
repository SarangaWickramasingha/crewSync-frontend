export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-black/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}