"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { OperatorCopy } from "./i18n.js";

const navigationItems = [
  { href: "/", key: "overview" },
  { href: "/source-assets", key: "sourceAssets" },
  { href: "/content-production", key: "contentProduction" },
  { href: "/workflow", key: "workflow" },
  { href: "/review", key: "review" },
  { href: "/publishing", key: "publishing" },
  { href: "/performance-analytics", key: "performanceAnalytics" },
  { href: "/administration", key: "administration" }
] as const;

export function Navigation({ text }: { readonly text: OperatorCopy["nav"] }) {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label={text.primary}>
      {navigationItems.map((item) => (
        <Link
          className="nav-link"
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          key={item.href}
        >
          {text[item.key]}
        </Link>
      ))}
    </nav>
  );
}
