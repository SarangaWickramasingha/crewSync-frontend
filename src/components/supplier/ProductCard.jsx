'use client';
import StatusPill from '@/src/components/ui/StatusPill';

export default function ProductCard({ product, onEdit, onRemove, isDeleting = false }) {
  const title = product.title || product.name;

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <div className="w-full h-[140px] rounded-xl flex items-center justify-center mb-3.5 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50/50">
        <img src={`/materials/${product.material_id || 9}.jpg`} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="text-[0.98rem] font-bold text-crewSlate mb-1 leading-snug">{title}</div>

      {product.description && (
        <div className="text-xs text-crewSlate-light mb-2.5 leading-relaxed">{product.description}</div>
      )}

      <div className="font-syne text-[1.15rem] font-bold text-crewAmber-dark">{product.price}</div>

      <div className="mt-1.5 flex flex-col gap-1">
        <StatusPill status={product.stockType} withDot />
        {product.stockNote && (
          <div className="text-[0.75rem] font-medium text-crewSlate-light mt-0.5">
            Available Qty: <span className="font-semibold text-crewSlate">{product.stockNote}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-black/10">
        {onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-crewAmber-light text-crewAmber-dark border border-crewAmber/25 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-[#FFE8CC] transition-colors cursor-pointer"
          >
            Edit Details
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(product.id)}
            disabled={isDeleting}
            className="bg-transparent text-crewSlate-light border border-black/10 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-[#FDECEA] hover:text-[#C0392B] transition-colors cursor-pointer disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
