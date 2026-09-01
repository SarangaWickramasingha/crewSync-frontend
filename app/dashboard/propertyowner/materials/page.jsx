'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashHeader from '@/src/components/propertyOwner/DashHeader';
import RequestMaterialModal from '@/src/components/propertyOwner/RequestMaterialModal';
import MaterialCard from '@/src/components/propertyOwner/MaterialCard';
import { useAuth } from '@/context/AuthContext';
import { searchMaterials } from '@/src/api/searchApi';
import SearchPagination from '@/src/components/propertyOwner/SearchPagination';
import { MATERIAL_NAME_TO_ID } from '@/constants/registerMaps';
import { DISTRICTS } from '@/constants/districts';

const MATERIAL_CATEGORIES = Object.keys(MATERIAL_NAME_TO_ID);
// 'Hardware' is added to the filter only — not to registerMaps
const FILTER_CATEGORIES = [...MATERIAL_CATEGORIES, 'Hardware'];

const ALL_MATERIALS = 'All Materials';
const DEFAULT_REGION = 'Colombo';

export default function PropertyOwnerMaterialsPage() {
  const router = useRouter();
  const { isGuest } = useAuth();

  // Temporary dropdown states
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(ALL_MATERIALS);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [priceRange, setPriceRange] = useState('all');

  // Applied filter state (triggered on "Filter" click)
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: '',
    category: ALL_MATERIALS,
    region: DEFAULT_REGION,
    priceRange: 'all',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestingProduct, setRequestingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadMaterials = useCallback(async (filters, page = 1) => {
    setLoading(true);
    setError(null);

    const params = { page, page_size: 9 };
    if (filters.searchQuery.trim()) params.q = filters.searchQuery.trim();
    if (filters.category === 'Hardware') {
      params.hardware = 1;
    } else if (filters.category !== ALL_MATERIALS) {
      params.material_id = MATERIAL_NAME_TO_ID[filters.category];
    }
    if (filters.region !== 'All Regions') {
      params.district = filters.region;
    }
    if (filters.priceRange !== 'all') {
      const ranges = {
        'under1k':   { min: 0, max: 1000 },
        '1k-5k':     { min: 1000, max: 5000 },
        '5k-10k':    { min: 5000, max: 10000 },
        '10k-50k':   { min: 10000, max: 50000 },
        'above50k':  { min: 50000, max: null },
      };
      const pr = ranges[filters.priceRange];
      if (pr) {
        params.min_price = pr.min;
        if (pr.max !== null) params.max_price = pr.max;
      }
    }

    try {
      const result = await searchMaterials(params);
      setProducts(result.materials || []);
      setCurrentPage(result.pagination?.page || 1);
      setTotalItems(result.pagination?.total || 0);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (e) {
      setError(e.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadMaterials(appliedFilters, 1), 0);
    return () => clearTimeout(timer);
  }, [loadMaterials, appliedFilters]);

  const handleFilter = (e) => {
    e.preventDefault();
    setAppliedFilters({ searchQuery, category, region, priceRange });
  };

  return (
    <div>
      <DashHeader title="Find Materials" subtitle="Browse suppliers and compare prices" />

      <form onSubmit={handleFilter} className="flex gap-3 mb-6 flex-wrap items-center bg-white p-3.5 border border-black/10 rounded-xl">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by material, supplier, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16a34a] text-slate-800"
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Material
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16a34a] text-slate-800"
          >
            <option value={ALL_MATERIALS}>All Materials</option>
            {FILTER_CATEGORIES.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Region / District
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16a34a] text-slate-800"
          >
            <option value="All Regions">All Regions</option>
            {DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16a34a] text-slate-800"
          >
            <option value="all">Any Price</option>
            <option value="under1k">Under LKR 1,000</option>
            <option value="1k-5k">LKR 1,000 - 5,000</option>
            <option value="5k-10k">LKR 5,000 - 10,000</option>
            <option value="10k-50k">LKR 10,000 - 50,000</option>
            <option value="above50k">Above LKR 50,000</option>
          </select>
        </div>

        <div className="self-end">
          <button
            type="submit"
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 h-[38px]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
          Loading materials...
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#C0392B]">
          {error}
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center p-8 bg-white border border-black/10 rounded-xl text-sm text-[#8A8FA8]">
              No materials found matching your selected filters.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <MaterialCard
                    key={p.id}
                    product={p}
                    onRequest={(product) => {
                      if (isGuest) {
                        router.push('/register');
                      } else {
                        setRequestingProduct(product);
                      }
                    }}
                  />
                ))}
              </div>
              <SearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={totalItems}
                onPageChange={(p) => loadMaterials(appliedFilters, p)}
              />
            </>
          )}
        </>
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
