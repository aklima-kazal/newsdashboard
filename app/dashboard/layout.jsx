"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useState } from "react";
import { SearchProvider } from "@/lib/SearchContext";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, []);

  return (
    <SearchProvider>
      <div className="flex min-h-screen ">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 bg-slate-900">
          <Topbar toggleSidebar={() => setSidebarOpen((s) => !s)} />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </SearchProvider>
  );
}
