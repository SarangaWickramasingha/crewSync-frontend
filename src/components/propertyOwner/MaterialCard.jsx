'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MATERIAL_NAME_TO_ID } from '@/constants/registerMaps';

const STOCK_STYLES = {
  green: {
    badge: 'bg-emerald-500/90 text-white border-emerald-400/30',
    dot: 'bg-white',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  amber: {
    badge: 'bg-amber-500/90 text-white border-amber-400/30',
    dot: 'bg-white',
    pill: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  red: {
    badge: 'bg-rose-500/90 text-white border-rose-400/30',
    dot: 'bg-white',
    pill: 'bg-rose-50 text-rose-700 border-rose-200/80',
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
    district,
    description,
    price,
    stock = 'In Stock',
    stockVariant = 'green',
    stock_qty,
    quantity,
    stock_quantity,
    contactNo = product.contact_no || product.phone || '+94 77 123 4567',
    isHardware = false,
  } = product;

  const unitsLeft = stock_qty ?? quantity ?? stock_quantity ?? 0;
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
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl p-4 hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      <div>
        {/* Large Prominent Product Image with Floating Badges */}
        <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/80 mb-3.5">
          <Image
            src={iconPath}
            alt={name || 'Material Photo'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left: Hardware / Materials Category Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md border shadow-xs ${
                isHardware
                  ? 'bg-blue-900/80 text-blue-100 border-blue-400/30'
                  : 'bg-slate-900/80 text-slate-100 border-white/20'
              }`}
            >
              {isHardware ? (
                <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              )}
              <span>{isHardware ? 'Hardware' : 'Material'}</span>
            </span>
          </div>

          {/* Top Right: Stock Status Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border shadow-xs ${stockStyle.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${stockStyle.dot}`} />
              {stock}
            </span>
          </div>
        </div>

        {/* Title and Rating / Availability */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {name}
          </h3>
          {unitsLeft > 0 && (
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0 flex items-center gap-1">
              <span className="font-semibold text-slate-800">{unitsLeft}</span> left
            </span>
          )}
        </div>

        {/* Business & Location */}
        <div className="space-y-1 mb-2.5">
          {businessName && (
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 truncate">
              <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="truncate">{businessName}</span>
            </p>
          )}

          <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{district ? `${district}${supplier && supplier !== district ? ` · ${supplier}` : ''}` : supplier}</span>
          </p>
        </div>

        {/* Description (if provided) */}
        {description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            {description}
          </p>
        )}

        {/* Price Tag Box */}
        <div className="pt-2.5 pb-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Unit Price</span>
          <span className="text-base sm:text-lg font-bold text-emerald-700">
            {price}
          </span>
        </div>

        {/* Supplier Contact with One-Click Copy */}
        <div className="mt-1 bg-slate-50 border border-slate-200/80 rounded-xl p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="truncate">
              <div className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Supplier Phone</div>
              <div className="text-xs font-bold text-slate-800 tracking-tight truncate">{contactNo}</div>
            </div>
          </div>

          <button
            onClick={handleCopyContact}
            type="button"
            title="Copy Contact Number"
            className={`flex items-center justify-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer flex-shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 active:scale-95 shadow-xs'
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
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className="w-full mt-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
        onClick={() => onRequest && onRequest(product)}
      >
        <span>Request Quotation</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}
