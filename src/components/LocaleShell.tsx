import { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleFromPath,
  useI18n,
  withLocalePrefix,
  type Lang,
} from "@/lib/i18n";

/**
 * Reads the locale segment from the URL and pushes it into the i18n context.
 * Renders its children unchanged. Wrap the top-level <Routes> with this.
 */
export function LocaleSync({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const fromPath: Lang = getLocaleFromPath(pathname) ?? DEFAULT_LOCALE;
    if (fromPath !== lang) setLang(fromPath);
  }, [pathname, lang, setLang]);

  return <>{children}</>;
}

/** Resolve the user's preferred locale from localStorage → browser → default. */
function detectPreferredLocale(): Lang {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem("lang");
    if (saved && (LOCALES as string[]).includes(saved)) return saved as Lang;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "").slice(0, 2).toLowerCase();
  if ((LOCALES as string[]).includes(nav)) return nav as Lang;
  return DEFAULT_LOCALE;
}

/**
 * When a URL lacks a locale prefix (e.g. `/c/length`) and the visitor's
 * preferred locale is not the default, redirect to the localized route
 * (`/es/c/length`, `/hi/c/length`, …). Non-default-locale URLs render
 * their children unchanged.
 */
export function LocaleRedirect({ children }: { children: React.ReactNode }) {
  const { pathname, search, hash } = useLocation();
  const target = useMemo(() => {
    const inPath = getLocaleFromPath(pathname);
    if (inPath) return null; // already localized
    const preferred = detectPreferredLocale();
    if (preferred === DEFAULT_LOCALE) return null; // English lives at root
    return `${withLocalePrefix(pathname, preferred)}${search}${hash}`;
  }, [pathname, search, hash]);

  if (target) return <Navigate to={target} replace />;
  return <>{children}</>;
}
