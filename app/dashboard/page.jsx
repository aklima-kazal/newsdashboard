"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import StatCard from "@/components/StatCard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  // ✅ Protect the route: if not logged in, kick back to login
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-amber-100">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total News" value="1,245" />
        <StatCard title="Views Today" value="32,540" />
        <StatCard title="Active Editors" value="14" />
      </div>
    </div>
  );
}
