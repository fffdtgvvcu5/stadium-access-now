import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Ticket, PlusCircle, User } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "المباريات" },
  { to: "/wallet", icon: Ticket, label: "محفظتي" },
  { to: "/sell", icon: PlusCircle, label: "بيع تذكرة" },
  { to: "/profile", icon: User, label: "حسابي" },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4 max-w-2xl mx-auto">
        {items.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${
                  active ? "text-silver" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`size-5 ${active ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""}`} strokeWidth={active ? 2.4 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
