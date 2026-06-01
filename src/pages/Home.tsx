import { Link } from "react-router-dom";
import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { TurboSearchBar } from "@/components/TurboSearchBar";
import { RecentConversions } from "@/components/RecentConversions";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/converters/data";
import { GROUP_LABELS } from "@/lib/converters/types";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

import {
  Search, ArrowRight, Ruler, Weight, Thermometer, Beaker, Square, Gauge, Zap, Clock,
  Wind, Compass, HardDrive, Fuel, BadgeCheck, Bolt, Lock, Waves, Activity, Wrench, RefreshCw, Droplet,
  Atom, Magnet, Radiation, Type, TreePine, Sigma, Lightbulb, Sun, Aperture, Grid3x3, FlaskConical,
} from "lucide-react";


const ICONS: Record<string, any> = {
  length: Ruler, weight: Weight, temperature: Thermometer, volume: Beaker,
  area: Square, pressure: Gauge, energy: Zap, power: Zap, time: Clock,
  speed: Wind, angle: Compass, data: HardDrive, fuel: Fuel,
  density: Waves, acceleration: Activity, torque: Wrench, angular_velocity: RefreshCw,
  current: Bolt, frequency: Activity, luminance: Sun, luminous_intensity: Aperture,
  illumination: Lightbulb, resolution: Grid3x3, flow: Droplet, viscosity: Droplet,
  molar: FlaskConical, surface_tension: Waves, magnetic_flux: Magnet,
  flux_density: Grid3x3, mmf: Bolt, radiation_activity: Radiation,
  dose_equivalent: Radiation, absorbed_dose: Radiation, si_prefix: Sigma,
  data_transfer: HardDrive, typography: Type, lumber: TreePine, atom: Atom,
};

const COMMON_CONVERSIONS = [
  ["length", "cm", "in"], ["length", "in", "cm"],
  ["weight", "kg", "lb"], ["weight", "lb", "kg"],
  ["temperature", "c", "f"], ["temperature", "f", "c"],
  ["length", "mm", "in"], ["length", "m", "ft"],
  ["speed", "mph", "kph"], ["power", "kW", "hp"],
] as const;

const MOST_USED = [
  ["length", "m", "ft"], ["length", "ft", "m"],
  ["volume", "L", "gal_us"], ["volume", "gal_us", "L"],
  ["temperature", "c", "f"], ["temperature", "f", "c"],
  ["weight", "kg", "lb"], ["weight", "lb", "kg"],
  ["length", "km", "mi"], ["speed", "mph", "kph"],
] as const;

const QUICK_CATEGORIES = ["length", "weight", "temperature", "volume", "area", "time", "speed"];

export default function HomePage() {
  const { t } = useI18n();
  const [categoryId, setCategoryId] = useState("length");
  const category = CATEGORY_MAP[categoryId];
  const [query, setQuery] = useState("");

  const FEATURES = [
    { icon: BadgeCheck, title: t("home.feature.precision.title"), text: t("home.feature.precision.text") },
    { icon: Zap, title: t("home.feature.instant.title"), text: t("home.feature.instant.text") },
    { icon: Lock, title: t("home.feature.privacy.title"), text: t("home.feature.privacy.text") },
  ];

  const FAQS = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: t("home.faq.q4"), a: t("home.faq.a4") },
  ];

  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.units.some((u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.symbol.toLowerCase().includes(query.toLowerCase()))
  );

  const groups = Array.from(new Set(CATEGORIES.map((c) => c.group)));

  const SITE_URL = "https://turbounitconverter.vercel.app";
  return (
    <>
      <Seo
        title="Turbo Unit Converter — Professional Unit Converter & Engineering Tools"
        description="Convert length, weight, temperature, volume, and dozens more — instantly and accurately, with engineering-grade precision."
        canonical="https://turbounitconverter.vercel.app/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Turbo Unit Converter",
            url: SITE_URL,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript. Works in any modern browser.",
            description: "Fast, accurate online unit converter for 75+ categories — length, weight, temperature, volume, and more.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: CATEGORIES.map((c) => c.name).join(", "),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <section className="mb-10">
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <img
              src={logo}
              alt="Turbo Unit Converter — Free Online Unit Converter Tool"
              className="mx-auto mb-6 h-20 md:h-28 w-auto drop-shadow-[0_4px_24px_hsl(var(--primary)/0.25)]"
            />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary mb-5">
              <BadgeCheck className="h-3.5 w-3.5" /> {t("home.badge")}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Free Online Unit Converter — Fast, Accurate & Trusted
            </h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              The free online unit converter built for accuracy. Instantly convert celsius to fahrenheit, kg to lbs, meters to feet, and 75+ more categories — no sign-up needed.
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mt-6">
              The Fastest Free Unit Converter for Every Category
            </h2>
          </div>


          <TurboSearchBar className="max-w-3xl mx-auto mb-8" />

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {QUICK_CATEGORIES.map((id) => {
              const c = CATEGORY_MAP[id];
              const Icon = ICONS[id] ?? Ruler;
              const active = categoryId === id;
              return (
                <button
                  key={id}
                  onClick={() => setCategoryId(id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition border min-h-[44px] ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface-elevated text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.name}
                </button>
              );
            })}
          </div>

          <Converter category={category} smartDefaults />

          <RecentConversions className="mt-8" />
        </section>

        <AdBanner className="mb-14" />


        <section className="mb-16">
          <SectionHeader title="Convert Celsius to Fahrenheit, kg to lbs & More Instantly" subtitle={t("home.common.subtitle")} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMMON_CONVERSIONS.map(([cat, from, to]) => {
              const c = CATEGORY_MAP[cat];
              const f = c.units.find((u) => u.id === from);
              const toU = c.units.find((u) => u.id === to);
              return (
                <Link
                  key={`${cat}-${from}-${to}`}
                  to={`/c/${cat}/${from}-to-${to}`}
                  className="group bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary hover:shadow-[var(--shadow-card)] transition"
                >
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{c.name}</div>
                  <div className="mt-2 font-semibold flex items-center gap-1.5">
                    {f?.symbol} <ArrowRight className="h-3.5 w-3.5 text-primary" /> {toU?.symbol}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <SectionHeader title="75+ Online Unit Converter Categories at Your Fingertips" subtitle={t("home.browse.subtitle")} centered />
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("home.search.placeholder")}
              aria-label={t("home.search.placeholder")}
              className="w-full bg-surface-elevated border border-border rounded-full pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:shadow-[var(--shadow-glow)]"
            />
            {query && (
              <div className="absolute z-10 inset-x-0 top-full mt-2 bg-surface-elevated border border-border rounded-xl divide-y divide-border max-h-72 overflow-auto shadow-[var(--shadow-card)]">
                {filtered.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">{t("home.search.noMatches")}</div>
                )}
                {filtered.slice(0, 12).map((c) => (
                  <Link key={c.id} to={`/c/${c.id}`}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.units.length} {t("home.units")}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {groups.map((g) => {
              const items = CATEGORIES.filter((c) => c.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    {GROUP_LABELS[g]}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {items.map((c) => {
                      const Icon = ICONS[c.id] ?? Ruler;
                      return (
                        <Link key={c.id} to={`/c/${c.id}`}
                          className="bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary transition group">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm truncate">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.units.length} {t("home.units")}</div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <SectionHeader title="Why Students & Engineers Trust Our Unit Converter" subtitle={t("home.why.subtitle")} centered />
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-surface-elevated border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-[var(--shadow-card)] transition">
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <SectionHeader title="Most-Used Conversions: Meters to Feet, Liters to Gallons & Beyond" subtitle="Jump straight to the most popular unit pairs for instant conversion." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MOST_USED.map(([cat, from, to]) => {
              const c = CATEGORY_MAP[cat];
              const f = c.units.find((u) => u.id === from);
              const toU = c.units.find((u) => u.id === to);
              return (
                <Link
                  key={`${cat}-${from}-${to}`}
                  to={`/c/${cat}/${from}-to-${to}`}
                  className="group bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary hover:shadow-[var(--shadow-card)] transition"
                >
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{c.name}</div>
                  <div className="mt-2 font-semibold flex items-center gap-1.5">
                    {f?.symbol} <ArrowRight className="h-3.5 w-3.5 text-primary" /> {toU?.symbol}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeader title={t("home.faq.title")} subtitle={t("home.faq.subtitle")} centered />
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group bg-surface-elevated border border-border rounded-xl p-5 open:shadow-[var(--shadow-card)] transition">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold">
                  {f.q}
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Turbo Unit Converter — Free online unit converter for{' '}
            <Link to="/c/temperature/c-to-f" className="text-primary hover:underline">celsius to fahrenheit</Link>,{' '}
            <Link to="/c/weight/kg-to-lb" className="text-primary hover:underline">kg to lbs</Link>,{' '}
            <Link to="/c/length/m-to-ft" className="text-primary hover:underline">meters to feet</Link>,{' '}
            and 75+ more categories.
          </p>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ title, subtitle, centered }: { title: string; subtitle: string; centered?: boolean }) {
  return (
    <div className={`mb-6 ${centered ? "text-center max-w-2xl mx-auto" : ""}`}>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
    </div>
  );
}
