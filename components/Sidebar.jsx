"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiPhpmyadmin } from "react-icons/si";
import { MdOutlineDashboard } from "react-icons/md";
import { IoMdAnalytics } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";

const menu = [
  {
    label: "Dashboard",
    icon: <MdOutlineDashboard size={24} />,
    href: "/dashboard",
  },
  {
    label: "Analytics",
    icon: <IoMdAnalytics size={20} />,
    href: "/dashboard/analytics",
  },
  {
    label: "News",
    icon: <IoNewspaperOutline size={24} />,
    children: [
      { label: "All News", href: "/dashboard/news" },
      { label: "Add News", href: "/dashboard/news/add" },
      { label: "Drafts", href: "/dashboard/news/drafts" },
    ],
  },
  {
    label: "Categories",
    icon: <MdOutlineCategory size={24} />,
    children: [
      { label: "All Categories", href: "/dashboard/categories" },
      { label: "Add Category", href: "/dashboard/categories/add" },
    ],
  },
  {
    label: "Settings",
    icon: <FiSettings size={22} />,
    children: [
      { label: "Profile", href: "/dashboard/settings/profile" },
      { label: "Security", href: "/dashboard/settings/security" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="w-64 min-h-screen bg-darkbg border-r border-borderdark p-4">
      <div className="mb-8 mt-2 flex gap-x-2 shadow-blue-100 shadow-lg/20 items-center rounded-md">
        <SiPhpmyadmin size={40} className="text-green-300 " />
        <h1 className="text-xl font-semibold text-white font-sans">
          News Admin
        </h1>
      </div>
      <nav className="space-y-2">
        {menu.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className={`sidebar-item text-lg font-medium ${
                  pathname === item.href ? "sidebar-active text-violet-400" : ""
                } gap-2 flex items-center text-blue-300 `}
              >
                {item.icon} {item.label}
              </Link>
            ) : (
              <button
                onClick={() =>
                  setOpenMenu(openMenu === item.label ? null : item.label)
                }
                className="sidebar-item w-full flex justify-between items-center "
              >
                <span
                  className={`flex text-blue-300 gap-x-2 cursor-pointer font-medium text-lg sidebar-item ${openMenu === item.label ? "sidebar-active text-violet-400" : ""}`}
                >
                  {item.icon} {item.label}
                </span>
                <span
                  className={`flex text-blue-300 gap-x-2 items-center cursor-pointer sidebar-item  ${openMenu === item.label ? "sidebar-active text-violet-400" : ""}`}
                >
                  {openMenu === item.label ? <BsCaretUp /> : <BsCaretDown />}
                </span>
              </button>
            )}

            {/* Submenu */}
            {item.children && openMenu === item.label && (
              <div className="ml-8 mt-1 space-y-1 animate-slide">
                {item.children.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className={`text-emerald-100 text-md font-semibold block px-3 py-2 rounded text-sm hover:text-white hover:bg-gray-800 ${
                      pathname === sub.href ? "bg-gray-800 " : ""
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
