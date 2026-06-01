import { Link } from "react-router-dom";
import { Clock, X } from "lucide-react";
import { useRecentConversions, clearRecentConversions } from "@/lib/recentConversions";

interface Props {
  className?: string;
  categoryId?: string;
}

export function RecentConversions({ className = "", categoryId }: Props) {
  const items = useRecentConversions();
  const filtered = categoryId ? items.filter((i) => i.categoryId === categoryId) : items;
  if (!filtered.length) return null;

  return (
    <section className={`bg-surface-elevated border border-border rounded-xl p-5 ${className}`} aria-label="Recent conversions">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Recent conversions
        </h2>
        <button
          type="button"
          onClick={clearRecentConversions}
          className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          aria-label="Clear recent conversions"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.slice(0, 8).map((i) => (
          <li key={`${i.ts}-${i.categoryId}-${i.fromId}-${i.toId}`}>
            <Link
              to={`/c/${i.categoryId}/${i.fromId}-to-${i.toId}?value=${encodeURIComponent(i.value)}`}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-sm hover:border-primary hover:text-primary transition min-h-[44px]"
            >
              <span className="font-mono-num truncate">
                {i.value} {i.fromSymbol} → <span className="text-primary font-semibold">{i.result}</span> {i.toSymbol}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
