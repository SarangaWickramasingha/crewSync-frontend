"use client";

const STOCK_META = {
  in: { label: 'In Stock', badgeClass: 'bg-[#E6F4EC] text-[#1B6E3A]', dotClass: 'bg-[#1B6E3A]' },
  low: { label: 'Low Stock', badgeClass: 'bg-[#FFF3E0] text-[#B85A00]', dotClass: 'bg-[#E8820C]' },
  out: { label: 'Out of Stock', badgeClass: 'bg-[#FDECEA] text-[#C0392B]', dotClass: 'bg-[#C0392B]' },
};

function getStockLabel(product) {
  const meta = STOCK_META[product.stockType] || STOCK_META.in;
  return product.stockNote ? `${meta.label} (${product.stockNote})` : meta.label;
}

export default function ProductCard({
  product,
  isEditing = false,
  editForm = { price: '', stockType: 'in', stockNote: '', description: '' },
  setEditForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRemoveProduct,
}) {
  const meta = STOCK_META[product.stockType] || STOCK_META.in;
  const title = product.title || product.name;

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      {/* <div className="w-full h-[88px] bg-gradient-to-br from-[#EEECEA] to-[#F7F6F2] rounded-lg flex items-center justify-center text-3xl mb-3.5">
        {product.icon || '📦'}
      </div> */}

      <div className="text-[0.98rem] font-bold text-[#1A1D23] mb-1 leading-snug">
        {title}
      </div>

      {product.description && (
        <div className="text-xs text-[#4A5068] mb-2.5 leading-relaxed">
          {product.description}
        </div>
      )}

      {!isEditing ? (
        <>
          <div className="font-syne text-[1.15rem] font-bold text-[#B85A00]">
            {product.price}
          </div>
          <div className="mt-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotClass}`} />
              <span className={`text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full ${meta.badgeClass}`}>
                {meta.label}
              </span>
            </div>
            {product.stockNote && (
              <div className="text-[0.75rem] font-medium text-[#4A5068] mt-0.5">
                Available Qty: <span className="font-semibold text-[#1A1D23]">{product.stockNote}</span>
              </div>
            )}
          </div>

          {(onStartEdit || onRemoveProduct) && (
            <div className="flex gap-2 mt-4 pt-3 border-t border-black/10">
              {onStartEdit && (
                <button
                  onClick={() => onStartEdit(product)}
                  className="flex-1 bg-[#FFF3E0] text-[#B85A00] border border-[#E8820C]/25 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-[#FFE8CC] transition-colors cursor-pointer"
                >
                  ✎ Edit
                </button>
              )}
              {onRemoveProduct && (
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="bg-transparent text-[#4A5068] border border-black/10 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-[#FDECEA] hover:text-[#C0392B] transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-1 pt-3 border-t border-black/10">
          <label className="block text-xs font-semibold text-[#4A5068] mb-1">Description (short sentence)</label>
          <input
            value={editForm.description || ''}
            onChange={e => setEditForm && setEditForm(f => ({ ...f, description: e.target.value }))}
            placeholder="e.g. Durable material for construction"
            className="w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#E8820C] mb-2.5 bg-white text-[#1A1D23]"
          />

          <label className="block text-xs font-semibold text-[#4A5068] mb-1">Unit Price</label>
          <input
            value={editForm.price}
            onChange={e => setEditForm && setEditForm(f => ({ ...f, price: e.target.value }))}
            placeholder="e.g. LKR 2,850"
            className="w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#E8820C] mb-2.5 bg-white text-[#1A1D23]"
          />

          <label className="block text-xs font-semibold text-[#4A5068] mb-1">Stock Status</label>
          <select
            value={editForm.stockType}
            onChange={e => setEditForm && setEditForm(f => ({ ...f, stockType: e.target.value }))}
            className="w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#E8820C] mb-2.5 bg-white text-[#1A1D23]"
          >
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <label className="block text-xs font-semibold text-[#4A5068] mb-1">Available Quantity (optional)</label>
          <input
            value={editForm.stockNote}
            onChange={e => setEditForm && setEditForm(f => ({ ...f, stockNote: e.target.value }))}
            placeholder="e.g. 240 bags"
            className="w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#E8820C] bg-white text-[#1A1D23]"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onSaveEdit && onSaveEdit(product.id)}
              className="flex-1 bg-[#E8820C] text-white rounded-md px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => onCancelEdit && onCancelEdit()}
              className="bg-transparent text-[#4A5068] border border-black/10 rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
