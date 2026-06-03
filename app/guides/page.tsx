import Link from "next/link";
import type { Metadata } from "next";
import {
  Trophy,
  Ticket,
  Compass,
  Map,
  BookOpen,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAllGuideContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ella Langley Guides",
  description:
    "Long-form guides for Ella Langley fans — concert prep, song rankings, opening acts, presale tactics, and more.",
  alternates: { canonical: "/guides" },
  openGraph: { url: "/guides" },
};

const CATEGORY_STYLE: Record<
  string,
  { label: string; icon: LucideIcon; tileBg: string; tileFg: string; accent: string }
> = {
  rankings: {
    label: "Rankings",
    icon: Trophy,
    tileBg: "bg-primary/20",
    tileFg: "text-primary-dark",
    accent: "border-l-primary",
  },
  "concert-prep": {
    label: "Concert Prep",
    icon: Ticket,
    tileBg: "bg-denim/15",
    tileFg: "text-denim",
    accent: "border-l-denim",
  },
  "fan-onboarding": {
    label: "New Fan Starter",
    icon: Compass,
    tileBg: "bg-clay/15",
    tileFg: "text-clay",
    accent: "border-l-clay",
  },
  context: {
    label: "Context & Comparisons",
    icon: Map,
    tileBg: "bg-emerald-100",
    tileFg: "text-emerald-800",
    accent: "border-l-emerald-600",
  },
};

const DEFAULT_STYLE = {
  label: "Guide",
  icon: BookOpen,
  tileBg: "bg-ink/10",
  tileFg: "text-ink",
  accent: "border-l-ink/40",
};

function styleFor(category?: string) {
  if (category && CATEGORY_STYLE[category]) return CATEGORY_STYLE[category];
  return DEFAULT_STYLE;
}

function readTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
}

export default function GuidesIndexPage() {
  const guides = getAllGuideContent();
  if (guides.length === 0) {
    return (
      <article className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl text-denim">GUIDES</h1>
        <p className="text-ink/70 mt-3">No guides published yet — check back soon.</p>
      </article>
    );
  }

  const [featured, ...rest] = guides;
  const featuredStyle = styleFor(featured.frontmatter.category);
  const FeaturedIcon = featuredStyle.icon;

  const grouped = rest.reduce<Record<string, typeof rest>>((acc, g) => {
    const cat = g.frontmatter.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(g);
    return acc;
  }, {});

  const categoryOrder = ["concert-prep", "rankings", "fan-onboarding", "context", "other"];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-clay font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Long-form, no-fluff fan guides
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-denim leading-none tracking-wider">
          THE GUIDES
        </h1>
        <p className="text-lg text-ink/80 mt-5 leading-relaxed">
          Concert prep, song rankings, presale tactics, and the answers to the questions you
          actually google before a show. Written by fans who&apos;ve been to too many.
        </p>
      </header>

      <section className="mb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/50 mb-3 font-medium">
          Featured guide
        </p>
        <Link
          href={`/guides/${featured.slug}`}
          className={`group block relative overflow-hidden bg-paper border border-ink/15 ${featuredStyle.accent} border-l-8 rounded-xl p-6 md:p-8 hover:border-primary hover:shadow-lg transition-all`}
        >
          <div className="flex items-start gap-5 md:gap-6">
            <div
              className={`${featuredStyle.tileBg} flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center`}
              aria-hidden="true"
            >
              <FeaturedIcon className={`${featuredStyle.tileFg} w-8 h-8 md:w-10 md:h-10`} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-primary font-medium">
                {featuredStyle.label} · {readTime(featured.body)} min read
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-denim mt-2 leading-tight group-hover:text-primary transition-colors">
                {featured.frontmatter.title}
              </h2>
              {featured.frontmatter.excerpt && (
                <p className="text-base md:text-lg text-ink/75 mt-3 leading-relaxed">
                  {featured.frontmatter.excerpt}
                </p>
              )}
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-display tracking-wide text-primary">
                READ THE GUIDE
                <ArrowUpRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </Link>
      </section>

      {sortedCategories.map((cat) => {
        const style = styleFor(cat);
        const Icon = style.icon;
        const catGuides = grouped[cat];
        return (
          <section key={cat} className="mb-12">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-ink/10">
              <div
                className={`${style.tileBg} w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0`}
                aria-hidden="true"
              >
                <Icon className={`${style.tileFg} w-5 h-5`} strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider">
                {style.label.toUpperCase()}
              </h2>
              <span className="text-xs text-ink/50 ml-auto">
                {catGuides.length} guide{catGuides.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {catGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className={`group block bg-paper border border-ink/15 ${style.accent} border-l-4 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${style.tileBg} flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center`}
                      aria-hidden="true"
                    >
                      <Icon className={`${style.tileFg} w-6 h-6`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50 font-medium">
                        {readTime(g.body)} min read
                      </p>
                      <h3 className="font-display text-lg md:text-xl text-denim mt-1 leading-tight group-hover:text-primary transition-colors">
                        {g.frontmatter.title}
                      </h3>
                      {g.frontmatter.excerpt && (
                        <p className="text-sm text-ink/75 mt-2 leading-relaxed line-clamp-3">
                          {g.frontmatter.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-16 text-center border-t border-ink/10 pt-10">
        <p className="text-sm text-ink/60">
          Missing a guide you wish existed?{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Tell us what to write next
          </Link>
          .
        </p>
      </div>
    </article>
  );
}