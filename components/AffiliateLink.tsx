"use client";
import { ReactNode } from "react";

interface Props {
  href: string;
  source?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function AffiliateLink({ href, source = "unknown", children, className, ariaLabel }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow sponsored"
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        if (typeof window !== "undefined" && (window as any).plausible) {
          (window as any).plausible("AffiliateClick", { props: { source } });
        }
      }}
    >
      {children}
    </a>
  );
}
