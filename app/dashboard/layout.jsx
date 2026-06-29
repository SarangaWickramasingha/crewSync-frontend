"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", fontFamily: "'DM Sans', sans-serif", color: "#1A1D23" }}>
      <nav style={{
        background: "#1A1D23", padding: "0 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#E8820C", letterSpacing: "-0.5px" }}>
          Crew<span style={{ color: "#fff" }}>Sync</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#E8820C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
              {user.avatar}
            </div>
            <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
          </div>
          <button onClick={handleLogout}
            style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "0.78rem", background: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Log out
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
            style={{ background: "none", border: "none", color: "#fff", fontSize: "1.3rem", cursor: "pointer", marginLeft: "4px" }}>
            ☰
          </button>
        </div>
      </nav>

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: "2rem 1.5rem", background: "#F7F6F2", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
