import { Seo } from "@/components/Seo";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t, lang } = useI18n();
  const locale = lang === "es" ? "es-ES" : lang === "hi" ? "hi-IN" : "en-US";
  return (
    <>
      <Seo
        title="Privacy Policy — Turbo Unit Converter"
        description="Turbo Unit Converter Privacy Policy. We do not collect personal information and all conversions happen locally in your browser."
        canonical="https://turbounitconverter.com/privacy"
      />
      <div className="min-h-screen bg-background">
        <section className="bg-surface-elevated border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("privacy.badge")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{t("privacy.h1")}</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{t("privacy.lead")}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">{t(`privacy.s${i}.h`)}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t(`privacy.s${i}.t`)}</p>
            </section>
          ))}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("privacy.s7.h")}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("privacy.s7.t")}</p>
          </section>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            {t("common.lastUpdated")} {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </>
  );
}
