"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SupplierLayout({ children }) {
  const { isSupplier, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSupplier) router.replace("/dashboard");
  }, [loading, isSupplier, router]);

  if (loading || !isSupplier) return null;

  return children;
}
