import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n, LANGUAGES, Lang, withLocalePrefix, stripLocalePrefix } from "@/lib/i18n";
import logo from "@/assets/Logo_webp.webp";

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();

  // Nav links are locale-aware so switching languages does not lose the prefix.
  const localizedTo = (to: string) => withLocalePrefix(to, lang);
  const NAV = [
    { to: localizedTo("/"), label: t("nav.home") },
    { to: localizedTo("/c/length"), label: t("nav.length") },
    { to: localizedTo("/c/weight"), label: t("nav.weight") },
    { to: localizedTo("/c/temperature"), label: t("nav.temperature") },
    { to: localizedTo("/converters"), label: t("nav.all") },
    { to: localizedTo("/learn"), label: "Learn" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <header className="bg-surface-elevated/80 backdrop-blur-md border-b border-border fixed top-0 inset-x-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to={localizedTo("/")} className="flex items-center gap-2" aria-label="Turbo Unit Converter">
          <img src={logo} alt="Turbo Unit Converter" className="h-9 md:h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition text-foreground"
              aria-label={t("nav.language")}
              aria-expanded={langOpen}
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase">{currentLang.code}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-surface-elevated border border-border rounded-xl shadow-[var(--shadow-card)] py-1 z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      const next = l.code as Lang;
                      setLang(next);
                      setLangOpen(false);
                      // Navigate to the equivalent URL under the chosen locale
                      // so the visible content and canonical stay consistent.
                      const target = withLocalePrefix(stripLocalePrefix(path), next);
                      navigate(target);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition flex items-center justify-between ${
                      l.code === lang ? "text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-xs text-muted-foreground uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggle} className="p-2 rounded-full hover:bg-muted transition" aria-label={t("nav.toggleTheme")}>
            {dark ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label={t("nav.menu")}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface-elevated px-4 py-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border mt-20 bg-surface-elevated">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">Turbo Unit Converter</span> — {t("footer.tagline")}
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/learn" className="hover:text-foreground transition-colors">Learn</Link>
            <span className="text-border">|</span>
            <Link to="/about" className="hover:text-foreground transition-colors">{t("footer.about")}</Link>
            <span className="text-border">|</span>
            <Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
            <span className="text-border">|</span>
            <Link to="/editorial-policy" className="hover:text-foreground transition-colors">Editorial policy</Link>
            <span className="text-border">|</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
            <span className="text-border">|</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
        <div className="mt-4 text-center md:text-right text-xs text-muted-foreground">
          © {new Date().getFullYear()} Turbo Unit Converter. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
