import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts, useRouterState, Link,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-silver">404</h1>
        <p className="mt-4 text-muted-foreground">الصفحة غير موجودة</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-silver px-6 py-3 text-sm font-bold text-primary-foreground">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-silver">حدث خطأ</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-silver px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#121214" },
      { title: "المدرج — تذاكر كرة القدم" },
      { name: "description", content: "السوق الآمن لشراء وبيع تذاكر مباريات كرة القدم في الخليج. تذاكر موثّقة، دفع آمن، تسليم فوري." },
      { property: "og:title", content: "المدرج" },
      { property: "og:description", content: "تذاكر مباريات كرة القدم — شراء، بيع، وإعادة تداول بكل أمان." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome = path.startsWith("/login");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen pb-24">
        {!hideChrome && <TopBar />}
        <main className="max-w-2xl mx-auto"><Outlet /></main>
        {!hideChrome && <BottomNav />}
      </div>
    </QueryClientProvider>
  );
}
