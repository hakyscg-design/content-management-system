import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "./navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Management System",
  description: "Local operator console for the CMS production layer."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
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
                  L-03 persistent local runtime. Data and media persist across
                  restarts.
                </div>
              </div>
              <Navigation />
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
