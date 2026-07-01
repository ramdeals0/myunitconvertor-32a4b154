import { AdBanner, AdRectangle } from "@/components/AdBanner";

interface AdSlotProps {
  /** true when the surrounding page has enough original prose to be
   *  compliant with AdSense's "publisher content" policy. */
  allowed: boolean;
  /** Word count of the surrounding page (for auditing via data-attr). */
  wordCount?: number;
  /** Short label describing what section of the page this ad sits in. */
  context: string;
  variant?: "banner" | "rectangle";
  className?: string;
}

/**
 * Policy-gated ad slot. Renders NOTHING when `allowed` is false so we
 * cannot ship ads on thin or auto-derived pages. Every render adds a
 * data-ad-context attribute to make placements auditable in the DOM.
 */
export function AdSlot({ allowed, wordCount, context, variant = "banner", className = "" }: AdSlotProps) {
  if (!allowed) return null;
  return (
    <div
      className={className}
      data-ad-context={context}
      data-ad-word-count={wordCount}
    >
      {variant === "rectangle" ? <AdRectangle /> : <AdBanner />}
    </div>
  );
}
