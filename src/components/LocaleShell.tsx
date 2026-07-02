import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLocaleFromPath, useI18n, type Lang } from "@/lib/i18n";

/**
 * Reads the locale segment from the URL and pushes it into the i18n context.
 * Renders its children unchanged. Wrap the top-level <Routes> with this.
 */
export function LocaleSync({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const fromPath: Lang = getLocaleFromPath(pathname) ?? "en";
    if (fromPath !== lang) setLang(fromPath);
  }, [pathname, lang, setLang]);

  return <>{children}</>;
}
