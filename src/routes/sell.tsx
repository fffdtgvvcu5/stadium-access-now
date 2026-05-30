import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMatchDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "بيع تذكرة — المدرج" }] }),
  component: SellPage,
});

function SellPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [matchId, setMatchId] = useState("");
  const [section, setSection] = useState("");
  const [row, setRow] = useState("");
  const [seat, setSeat] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const { data: matches } = useQuery({
    queryKey: ["matches-select"],
    queryFn: async () => {
      const { data, error } = await supabase.from("matches").select("*")
        .gte("kickoff_at", new Date().toISOString()).order("kickoff_at");
      if (error) throw error;
      return data;
    },
  });

  if (!userId) {
    return (
      <div className="px-4 pt-8 text-center">
        <h1 className="text-xl font-black mb-2">بيع تذكرة</h1>
        <p className="text-muted-foreground text-sm mb-6">سجّل دخولك لعرض تذكرة للبيع.</p>
        <button onClick={() => navigate({ to: "/login" })} className="bg-silver text-primary-foreground rounded-full px-8 py-3 font-bold">
          سجّل الدخول
        </button>
      </div>
    );
  }

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    setImagePreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId || !section || !price) {
      toast.error("املأ الحقول المطلوبة");
      return;
    }
    setSubmitting(true);
    let image_url: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("ticket-images").upload(path, imageFile, { upsert: false });
      if (upErr) { setSubmitting(false); toast.error(upErr.message); return; }
      image_url = supabase.storage.from("ticket-images").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("ticket_listings").insert({
      match_id: matchId, seller_id: userId, section, row_label: row || null,
      seat_label: seat || null, price: Number(price), quantity, notes: notes || null,
      image_url,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("تم عرض تذكرتك بنجاح");
    navigate({ to: "/wallet" });
  };

  return (
    <div className="px-4 pt-2">
      <h1 className="text-2xl font-black mb-1">بيع تذكرة</h1>
      <p className="text-sm text-muted-foreground mb-6">3 خطوات سريعة وتذكرتك معروضة في السوق</p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="المباراة *">
          <select value={matchId} onChange={(e) => setMatchId(e.target.value)} required
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm">
            <option value="">اختر المباراة</option>
            {matches?.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.home_team} × {m.away_team} — {formatMatchDate(m.kickoff_at)}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="المربع *"><Input value={section} onChange={setSection} placeholder="A12" required /></Field>
          <Field label="الصف"><Input value={row} onChange={setRow} placeholder="5" /></Field>
          <Field label="المقعد"><Input value={seat} onChange={setSeat} placeholder="22" /></Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="السعر (ر.س) *">
            <Input value={price} onChange={setPrice} type="number" placeholder="250" required />
          </Field>
          <Field label="عدد التذاكر">
            <Input value={String(quantity)} onChange={(v) => setQuantity(Math.max(1, Number(v) || 1))} type="number" />
          </Field>
        </div>

        <Field label="صورة التذكرة">
          <label className="flex flex-col items-center justify-center gap-2 bg-card border border-dashed border-border rounded-xl px-4 py-6 cursor-pointer hover:border-silver/60 transition">
            {imagePreview ? (
              <img src={imagePreview} alt="معاينة التذكرة" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <span className="text-2xl">📷</span>
                <span className="text-xs text-muted-foreground">اضغط لإرفاق صورة التذكرة</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
          </label>
        </Field>

        <Field label="ملاحظات (اختياري)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            rows={3} placeholder="مثل: المقاعد متجاورة"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm resize-none" />
        </Field>

        <button type="submit" disabled={submitting}
          className="w-full bg-silver text-primary-foreground rounded-2xl py-4 font-black shadow-luxe disabled:opacity-50">
          {submitting ? "جاري النشر…" : "نشر التذكرة"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, ...rest }: { value: string; onChange: (v: string) => void; [k: string]: any }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm" {...rest} />
  );
}
