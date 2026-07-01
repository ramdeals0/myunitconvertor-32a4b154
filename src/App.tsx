import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ScientificCalculator } from "@/components/ScientificCalculator";
import { I18nProvider } from "@/lib/i18n";

import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import MethodologyPage from "@/pages/Methodology";
import EditorialPolicyPage from "@/pages/EditorialPolicy";
import ConvertersPage from "@/pages/Converters";
import PrivacyPage from "@/pages/Privacy";
import TermsPage from "@/pages/Terms";
import CategoryPage from "@/pages/Category";
import PairPage from "@/pages/Pair";
import ConvertPage from "@/pages/Convert";
import LearnPage from "@/pages/Learn";
import LearnArticlePage from "@/pages/LearnArticle";
import NotFoundPage from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <I18nProvider>
      <ScrollToTop />
      <SiteHeader />
      <div className="pt-16 min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:slug" element={<LearnArticlePage />} />
            <Route path="/converters" element={<ConvertersPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/c/:category" element={<CategoryPage />} />
            <Route path="/c/:category/:pair" element={<PairPage />} />
            <Route path="/convert/:pair" element={<ConvertPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
      <ScientificCalculator />
      <SpeedInsights />
    </I18nProvider>
  );
}
