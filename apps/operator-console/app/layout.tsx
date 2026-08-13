import type { Metadata } from "next";
import Link from "next/link";
import { getOperatorLanguage } from "./language-context.js";
import { LanguageSwitcher } from "./language-switcher.js";
import { Navigation } from "./navigation.js";
import { getOperatorDashboardView } from "./project-context.js";
import { ProjectSwitcher } from "./project-switcher.js";
import { copy } from "./i18n.js";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Management System",
  description: "Local operator console for the CMS production layer."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const view = await getOperatorDashboardView();
  const language = await getOperatorLanguage();
  const text = copy[language];

  return (
    <html lang={language === "vn" ? "vi" : "en"}>
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="topbar-inner">
              <div className="brand-row">
                <div>
                  <h1 className="brand-title">
                    <Link href="/">{text.shell.appName}</Link>
                  </h1>
                  <p className="brand-subtitle">{text.shell.subtitle}</p>
                </div>
                <div className="runtime-badge">
                  {view.project.name} - {text.shell.runtimeSuffix}
                </div>
              </div>
              <div className="topbar-controls">
                <ProjectSwitcher
                  activeProjectId={view.project.id}
                  text={text.shell}
                />
                <LanguageSwitcher language={language} text={text.shell} />
              </div>
              <Navigation text={text.nav} />
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
