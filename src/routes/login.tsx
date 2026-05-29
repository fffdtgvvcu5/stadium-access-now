import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — المدرج" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
      });
      if (error) toast.error(error.message);
      else { toast.success("تحقق من بريدك لتأكيد الحساب"); navigate({ to: "/" }); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("مرحباً بعودتك"); navigate({ to: "/" }); }
    }
    setLoading(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error("فشل تسجيل الدخول بـ Google");
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 max-w-md mx-auto">
      <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-8">
        <ChevronLeft className="size-4 rotate-180" /> العودة
      </Link>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4"><Logo size={56} /></div>
        <p className="text-sm text-muted-foreground">سوق تذاكر كرة القدم الأكثر أماناً</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-luxe">
        <div className="flex gap-1 bg-muted rounded-full p-1 mb-6">
          <button onClick={() => setMode("signin")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${mode === "signin" ? "bg-silver text-primary-foreground" : "text-muted-foreground"}`}>
            دخول
          </button>
          <button onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${mode === "signup" ? "bg-silver text-primary-foreground" : "text-muted-foreground"}`}>
            حساب جديد
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="الاسم الكامل"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm" />
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="البريد الإلكتروني"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm" dir="ltr" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="كلمة المرور"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm" dir="ltr" />

          <button type="submit" disabled={loading}
            className="w-full bg-silver text-primary-foreground rounded-xl py-3 font-black disabled:opacity-50">
            {loading ? "..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground">أو</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <button onClick={google}
          className="w-full bg-card border border-border hover:bg-muted transition-colors rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2">
          <svg className="size-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          متابعة عبر Google
        </button>
      </div>
    </div>
  );
}
