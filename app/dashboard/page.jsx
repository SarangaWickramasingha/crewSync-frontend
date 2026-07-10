"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { isSupplier, isProvider } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSupplier) router.replace("/dashboard/supplier/my-products");
    else if (isProvider) router.replace("/dashboard/serviceprovider");
  }, [isSupplier, isProvider, router]);

  if (isSupplier || isProvider) return null;

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