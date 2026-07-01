import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function EditorialPolicyPage() {
  const url = "https://turbounitconverter.com/editorial-policy";
  return (
    <>
      <Seo
        title="Editorial Policy | Turbo Unit Converter"
        description="How we research, write, review and update unit conversion content — citing NIST SP 811, BIPM and IEEE/ASTM SI 10."
        canonical={url}
      />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Editorial Policy</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Turbo Unit Converter exists to give engineers, students, tradespeople and
          curious readers conversions they can trust. Every number, formula and
          worked example on this site is written and reviewed against the same
          published standards used by national metrology institutes.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Sources of truth</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Unit definitions and conversion factors follow the guidelines of
          {" "}<a className="text-primary hover:underline" href="https://www.nist.gov/pml/special-publication-811" target="_blank" rel="noopener noreferrer">NIST Special Publication 811</a>{" "}
          (Appendix B for factor tables), the
          {" "}<a className="text-primary hover:underline" href="https://www.bipm.org/en/publications/si-brochure" target="_blank" rel="noopener noreferrer">BIPM SI Brochure</a>{" "}
          and IEEE/ASTM SI 10. Where a legacy unit (e.g. the US survey foot, the
          international pound) has multiple accepted definitions, we state which
          one we use.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Writing and review</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Articles in <Link to="/learn" className="text-primary hover:underline">/learn</Link>{" "}
          are drafted by our engineering staff, checked line-by-line against the
          references above, and dated with the last review. Numerical examples
          are computed with the same 12-digit constants used by the live
          converter — never rounded factors from a textbook — so what you read in
          the article matches what the tool returns.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Corrections</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Spotted an error, an ambiguous definition, or a case where our worked
          example disagrees with a primary source? Email
          {" "}<a className="text-primary hover:underline" href="mailto:hello@turbounitconverter.com">hello@turbounitconverter.com</a>{" "}
          with the URL and the discrepancy. We update the affected page and note
          the correction date at the top of the article.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Independence</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Turbo Unit Converter is an independent tool. We are not affiliated with,
          endorsed by, or certified by NIST, BIPM, IEEE or ASTM. When we cite a
          standard, we link to the primary source so you can verify it yourself.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Advertising</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Some pages display advertising that helps fund the tool. Ads are only
          served on pages that carry substantial original editorial content, are
          clearly labelled as advertisements, and never influence which
          conversions or articles we publish.
        </p>

        <p className="text-xs text-muted-foreground mt-10">
          Last reviewed: {new Date().toISOString().slice(0, 10)}.
        </p>
      </div>
    </>
  );
}
