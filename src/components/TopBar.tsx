import { Logo } from "./Logo";
import { Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size={36} />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="بحث">
            <Search className="size-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors relative" aria-label="إشعارات">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-accent rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
