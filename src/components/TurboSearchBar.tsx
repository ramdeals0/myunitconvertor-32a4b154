import { useMemo, useState, useId } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { parseConversionQuery } from "@/lib/parseConversionQuery";
import { convert, formatResult } from "@/lib/converters/data";
import { addRecentConversion } from "@/lib/recentConversions";

interface Props {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

const EXAMPLES = ["5 ft 11 in to cm", "70 F in C", "250 grams to ounces", "10 km to miles"];

export function TurboSearchBar({ className = "", placeholder, autoFocus }: Props) {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const inputId = useId();

  const parsed = useMemo(() => (submitted ? parseConversionQuery(submitted) : null), [submitted]);

  const result = useMemo(() => {
    if (!parsed) return null;
    try {
      const r = convert(parsed.category, parsed.value, parsed.from.id, parsed.to.id);
      const formatted = formatResult(r);
      addRecentConversion({
        categoryId: parsed.category.id,
        fromId: parsed.from.id,
        toId: parsed.to.id,
        fromSymbol: parsed.from.symbol,
        toSymbol: parsed.to.symbol,
        value: formatResult(parsed.value),
        result: formatted,
      });
      return formatted;
    } catch {
      return null;
    }
  }, [parsed]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(q.trim());
  };

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="relative" role="search" aria-label="Turbo Search converter">
        <label htmlFor={inputId} className="sr-only">Ask any conversion</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          id={inputId}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder={placeholder ?? 'Try: "5 ft 11 in to cm" or "70 F in C"'}
          inputMode="search"
          className="w-full bg-surface-elevated border border-border rounded-full pl-12 pr-32 py-4 text-base outline-none focus:border-primary focus:shadow-[var(--shadow-glow)] min-h-[52px]"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition min-h-[44px]"
          aria-label="Convert"
        >
          <Sparkles className="h-4 w-4" /> Convert
        </button>
      </form>

      {submitted && !parsed && (
        <div className="mt-3 text-sm text-muted-foreground">
          Couldn't parse that. Try formats like <span className="font-mono-num text-foreground">5 km to miles</span> or{" "}
          <span className="font-mono-num text-foreground">70 F in C</span>.
        </div>
      )}

      {parsed && result !== null && (
        <div className="mt-4 bg-primary-soft border border-primary/20 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">Result</div>
            <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
              {formatResult(parsed.value)} {parsed.from.symbol}{" "}
              <span className="text-muted-foreground">=</span>{" "}
              <span className="text-primary">{result}</span> {parsed.to.symbol}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {parsed.from.name} → {parsed.to.name} · {parsed.category.name}
            </div>
          </div>
          <Link
            to={`/c/${parsed.category.id}/${parsed.from.id}-to-${parsed.to.id}?value=${encodeURIComponent(formatResult(parsed.value))}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition min-h-[44px]"
          >
            Open converter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {!submitted && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setQ(ex); setSubmitted(ex); }}
              className="text-xs rounded-full border border-border bg-surface-elevated px-3 py-1.5 hover:border-primary hover:text-primary transition"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
