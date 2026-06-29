"use client";
import { useAuth } from "@/context/AuthContext";
import SupplierDashboard from "@/features/dashboard/SupplierDashboard";
import ProviderDashboard from "@/features/dashboard/ProviderDashboard";

export default function DashboardPage() {
  const { isSupplier, isProvider } = useAuth();

  if (isSupplier) return <SupplierDashboard />;
  if (isProvider) return <ProviderDashboard />;

  // Property Owner default (placeholder until OwnerDashboard is built)
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#1A1D23', marginBottom: '0.4rem' }}>
        Dashboard
      </h2>
      <p style={{ fontSize: '0.82rem', color: '#8A8FA8' }}>Select your role to view your dashboard.</p>
    </div>
  );
}