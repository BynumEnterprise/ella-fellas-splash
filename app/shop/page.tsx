import Link from "next/link";
import type { Metadata } from "next";
import {
  Ear,
  ShoppingBag,
  BatteryCharging,
  GlassWater,
  Umbrella,
  Footprints,
  Shirt,
  Crown,
  Disc3,
  Disc,
  Briefcase,
  Gem,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { amazonSearchUrl, amazonUrl } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Concert Gear & Fan Picks â the Ella Fellas Shop",
  description:
    "Hand-picked gear for Ella Langley concerts and country shows: boots, earplugs, hats, portable chargers, and Dandelion vinyl. All Amazon links are affiliate links â your clicks help keep the site free.",
};

interface Pick {
  name: string;
  blurb: string;
  query?: string;
  asin?: string;
  price?: string;
  why: string;
  icon: LucideIcon;
  tileBg: string;
  tileIcon: string;
}

interface Category {
  slug: string;
  title: string;
  intro: string;
  picks: Pick[];
}

const CATEGORIES: Category[] = [
  {
    slug: "concert-essentials",
    title: "CONCERT ESSENTIALS",
    intro:
      "The five things every Ella show veteran has in their bag. Spend $40 once and you're set for the whole tour.",
    picks: [
      {
        name: "High-fidelity concert earplugs",
        blurb:
          "Lowers volume without muffling vocals. You'll hear every word of 'Choosin' Texas' and not leave with your ears ringing.",
        query: "concert earplugs high fidelity",
        price: "$25-$35",
        why: "If you're going to multiple stadium dates this summer, the difference between cheap foam and real filtered earplugs is night and day. Loop Experience is the popular pick but the off-brand versions on Amazon work fine.",
        icon: Ear,
        tileBg: "bg-clay/15",
        tileIcon: "text-clay",
      },
      {
        name: "Slim crossbody bag (clear, venue-compliant)",
        blurb:
          "Most stadiums on Morgan Wallen's tour now enforce clear-bag policy. Get a stadium-approved one before you go.",
        query: "clear stadium crossbody bag NFL approved",
        price: "$15-$25",
        why: "Soldier Field, Gillette, Acrisure, Lincoln Financial â all clear-bag stadiums. Cheaper to buy ahead than panic-buy at the gate.",
        icon: ShoppingBag,
        tileBg: "bg-denim/10",
        tileIcon: "text-denim",
      },
      {
        name: "10,000 mAh portable charger",
        blurb:
          "Doors open at 5:30 and you won't be home until midnight. Phones die fast at outdoor shows.",
        query: "anker portable charger 10000mAh",
        price: "$20-$30",
        why: "Anker is the trusted brand. 10K mAh is two full phone charges â enough for openers, headliner, and the rideshare home.",
        icon: BatteryCharging,
        tileBg: "bg-primary/20",
        tileIcon: "text-primary-dark",
      },
      {
        name: "Refillable insulated water bottle",
        blurb:
          "Most venues let you bring an empty one in. Summer shows = expensive arena water unless you bring your own.",
        query: "Hydro Flask 24oz water bottle",
        price: "$25-$45",
        why: "Empty bottles pass security. $5 stadium water adds up fast across a tour.",
        icon: GlassWater,
        tileBg: "bg-sky-100",
        tileIcon: "text-sky-700",
      },
      {
        name: "Lightweight rain poncho",
        blurb:
          "Half the Dandelion Tour dates are amphitheatres and outdoor. One rain delay justifies the $8.",
        query: "disposable rain poncho 4 pack",
        price: "$8-$15",
        why: "Estero, OKC, Cary, Salem â all outdoor venues. Better to have one and not need it.",
        icon: Umbrella,
        tileBg: "bg-slate-200",
        tileIcon: "text-slate-700",
      },
    ],
  },
  {
    slug: "what-to-wear",
    title: "WHAT TO WEAR",
    intro:
      "We're not going to tell you what country fans \"should\" look like. But here's what holds up at a 4-hour show.",
    picks: [
      {
        name: "Western boots that don't kill your feet",
        blurb:
          "Real-life boots from brands that ship via Amazon â Ariat, Justin, Dan Post. Break them in first.",
        query: "Ariat women's western boots",
        price: "$120-$250",
        why: "Avoid the $40 Halloween cowboy boots. You'll be standing for 4+ hours. Worth the upgrade.",
        icon: Footprints,
        tileBg: "bg-amber-100",
        tileIcon: "text-amber-800",
      },
      {
        name: "Country show pearl-snap shirt",
        blurb:
          "The unofficial Ella crowd uniform. Looks right, costs $25, fits in any venue.",
        query: "men's pearl snap western shirt",
        price: "$25-$45",
        why: "Works for cowboy-aesthetic without trying too hard. Wrangler is the safe pick.",
        icon: Shirt,
        tileBg: "bg-denim/15",
        tileIcon: "text-denim",
      },
      {
        name: "Lightweight straw cowboy hat (only if you commit)",
        blurb:
          "Don't buy this for one show. But if you're doing the festival circuit, a good crushable straw lid is worth it.",
        query: "men's straw cowboy hat crushable",
        price: "$40-$80",
        why: "Resistol or Stetson via FlexOffers are the lifetime picks. The $20 versions look $20 and won't survive Stagecoach.",
        icon: Crown,
        tileBg: "bg-yellow-100",
        tileIcon: "text-yellow-800",
      },
    ],
  },
  {
    slug: "fan-collection",
    title: "FOR THE FAN COLLECTION",
    intro:
      "Vinyl, CDs, posters, and stuff worth owning. We link to whatever Amazon has â official Ella merch is at ellalangley.us.",
    picks: [
      {
        name: "Dandelion (vinyl)",
        blurb:
          "Ella's second album, the one that broke her to the mainstream. Pressed by Columbia, widely available on Amazon and at indie record stores.",
        query: "Ella Langley Dandelion vinyl",
        price: "$28-$35",
        why: "Look for the colored variants. The standard black is fine but the limited indie-store colors will hold value.",
        icon: Disc3,
        tileBg: "bg-primary/15",
        tileIcon: "text-primary-dark",
      },
      {
        name: "Hungover (debut album, vinyl)",
        blurb:
          "Her 2024 debut. Less polished, more honest. 'You Look Like You Love Me' lives here.",
        query: "Ella Langley Hungover vinyl",
        price: "$24-$30",
        why: "Best entry point if you're starting the collection. Includes the song she sings with Riley Green that made the whole world pay attention.",
        icon: Disc,
        tileBg: "bg-clay/15",
        tileIcon: "text-clay",
      },
      {
        name: "Country Now / Whiskey Riff t-shirts",
        blurb:
          "Country-blog tees are a vibe. Cheaper than band merch and you'll get nods from other fans in line.",
        query: "Whiskey Riff country music t-shirt",
        price: "$22-$30",
        why: "Pairs well with denim and a Stetson. Less try-hard than an actual artist tee.",
        icon: Shirt,
        tileBg: "bg-emerald-100",
        tileIcon: "text-emerald-800",
      },
    ],
  },
  {
    slug: "travel-prep",
    title: "TRAVEL PREP",
    intro:
      "For the fans flying in for a specific show â practical packing for a 36-hour music-trip.",
    picks: [
      {
        name: "Underseat duffel (45L)",
        blurb:
          "Fits boots + outfit changes + chargers and still goes under the seat on Southwest and Delta.",
        query: "underseat carry on duffel bag 45L",
        price: "$35-$70",
        why: "Skip the checked bag for a 1-night turnaround. Faster off the plane, no bag-fee.",
        icon: Briefcase,
        tileBg: "bg-denim/10",
        tileIcon: "text-denim",
      },
      {
        name: "Travel jewelry / accessory case",
        blurb:
          "Keeps small turquoise/silver pieces from getting destroyed in your carry-on.",
        query: "small travel jewelry organizer pouch",
        price: "$12-$20",
        why: "If you're driving to Vegas for Stagecoach or hopping to Stagecoach + a stadium date, this saves headaches.",
        icon: Gem,
        tileBg: "bg-rose-100",
        tileIcon: "text-rose-700",
      },
    ],
  },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-ink/60 mb-2">
          Curated affiliate picks
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-denim leading-none tracking-wider">
          THE FELLAS SHOP
        </h1>
        <p className="text-lg text-ink/80 mt-4 max-w-2xl mx-auto">
          Stuff we actually recommend for going to Ella Langley shows â concert gear, festival
          packing, and additions to the fan collection.{" "}
          <strong className="text-denim">Every Amazon link is an affiliate link.</strong>
        </p>
        <p className="text-sm text-ink/60 mt-3 max-w-2xl mx-auto">
          You won&apos;t pay more by clicking through us â Amazon pays a small commission that
          keeps Ella Fellas free.
        </p>
      </header>

      {CATEGORIES.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-denim mb-2 tracking-wider">
            {cat.title}
          </h2>
          <p className="text-ink/80 mb-6 leading-relaxed">{cat.intro}</p>
          <div className="space-y-5">
            {cat.picks.map((p) => {
              const href = p.asin
                ? amazonUrl(p.asin)
                : amazonSearchUrl(p.query ?? p.name);
              const Icon = p.icon;
              return (
                <article
                  key={p.name}
                  className="bg-paper border border-ink/15 rounded-lg p-5 md:p-6 hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    <div
                      className={`${p.tileBg} flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md flex items-center justify-center`}
                      aria-hidden="true"
                    >
                      <Icon className={`${p.tileIcon} w-10 h-10 md:w-12 md:h-12`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-xl md:text-2xl text-denim leading-tight">
                            {p.name}
                          </h3>
                          {p.price && (
                            <p className="text-xs uppercase tracking-[0.15em] text-primary mt-1">
                              {p.price}
                            </p>
                          )}
                        </div>
                        <AffiliateLink
                          href={href}
                          source={`amazon-${cat.slug}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-denim text-paper font-display tracking-wide text-sm rounded-md hover:bg-denim/90 whitespace-nowrap"
                          ariaLabel={`Shop ${p.name} on Amazon`}
                        >
                          SHOP ON AMAZON â
                        </AffiliateLink>
                      </div>
                      <p className="text-base text-ink/80 mt-3 leading-relaxed">{p.blurb}</p>
                      <p className="text-sm text-ink/60 mt-2 italic">
                        <span className="not-italic font-medium text-ink/80">Why we picked it:</span>{" "}
                        {p.why}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-8 text-center">
        <h2 className="font-display text-2xl text-denim mb-2">LOOKING FOR OFFICIAL MERCH?</h2>
        <p className="text-ink/80 mb-4">
          We&apos;re an unofficial fan site. For official Ella Langley apparel and tour merch, go
          straight to the source.
        </p>
        <a
          href="https://ellalangley.us"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
        >
          ELLALANGLEY.US â
        </a>
      </div>

      <AffiliateDisclosure />

      <p className="text-xs text-ink/50 mt-8 text-center">
        Looking for something specific?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Tell us what to add
        </Link>
        .
      </p>
    </div>
  );
}
