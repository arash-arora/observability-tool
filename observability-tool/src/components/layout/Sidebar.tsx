"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  History,
  Terminal,
  Database,
  BarChart,
  Box,
  Settings,
  BookOpen,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Traces", href: "/traces", icon: List },
  // { name: "Sessions", href: "/sessions", icon: History },
  // { name: "Prompts", href: "/prompts", icon: Terminal },
  // { name: "Datasets", href: "/datasets", icon: Database },
  // { name: "Scores", href: "/scores", icon: BarChart },
  // { name: "Models", href: "/models", icon: Box },
  // { name: "Settings", href: "/settings", icon: Settings },
];

const bottomItems = [
  { name: "Documentation", href: "#", icon: BookOpen },
  { name: "Support", href: "#", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/10 text-foreground">
      <div className="flex h-14 items-center border-b px-4 font-bold text-xl bg-background/50 backdrop-blur-sm">
        Observability Tool
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4 bg-background/50">
        <nav className="grid gap-1">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
