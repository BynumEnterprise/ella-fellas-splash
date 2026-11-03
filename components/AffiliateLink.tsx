import { ReactNode } from "react";

// Server component on purpose (no client directive): a plain <a> with no state or handlers, so it renders
// on the server and adds nothing to the client bundle or hydration. Click
// tracking is done globally by AffiliateClickTracker (event delegation).

interface Props {
  href: string;
  source?: string;
  children: ReactNode;
  className?: string;
  /**
   * Extra context for assistive tech (e.g. "Get tickets for Ella Langley in
   * Georgetown on TicketNetwork"). Rendered as `title` (the accessible
   * DESCRIPTION), not `aria-label`: an aria-label that doesn't contain the
   * link's visible text fails WCAG 2.5.3 Label in Name (Lighthouse
   * label-content-name-mismatch) and breaks voice control ("click Get
   * tickets"). The visible text stays the accessible name.
   */
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
      title={ariaLabel}
      className={className}
      data-affiliate-source={source && source !== "unknown" ? source : undefined}
    >
      {children}
    </a>
  );
}
