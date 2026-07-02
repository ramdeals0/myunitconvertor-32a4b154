#!/usr/bin/env node
/**
 * translate-i18n.mjs — fill missing dictionary keys in src/lib/i18n.tsx
 * using the Lovable AI Gateway.
 *
 *   LOVABLE_API_KEY=... node scripts/translate-i18n.mjs
 *
 * The script parses the three `const en/es/hi: Dict = {...}` blocks in
 * src/lib/i18n.tsx, finds every key present in `en` but missing (or empty)
 * in `es`/`hi`, sends a batched translation prompt to the gateway, and
 * writes the merged dictionaries back to disk. Existing translations are
 * never overwritten — the pipeline is additive so hand-tuned strings stay
 * authoritative.
 *
 * Model: google/gemini-3-flash-preview (chat-completions, JSON output).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/lib/i18n.tsx");
const MODEL = "google/gemini-3-flash-preview";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const LANG_NAMES = { es: "Spanish (Spain)", hi: "Hindi (India)" };

function extractDict(source, name) {
  const re = new RegExp(`const ${name}: Dict = \\{([\\s\\S]*?)\\n\\};`);
  const m = source.match(re);
  if (!m) throw new Error(`Could not find dictionary "${name}" in i18n.tsx`);
  // eslint-disable-next-line no-new-func
  const obj = new Function(`return {${m[1]}};`)();
  return { block: m[0], body: m[1], obj };
}

function serializeDict(name, obj) {
  const lines = Object.entries(obj).map(
    ([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  );
  return `const ${name}: Dict = {\n${lines.join("\n")}\n};`;
}

async function translateBatch(pairs, targetLang) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not set");

  const system =
    `You are a professional software UI translator. Translate the given English UI strings ` +
    `into ${LANG_NAMES[targetLang]}. Preserve product names (Turbo Unit Converter, NIST, BIPM, ISO), ` +
    `punctuation, placeholders, and casing style. Return ONLY a JSON object mapping each input key ` +
    `to its translated string — no commentary, no code fences.`;

  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(pairs) },
    ],
    response_format: { type: "json_object" },
  };

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}

async function main() {
  const src = readFileSync(FILE, "utf8");
  const en = extractDict(src, "en");
  const es = extractDict(src, "es");
  const hi = extractDict(src, "hi");

  let updated = src;
  for (const [name, dict] of [["es", es], ["hi", hi]]) {
    const missing = {};
    for (const [k, v] of Object.entries(en.obj)) {
      if (!dict.obj[k]) missing[k] = v;
    }
    const keys = Object.keys(missing);
    if (keys.length === 0) {
      console.log(`[i18n] ${name}: nothing to translate`);
      continue;
    }
    console.log(`[i18n] ${name}: translating ${keys.length} keys via ${MODEL}`);
    // Chunk to keep single requests within a reasonable size.
    const CHUNK = 40;
    const translations = {};
    for (let i = 0; i < keys.length; i += CHUNK) {
      const slice = Object.fromEntries(keys.slice(i, i + CHUNK).map((k) => [k, missing[k]]));
      const out = await translateBatch(slice, name);
      Object.assign(translations, out);
    }
    const merged = { ...dict.obj, ...translations };
    const rebuilt = serializeDict(name, merged);
    updated = updated.replace(dict.block, rebuilt);
  }

  writeFileSync(FILE, updated);
  console.log("[i18n] wrote src/lib/i18n.tsx");
}

main().catch((err) => {
  console.error("[i18n] failed:", err);
  process.exit(1);
});
