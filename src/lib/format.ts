export function formatSAR(n: number) {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n);
}

export function formatMatchDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

export function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `بعد ${days} يوم`;
  if (hours > 0) return `بعد ${hours} ساعة`;
  return "قريباً";
}
