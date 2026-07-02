"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProviderDashboard from "@/features/dashboard/ProviderDashboard";

export default function DashboardPage() {
  const { isSupplier, isProvider } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSupplier) router.replace("/dashboard/my-products");
  }, [isSupplier, router]);

  if (isSupplier) return null;
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