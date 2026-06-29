"use client";
import { useState } from "react";

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  red: '#C0392B', redLight: '#FDECEA',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

const INITIAL_PRODUCTS = [
  { id: 1, icon: '🏗️', name: 'OPC Cement – 50kg',  cat: 'Cement & Concrete', price: 'LKR 2,850',   stock: 'In Stock (240 bags)',  stockType: 'in' },
  { id: 2, icon: '🔩', name: 'TMT Steel Rod 12mm', cat: 'Steel & Iron',       price: 'LKR 890 / m', stock: 'Low Stock (18 units)', stockType: 'low' },
  { id: 3, icon: '🪣', name: 'Sand – 1 Cube',      cat: 'Aggregates',         price: 'LKR 12,000',  stock: 'In Stock',             stockType: 'in' },
];

const PILL = {
  in:  { background: '#E6F4EC', color: '#1B6E3A' },
  low: { background: '#FFF3E0', color: '#B85A00' },
  out: { background: '#FDECEA', color: '#C0392B' },
};

const actionBtn = {
  background: 'none', border: '1px solid rgba(26,29,35,0.1)', borderRadius: '6px',
  padding: '5px 10px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", color: '#4A5068',
};

export default function MyProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', cat: '', price: '', stock: '' });

  function removeProduct(id) {
    if (window.confirm('Remove this product?')) setProducts(p => p.filter(x => x.id !== id));
  }

  function addProduct() {
    if (!newProduct.name || !newProduct.price) return;
    setProducts(p => [...p, { ...newProduct, id: Date.now(), icon: '📦', stockType: 'in' }]);
    setNewProduct({ name: '', cat: '', price: '', stock: '' });
    setShowAdd(false);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.slate }}>My Products</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, marginTop: '2px' }}>Manage inventory and listings</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          + Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { key: 'name', label: 'Product Name', placeholder: 'e.g. Roofing Tiles' },
              { key: 'cat',  label: 'Category',     placeholder: 'e.g. Roofing' },
              { key: 'price',label: 'Price',         placeholder: 'e.g. LKR 1,500' },
              { key: 'stock',label: 'Stock Info',    placeholder: 'e.g. In Stock (100 units)' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.1rem' }}>
            <div style={{ width: '100%', height: '90px', background: C.surface2, borderRadius: C.radiusSm, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '0.8rem' }}>
              {p.icon}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '2px' }}>{p.name}</div>
            <div style={{ fontSize: '0.72rem', color: C.muted }}>{p.cat}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: C.amberDark, marginTop: '0.5rem' }}>{p.price}</div>
            {p.stock && (
              <div style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 9px', borderRadius: '12px', ...PILL[p.stockType] }}>{p.stock}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '6px', marginTop: '0.7rem' }}>
              <button style={actionBtn}>Edit</button>
              <button onClick={() => removeProduct(p.id)} style={{ ...actionBtn }}
                onMouseEnter={e => { e.currentTarget.style.background = C.redLight; e.currentTarget.style.color = C.red; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.slateLight; }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
