import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "./navigation.js";
import { getOperatorDashboardView } from "./project-context.js";
import { ProjectSwitcher } from "./project-switcher.js";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Management System",
  description: "Local operator console for the CMS production layer."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const view = await getOperatorDashboardView();

  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="topbar-inner">
              <div className="brand-row">
                <div>
                  <h1 className="brand-title">
                    <Link href="/">Content Management System</Link>
                  </h1>
                  <p className="brand-subtitle">
                    Local operator console for reusable content projects.
                  </p>
                </div>
                <div className="runtime-badge">
                  {view.project.name} - persistent local runtime.
                </div>
              </div>
              <ProjectSwitcher activeProjectId={view.project.id} />
              <Navigation />
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
