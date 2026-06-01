#!/usr/bin/env node
/**
 * Build-time prerender: navigates every URL in public/sitemap.xml with
 * a headless browser, captures the fully-rendered HTML (after Helmet has
 * applied per-route <title>, meta, JSON-LD, FAQs, H1s, etc.), and writes
 * it to dist/<path>/index.html so non-JS crawlers (LinkedIn, Slack,
 * Facebook, some AI answer engines) see the real content.
 *
 * Gracefully no-ops if puppeteer / Chromium can't launch (e.g. Lovable
 * preview sandbox). Production builds on Vercel will run it fully.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import sirv from "sirv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = join(root, "dist");
const PORT = 4179;

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function main() {
  if (!(await exists(distDir))) {
    console.warn("[prerender] dist/ missing — run `vite build` first. Skipping.");
    return;
  }

  // Parse sitemap.xml
  const sitemapPath = join(root, "public", "sitemap.xml");
  let urls = ["/"];
  if (await exists(sitemapPath)) {
    const xml = await readFile(sitemapPath, "utf-8");
    urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
      .map((m) => {
        try { return new URL(m[1]).pathname; } catch { return null; }
      })
      .filter(Boolean);
    if (!urls.includes("/")) urls.unshift("/");
  }
  console.log(`[prerender] ${urls.length} routes to prerender`);

  // Lazy-load puppeteer so missing binary doesn't crash the build.
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch (err) {
    console.warn("[prerender] puppeteer unavailable — skipping prerender.", err?.message);
    return;
  }

  // Static server for dist/ with SPA fallback
  const serve = sirv(distDir, { single: true, dev: false, etag: false });
  const server = http.createServer((req, res) => serve(req, res, () => {
    res.statusCode = 404; res.end("not found");
  }));
  await new Promise((r) => server.listen(PORT, r));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (err) {
    console.warn("[prerender] could not launch Chromium — skipping.", err?.message);
    server.close();
    return;
  }

  let ok = 0, fail = 0;
  for (const path of urls) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 800 });
      // Block third-party scripts that slow us down and aren't needed for HTML capture.
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const url = req.url();
        if (
          url.includes("googletagmanager.com") ||
          url.includes("google-analytics.com") ||
          url.includes("googlesyndication.com") ||
          url.includes("vercel-insights") ||
          url.includes("vercel-analytics") ||
          url.includes("vitals.vercel-insights")
        ) return req.abort();
        req.continue();
      });

      const target = `http://localhost:${PORT}${path}`;
      await page.goto(target, { waitUntil: "networkidle0", timeout: 30000 });
      // Give react-helmet-async a tick to commit head mutations.
      await new Promise((r) => setTimeout(r, 250));

      // Inject a marker so we can detect prerendered HTML at runtime if needed.
      await page.evaluate(() => {
        const m = document.createElement("meta");
        m.name = "x-prerendered";
        m.content = new Date().toISOString();
        document.head.appendChild(m);
      });

      const html = await page.content();
      const outDir = path === "/" ? distDir : join(distDir, path.replace(/^\/+/, ""));
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf-8");
      ok++;
      if (ok % 25 === 0) console.log(`[prerender] ${ok}/${urls.length}`);
    } catch (err) {
      fail++;
      console.warn(`[prerender] FAIL ${path}: ${err?.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] done. ok=${ok} fail=${fail}`);
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  // Don't fail the build — fall back to the SPA index.html.
  process.exit(0);
});
