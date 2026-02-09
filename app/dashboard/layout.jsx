"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push("/login");
  }, [loading, isLoggedIn, router]);

  if (loading || !isLoggedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-900">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
        <p className="text-cyan-400">Loading...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6 pt-16">{children}</main>
      </div>
    </div>
  );
}
