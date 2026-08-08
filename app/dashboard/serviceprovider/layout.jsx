"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ServiceProviderLayout({ children }) {
  const { isProvider, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isProvider) router.replace("/dashboard");
  }, [loading, isProvider, router]);

  if (loading || !isProvider) return null;

  return children;
}
