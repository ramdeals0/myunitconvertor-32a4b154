import { useEffect, useId, useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Check, ChevronsUpDown, Link2 } from "lucide-react";
import { Category } from "@/lib/converters/types";
import { convert, formatResult } from "@/lib/converters/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addRecentConversion, useFavoritePairForCategory } from "@/lib/recentConversions";

interface Props {
  category: Category;
  initialFrom?: string;
  initialTo?: string;
  initialValue?: string;
  /** When true, persist current value to ?value= in URL via history.replaceState. */
  persistValueInUrl?: boolean;
  /** When true, use the user's most-frequent pair for this category as the default. */
  smartDefaults?: boolean;
  compact?: boolean;
}

function readUrlValue(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get("value");
  } catch {
    return null;
  }
}

export function Converter({ category, initialFrom, initialTo, initialValue, persistValueInUrl, smartDefaults, compact }: Props) {
  const favorite = useFavoritePairForCategory(category.id);
  const resolvedFrom = initialFrom ?? (smartDefaults && favorite ? favorite.fromId : undefined) ?? category.units[0].id;
  const resolvedTo = initialTo ?? (smartDefaults && favorite ? favorite.toId : undefined) ?? (category.units[1]?.id ?? category.units[0].id);

  const [from, setFrom] = useState(resolvedFrom);
  const [to, setTo] = useState(resolvedTo);
  const [input, setInput] = useState(() => initialValue ?? readUrlValue() ?? "1");
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setFrom(resolvedFrom);
    setTo(resolvedTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id, initialFrom, initialTo, favorite?.fromId, favorite?.toId]);

  const result = useMemo(() => {
    const n = parseFloat(input);
    if (isNaN(n)) return "";
    return formatResult(convert(category, n, from, to));
  }, [input, from, to, category]);

  // Persist the value in the URL + record to recents (debounced effect).
  useEffect(() => {
    if (!result) return;
    if (persistValueInUrl && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (input && !isNaN(parseFloat(input))) url.searchParams.set("value", input);
      else url.searchParams.delete("value");
      window.history.replaceState({}, "", url.toString());
    }
    const t = setTimeout(() => {
      const fu = category.units.find((u) => u.id === from);
      const tu = category.units.find((u) => u.id === to);
      if (!fu || !tu) return;
      addRecentConversion({
        categoryId: category.id,
        fromId: from,
        toId: to,
        fromSymbol: fu.symbol,
        toSymbol: tu.symbol,
        value: input,
        result,
      });
    }, 800);
    return () => clearTimeout(t);
  }, [input, from, to, result, category, persistValueInUrl]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (result) setInput(result);
  };


  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 1500);
  };

  const shareUrl = async () => {
    const url = `${window.location.origin}/c/${category.id}/${from}-to-${to}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const fromUnit = category.units.find((u) => u.id === from);
  const toUnit = category.units.find((u) => u.id === to);

  return (
    <div className={`bg-surface-elevated rounded-2xl border border-border shadow-[var(--shadow-card)] ${compact ? "p-6" : "p-8 md:p-12"}`}>
      {!compact && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Precision {category.name} Converter
          </h2>
          <p className="text-muted-foreground mt-2">{category.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-end">
        <UnitField
          label="From"
          value={input}
          onChange={setInput}
          unit={from}
          onUnitChange={setFrom}
          category={category}
          editable
        />

        <div className="flex md:pb-2 justify-center">
          <button
            onClick={swap}
            aria-label="Swap units"
            className="group bg-surface-elevated border border-border hover:border-primary hover:text-primary transition-all p-3 rounded-full"
          >
            <ArrowLeftRight className="h-5 w-5 transition-transform group-active:rotate-180" />
          </button>
        </div>

        <UnitField
          label="To"
          value={result}
          onChange={() => {}}
          unit={to}
          onUnitChange={setTo}
          category={category}
          readOnly
        />
      </div>

      {result && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={copyResult}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition"
          >
            {copiedResult ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedResult ? "Copied result" : "Copy result"}
          </button>
          <button
            onClick={shareUrl}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition"
          >
            {copiedLink ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copiedLink ? "Link copied" : "Share link"}
          </button>
        </div>
      )}

      {fromUnit && toUnit && result && (
        <div className="mt-4 text-center text-xs text-muted-foreground">
          {input} {fromUnit.name} = {result} {toUnit.name}
        </div>
      )}
    </div>
  );
}

function UnitField({
  label, value, onChange, unit, onUnitChange, category, editable, readOnly, trailing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
  category: Category;
  editable?: boolean;
  readOnly?: boolean;
  trailing?: React.ReactNode;
}) {
  const inputId = useId();
  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-[11px] tracking-[0.08em] font-semibold uppercase text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="0"
          aria-label={`${label} value in ${unit}`}
          className={`w-full bg-surface-elevated border border-border rounded-xl pl-4 pr-44 py-4 text-2xl font-mono-num font-medium outline-none transition-all
            ${readOnly ? "text-muted-foreground bg-muted/40" : "focus:border-primary focus:shadow-[var(--shadow-glow)]"}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {trailing}
          <UnitPicker unit={unit} onUnitChange={onUnitChange} category={category} />
        </div>
      </div>
    </div>
  );
}

function UnitPicker({
  unit,
  onUnitChange,
  category,
}: {
  unit: string;
  onUnitChange: (v: string) => void;
  category: Category;
}) {
  const [open, setOpen] = useState(false);
  const selected = category.units.find((u) => u.id === unit);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 bg-muted border border-border hover:border-primary rounded-lg py-1.5 pl-2 pr-2 text-xs font-semibold focus:ring-0 cursor-pointer max-w-[160px] truncate transition"
        >
          <span className="truncate">{selected?.symbol ?? unit}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search unit…" className="h-9" />
          <CommandList>
            <CommandEmpty className="py-3 text-xs text-muted-foreground">No unit found.</CommandEmpty>
            <CommandGroup>
              {category.units.map((u) => (
                <CommandItem
                  key={u.id}
                  value={`${u.name} ${u.symbol} ${u.aliases?.join(" ") ?? ""}`}
                  onSelect={() => {
                    onUnitChange(u.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer text-sm"
                >
                  <span className="flex-1 truncate">
                    {u.symbol} — {u.name}
                  </span>
                  {u.id === unit && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
