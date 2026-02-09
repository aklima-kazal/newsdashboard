"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function Topbar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-slate-800 shadow-md shadow-indigo-300/30">
      <span className="text-green-200 text-3xl mx-auto font-semibold">
        Welcome Admin
      </span>
      <button
        onClick={handleLogout}
        className="bg-red-100 px-4 py-2 rounded text-base font-medium hover:bg-red-200 hover:scale-[101%] transition-all ease-in duration-200 cursor-pointer hover:rounded-xs shadow-md shadow-indigo-300/30 hover:rotate-2"
      >
        Logout
      </button>
    </div>
  );
}
