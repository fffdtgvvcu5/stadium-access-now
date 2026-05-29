import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, ShieldCheck, CreditCard, HelpCircle, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "حسابي — المدرج" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        setProfile(p);
      }
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (!user) {
    return (
      <div className="px-4 pt-8 text-center">
        <h1 className="text-xl font-black mb-2">حسابي</h1>
        <p className="text-muted-foreground text-sm mb-6">سجّل الدخول للوصول لحسابك.</p>
        <Link to="/login" className="inline-block bg-silver text-primary-foreground rounded-full px-8 py-3 font-bold">
          سجّل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2">
      <div className="glass rounded-3xl p-6 mb-6 text-center shadow-luxe">
        <div className="size-20 mx-auto rounded-full bg-silver flex items-center justify-center text-3xl font-black text-primary-foreground mb-3">
          {(profile?.full_name ?? user.email ?? "م")[0].toUpperCase()}
        </div>
        <h1 className="text-lg font-black">{profile?.full_name ?? "مستخدم المدرج"}</h1>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        {profile?.verified && (
          <span className="inline-flex items-center gap-1 text-xs text-success mt-2"><ShieldCheck className="size-3" /> موثّق</span>
        )}
      </div>

      <ul className="space-y-2">
        <MenuItem icon={ShieldCheck} label="التحقق من الهوية" />
        <MenuItem icon={CreditCard} label="طرق الدفع والسحب" />
        <MenuItem icon={HelpCircle} label="المساعدة والدعم" />
      </ul>

      <button onClick={signOut} className="w-full mt-6 flex items-center justify-center gap-2 text-destructive py-4 font-bold">
        <LogOut className="size-4" /> تسجيل الخروج
      </button>
    </div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <li>
      <button className="w-full glass rounded-2xl p-4 flex items-center justify-between hover:shadow-glow transition-shadow">
        <span className="flex items-center gap-3 text-sm font-bold"><Icon className="size-5 text-silver" />{label}</span>
        <ChevronLeft className="size-4 text-muted-foreground" />
      </button>
    </li>
  );
}
