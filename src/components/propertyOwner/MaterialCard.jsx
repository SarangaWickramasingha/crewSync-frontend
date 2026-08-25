'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MATERIAL_NAME_TO_ID } from '@/constants/registerMaps';

const STOCK_STYLES = {
  green: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
    dot: 'bg-amber-500',
  },
  red: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200/60',
    dot: 'bg-rose-500',
  },
};

const getMaterialIconId = (product) => {
  if (product.material_id) return product.material_id;
  if (product.materialId) return product.materialId;

  const nameLower = (product.name || '').toLowerCase();
  for (const [materialName, id] of Object.entries(MATERIAL_NAME_TO_ID)) {
    if (nameLower.includes(materialName.toLowerCase())) {
      return id;
    }
  }
  return MATERIAL_NAME_TO_ID['Other'] || 9;
};

export default function MaterialCard({ product, onRequest }) {
  const [copied, setCopied] = useState(false);

  const {
    name,
    supplier,
    businessName,
    price,
    stock = 'In Stock',
    stockVariant = 'green',
    stockQuantity = product.quantity || product.stock_quantity || 100,
    contactNo = product.contact_no || product.phone || '+94 77 123 4567',
    isHardware = false,
  } = product;

  const materialId = getMaterialIconId(product);
  const iconPath = `/materials/${materialId}.jpg`;
  const stockStyle = STOCK_STYLES[stockVariant] || STOCK_STYLES.green;

  const handleCopyContact = (e) => {
    e.stopPropagation();
    if (!contactNo) return;
    navigator.clipboard.writeText(contactNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-xl p-4 hover:shadow-lg hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Icon & Badges */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50/80 to-amber-50/50 p-2 border border-orange-100/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xs flex-shrink-0">
            <Image
              src={iconPath}
              alt={name || 'Material Icon'}
              width={34}
              height={34}
              className="object-contain drop-shadow-xs"
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${stockStyle.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${stockStyle.dot}`} />
              {stock}
            </span>

            {/* Hardware / Materials type badge */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isHardware
                  ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                  : 'bg-slate-50 text-slate-500 border-slate-200/60'
              }`}
            >
              {isHardware ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              )}
              {isHardware ? 'Hardware' : 'Materials'}
            </span>

            {/* Stock Quantity */}
            <div className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <span>{stockQuantity} units left</span>
            </div>
          </div>
        </div>

        {/* Title & Supplier */}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#E8820C] transition-colors">
          {name}
        </h3>

        {/* Business Name */}
        {businessName && (
          <p className="text-[11px] font-semibold text-[#E8820C] mt-0.5 flex items-center gap-1 truncate">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{businessName}</span>
          </p>
        )}

        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{supplier}</span>
        </p>

        {/* Price Tag */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unit Price</span>
          <span className="text-base font-bold text-[#D96B00] tracking-normal">
            {price}
          </span>
        </div>

        {/* Contact No with Copy Button */}
        <div className="mt-2.5 bg-slate-50 border border-slate-200/70 rounded-xl p-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-orange-100/70 text-[#E8820C] flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Supplier Contact</div>
              <div className="text-xs font-semibold text-slate-800 tracking-tight truncate">{contactNo}</div>
            </div>
          </div>

          <button
            onClick={handleCopyContact}
            type="button"
            title="Copy Contact Number"
            className={`flex items-center justify-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all duration-200 cursor-pointer flex-shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:text-[#E8820C] active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        className="w-full mt-3.5 bg-[#E8820C] hover:bg-[#d67305] active:scale-[0.99] text-white text-xs font-bold py-2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer text-center"
        onClick={() => onRequest && onRequest(product)}
      >
        Request Quotation
      </button>
    </div>
  );
}
