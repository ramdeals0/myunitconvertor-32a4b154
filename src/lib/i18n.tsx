import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "es" | "hi";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export const LOCALES: Lang[] = ["en", "es", "hi"];
export const DEFAULT_LOCALE: Lang = "en";
export const SITE_URL = "https://turbounitconverter.com";

/** Return the locale segment at the start of pathname, or null. */
export function getLocaleFromPath(pathname: string): Lang | null {
  const m = pathname.match(/^\/(es|hi|en)(?=\/|$)/);
  return m ? (m[1] as Lang) : null;
}

/** Strip a leading /en /es /hi from pathname. Always starts with "/". */
export function stripLocalePrefix(pathname: string): string {
  const p = pathname.replace(/^\/(?:en|es|hi)(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

/** Prepend the locale prefix (except for default English which lives at root). */
export function withLocalePrefix(pathname: string, lang: Lang): string {
  const base = stripLocalePrefix(pathname);
  if (lang === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
}

/** Build the fully-qualified canonical URL for a path in a given locale. */
export function localeHref(pathname: string, lang: Lang): string {
  return `${SITE_URL}${withLocalePrefix(pathname, lang)}`;
}

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.length": "Length",
  "nav.weight": "Weight",
  "nav.temperature": "Temperature",
  "nav.volume": "Volume",
  "nav.all": "All Converters",
  "nav.toggleTheme": "Toggle theme",
  "nav.menu": "Menu",
  "nav.language": "Language",

  "footer.tagline": "Professional unit conversion & technical tools.",
  "footer.about": "About",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.rights": "Engineered for accuracy.",

  "home.badge": "Engineering-grade precision",
  "home.h1.part1": "Professional Unit Converter",
  "home.h1.part2": "& Engineering Tools",
  "home.subtitle": "A clean, fast, modern unit converter for every category you need. Precision-engineered for students, engineers, and travelers.",
  "home.common.title": "Common Unit Conversions",
  "home.common.subtitle": "Jump straight to the most-used unit pairs for quick calculation.",
  "home.why.title": "Why Choose Turbo Unit Converter?",
  "home.why.subtitle": "Built for engineers, students, and anyone who needs answers they can trust.",
  "home.browse.title": "Browse All Unit Converters",
  "home.browse.subtitle": "Every major scientific and engineering category, organized for easy access.",
  "home.search.placeholder": "Search units, categories, or symbols…",
  "home.search.noMatches": "No matches.",
  "home.units": "units",
  "home.faq.title": "Frequently Asked Questions",
  "home.faq.subtitle": "Answers to common questions about Turbo Unit Converter.",
  "home.feature.precision.title": "Engineering-Grade Precision",
  "home.feature.precision.text": "Our algorithms are verified against NIST standards for high-fidelity technical calculations.",
  "home.feature.instant.title": "Instant Real-Time Results",
  "home.feature.instant.text": "Get conversions as you type. No page reloads or waiting for servers — pure client-side speed.",
  "home.feature.privacy.title": "Privacy-Focused",
  "home.feature.privacy.text": "We don't store your input data. All conversions happen directly in your browser for total security.",
  "home.faq.q1": "How accurate is the conversion?",
  "home.faq.a1": "Turbo Unit Converter uses double-precision floating-point arithmetic and NIST-verified conversion factors. We support up to 12 decimal places of precision for critical technical tasks.",
  "home.faq.q2": "Is this tool free to use?",
  "home.faq.a2": "Yes, Turbo Unit Converter is 100% free for students and professional engineers. We sustain the platform through minimal, non-intrusive advertisements.",
  "home.faq.q3": "Does it work offline?",
  "home.faq.a3": "Initial loading needs a connection, but once the page is open the conversion logic runs entirely in your browser.",
  "home.faq.q4": "Can I suggest a new unit?",
  "home.faq.a4": "Absolutely. We are always expanding our converter database and welcome suggestions for new categories or specialized units.",

  "all.h1": "All Unit Converters",
  "all.subtitle": "Browse our complete directory of professional-grade conversion tools, organized by scientific and engineering disciplines.",
  "all.search.placeholder": "Search converters…",

  "about.badge": "About Us",
  "about.h1": "About Turbo Unit Converter",
  "about.lead": "Engineering-grade precision meets everyday simplicity. We built Turbo Unit Converter to be the most reliable unit conversion tool on the web.",
  "about.mission.title": "Our Mission",
  "about.mission.p1": "Turbo Unit Converter was created with a single goal: to make unit conversion effortless, accurate, and accessible to everyone. Whether you are an engineer working on complex calculations, a student learning the sciences, a traveler navigating foreign measurements, or a home cook experimenting with international recipes — we have got you covered.",
  "about.mission.p2": "We believe that precision matters. A small rounding error can lead to big problems in engineering, medicine, and science. That is why every conversion on Turbo Unit Converter is calculated with the highest degree of accuracy and cross-verified against standard reference data.",
  "about.offer.title": "What We Offer",
  "about.offer.l1.b": "75+ Conversion Categories",
  "about.offer.l1.t": "From everyday units like length, weight, and volume to specialized categories like acceleration, magnetic flux, and radiation dose.",
  "about.offer.l2.b": "Real-Time Results",
  "about.offer.l2.t": "See conversions update instantly as you type. No clicks, no waiting.",
  "about.offer.l3.b": "Privacy-First",
  "about.offer.l3.t": "All conversions happen in your browser. We do not store your data or track your activity.",
  "about.offer.l4.b": "Completely Free",
  "about.offer.l4.t": "No paywalls, no signups, no ads that get in your way. Just pure conversion power.",
  "about.trust.title": "Built on Trust",
  "about.trust.text": "Accuracy is not just a feature for us — it is a commitment. Every conversion factor in our database is sourced from authoritative standards including NIST, BIPM, and ISO. We regularly audit and update our data to ensure you always get the right answer.",
  "about.feedback.title": "Open to Feedback",
  "about.feedback.text": "We are constantly expanding our converter database based on user requests. If there is a unit or category you would like to see added, we would love to hear from you.",

  "privacy.badge": "Privacy",
  "privacy.h1": "Privacy Policy",
  "privacy.lead": "Your privacy is important to us. This policy explains how Turbo Unit Converter handles your data.",
  "privacy.s1.h": "1. Information We Do Not Collect",
  "privacy.s1.t": "Turbo Unit Converter is designed with privacy at its core. We do not require you to create an account, sign in, or provide any personal information to use our tools. All unit conversions are performed entirely in your web browser — no data is sent to our servers for processing.",
  "privacy.s2.h": "2. No Personal Data Stored",
  "privacy.s2.t": "Since we do not collect personal information through our service, there is no user data stored on our servers. We do not process, store, or transmit any personally identifiable information.",
  "privacy.s3.h": "3. Cookies and Tracking",
  "privacy.s3.t": "We do not use tracking cookies or third-party analytics services that collect personal data. We only use a localStorage item to remember your preferred theme (light or dark mode), which stays on your device and is never transmitted to us.",
  "privacy.s4.h": "4. Third-Party Services",
  "privacy.s4.t": "We may display advertisements through third-party ad networks. These partners may use cookies or similar technologies to serve relevant ads. Please refer to the respective privacy policies of our advertising partners for more information.",
  "privacy.s5.h": "5. Data Security",
  "privacy.s5.t": "While we do not collect personal data, we take reasonable measures to protect the integrity of our service. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  "privacy.s6.h": "6. Changes to This Policy",
  "privacy.s6.t": "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.",
  "privacy.s7.h": "7. Contact Us",
  "privacy.s7.t": "If you have any questions about this Privacy Policy, please reach out to us directly.",
  "common.lastUpdated": "Last updated:",

  "terms.badge": "Legal",
  "terms.h1": "Terms of Service",
  "terms.lead": "Please read these terms carefully before using Turbo Unit Converter.",
  "terms.s1.h": "1. Acceptance of Terms",
  "terms.s1.t": "By accessing or using Turbo Unit Converter, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  "terms.s2.h": "2. Description of Service",
  "terms.s2.t": "Turbo Unit Converter provides free online unit conversion tools. Our service allows you to convert between various units of measurement across multiple categories including length, weight, temperature, volume, area, speed, and more.",
  "terms.s3.h": "3. Use of the Service",
  "terms.s3.t": "You may use Turbo Unit Converter for personal, educational, and professional purposes. You agree not to:",
  "terms.s3.l1": "Use the service for any illegal or unauthorized purpose.",
  "terms.s3.l2": "Attempt to interfere with the proper functioning of the service.",
  "terms.s3.l3": "Reverse engineer, decompile, or disassemble any part of the service.",
  "terms.s3.l4": "Use automated systems or software to extract data from the service without permission.",
  "terms.s4.h": "4. Accuracy Disclaimer",
  "terms.s4.t": "While we strive for maximum accuracy, Turbo Unit Converter is provided \"as is\" without warranties of any kind. Conversion factors are based on standard reference data, but we cannot guarantee that all conversions are 100% accurate in every context. For critical applications (medical, engineering, financial), please verify results with authoritative sources.",
  "terms.s5.h": "5. Limitation of Liability",
  "terms.s5.t": "To the fullest extent permitted by law, Turbo Unit Converter and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use the service.",
  "terms.s6.h": "6. Intellectual Property",
  "terms.s6.t": "All content on Turbo Unit Converter, including text, graphics, logos, and software, is the property of Turbo Unit Converter or its licensors and is protected by copyright and other intellectual property laws.",
  "terms.s7.h": "7. Modifications to Terms",
  "terms.s7.t": "We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the updated terms.",
  "terms.s8.h": "8. Governing Law",
  "terms.s8.t": "These terms shall be governed by and construed in accordance with the laws applicable in the jurisdiction where Turbo Unit Converter operates, without regard to conflict of law principles.",
  "terms.s9.h": "9. Contact",
  "terms.s9.t": "For questions about these Terms of Service, please reach out to us directly.",
};

const es: Dict = {
  "nav.home": "Inicio",
  "nav.length": "Longitud",
  "nav.weight": "Peso",
  "nav.temperature": "Temperatura",
  "nav.volume": "Volumen",
  "nav.all": "Todos los Conversores",
  "nav.toggleTheme": "Cambiar tema",
  "nav.menu": "Menú",
  "nav.language": "Idioma",

  "footer.tagline": "Conversión de unidades profesional y herramientas técnicas.",
  "footer.about": "Acerca de",
  "footer.privacy": "Privacidad",
  "footer.terms": "Términos",
  "footer.rights": "Diseñado para la precisión.",

  "home.badge": "Precisión de nivel ingenieril",
  "home.h1.part1": "Conversor de Unidades Profesional",
  "home.h1.part2": "y Herramientas de Ingeniería",
  "home.subtitle": "Un conversor de unidades limpio, rápido y moderno para cada categoría que necesites. Diseñado para estudiantes, ingenieros y viajeros.",
  "home.common.title": "Conversiones de Unidades Comunes",
  "home.common.subtitle": "Ve directamente a los pares de unidades más usados para un cálculo rápido.",
  "home.why.title": "¿Por qué elegir Turbo Unit Converter?",
  "home.why.subtitle": "Hecho para ingenieros, estudiantes y cualquiera que necesite respuestas confiables.",
  "home.browse.title": "Explora Todos los Conversores",
  "home.browse.subtitle": "Cada categoría científica y de ingeniería importante, organizada para un acceso fácil.",
  "home.search.placeholder": "Busca unidades, categorías o símbolos…",
  "home.search.noMatches": "Sin resultados.",
  "home.units": "unidades",
  "home.faq.title": "Preguntas Frecuentes",
  "home.faq.subtitle": "Respuestas a preguntas comunes sobre Turbo Unit Converter.",
  "home.feature.precision.title": "Precisión de Nivel Ingenieril",
  "home.feature.precision.text": "Nuestros algoritmos están verificados con los estándares NIST para cálculos técnicos de alta fidelidad.",
  "home.feature.instant.title": "Resultados Instantáneos en Tiempo Real",
  "home.feature.instant.text": "Obtén conversiones mientras escribes. Sin recargas ni esperas — pura velocidad del lado del cliente.",
  "home.feature.privacy.title": "Enfocado en la Privacidad",
  "home.feature.privacy.text": "No almacenamos tus datos. Todas las conversiones ocurren directamente en tu navegador para total seguridad.",
  "home.faq.q1": "¿Qué tan precisa es la conversión?",
  "home.faq.a1": "Turbo Unit Converter usa aritmética de coma flotante de doble precisión y factores de conversión verificados por NIST. Soportamos hasta 12 decimales de precisión para tareas técnicas críticas.",
  "home.faq.q2": "¿Esta herramienta es gratis?",
  "home.faq.a2": "Sí, Turbo Unit Converter es 100% gratis para estudiantes e ingenieros profesionales. Mantenemos la plataforma con anuncios mínimos y no intrusivos.",
  "home.faq.q3": "¿Funciona sin conexión?",
  "home.faq.a3": "La carga inicial necesita conexión, pero una vez abierta la página, la lógica de conversión se ejecuta totalmente en tu navegador.",
  "home.faq.q4": "¿Puedo sugerir una nueva unidad?",
  "home.faq.a4": "Por supuesto. Siempre estamos ampliando nuestra base de datos y damos la bienvenida a sugerencias de nuevas categorías o unidades especializadas.",

  "all.h1": "Todos los Conversores de Unidades",
  "all.subtitle": "Explora nuestro directorio completo de herramientas de conversión profesionales, organizadas por disciplinas científicas y de ingeniería.",
  "all.search.placeholder": "Buscar conversores…",

  "about.badge": "Acerca de",
  "about.h1": "Acerca de Turbo Unit Converter",
  "about.lead": "Precisión de nivel ingenieril con simplicidad cotidiana. Construimos Turbo Unit Converter para ser la herramienta de conversión más confiable de la web.",
  "about.mission.title": "Nuestra Misión",
  "about.mission.p1": "Turbo Unit Converter fue creado con una sola meta: hacer la conversión de unidades sencilla, precisa y accesible para todos. Ya seas ingeniero trabajando en cálculos complejos, estudiante aprendiendo ciencias, viajero navegando medidas extranjeras o cocinero experimentando con recetas internacionales — te tenemos cubierto.",
  "about.mission.p2": "Creemos que la precisión importa. Un pequeño error de redondeo puede causar grandes problemas en ingeniería, medicina y ciencia. Por eso cada conversión en Turbo Unit Converter se calcula con la mayor precisión y se verifica contra datos de referencia estándar.",
  "about.offer.title": "Lo Que Ofrecemos",
  "about.offer.l1.b": "Más de 75 Categorías de Conversión",
  "about.offer.l1.t": "Desde unidades cotidianas como longitud, peso y volumen hasta categorías especializadas como aceleración, flujo magnético y dosis de radiación.",
  "about.offer.l2.b": "Resultados en Tiempo Real",
  "about.offer.l2.t": "Mira cómo las conversiones se actualizan al escribir. Sin clics, sin esperas.",
  "about.offer.l3.b": "Privacidad Primero",
  "about.offer.l3.t": "Todas las conversiones ocurren en tu navegador. No guardamos tus datos ni rastreamos tu actividad.",
  "about.offer.l4.b": "Completamente Gratis",
  "about.offer.l4.t": "Sin muros de pago, sin registros, sin anuncios que estorben. Solo poder de conversión puro.",
  "about.trust.title": "Construido sobre Confianza",
  "about.trust.text": "La precisión no es solo una función para nosotros — es un compromiso. Cada factor de conversión en nuestra base de datos proviene de estándares autorizados incluyendo NIST, BIPM e ISO. Auditamos y actualizamos nuestros datos regularmente.",
  "about.feedback.title": "Abiertos a Comentarios",
  "about.feedback.text": "Expandimos constantemente nuestra base de datos según las solicitudes de los usuarios. Si hay una unidad o categoría que te gustaría ver, nos encantaría saberlo.",

  "privacy.badge": "Privacidad",
  "privacy.h1": "Política de Privacidad",
  "privacy.lead": "Tu privacidad es importante para nosotros. Esta política explica cómo Turbo Unit Converter maneja tus datos.",
  "privacy.s1.h": "1. Información que No Recopilamos",
  "privacy.s1.t": "Turbo Unit Converter está diseñado con la privacidad como núcleo. No requerimos que crees cuenta, inicies sesión, ni proporciones información personal para usar nuestras herramientas. Todas las conversiones se realizan completamente en tu navegador — no se envían datos a nuestros servidores.",
  "privacy.s2.h": "2. No Almacenamos Datos Personales",
  "privacy.s2.t": "Como no recopilamos información personal a través de nuestro servicio, no hay datos de usuarios almacenados en nuestros servidores. No procesamos, almacenamos ni transmitimos ninguna información de identificación personal.",
  "privacy.s3.h": "3. Cookies y Rastreo",
  "privacy.s3.t": "No usamos cookies de rastreo ni servicios de analítica de terceros que recopilen datos personales. Solo usamos un elemento de localStorage para recordar tu tema preferido (claro u oscuro), que permanece en tu dispositivo y nunca se nos transmite.",
  "privacy.s4.h": "4. Servicios de Terceros",
  "privacy.s4.t": "Podemos mostrar anuncios a través de redes publicitarias de terceros. Estos socios pueden usar cookies o tecnologías similares para ofrecer anuncios relevantes. Consulta sus políticas de privacidad respectivas para más información.",
  "privacy.s5.h": "5. Seguridad de Datos",
  "privacy.s5.t": "Aunque no recopilamos datos personales, tomamos medidas razonables para proteger la integridad de nuestro servicio. Sin embargo, ningún método de transmisión por internet es 100% seguro, y no podemos garantizar seguridad absoluta.",
  "privacy.s6.h": "6. Cambios en Esta Política",
  "privacy.s6.t": "Podemos actualizar esta Política de Privacidad de vez en cuando. Los cambios se publicarán en esta página con una fecha actualizada. Te invitamos a revisar esta política periódicamente.",
  "privacy.s7.h": "7. Contáctanos",
  "privacy.s7.t": "Si tienes preguntas sobre esta Política de Privacidad, por favor contáctanos directamente.",
  "common.lastUpdated": "Última actualización:",

  "terms.badge": "Legal",
  "terms.h1": "Términos del Servicio",
  "terms.lead": "Por favor lee estos términos cuidadosamente antes de usar Turbo Unit Converter.",
  "terms.s1.h": "1. Aceptación de los Términos",
  "terms.s1.t": "Al acceder o usar Turbo Unit Converter, aceptas estar sujeto a estos Términos del Servicio. Si no aceptas estos términos, por favor no uses nuestros servicios.",
  "terms.s2.h": "2. Descripción del Servicio",
  "terms.s2.t": "Turbo Unit Converter proporciona herramientas gratuitas de conversión de unidades en línea. Nuestro servicio permite convertir entre varias unidades de medida en múltiples categorías incluyendo longitud, peso, temperatura, volumen, área, velocidad y más.",
  "terms.s3.h": "3. Uso del Servicio",
  "terms.s3.t": "Puedes usar Turbo Unit Converter con fines personales, educativos y profesionales. Aceptas no:",
  "terms.s3.l1": "Usar el servicio para cualquier propósito ilegal o no autorizado.",
  "terms.s3.l2": "Intentar interferir con el funcionamiento adecuado del servicio.",
  "terms.s3.l3": "Realizar ingeniería inversa, descompilar o desensamblar cualquier parte del servicio.",
  "terms.s3.l4": "Usar sistemas o software automatizados para extraer datos del servicio sin permiso.",
  "terms.s4.h": "4. Descargo de Precisión",
  "terms.s4.t": "Aunque nos esforzamos por la máxima precisión, Turbo Unit Converter se proporciona \"tal cual\" sin garantías de ningún tipo. Los factores de conversión se basan en datos de referencia estándar, pero no podemos garantizar que todas las conversiones sean 100% precisas en cada contexto. Para aplicaciones críticas (médicas, de ingeniería, financieras), verifica los resultados con fuentes autorizadas.",
  "terms.s5.h": "5. Limitación de Responsabilidad",
  "terms.s5.t": "En la mayor medida permitida por la ley, Turbo Unit Converter y sus operadores no serán responsables por daños directos, indirectos, incidentales, especiales o consecuentes que surjan de tu uso o incapacidad para usar el servicio.",
  "terms.s6.h": "6. Propiedad Intelectual",
  "terms.s6.t": "Todo el contenido de Turbo Unit Converter, incluyendo texto, gráficos, logos y software, es propiedad de Turbo Unit Converter o sus licenciantes y está protegido por leyes de derechos de autor y propiedad intelectual.",
  "terms.s7.h": "7. Modificaciones a los Términos",
  "terms.s7.t": "Nos reservamos el derecho de modificar estos Términos del Servicio en cualquier momento. Los cambios serán efectivos inmediatamente al publicarse. Tu uso continuo del servicio constituye la aceptación de los términos actualizados.",
  "terms.s8.h": "8. Ley Aplicable",
  "terms.s8.t": "Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables en la jurisdicción donde opera Turbo Unit Converter, sin tener en cuenta los principios de conflicto de leyes.",
  "terms.s9.h": "9. Contacto",
  "terms.s9.t": "Para preguntas sobre estos Términos del Servicio, por favor contáctanos directamente.",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.length": "लंबाई",
  "nav.weight": "वजन",
  "nav.temperature": "तापमान",
  "nav.volume": "आयतन",
  "nav.all": "सभी कन्वर्टर",
  "nav.toggleTheme": "थीम बदलें",
  "nav.menu": "मेनू",
  "nav.language": "भाषा",

  "footer.tagline": "पेशेवर इकाई रूपांतरण और तकनीकी उपकरण।",
  "footer.about": "हमारे बारे में",
  "footer.privacy": "गोपनीयता",
  "footer.terms": "शर्तें",
  "footer.rights": "सटीकता के लिए डिज़ाइन किया गया।",

  "home.badge": "इंजीनियरिंग-स्तर की सटीकता",
  "home.h1.part1": "पेशेवर इकाई कन्वर्टर",
  "home.h1.part2": "और इंजीनियरिंग उपकरण",
  "home.subtitle": "हर श्रेणी के लिए एक साफ, तेज़ और आधुनिक इकाई कन्वर्टर। छात्रों, इंजीनियरों और यात्रियों के लिए सटीकता के साथ बनाया गया।",
  "home.common.title": "सामान्य इकाई रूपांतरण",
  "home.common.subtitle": "त्वरित गणना के लिए सबसे अधिक उपयोग की जाने वाली इकाई जोड़ियों पर सीधे जाएं।",
  "home.why.title": "Turbo Unit Converter क्यों चुनें?",
  "home.why.subtitle": "इंजीनियरों, छात्रों और हर उस व्यक्ति के लिए बनाया गया जिसे विश्वसनीय उत्तर चाहिए।",
  "home.browse.title": "सभी इकाई कन्वर्टर ब्राउज़ करें",
  "home.browse.subtitle": "हर बड़ी वैज्ञानिक और इंजीनियरिंग श्रेणी, आसान पहुंच के लिए व्यवस्थित।",
  "home.search.placeholder": "इकाइयाँ, श्रेणियाँ या प्रतीक खोजें…",
  "home.search.noMatches": "कोई मिलान नहीं।",
  "home.units": "इकाइयाँ",
  "home.faq.title": "अक्सर पूछे जाने वाले प्रश्न",
  "home.faq.subtitle": "Turbo Unit Converter के बारे में सामान्य प्रश्नों के उत्तर।",
  "home.feature.precision.title": "इंजीनियरिंग-स्तर की सटीकता",
  "home.feature.precision.text": "हमारे एल्गोरिथम उच्च-निष्ठा तकनीकी गणनाओं के लिए NIST मानकों के विरुद्ध सत्यापित हैं।",
  "home.feature.instant.title": "तुरंत वास्तविक समय परिणाम",
  "home.feature.instant.text": "टाइप करते ही रूपांतरण पाएं। कोई पृष्ठ पुनः लोड नहीं — शुद्ध क्लाइंट-साइड गति।",
  "home.feature.privacy.title": "गोपनीयता-केंद्रित",
  "home.feature.privacy.text": "हम आपका डेटा संग्रहीत नहीं करते। सभी रूपांतरण आपके ब्राउज़र में होते हैं।",
  "home.faq.q1": "रूपांतरण कितना सटीक है?",
  "home.faq.a1": "Turbo Unit Converter डबल-प्रिसिजन फ्लोटिंग-पॉइंट अंकगणित और NIST-सत्यापित रूपांतरण कारकों का उपयोग करता है। महत्वपूर्ण कार्यों के लिए 12 दशमलव स्थानों तक की सटीकता।",
  "home.faq.q2": "क्या यह उपकरण मुफ्त है?",
  "home.faq.a2": "हाँ, Turbo Unit Converter छात्रों और पेशेवर इंजीनियरों के लिए 100% मुफ्त है। हम न्यूनतम, गैर-आक्रामक विज्ञापनों के माध्यम से प्लेटफ़ॉर्म चलाते हैं।",
  "home.faq.q3": "क्या यह ऑफ़लाइन काम करता है?",
  "home.faq.a3": "प्रारंभिक लोडिंग के लिए कनेक्शन चाहिए, लेकिन एक बार पृष्ठ खुल जाने पर रूपांतरण लॉजिक पूरी तरह आपके ब्राउज़र में चलता है।",
  "home.faq.q4": "क्या मैं नई इकाई सुझा सकता हूँ?",
  "home.faq.a4": "बिल्कुल। हम हमेशा अपने कन्वर्टर डेटाबेस का विस्तार कर रहे हैं और नई श्रेणियों या विशेष इकाइयों के लिए सुझावों का स्वागत करते हैं।",

  "all.h1": "सभी इकाई कन्वर्टर",
  "all.subtitle": "वैज्ञानिक और इंजीनियरिंग विषयों के अनुसार व्यवस्थित, पेशेवर-स्तर के रूपांतरण उपकरणों की हमारी पूरी निर्देशिका ब्राउज़ करें।",
  "all.search.placeholder": "कन्वर्टर खोजें…",

  "about.badge": "हमारे बारे में",
  "about.h1": "Turbo Unit Converter के बारे में",
  "about.lead": "इंजीनियरिंग-स्तर की सटीकता रोज़मर्रा की सादगी से मिलती है। हमने Turbo Unit Converter को वेब पर सबसे विश्वसनीय इकाई रूपांतरण उपकरण बनाया है।",
  "about.mission.title": "हमारा मिशन",
  "about.mission.p1": "Turbo Unit Converter एक ही लक्ष्य के साथ बनाया गया था: इकाई रूपांतरण को सभी के लिए आसान, सटीक और सुलभ बनाना। चाहे आप जटिल गणनाओं पर काम करने वाले इंजीनियर हों, विज्ञान सीखने वाले छात्र हों, विदेशी मापों से जूझ रहे यात्री हों, या अंतरराष्ट्रीय व्यंजनों के साथ प्रयोग कर रहे रसोइए — हम आपकी मदद के लिए हैं।",
  "about.mission.p2": "हम मानते हैं कि सटीकता मायने रखती है। एक छोटी सी राउंडिंग त्रुटि इंजीनियरिंग, चिकित्सा और विज्ञान में बड़ी समस्याएँ पैदा कर सकती है। इसीलिए Turbo Unit Converter पर हर रूपांतरण उच्चतम सटीकता के साथ की जाती है।",
  "about.offer.title": "हम क्या प्रदान करते हैं",
  "about.offer.l1.b": "75+ रूपांतरण श्रेणियाँ",
  "about.offer.l1.t": "लंबाई, वजन और आयतन जैसी रोज़मर्रा की इकाइयों से लेकर त्वरण, चुंबकीय फ्लक्स और विकिरण खुराक जैसी विशेष श्रेणियों तक।",
  "about.offer.l2.b": "वास्तविक समय परिणाम",
  "about.offer.l2.t": "टाइप करते ही रूपांतरण तुरंत अपडेट होते देखें। कोई क्लिक नहीं, कोई प्रतीक्षा नहीं।",
  "about.offer.l3.b": "गोपनीयता पहले",
  "about.offer.l3.t": "सभी रूपांतरण आपके ब्राउज़र में होते हैं। हम आपका डेटा संग्रहीत नहीं करते या आपकी गतिविधि को ट्रैक नहीं करते।",
  "about.offer.l4.b": "पूरी तरह मुफ्त",
  "about.offer.l4.t": "कोई पेवॉल नहीं, कोई साइनअप नहीं, कोई बाधक विज्ञापन नहीं। केवल शुद्ध रूपांतरण शक्ति।",
  "about.trust.title": "विश्वास पर निर्मित",
  "about.trust.text": "सटीकता हमारे लिए केवल एक सुविधा नहीं है — यह एक प्रतिबद्धता है। हमारे डेटाबेस में हर रूपांतरण कारक NIST, BIPM और ISO सहित आधिकारिक मानकों से लिया गया है।",
  "about.feedback.title": "प्रतिक्रिया के लिए खुले",
  "about.feedback.text": "हम उपयोगकर्ता अनुरोधों के आधार पर अपने कन्वर्टर डेटाबेस का लगातार विस्तार कर रहे हैं। यदि कोई इकाई या श्रेणी जोड़ना चाहते हैं, तो हमें बताएँ।",

  "privacy.badge": "गोपनीयता",
  "privacy.h1": "गोपनीयता नीति",
  "privacy.lead": "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि Turbo Unit Converter आपके डेटा को कैसे संभालता है।",
  "privacy.s1.h": "1. जानकारी जो हम एकत्र नहीं करते",
  "privacy.s1.t": "Turbo Unit Converter गोपनीयता को मूल में रखकर डिज़ाइन किया गया है। हमारे उपकरणों का उपयोग करने के लिए आपको खाता बनाने, साइन इन करने या कोई व्यक्तिगत जानकारी देने की आवश्यकता नहीं है। सभी रूपांतरण पूरी तरह आपके ब्राउज़र में होते हैं।",
  "privacy.s2.h": "2. कोई व्यक्तिगत डेटा संग्रहीत नहीं",
  "privacy.s2.t": "चूंकि हम अपनी सेवा के माध्यम से व्यक्तिगत जानकारी एकत्र नहीं करते, इसलिए हमारे सर्वर पर कोई उपयोगकर्ता डेटा संग्रहीत नहीं है। हम कोई भी व्यक्तिगत पहचान संबंधी जानकारी संसाधित, संग्रहीत या प्रसारित नहीं करते।",
  "privacy.s3.h": "3. कुकीज़ और ट्रैकिंग",
  "privacy.s3.t": "हम ट्रैकिंग कुकीज़ या व्यक्तिगत डेटा एकत्र करने वाली तृतीय-पक्ष एनालिटिक्स सेवाओं का उपयोग नहीं करते। हम केवल आपकी पसंदीदा थीम (लाइट या डार्क) याद रखने के लिए localStorage का उपयोग करते हैं।",
  "privacy.s4.h": "4. तृतीय-पक्ष सेवाएँ",
  "privacy.s4.t": "हम तृतीय-पक्ष विज्ञापन नेटवर्क के माध्यम से विज्ञापन दिखा सकते हैं। ये साझेदार प्रासंगिक विज्ञापन देने के लिए कुकीज़ का उपयोग कर सकते हैं।",
  "privacy.s5.h": "5. डेटा सुरक्षा",
  "privacy.s5.t": "हालांकि हम व्यक्तिगत डेटा एकत्र नहीं करते, हम अपनी सेवा की अखंडता की सुरक्षा के लिए उचित उपाय करते हैं। हालांकि, इंटरनेट पर संचरण का कोई भी तरीका 100% सुरक्षित नहीं है।",
  "privacy.s6.h": "6. इस नीति में बदलाव",
  "privacy.s6.t": "हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। कोई भी बदलाव इस पृष्ठ पर पोस्ट किया जाएगा।",
  "privacy.s7.h": "7. हमसे संपर्क करें",
  "privacy.s7.t": "यदि इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमसे सीधे संपर्क करें।",
  "common.lastUpdated": "अंतिम अद्यतन:",

  "terms.badge": "कानूनी",
  "terms.h1": "सेवा की शर्तें",
  "terms.lead": "कृपया Turbo Unit Converter का उपयोग करने से पहले इन शर्तों को ध्यान से पढ़ें।",
  "terms.s1.h": "1. शर्तों की स्वीकृति",
  "terms.s1.t": "Turbo Unit Converter का उपयोग करके आप इन सेवा शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।",
  "terms.s2.h": "2. सेवा का विवरण",
  "terms.s2.t": "Turbo Unit Converter मुफ्त ऑनलाइन इकाई रूपांतरण उपकरण प्रदान करता है। हमारी सेवा आपको लंबाई, वजन, तापमान, आयतन, क्षेत्रफल, गति और अधिक श्रेणियों में रूपांतरण की अनुमति देती है।",
  "terms.s3.h": "3. सेवा का उपयोग",
  "terms.s3.t": "आप Turbo Unit Converter का व्यक्तिगत, शैक्षिक और पेशेवर उद्देश्यों के लिए उपयोग कर सकते हैं। आप सहमत हैं कि:",
  "terms.s3.l1": "किसी भी अवैध या अनधिकृत उद्देश्य के लिए सेवा का उपयोग नहीं करेंगे।",
  "terms.s3.l2": "सेवा के उचित कामकाज में हस्तक्षेप का प्रयास नहीं करेंगे।",
  "terms.s3.l3": "सेवा के किसी भी भाग की रिवर्स इंजीनियरिंग या डीकंपाइल नहीं करेंगे।",
  "terms.s3.l4": "बिना अनुमति के डेटा निकालने के लिए स्वचालित प्रणालियों का उपयोग नहीं करेंगे।",
  "terms.s4.h": "4. सटीकता अस्वीकरण",
  "terms.s4.t": "हालांकि हम अधिकतम सटीकता का प्रयास करते हैं, Turbo Unit Converter \"जैसा है\" प्रदान किया जाता है। महत्वपूर्ण अनुप्रयोगों (चिकित्सा, इंजीनियरिंग, वित्तीय) के लिए, कृपया आधिकारिक स्रोतों से परिणाम सत्यापित करें।",
  "terms.s5.h": "5. दायित्व की सीमा",
  "terms.s5.t": "कानून द्वारा अनुमत अधिकतम सीमा तक, Turbo Unit Converter और इसके संचालक सेवा के उपयोग से उत्पन्न किसी भी प्रत्यक्ष या अप्रत्यक्ष क्षति के लिए उत्तरदायी नहीं होंगे।",
  "terms.s6.h": "6. बौद्धिक संपदा",
  "terms.s6.t": "Turbo Unit Converter की सभी सामग्री, टेक्स्ट, ग्राफिक्स, लोगो और सॉफ़्टवेयर सहित, Turbo Unit Converter या इसके लाइसेंसकर्ताओं की संपत्ति है।",
  "terms.s7.h": "7. शर्तों में संशोधन",
  "terms.s7.t": "हम किसी भी समय इन सेवा शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। पोस्ट करने पर परिवर्तन तुरंत प्रभावी होंगे।",
  "terms.s8.h": "8. प्रशासी कानून",
  "terms.s8.t": "ये शर्तें उस क्षेत्राधिकार के लागू कानूनों के अनुसार शासित होंगी जहाँ Turbo Unit Converter संचालित होता है।",
  "terms.s9.h": "9. संपर्क",
  "terms.s9.t": "इन सेवा शर्तों के बारे में प्रश्नों के लिए, कृपया हमसे सीधे संपर्क करें।",
};

const DICTS: Record<Lang, Dict> = { en, es, hi };

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const initial: Lang = (() => {
    if (typeof window === "undefined") return "en";
    const fromPath = getLocaleFromPath(window.location.pathname);
    if (fromPath) return fromPath;
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && DICTS[saved]) return saved;
    return "en";
  })();
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const sync = () => {
      const fromPath = getLocaleFromPath(window.location.pathname) ?? "en";
      setLangState((prev) => (prev === fromPath ? prev : fromPath));
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") localStorage.setItem("lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const t = (key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
