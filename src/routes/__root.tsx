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
      { property: "og:title", content: "المدرج — تذاكر كرة القدم" },
      { property: "og:description", content: "السوق الآمن لشراء وبيع تذاكر مباريات كرة القدم في الخليج. تذاكر موثّقة، دفع آمن، تسليم فوري." },
      { name: "twitter:title", content: "المدرج — تذاكر كرة القدم" },
      { name: "twitter:description", content: "السوق الآمن لشراء وبيع تذاكر مباريات كرة القدم في الخليج. تذاكر موثّقة، دفع آمن، تسليم فوري." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d9674a7c-3077-4229-ad80-be08d5e7a1cc/id-preview-90fe5a50--bd5f4542-8a68-4460-bd62-915f599531c0.lovable.app-1780101539131.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d9674a7c-3077-4229-ad80-be08d5e7a1cc/id-preview-90fe5a50--bd5f4542-8a68-4460-bd62-915f599531c0.lovable.app-1780101539131.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" },
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
