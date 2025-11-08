"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BarChart, ClipboardList, Users, Settings } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Traces", icon: BarChart, href: "/traces" },
  { name: "Evaluation", icon: ClipboardList, href: "/evaluation" },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="px-6 py-5 font-bold text-xl border-b">Langfuse</div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100",
              pathname === item.href ? "bg-gray-100 text-gray-900" : "text-gray-600"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  )
}
