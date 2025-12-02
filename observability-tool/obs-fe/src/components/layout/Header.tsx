import { Bell, HelpCircle, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
