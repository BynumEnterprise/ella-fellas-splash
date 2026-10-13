"use client";
import { ReactNode } from "react";

interface Props {
  href: string;
  source?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

// No default source: an untagged link used to be stamped "unknown", which won
// over AffiliateClickTracker's ancestor/section fallback. Omit the attribute and
// let the tracker derive a real placement instead.
export function AffiliateLink({ href, source, children, className, ariaLabel }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow sponsored"
      aria-label={ariaLabel}
      className={className}
      data-affiliate-source={source && source !== "unknown" ? source : undefined}
    >
      {children}
    </a>
  );
}
