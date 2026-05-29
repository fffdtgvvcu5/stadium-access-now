import logo from "@/assets/logo-stadium.png";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="المدرج" width={size} height={size} className="drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" />
      <span className="text-2xl font-extrabold tracking-tight text-silver">المدرج</span>
    </div>
  );
}
