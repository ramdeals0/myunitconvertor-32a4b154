import { Seo } from "@/components/Seo";
import { Scale } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TermsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "es" ? "es-ES" : lang === "hi" ? "hi-IN" : "en-US";
  return (
    <>
      <Seo
        title="Terms of Service — Turbo Unit Converter"
        description="Turbo Unit Converter Terms of Service. Read the terms and conditions governing your use of our free unit conversion tools."
        canonical="https://myunitconvertor.lovable.app/terms"
      />
      <div className="min-h-screen bg-background">
        <section className="bg-surface-elevated border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
              <Scale className="h-3.5 w-3.5" />
              {t("terms.badge")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{t("terms.h1")}</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{t("terms.lead")}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("terms.s1.h")}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("terms.s1.t")}</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("terms.s2.h")}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("terms.s2.t")}</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("terms.s3.h")}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("terms.s3.t")}</p>
            <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground leading-relaxed">
              {[1, 2, 3, 4].map((i) => (
                <li key={i}>{t(`terms.s3.l${i}`)}</li>
              ))}
            </ul>
          </section>
          {[4, 5, 6, 7, 8].map((i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">{t(`terms.s${i}.h`)}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t(`terms.s${i}.t`)}</p>
            </section>
          ))}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">{t("terms.s9.h")}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("terms.s9.t")}</p>
          </section>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            {t("common.lastUpdated")} {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </>
  );
}
