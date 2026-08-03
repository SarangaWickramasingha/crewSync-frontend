"use client";
import { useState, useEffect } from "react";
import { MATERIAL_NAME_TO_ID } from "@/constants/registerMaps";
import { API_SUPPLIER_PRODUCTS, API_SUPPLIER_PRODUCT_DELETE } from "@/config/api";
import ProductCard from "@/Components/dashboard/materialSupplier/ProductCard";

const MATERIAL_TITLES = Object.keys(MATERIAL_NAME_TO_ID);

const C = {
  amber: '#E8820C', amberLight: '#FFF3E0', amberDark: '#B85A00',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', surface2: '#EEECEA', white: '#FFFFFF',
  green: '#1B6E3A', greenLight: '#E6F4EC',
  red: '#C0392B', redLight: '#FDECEA',
  border: 'rgba(26,29,35,0.1)', radius: '14px', radiusSm: '8px',
};

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: MATERIAL_TITLES[0] || 'Sand', description: '', price: '', stockNote: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', stockType: 'in', stockNote: '', description: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await fetch(API_SUPPLIER_PRODUCTS, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (isMounted && data.success) setProducts(data.products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  async function removeProduct(id) {
    if (!window.confirm('Remove this product?')) return;
    try {
      const res = await fetch(API_SUPPLIER_PRODUCT_DELETE(id), { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) setProducts(p => p.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function addProduct() {
    if (!newProduct.title || !newProduct.price) return;
    const materialId = MATERIAL_NAME_TO_ID[newProduct.title];
    const priceNum = parseFloat(newProduct.price.replace(/[^0-9.]/g, ''));
    const qtyNum = parseInt(newProduct.stockNote.replace(/[^0-9]/g, '')) || 0;

    setBusy(true);
    try {
      const res = await fetch(API_SUPPLIER_PRODUCTS, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: materialId,
          unit_price: priceNum,
          stock_qty: qtyNum,
          description: newProduct.description,
          is_available: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Reload full list to get correctly formatted fields from server
        const res2 = await fetch(API_SUPPLIER_PRODUCTS, { method: 'GET', credentials: 'include' });
        const data2 = await res2.json();
        if (data2.success) setProducts(data2.products);
        setNewProduct({ title: MATERIAL_TITLES[0] || 'Sand', description: '', price: '', stockNote: '' });
        setShowAdd(false);
      } else {
        alert(data.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({ price: p.price, stockType: p.stockType, stockNote: p.stockNote || '', description: p.description || '' });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const priceNum = parseFloat(editForm.price.replace(/[^0-9.]/g, ''));
    const qtyNum = parseInt(editForm.stockNote.replace(/[^0-9]/g, '')) || 0;
    const isAvailable = editForm.stockType !== 'out';

    setBusy(true);
    try {
      const res = await fetch(API_SUPPLIER_PRODUCTS, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: product.material_id,
          unit_price: priceNum,
          stock_qty: qtyNum,
          description: editForm.description,
          is_available: isAvailable,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const res2 = await fetch(API_SUPPLIER_PRODUCTS, { method: 'GET', credentials: 'include' });
        const data2 = await res2.json();
        if (data2.success) setProducts(data2.products);
        setEditingId(null);
      } else {
        alert(data.message || 'Failed to update product.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>Loading products…</div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

      {showAdd && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(26,29,35,0.04)' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: C.slateLight, marginBottom: '5px' }}>Product Title</label>
              <select
                value={newProduct.title}
                onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))}
                style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', background: C.white, color: C.slate }}
              >
                {MATERIAL_TITLES.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            {[
              { key: 'description', label: 'Description', placeholder: 'e.g. Durable weather-resistant material' },
              { key: 'price', label: 'Unit Price', placeholder: 'e.g. 1500' },
              { key: 'stockNote', label: 'Available Quantity', placeholder: 'e.g. 100' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: C.slateLight, marginBottom: '5px' }}>{f.label}</label>
                <input value={newProduct[f.key]} onChange={e => setNewProduct(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: '8px 12px', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={addProduct} disabled={busy} style={{ background: C.amber, color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? 'Saving…' : 'Add'}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: `1px solid ${C.border}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', color: C.slateLight }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            isEditing={editingId === p.id}
            editForm={editForm}
            setEditForm={setEditForm}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onSaveEdit={saveEdit}
            onRemoveProduct={removeProduct}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontSize: '0.9rem' }}>No products yet — add your first one.</div>
      )}
    </div>
  );
}