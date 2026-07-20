import { Link } from "react-router-dom";
import { useState } from "react";
import { Seo } from "@/components/Seo";
import { CATEGORIES } from "@/lib/converters/data";
import { useI18n } from "@/lib/i18n";
import { GROUP_LABELS, CategoryGroup } from "@/lib/converters/types";
import {
  Search, ArrowRight, Ruler, Cog, Zap, Lightbulb, Droplets, Flame, Atom, Database,
} from "lucide-react";

const GROUP_META: Record<CategoryGroup, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  common: { icon: Ruler, label: "Basic & Common" },
  engineering: { icon: Cog, label: "Engineering & Physics" },
  electricity: { icon: Zap, label: "Electricity & Magnetism" },
  magnetism: { icon: Zap, label: "Magnetism" },
  light: { icon: Lightbulb, label: "Light & Optics" },
  fluids: { icon: Droplets, label: "Fluids & Hydraulics" },
  heat: { icon: Flame, label: "Heat & Thermodynamics" },
  radiology: { icon: Atom, label: "Radiology & Nuclear" },
  other: { icon: Database, label: "Specialized" },
};

const GROUP_ORDER: CategoryGroup[] = [
  "common", "engineering", "electricity", "light", "fluids", "heat", "radiology", "magnetism", "other",
];

export default function ConvertersPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  return (
    <>
      <Seo
        title="All Converters — Turbo Unit Converter"
        description="Browse our complete directory of professional-grade conversion tools, organized by scientific and engineering disciplines."
        canonical="https://turbounitconverter.com/converters"
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("all.h1")}</h1>
          <p className="text-muted-foreground mt-3 text-base md:text-lg">{t("all.subtitle")}</p>
        </div>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("all.search.placeholder")}
            aria-label={t("all.search.placeholder")}
            className="w-full bg-surface-elevated border border-border rounded-full pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:shadow-[var(--shadow-glow)]"
          />
        </div>


        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GROUP_ORDER.map((g) => {
            const meta = GROUP_META[g] ?? { icon: Database, label: GROUP_LABELS[g] };
            const Icon = meta.icon;
            const items = CATEGORIES.filter(
              (c) => c.group === g && (!query || c.name.toLowerCase().includes(query)),
            );
            if (!items.length) return null;
            return (
              <section key={g} className="bg-surface-elevated border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-[var(--shadow-card)] transition">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight">{meta.label}</h2>
                </div>
                <ul className="space-y-1">
                  {items.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/c/${c.id}`}
                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-primary-soft hover:text-primary transition"
                      >
                        <span>{c.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
