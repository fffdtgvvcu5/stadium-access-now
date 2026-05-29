import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatMatchDate, timeUntil } from "@/lib/format";
import { MapPin, Trophy, ChevronLeft } from "lucide-react";
import heroStadium from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "المباريات القادمة — المدرج" }] }),
  component: HomePage,
});

type Match = {
  id: string; home_team: string; away_team: string;
  competition: string; venue: string; city: string;
  kickoff_at: string; cover_color: string | null;
};

function HomePage() {
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches").select("*").gte("kickoff_at", new Date().toISOString())
        .order("kickoff_at", { ascending: true }).limit(20);
      if (error) throw error;
      return data as Match[];
    },
  });

  const next = matches?.[0];
  const rest = matches?.slice(1) ?? [];

  return (
    <div className="px-4 pt-2">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl mb-6 shadow-luxe">
        <img src={heroStadium} alt="" className="absolute inset-0 size-full object-cover opacity-50" width={1600} height={1000} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative p-6 pt-32">
          <p className="text-xs font-bold tracking-[0.3em] text-silver mb-2">السوق الموثوق</p>
          <h1 className="text-3xl font-black leading-tight">
            تذاكرك للمباراة<br />
            <span className="text-silver">في ثوانٍ معدودة</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            اشترِ تذاكرك أو أعد بيع الفائض بأمان — دفع محمي، تسليم QR فوري.
          </p>
        </div>
      </section>

      {/* Next match featured */}
      {next && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-muted-foreground tracking-wider">المباراة القادمة</h2>
            <span className="text-xs text-accent font-bold">{timeUntil(next.kickoff_at)}</span>
          </div>
          <FeaturedMatchCard match={next} />
        </section>
      )}

      {/* Upcoming list */}
      <section className="mb-12">
        <h2 className="text-sm font-bold text-muted-foreground tracking-wider mb-3">مباريات قادمة</h2>
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-card animate-pulse" />
          ))}</div>
        ) : (
          <ul className="space-y-3">
            {rest.map((m) => <li key={m.id}><MatchCard match={m} /></li>)}
            {rest.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">لا توجد مباريات إضافية</p>}
          </ul>
        )}
      </section>
    </div>
  );
}

function FeaturedMatchCard({ match }: { match: Match }) {
  return (
    <Link
      to="/match/$id" params={{ id: match.id }}
      className="block glass rounded-3xl p-6 shadow-luxe relative overflow-hidden group"
      style={{ background: `linear-gradient(135deg, ${match.cover_color}40, transparent 70%), var(--card)` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-silver flex items-center gap-1"><Trophy className="size-3" />{match.competition}</span>
        <ChevronLeft className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div className="flex items-center justify-around text-center my-6">
        <TeamBadge name={match.home_team} />
        <div className="text-2xl font-black text-silver">VS</div>
        <TeamBadge name={match.away_team} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
        <span className="flex items-center gap-1"><MapPin className="size-3" />{match.venue} • {match.city}</span>
        <span className="font-bold">{formatMatchDate(match.kickoff_at)}</span>
      </div>
    </Link>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Link to="/match/$id" params={{ id: match.id }} className="block glass rounded-2xl p-4 hover:shadow-glow transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>{match.home_team}</span>
            <span className="text-muted-foreground text-xs">ضد</span>
            <span>{match.away_team}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{match.competition}</div>
        </div>
        <div className="text-end">
          <div className="text-xs font-bold text-accent">{timeUntil(match.kickoff_at)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{match.city}</div>
        </div>
      </div>
    </Link>
  );
}

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="size-16 rounded-full bg-silver shadow-glow flex items-center justify-center text-primary-foreground font-black text-xl">
        {name.slice(0, 2)}
      </div>
      <span className="text-sm font-bold">{name}</span>
    </div>
  );
}
