import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatMatchDate, formatSAR, timeUntil } from "@/lib/format";
import { MapPin, Shield, Trophy, ChevronLeft, Ticket as TicketIcon } from "lucide-react";

export const Route = createFileRoute("/match/$id")({
  head: () => ({ meta: [{ title: "تفاصيل المباراة — المدرج" }] }),
  component: MatchPage,
});

type Match = {
  id: string; home_team: string; away_team: string;
  competition: string; venue: string; city: string;
  kickoff_at: string; cover_color: string | null;
};
type Listing = {
  id: string; section: string; row_label: string | null; seat_label: string | null;
  quantity: number; price: number; currency: string; notes: string | null;
};

function MatchPage() {
  const { id } = Route.useParams();

  const { data: match } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("matches").select("*").eq("id", id).single();
      if (error) throw notFound();
      return data as Match;
    },
  });

  const { data: listings, isLoading } = useQuery({
    queryKey: ["listings", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_listings").select("*")
        .eq("match_id", id).eq("status", "available")
        .order("price", { ascending: true });
      if (error) throw error;
      return data as Listing[];
    },
  });

  if (!match) {
    return <div className="p-8 text-center text-muted-foreground">جاري التحميل…</div>;
  }

  return (
    <div className="px-4 pt-2">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <ChevronLeft className="size-4 rotate-180" /> رجوع
      </Link>

      <div className="glass rounded-3xl p-6 shadow-luxe mb-6"
        style={{ background: `linear-gradient(135deg, ${match.cover_color}40, transparent 70%), var(--card)` }}>
        <div className="flex items-center gap-2 text-xs text-silver font-bold mb-4">
          <Trophy className="size-3" /> {match.competition}
        </div>
        <h1 className="text-2xl font-black text-center my-4">
          {match.home_team} <span className="text-silver mx-2">×</span> {match.away_team}
        </h1>
        <div className="space-y-2 text-sm text-muted-foreground border-t border-border/50 pt-4">
          <p className="flex items-center gap-2"><MapPin className="size-4" /> {match.venue}، {match.city}</p>
          <p className="font-bold text-foreground">{formatMatchDate(match.kickoff_at)}</p>
          <p className="text-accent font-bold text-xs">{timeUntil(match.kickoff_at)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-muted-foreground tracking-wider">
          التذاكر المتاحة {listings && `(${listings.length})`}
        </h2>
        <span className="text-xs text-success flex items-center gap-1"><Shield className="size-3" /> دفع آمن</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-card animate-pulse" />)}</div>
      ) : listings && listings.length > 0 ? (
        <ul className="space-y-2 mb-8">
          {listings.map((l) => (
            <li key={l.id}>
              <Link to="/ticket/$id" params={{ id: l.id }} className="block glass rounded-2xl p-4 hover:shadow-glow transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">{l.section}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {l.row_label && `صف ${l.row_label}`} {l.seat_label && `• مقعد ${l.seat_label}`}
                      {l.quantity > 1 && ` • ${l.quantity} تذاكر`}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-lg font-black text-silver">{formatSAR(l.price)}</div>
                    <div className="text-[10px] text-muted-foreground">للتذكرة</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <TicketIcon className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">لا توجد تذاكر معروضة بعد لهذه المباراة</p>
          <Link to="/sell" className="mt-4 inline-block text-sm font-bold text-silver">كن أول البائعين →</Link>
        </div>
      )}
    </div>
  );
}
