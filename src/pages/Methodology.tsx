import { Seo } from "@/components/Seo";
import { BookOpen, Scale, FileCheck, ExternalLink } from "lucide-react";

export default function MethodologyPage() {
  return (
    <>
      <Seo
        title="Methodology — About Our Calculations | Turbo Unit Converter"
        description="How Turbo Unit Converter computes conversions: SI base units, factor sources, rounding, and references to NIST Special Publication 811 and IEEE/ASTM SI 10."
        canonical="https://turbounitconverter.com/methodology"
      />
      <div className="min-h-screen bg-background">
        <section className="bg-surface-elevated border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
              <BookOpen className="h-3.5 w-3.5" />
              Methodology
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              About Our Calculations
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Conversions follow the guidelines of NIST Special Publication 811 and the
              International System of Units (SI) as maintained by the BIPM.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Standards alignment</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Turbo Unit Converter is an independent tool. It is not certified, audited, or
              endorsed by NIST or any standards body. Calculations are based on NIST standards
              for the International System of Units (SI), and conversion factors are taken from
              publicly published reference tables — primarily NIST Special Publication 811
              Appendix B and IEEE/ASTM SI 10.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Where a unit has a defined exact value (for example, 1 inch = 0.0254 m exactly),
              we use the exact factor. Where a factor is conventional or experimentally
              determined, we use the value published by NIST or BIPM at the precision shown
              in the conversion table.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <FileCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">How a conversion is computed</h2>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
              <li>
                Every category defines a canonical SI base unit (metre, kilogram, second,
                kelvin, ampere, candela, mole, plus coherent derived units such as pascal,
                watt, joule).
              </li>
              <li>
                Each supported unit stores an exact or NIST-published factor to the base
                unit. The input value is first converted <em>to</em> the base unit, then
                <em> from</em> the base unit to the target unit.
              </li>
              <li>
                Temperature (°C, °F, K, °R) uses the additive offset formulas defined by the
                International Temperature Scale of 1990 (ITS-90), not a single multiplicative
                factor.
              </li>
              <li>
                Math runs in IEEE 754 double precision in the browser. Displayed values are
                rounded for readability; the underlying calculation keeps full precision.
              </li>
              <li>
                Derived units scale with dimension: a length factor <code>f</code> becomes
                <code> f²</code> for area and <code>f³</code> for volume, per SP 811 §4.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Rounding &amp; significant figures</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We follow the rounding guidance in NIST SP 811 §7.9: results are rounded only
              at the final step and never carry more significant figures than the least
              precise input. For everyday use, 2–4 decimal places is usually appropriate;
              for engineering, scientific, or regulatory work, copy the full-precision value
              shown in the result field rather than the rounded display.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <ExternalLink className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">References</h2>
            </div>
            <ul className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
              <li>
                <a
                  href="https://www.nist.gov/pml/special-publication-811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)
                </a>
              </li>
              <li>
                <a
                  href="https://physics.nist.gov/cuu/Units/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NIST Reference on Constants, Units, and Uncertainty
                </a>
              </li>
              <li>
                <a
                  href="https://www.nist.gov/pml/owm/writing-si-metric-system-units"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NIST — Writing SI (Metric System) Units
                </a>
              </li>
              <li>
                <a
                  href="https://www.bipm.org/en/publications/si-brochure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  BIPM — The International System of Units (SI Brochure, 9th ed.)
                </a>
              </li>
              <li>
                IEEE/ASTM SI 10 — American National Standard for Metric Practice
              </li>
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-surface-elevated p-5">
            <h2 className="text-base font-semibold text-foreground">Spotted a discrepancy?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If a conversion factor on this site disagrees with the latest NIST or BIPM
              publication, that's a bug — please let us know and we will correct it.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
