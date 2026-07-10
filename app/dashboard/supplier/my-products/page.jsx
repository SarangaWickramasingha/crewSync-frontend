"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  red: '#C0392B', redLight: '#FDECEA',
  border: 'rgba(26,29,35,0.1)', radius: '14px', radiusSm: '8px',
};

const INITIAL_PRODUCTS = [
  { id: 1, icon: '🏗️', name: 'OPC Cement – 50kg',  cat: 'Cement & Concrete', price: 'LKR 2,850',   stockType: 'in',  stockNote: '240 bags' },
  { id: 2, icon: '🔩', name: 'TMT Steel Rod 12mm', cat: 'Steel & Iron',       price: 'LKR 890 / m', stockType: 'low', stockNote: '18 units' },
  { id: 3, icon: '🪣', name: 'Sand – 1 Cube',      cat: 'Aggregates',         price: 'LKR 12,000',  stockType: 'in',  stockNote: '' },
];

const STOCK_META = {
  in:  { label: 'In Stock',     background: '#E6F4EC', color: '#1B6E3A', dot: '#1B6E3A' },
  low: { label: 'Low Stock',    background: '#FFF3E0', color: '#B85A00', dot: '#E8820C' },
  out: { label: 'Out of Stock', background: '#FDECEA', color: '#C0392B', dot: '#C0392B' },
};

const actionBtn = {
  border: '1px solid rgba(26,29,35,0.1)', borderRadius: '7px',
  padding: '6px 12px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
};

function stockLabel(p) {
  const meta = STOCK_META[p.stockType];
  return p.stockNote ? `${meta.label} (${p.stockNote})` : meta.label;
}

export default function MyProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', cat: '', price: '', stockNote: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', stockType: 'in', stockNote: '' });

  function removeProduct(id) {
    if (window.confirm('Remove this product?')) setProducts(p => p.filter(x => x.id !== id));
  }

  function addProduct() {
    if (!newProduct.name || !newProduct.price) return;
    setProducts(p => [...p, { ...newProduct, id: Date.now(), icon: '📦', stockType: 'in' }]);
    setNewProduct({ name: '', cat: '', price: '', stockNote: '' });
    setShowAdd(false);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({ price: p.price, stockType: p.stockType, stockNote: p.stockNote || '' });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id) {
    setProducts(prev => prev.map(p => p.id === id
      ? { ...p, price: editForm.price, stockType: editForm.stockType, stockNote: editForm.stockNote.trim() }
      : p));
    setEditingId(null);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Products</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Manage inventory and listings · {products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ background: C.amber, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 2px 6px rgba(232,130,12,0.3)' }}>
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(26,29,35,0.04)' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { key: 'name',      label: 'Product Name', placeholder: 'e.g. Roofing Tiles' },
              { key: 'cat',       label: 'Category',     placeholder: 'e.g. Roofing' },
              { key: 'price',     label: 'Unit Price',   placeholder: 'e.g. LKR 1,500' },
              { key: 'stockNote', label: 'Quantity',     placeholder: 'e.g. 100 units' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: C.slateLight, marginBottom: '5px' }}>{f.label}</label>
                <input value={newProduct[f.key]} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={addProduct} style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', color: C.slateLight }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
        {products.map(p => {
          const meta = STOCK_META[p.stockType];
          const isEditing = editingId === p.id;
          return (
            <div key={p.id}
              style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.2rem', boxShadow: '0 1px 3px rgba(26,29,35,0.05)', transition: 'box-shadow 0.15s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(26,29,35,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,29,35,0.05)'; e.currentTarget.style.transform = 'none'; }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '88px', background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`, borderRadius: C.radiusSm, fontSize: '2.1rem', marginBottom: '0.9rem' }}>
                {p.icon}
              </div>

              <div style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 600, color: C.muted, background: C.surface, padding: '2px 9px', borderRadius: '10px', marginBottom: '6px' }}>
                {p.cat}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: C.slate, marginBottom: '8px', lineHeight: 1.3 }}>{p.name}</div>

              {!isEditing ? (
                <>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: C.amberDark }}>{p.price}</div>
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', background: meta.background, color: meta.color }}>
                      {stockLabel(p)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', borderTop: `1px solid ${C.border}`, paddingTop: '0.8rem' }}>
                    <button onClick={() => startEdit(p)}
                      style={{ ...actionBtn, flex: 1, background: C.amberLight, color: C.amberDark, borderColor: 'rgba(232,130,12,0.25)' }}>
                      ✎ Edit
                    </button>
                    <button onClick={() => removeProduct(p.id)}
                      style={{ ...actionBtn, background: 'none', color: C.slateLight }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.redLight; e.currentTarget.style.color = C.red; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.slateLight; }}>
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '4px', borderTop: `1px solid ${C.border}`, paddingTop: '0.8rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.slateLight, marginBottom: '4px' }}>Unit Price</label>
                  <input value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. LKR 2,850"
                    style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '7px 10px', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }} />

                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.slateLight, marginBottom: '4px' }}>Stock Status</label>
                  <select value={editForm.stockType} onChange={e => setEditForm(f => ({ ...f, stockType: e.target.value }))}
                    style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '7px 10px', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '10px', background: C.white, color: C.slate }}>
                    <option value="in">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>

                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.slateLight, marginBottom: '4px' }}>Quantity (optional)</label>
                  <input value={editForm.stockNote} onChange={e => setEditForm(f => ({ ...f, stockNote: e.target.value }))}
                    placeholder="e.g. 240 bags"
                    style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '7px 10px', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => saveEdit(p.id)}
                      style={{ ...actionBtn, flex: 1, background: C.amber, color: '#fff', border: 'none' }}>
                      Save
                    </button>
                    <button onClick={cancelEdit}
                      style={{ ...actionBtn, background: 'none', color: C.slateLight }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontSize: '0.9rem' }}>No products yet — add your first one.</div>
      )}
    </div>
  );
}
