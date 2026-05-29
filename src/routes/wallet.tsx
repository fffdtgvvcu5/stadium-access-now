import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMatchDate, formatSAR } from "@/lib/format";
import { Ticket as TicketIcon, QrCode, Tag } from "lucide-react";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "محفظتي — المدرج" }] }),
  component: WalletPage,
});

function WalletPage() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const { data: tickets } = useQuery({
    queryKey: ["my-tickets", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_listings").select("*, matches(*)")
        .eq("seller_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  if (!userId) {
    return (
      <div className="px-4 pt-8 text-center">
        <TicketIcon className="size-12 text-silver mx-auto mb-4" />
        <h1 className="text-xl font-black mb-2">محفظة التذاكر</h1>
        <p className="text-muted-foreground text-sm mb-6">سجّل دخولك لعرض تذاكرك المشتراة والمعروضة للبيع.</p>
        <Link to="/login" className="inline-block bg-silver text-primary-foreground rounded-full px-8 py-3 font-bold">سجّل الدخول</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2">
      <h1 className="text-2xl font-black mb-1">محفظتي</h1>
      <p className="text-sm text-muted-foreground mb-6">تذاكرك المعروضة والمشتراة</p>

      {tickets && tickets.length > 0 ? (
        <ul className="space-y-3">
          {tickets.map((t) => (
            <li key={t.id} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">{t.matches.home_team} × {t.matches.away_team}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatMatchDate(t.matches.kickoff_at)}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">{t.section} • {formatSAR(t.price)}</span>
                <button className="text-xs flex items-center gap-1 text-silver font-bold">
                  <QrCode className="size-4" /> عرض QR
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <Tag className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">لا توجد تذاكر في محفظتك بعد</p>
          <Link to="/sell" className="inline-block bg-silver text-primary-foreground rounded-full px-6 py-2 text-sm font-bold">اعرض تذكرتك للبيع</Link>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    available: { label: "معروضة", cls: "bg-success/15 text-success" },
    reserved: { label: "محجوزة", cls: "bg-accent/15 text-accent" },
    sold: { label: "مُباعة", cls: "bg-muted text-muted-foreground" },
    cancelled: { label: "ملغاة", cls: "bg-destructive/15 text-destructive" },
  };
  const v = map[status] ?? map.available;
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${v.cls}`}>{v.label}</span>;
}
