import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';

const PRODUCTS = [
  {
    icon: '🏗️', name: 'OPC Cement – 50kg Bag', supplier: 'Malshan Hardware, Kandy',
    price: 'LKR 2,850', stock: 'In Stock', stockVariant: 'green',
  },
  {
    icon: '🔩', name: 'TMT Steel Rod – 12mm', supplier: 'Kandy Steel Traders',
    price: 'LKR 890 / m', stock: 'In Stock', stockVariant: 'green',
  },
  {
    icon: '🪵', name: 'Teak Timber – 4"×2"×12\'', supplier: 'Silva Timber Mills, Matale',
    price: 'LKR 1,650 / piece', stock: 'Low Stock', stockVariant: 'amber',
  },
];

const STOCK_STYLES = {
  green: 'bg-[#E6F4EC] text-[#1B6E3A]',
  amber: 'bg-[#FFF3E0] text-[#B85A00]',
};

export default function PropertyOwnerMaterialsPage() {
  return (
    <div>
      <DashHeader title="Find Materials" subtitle="Browse suppliers and compare prices" />

      <div className="flex gap-2.5 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search materials..."
          className="flex-1 min-w-[200px] bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]"
        />
        <select className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]">
          <option>All Categories</option>
          <option>Cement & Concrete</option><option>Steel & Iron</option>
          <option>Timber & Wood</option><option>Tiles</option>
          <option>Plumbing</option><option>Electrical</option>
        </select>
        <select className="bg-white border border-black/10 rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#E8820C]">
          <option>All Regions</option>
          <option>Kandy</option><option>Colombo</option><option>Badulla</option>
        </select>
        <button className="bg-[#E8820C] hover:bg-[#B85A00] text-white text-sm font-semibold px-4.5 py-2 rounded-lg">
          Search
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((p) => (
          <div key={p.name} className="bg-white border border-black/10 rounded-xl p-4.5">
            <div className="w-full h-[90px] bg-[#EEECEA] rounded-lg flex items-center justify-center text-3xl mb-3">
              {p.icon}
            </div>
            <div className="text-sm font-bold">{p.name}</div>
            <div className="text-xs text-[#8A8FA8]">{p.supplier}</div>
            <div className="font-syne text-lg font-bold text-[#B85A00] mt-2">{p.price}</div>
            <span className={`inline-block text-xs font-semibold px-3 py-0.5 rounded-full mt-1 ${STOCK_STYLES[p.stockVariant]}`}>
              {p.stock}
            </span>
            <button className="w-full mt-2.5 bg-[#E8820C] hover:opacity-85 text-white text-xs font-semibold py-2 rounded-md">
              Request Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}