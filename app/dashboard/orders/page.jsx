"use client";
import React, { useState } from "react";

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-041",
      customer: "Nimal Kumarasinghe",
      items: "Cement × 20 bags",
      amount: "LKR 57,000",
      status: "New",
    },
    {
      id: "#ORD-040",
      customer: "Chamari Perera",
      items: "Steel Rod × 50m",
      amount: "LKR 44,500",
      status: "Processing",
    },
    {
      id: "#ORD-039",
      customer: "Lasith Fernando",
      items: "Sand × 2 cubes",
      amount: "LKR 24,000",
      status: "Delivered",
    },
  ]);

  const handleAccept = (id) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: "Processing" } : o))
    );
  };

  const handleReject = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const handleDeliver = (id) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: "Delivered" } : o))
    );
  };

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-syne text-xl font-bold text-crewSlate [letter-spacing:-0.5px]">
          Orders
        </h2>
        <p className="text-xs text-crewMuted mt-0.5">
          Manage incoming material orders
        </p>
      </div>

      {/* Table Wrapper Matching .tbl-wrap Layout */}
      <div className="bg-white border border-black/10 overflow-hidden overflow-x-auto shadow-sm" style={{ borderRadius: "12px" }}>
        <table className="w-full border-collapse text-[0.83rem] text-left">
          <thead>
            <tr className="bg-[#EEECEA] border-b border-black/10 text-[0.75rem] font-semibold text-crewMuted uppercase tracking-wider">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-crewSlate">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#F7F6F2]/40 transition-colors">
                <td className="p-3 font-semibold text-crewSlate">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3 text-crewSlate-light">{order.items}</td>
                <td className="p-3 font-medium">{order.amount}</td>
                <td className="p-3">
                  {/* Pill Status Badges */}
                  <span
                    className={`inline-block text-[0.7rem] font-semibold px-[9px] py-[2px] rounded-full ${
                      order.status === "New"
                        ? "bg-[#FFF3E0] text-[#B85A00]"
                        : order.status === "Processing"
                        ? "bg-[#E8F0FB] text-[#1A56A0]"
                        : "bg-[#E6F4EC] text-[#1B6E3A]"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {/* Contextual Action Buttons */}
                  {order.status === "New" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="text-[0.75rem] font-medium border rounded-[6px] px-[10px] py-[5px] bg-[#E6F4EC] text-[#1B6E3A] border-[#1B6E3A]/20 hover:bg-[#d8edd3] transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="text-[0.75rem] font-medium border border-black/10 rounded-[6px] px-[10px] py-[5px] text-crewSlate-light hover:bg-[#FDECEA] hover:text-[#C0392B] hover:border-[#C0392B]/30 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === "Processing" && (
                    <button
                      onClick={() => handleDeliver(order.id)}
                      className="text-[0.75rem] font-medium border border-black/10 rounded-[6px] px-[10px] py-[5px] text-crewSlate-light hover:bg-[#F7F6F2] hover:text-crewSlate transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {order.status === "Delivered" && (
                    <span className="text-[0.75rem] text-crewMuted font-medium">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}