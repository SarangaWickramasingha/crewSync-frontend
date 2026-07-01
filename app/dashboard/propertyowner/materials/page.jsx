'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import RequestMaterialModal from '@/Components/dashboard/RequestMaterialModal';
import { useAuth } from '@/context/AuthContext';

const PRODUCTS = [
  {
    name: 'OPC Cement – 50kg Bag', supplier: 'Malshan Hardware, Kandy',
    price: 'LKR 2,850', stock: 'In Stock', stockVariant: 'green',
  },
  {
    name: 'TMT Steel Rod – 12mm', supplier: 'Kandy Steel Traders',
    price: 'LKR 890 / m', stock: 'In Stock', stockVariant: 'green',
  },
  {
    name: "Teak Timber – 4\"×2\"×12'", supplier: 'Silva Timber Mills, Matale',
    price: 'LKR 1,650 / piece', stock: 'Low Stock', stockVariant: 'amber',
  },
];

const STOCK_STYLES = {
  green: 'bg-[#E6F4EC] text-[#1B6E3A]',
  amber: 'bg-[#FFF3E0] text-[#B85A00]',
};

export default function PropertyOwnerMaterialsPage() {
  const router = useRouter();
  const { isGuest } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [requestingProduct, setRequestingProduct] = useState(null);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchVal.toLowerCase());
    
    // Categorize products on frontend
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      (selectedCategory === 'Cement & Concrete' && p.name.toLowerCase().includes('cement')) ||
      (selectedCategory === 'Steel & Iron' && p.name.toLowerCase().includes('steel')) ||
      (selectedCategory === 'Timber & Wood' && p.name.toLowerCase().includes('timber'));
      
    const matchesRegion =
      selectedRegion === 'All Regions' ||
      p.supplier.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div>
      <DashHeader title="Find Materials" subtitle="Browse suppliers and compare prices" />

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="flex-1 min-w-[200px] bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        >
          <option value="All Categories">All Categories</option>
          <option value="Cement & Concrete">Cement & Concrete</option>
          <option value="Steel & Iron">Steel & Iron</option>
          <option value="Timber & Wood">Timber & Wood</option>
          <option value="Tiles">Tiles</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
        </select>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        >
          <option value="All Regions">All Regions</option>
          <option value="Kandy">Kandy</option>
          <option value="Colombo">Colombo</option>
          <option value="Badulla">Badulla</option>
          <option value="Matale">Matale</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          No materials found matching your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.name} className="bg-white border border-black/10 rounded-xl p-4.5 hover:shadow-md transition-all">
              <div className="w-full h-[90px] bg-[#EEECEA] rounded-lg flex items-center justify-center mb-3">
                <svg className="w-10 h-10 text-[#8A8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  {p.name.toLowerCase().includes('cement') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  ) : p.name.toLowerCase().includes('steel') || p.name.toLowerCase().includes('rod') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  )}
                </svg>
              </div>
              <div className="text-sm font-bold">{p.name}</div>
              <div className="text-xs text-[#8A8FA8]">{p.supplier}</div>
              <div className="font-syne text-lg font-bold text-[#B85A00] mt-2">{p.price}</div>
              <span className={`inline-block text-xs font-semibold px-3 py-0.5 rounded-full mt-1 ${STOCK_STYLES[p.stockVariant]}`}>
                {p.stock}
              </span>
              <button
                className="w-full mt-2.5 bg-[#E8820C] hover:opacity-85 text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer"
                onClick={() => {
                  if (isGuest) {
                    router.push('/register');
                  } else {
                    setRequestingProduct(p);
                  }
                }}
              >
                Request
              </button>
            </div>
          ))}
        </div>
      )}

      {requestingProduct && (
        <RequestMaterialModal
          product={requestingProduct}
          onClose={() => setRequestingProduct(null)}
        />
      )}
    </div>
  );
}