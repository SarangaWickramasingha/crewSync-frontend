"use client";
import React from "react";

export default function SupplierProductsPage() {
  const catalog = [
    {
      id: 1,
      icon: "🏗️",
      name: "OPC Cement – 50kg",
      category: "Cement & Concrete",
      price: "LKR 2,850",
      stockText: "In Stock (240 bags)",
      status: "green",
    },
    {
      id: 2,
      icon: "🔩",
      name: "TMT Steel Rod 12mm",
      category: "Steel & Iron",
      price: "LKR 890 / m",
      stockText: "Low Stock (18 units)",
      status: "amber",
    },
    {
      id: 3,
      icon: "🪣",
      name: "Sand – 1 Cube",
      category: "Aggregates",
      price: "LKR 12,000",
      stockText: "In Stock",
      status: "green",
    },
  ];

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-syne text-xl font-bold text-crewSlate [letter-spacing:-0.5px]">
            My Products
          </h2>
          <p className="text-xs text-crewMuted mt-0.5">
            Manage inventory and listings
          </p>
        </div>
        <button className="btn-sm bg-crewAmber hover:bg-crewAmber-dark text-white text-xs font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm">
          + Add Product
        </button>
      </div>

      {/* Grid Layout Matching --three-col Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {catalog.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-black/10 p-[1.1rem] transition-all hover:shadow-md"
            style={{ borderRadius: "12px" }}
          >
            {/* Product Image Placeholder */}
            <div className="w-full h-[90px] bg-[#EEECEA] rounded-lg flex items-center justify-center text-3xl mb-[0.8rem]">
              {product.icon}
            </div>

            {/* Product Details */}
            <h4 className="text-[0.88rem] font-bold text-crewSlate">
              {product.name}
            </h4>
            <p className="text-[0.72rem] text-crewMuted mt-0.5">
              {product.category}
            </p>
            
            <div className="font-syne text-[1.1rem] font-bold text-crewAmber-dark mt-[0.5rem]">
              {product.price}
            </div>

            {/* Stock Pill Badge Status */}
            <div className="mt-[4px]">
              <span
                className={`inline-block text-[0.7rem] font-semibold px-[9px] py-[2px] rounded-full ${
                  product.status === "green"
                    ? "bg-[#E6F4EC] text-[#1B6E3A]"
                    : "bg-[#FFF3E0] text-[#B85A00]"
                }`}
              >
                {product.stockText}
              </span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-[6px] mt-[0.7rem]">
              <button className="text-[0.75rem] font-medium border border-black/10 rounded-[6px] px-[10px] py-[5px] text-crewSlate-light hover:bg-[#F7F6F2] hover:text-crewSlate transition-all duration-150">
                Edit
              </button>
              <button className="text-[0.75rem] font-medium border border-black/10 rounded-[6px] px-[10px] py-[5px] text-crewSlate-light hover:bg-[#FDECEA] hover:text-[#C0392B] hover:border-[#C0392B]/30 transition-all duration-150">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}