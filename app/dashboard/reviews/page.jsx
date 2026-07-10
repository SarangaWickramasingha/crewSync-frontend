"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldReviewsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/serviceprovider/reviews"); }, [router]);
  return null;
}
