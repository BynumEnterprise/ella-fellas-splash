import Link from "next/link";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-denim text-paper mt-16">
      {/* Sitewide newsletter signup */}
      <div className="border-b border-paper/10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-display text-xl tracking-wider text-primary mb-1">
            GET THE ELLA FELLAS DAILY
          </p>
          <p className="text-sm text-paper/80 mb-5">
            Tour news, ticket alerts, and concert guides in your inbox &mdash; written by fans, for the Fellas.
          </p>
          <NewsletterSignup placement="footer" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-2xl tracking-wider text-primary">ELLA FELLAS</p>
          <p className="text-sm mt-2 text-paper/80">
            Daily HQ for Ella Langley superfans. An unofficial fan site.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-display text-primary mb-3">EXPLORE</p>
          <ul className="space-y-1.5">
            <li><Link href="/tour" className="hover:text-primary">Tour</Link></li>
            <li><Link href="/songs" className="hover:text-primary">Songs</Link></li>
            <li><Link href="/news" className="hover:text-primary">News</Link></li>
            <li><Link href="/guides" className="hover:text-primary">Guides</Link></li>
            <li><Link href="/vs" className="hover:text-primary">Compare</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display text-primary mb-3">ABOUT</p>
          <ul className="space-y-1.5">
            <li><Link href="/about" className="hover:text-primary">About this site</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-paper/70 space-y-2">
          <p>
            <strong>Ella Fellas is an independent fan-run site.</strong> We are not affiliated with,
            endorsed by, or sponsored by Ella Langley, her management, her label
            (Sony Music Nashville / Columbia / SAWGOD), or her official merchandise (Ella&apos;s Fellas).
            All trademarks belong to their respective owners.
          </p>
          <p>
            Official site: <a href="https://ellalangley.com" className="text-primary hover:underline" target="_blank" rel="noopener">ellalangley.com</a>
            {" "}&middot;{" "}
            Official merch: <a href="https://ellalangley.us" className="text-primary hover:underline" target="_blank" rel="noopener">ellalangley.us</a>
          </p>
          <p className="opacity-60">&copy; 2026 Bynum Enterprises &middot; Made with too much coffee</p>
        </div>
      </div>
    </footer>
  );
}