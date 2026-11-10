import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import { PROFILE } from "@/data/profile";
import { SITE_ALIASES, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  category: "games",
  classification: "League of Legends, Pyke, suporte",
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // why: the Riot ID and mastery numbers are not phone numbers; without this, iOS Safari turns them into call links.
  formatDetection: { telephone: false, address: false, email: false },
  // why: Search Console ownership token, set per environment so it is never hardcoded in the repo.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
};

// why: lets search engines show the site name and the owner's profile instead of guessing from the title.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: SITE_ALIASES,
      description: SITE_DESCRIPTION,
      inLanguage: "pt-BR",
      keywords: SITE_KEYWORDS.join(", "),
      publisher: { "@id": `${SITE_URL}/#person` },
      about: { "@id": `${SITE_URL}/#pyke` },
    },
    {
      "@type": "Thing",
      "@id": `${SITE_URL}/#pyke`,
      name: "Pyke",
      description: "Campeão de League of Legends, o Estripador de Águas de Sentina",
      sameAs: "https://www.leagueoflegends.com/pt-br/champions/pyke/",
      subjectOf: {
        "@type": "VideoGame",
        name: "League of Legends",
        publisher: { "@type": "Organization", name: "Riot Games" },
        url: "https://www.leagueoflegends.com/pt-br/",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#page`,
      url: `${SITE_URL}/`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "pt-BR",
      about: { "@id": `${SITE_URL}/#pyke` },
      mainEntity: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PROFILE.name,
        alternateName: `${PROFILE.name}${PROFILE.tag}`,
        // why: the Riot ID is how players look the owner up in game; schema.org exposes it as a typed identifier.
        identifier: { "@type": "PropertyValue", propertyID: "Riot ID", value: `${PROFILE.name}${PROFILE.tag}` },
        url: `${SITE_URL}/`,
        image: `${SITE_URL}${PROFILE.photo}`,
        description: `${PROFILE.since}. Suporte, elo ${PROFILE.rank}, ${PROFILE.mastery} ${PROFILE.masteryLabel}.`,
        knowsAbout: ["Pyke", "League of Legends", "suporte"],
      },
    },
  ],
};

export const viewport: Viewport = { themeColor: "#061416", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // hazard: JSON.stringify does not escape "<"; without the replace, a "</script>" in profile text would end the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
