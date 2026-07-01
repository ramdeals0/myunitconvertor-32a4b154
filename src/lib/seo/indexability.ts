// Central rules for what should be indexed by search engines.
// Non-launch pair pages, thin category pages, and any auto-derived route
// get noindex,follow — they still exist for direct visitors but stay out
// of the crawl budget.

import { getPseoOverride } from "@/lib/converters/pseoGrid";
import { getGeneratedPair } from "@/lib/converters/generatedContent";

export interface IndexabilityResult {
  /** true when the page has enough original content to be indexed. */
  indexable: boolean;
  /** true when AdSense units are allowed to render. */
  adsAllowed: boolean;
  /** word count of the surrounding editorial prose. */
  wordCount: number;
}

const AD_MIN_WORDS = 600;
const INDEX_MIN_WORDS = 300;

export function countWords(...blocks: (string | undefined | null)[]): number {
  let total = 0;
  for (const b of blocks) {
    if (!b) continue;
    total += b.trim().split(/\s+/).filter(Boolean).length;
  }
  return total;
}

/** Pair page indexability rules — launch-set or generated JSON only. */
export function pairIndexability(
  categoryId: string,
  slug: string,
  extraWords = 0,
): IndexabilityResult {
  const gen = getGeneratedPair(categoryId, slug);
  const pseo = getPseoOverride(categoryId, slug);
  const inLaunchSet = !!pseo || !!gen;
  const words =
    (gen
      ? countWords(
          gen.content.intro,
          gen.content.result_section,
          gen.content.formula_section,
          gen.content.use_cases,
          gen.content.tips,
          gen.content.faq,
        )
      : 0) + extraWords;
  return {
    indexable: inLaunchSet && words >= INDEX_MIN_WORDS,
    adsAllowed: inLaunchSet && words >= AD_MIN_WORDS,
    wordCount: words,
  };
}

/** Category hub is always indexable, but ads gated by prose. */
export function categoryIndexability(extraWords: number): IndexabilityResult {
  return {
    indexable: true,
    adsAllowed: extraWords >= AD_MIN_WORDS,
    wordCount: extraWords,
  };
}
