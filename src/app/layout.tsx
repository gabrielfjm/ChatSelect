import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAdHocSlugs } from "@/lib/catalog/instruments-repository";
import { getAdminUser } from "@/lib/auth/admin";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ChatSelect — Catálogo de Instrumentos de Avaliação",
    template: "%s | ChatSelect",
  },
  description:
    "Catálogo de instrumentos de avaliação (questionários, escalas, entrevistas, rubricas) usados em pesquisas sobre chatbots educacionais.",
};

// Fichas live in the database and change whenever an admin approves or edits
// one, so every route renders per request instead of being frozen at build.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Only used to highlight the header's active item, so a database hiccup
  // here shouldn't take down pages that don't need the catalog (e.g. /sobre).
  const [adHocSlugs, admin] = await Promise.all([
    getAdHocSlugs().catch(() => []),
    // Header login badge only — never used for authorization.
    getAdminUser().catch(() => null),
  ]);

  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader
          adHocSlugs={adHocSlugs}
          admin={admin ? { email: admin.email, name: admin.name } : null}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
