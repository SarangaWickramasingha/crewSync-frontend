"use client";
import React, { useState } from "react";

const STATUS_META = {
  New:        { badge: "bg-[#FFF3E0] text-[#B85A00]", dot: "#E8820C" },
  Processing: { badge: "bg-[#E8F0FB] text-[#1A56A0]", dot: "#1A56A0" },
  Delivered:  { badge: "bg-[#E6F4EC] text-[#1B6E3A]", dot: "#1B6E3A" },
};

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-041",
      customer: "Nimal Kumarasinghe",
      items: "Cement × 20 bags",
      amount: "LKR 57,000",
      date: "Jul 4, 2026",
      status: "New",
    },
    {
      id: "#ORD-040",
      customer: "Chamari Perera",
      items: "Steel Rod × 50m",
      amount: "LKR 44,500",
      date: "Jul 2, 2026",
      status: "Processing",
    },
    {
      id: "#ORD-039",
      customer: "Lasith Fernando",
      items: "Sand × 2 cubes",
      amount: "LKR 24,000",
      date: "Jun 28, 2026",
      status: "Delivered",
    },
  ]);

  const handleAccept = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Processing" } : o)));
  };

  const handleReject = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="font-syne text-xl font-bold text-crewSlate [letter-spacing:-0.5px]">
            Orders
          </h2>
          <p className="text-xs text-crewMuted mt-0.5">
            Manage incoming material orders
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white border border-black/10 overflow-hidden overflow-x-auto shadow-sm rounded-xl">
        <table className="w-full border-collapse text-[0.83rem] text-left">
          <thead>
            <tr className="bg-[#EEECEA] border-b border-black/10 text-[0.72rem] font-semibold text-crewMuted uppercase tracking-wider">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-crewSlate">
            {orders.map((order) => {
              const meta = STATUS_META[order.status];
              return (
                <tr key={order.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                  <td className="p-3 font-semibold text-crewSlate">{order.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#EEECEA] text-crewSlate-light text-[0.68rem] font-bold flex items-center justify-center flex-shrink-0">
                        {initials(order.customer)}
                      </span>
                      <span>{order.customer}</span>
                    </div>
                  </td>
                  <td className="p-3 text-crewSlate-light">{order.items}</td>
                  <td className="p-3 font-semibold">{order.amount}</td>
                  <td className="p-3 text-crewMuted">{order.date}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold px-[9px] py-[3px] rounded-full ${meta.badge}`}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.status === "New" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(order.id)}
                          className="text-[0.75rem] font-semibold border rounded-[7px] px-[11px] py-[6px] bg-[#E6F4EC] text-[#1B6E3A] border-[#1B6E3A]/20 hover:bg-[#d8edd3] transition-all"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="text-[0.75rem] font-medium border border-black/10 rounded-[7px] px-[11px] py-[6px] text-crewSlate-light hover:bg-[#FDECEA] hover:text-[#C0392B] hover:border-[#C0392B]/30 transition-all"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}

                    {order.status === "Processing" && (
                      <span className="text-[0.75rem] text-[#1A56A0] font-medium">
                        ⏳ In Progress
                      </span>
                    )}

                    {order.status === "Delivered" && (
                      <span className="text-[0.75rem] text-[#1B6E3A] font-medium">
                        ✓ Completed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-crewMuted text-sm">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
