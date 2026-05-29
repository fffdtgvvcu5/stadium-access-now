import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatSAR, formatMatchDate } from "@/lib/format";
import { Shield, ChevronLeft, CheckCircle2, Apple, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ticket/$id")({
  head: () => ({ meta: [{ title: "تذكرة للبيع — المدرج" }] }),
  component: TicketPage,
});

function TicketPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_listings")
        .select("*, matches(*), profiles(full_name, verified, rating)")
        .eq("id", id).single();
      if (error) throw error;
      return data as any;
    },
  });

  if (isLoading || !data) return <div className="p-8 text-center text-muted-foreground">جاري التحميل…</div>;

  const total = Number(data.price) * data.quantity;
  const serviceFee = Math.round(total * 0.05);

  const handleBuy = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.info("سجّل دخول لإتمام الشراء");
      navigate({ to: "/login" });
      return;
    }
    toast.success("سيتم تفعيل بوابة الدفع قريباً");
  };

  return (
    <div className="px-4 pt-2 pb-32">
      <Link to="/match/$id" params={{ id: data.match_id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <ChevronLeft className="size-4 rotate-180" /> رجوع للمباراة
      </Link>

      {/* Ticket card */}
      <div className="relative bg-card rounded-3xl shadow-luxe overflow-hidden mb-4 border border-border">
        <div className="p-6 bg-silver text-primary-foreground">
          <p className="text-xs font-bold opacity-70">{data.matches.competition}</p>
          <h1 className="text-xl font-black mt-1">{data.matches.home_team} × {data.matches.away_team}</h1>
          <p className="text-xs mt-2 opacity-80">{formatMatchDate(data.matches.kickoff_at)}</p>
          <p className="text-xs opacity-80">{data.matches.venue}، {data.matches.city}</p>
        </div>
        {/* Perforation */}
        <div className="h-4 bg-card flex items-center" style={{ background: "radial-gradient(circle at 0 50%, var(--background) 8px, transparent 8px) repeat-x, radial-gradient(circle at 100% 50%, var(--background) 8px, transparent 8px) repeat-x", backgroundSize: "20px 16px" }}>
          <div className="flex-1 border-t-2 border-dashed border-border mx-6" />
        </div>
        <div className="p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">القطاع</p>
            <p className="font-black mt-1">{data.section}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">الصف</p>
            <p className="font-black mt-1">{data.row_label ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">المقعد</p>
            <p className="font-black mt-1">{data.seat_label ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Seller */}
      <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="size-10 rounded-full bg-silver flex items-center justify-center font-bold text-primary-foreground">
          {data.profiles?.full_name?.[0] ?? "ب"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm font-bold">
            {data.profiles?.full_name ?? "بائع"}
            {data.profiles?.verified && <CheckCircle2 className="size-4 text-success" />}
          </div>
          <p className="text-xs text-muted-foreground">تقييم {data.profiles?.rating ?? "5.0"} ★</p>
        </div>
        <Shield className="size-5 text-success" />
      </div>

      {data.notes && (
        <div className="glass rounded-2xl p-4 mb-4 text-sm">
          <p className="text-xs text-muted-foreground mb-1">ملاحظات البائع</p>
          <p>{data.notes}</p>
        </div>
      )}

      {/* Price breakdown */}
      <div className="glass rounded-2xl p-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">السعر × {data.quantity}</span><span>{formatSAR(total)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">رسوم الخدمة</span><span>{formatSAR(serviceFee)}</span></div>
        <div className="flex justify-between font-black text-base border-t border-border pt-2"><span>الإجمالي</span><span className="text-silver">{formatSAR(total + serviceFee)}</span></div>
      </div>

      {/* Pay buttons */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-4 max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-3 shadow-luxe space-y-2">
          <button onClick={handleBuy} className="w-full flex items-center justify-center gap-2 bg-foreground text-background rounded-xl py-3 font-bold">
            <Apple className="size-5" /> الدفع عبر Apple Pay
          </button>
          <button onClick={handleBuy} className="w-full flex items-center justify-center gap-2 bg-silver text-primary-foreground rounded-xl py-3 font-bold">
            <CreditCard className="size-5" /> بطاقة / مدى — {formatSAR(total + serviceFee)}
          </button>
        </div>
      </div>
    </div>
  );
}
