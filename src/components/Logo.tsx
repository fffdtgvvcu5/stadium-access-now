import logo from "@/assets/logo-stadium.png";

export function Logo({ size = 200 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="المدرج" width={size} height={size} className="drop-shadow-[0_0_14px_rgba(255,255,255,0.18)]" />
      <span className="text-2xl font-extrabold tracking-tight text-silver">المدرج</span>
    </div>
  );
}

