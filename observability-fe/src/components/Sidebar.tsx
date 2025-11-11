"use client";

import { ChevronDown } from "lucide-react";
import { SidebarNavItems } from "@/data/sidebar/sidebar_nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-gray-800 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto bg-[#0d1117]">
      {/* Logo */}
      <div className="h-14 border-b border-gray-800 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded"></div>
          <span className="font-semibold text-white">Observability</span>
          <span className="text-xs text-gray-500">v1.0.0</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 text-sm">
        <Link href={"/"}>
          <div className="px-2 py-1.5 rounded text-gray-400 hover:bg-gray-800">
            Dashboard
          </div>
        </Link>
        <Link href={"/organizations"}>
          <div className="px-2 py-1.5 rounded text-gray-400 hover:bg-gray-800">
            Your Organisations
          </div>
        </Link>

        {SidebarNavItems.map(({ parent, children }) => (
          <div key={parent}>
            <div className="text-xs text-gray-500 px-2 mb-2 mt-4">{parent}</div>
            <div className="flex flex-col">
              {children.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    href={href}
                    key={label}
                    className={`px-2 py-1.5 rounded block ${
                      isActive
                        ? "text-white bg-gray-800"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-pink-500"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Arash Arora</div>
            <div className="text-xs text-gray-500 truncate">
              arasharora2001@g...
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
