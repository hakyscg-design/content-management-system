"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Overview" },
  { href: "/source-assets", label: "Source & Assets" },
  { href: "/content-production", label: "Content Production" },
  { href: "/workflow", label: "Workflow" },
  { href: "/review", label: "Review" },
  { href: "/publishing", label: "Publishing" },
  { href: "/performance-analytics", label: "Performance & Analytics" },
  { href: "/administration", label: "Administration" }
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Primary">
      {navigationItems.map((item) => (
        <Link
          className="nav-link"
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
