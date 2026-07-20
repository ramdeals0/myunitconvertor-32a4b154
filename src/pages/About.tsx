import { Seo } from "@/components/Seo";
import { Info, Shield, Zap, Globe, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      <Seo
        title="About Us — Turbo Unit Converter"
        description="Learn about Turbo Unit Converter, the professional unit converter built for accuracy."
        canonical="https://turbounitconverter.com/about"
      />
      <div className="min-h-screen bg-background">
        <section className="bg-surface-elevated border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
              <Info className="h-3.5 w-3.5" />
              {t("about.badge")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {t("about.h1")}
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("about.lead")}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("about.mission.title")}</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("about.mission.p1")}</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("about.mission.p2")}</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("about.offer.title")}</h2>
            </div>
            <ul className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">{t(`about.offer.l${i}.b`)}</strong> — {t(`about.offer.l${i}.t`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("about.trust.title")}</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("about.trust.text")}</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t("about.feedback.title")}</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("about.feedback.text")}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
