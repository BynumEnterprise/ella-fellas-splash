import Link from "next/link";
import { getUpcomingTourDates } from "@/lib/data";
import { getAllNews } from "@/lib/content";
import { TourCard } from "@/components/TourCard";
import { NewsCard } from "@/components/NewsCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";

function formatFeedDate(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", {
        weekday: "long",
            month: "long",
                day: "numeric",
                    timeZone: "UTC",
                      });
                      }

export default function HomePage() {
  const upcoming = getUpcomingTourDates(4);
  const allNews = getAllNews();
  const news = allNews.slice(0, 3);
  const feed = allNews.slice(0, 15);
  const nextShow = upcoming[0];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-12 md:py-20 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-ink/60 mb-4">An unofficial fan site</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary leading-none tracking-wider">ELLA FELLAS</h1>
        <p className="font-display text-lg md:text-xl tracking-[0.2em] text-denim mt-3">THE UNOFFICIAL ELLA LANGLEY SUPERFAN HQ</p>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mt-6 text-ink">Daily news, tour stop guides, ticket alerts, and everything else for the <strong className="text-denim">Fellas</strong>.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tour" className="px-6 py-3 bg-denim text-paper font-display tracking-wide hover:bg-denim/90 rounded-md">SEE THE TOUR</Link>
          <Link href="#newsletter" className="px-6 py-3 bg-primary text-ink font-display tracking-wide hover:bg-primary-dark hover:text-paper rounded-md">JOIN THE DAILY</Link>
        </div>
      </section>
      {nextShow && (
        <section className="bg-denim text-paper rounded-lg p-6 md:p-8 mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Next Show</p>
          <p className="font-display text-3xl md:text-4xl tracking-wider">{nextShow.city}, {nextShow.state}</p>
          <p className="text-paper/80 mt-1">{nextShow.venue} · {nextShow.tour}</p>
          <Link href={`/tour/${nextShow.id}`} className="inline-block mt-4 px-4 py-2 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary-dark hover:text-paper">SHOW DETAILS</Link>
        </section>
      )}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-3xl text-denim">LATEST NEWS</h2>
          <Link href="/news" className="text-sm text-primary hover:underline">All news &rarr;</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {news.map((n) => (<NewsCard key={n.slug} slug={n.slug} title={n.frontmatter.title} excerpt={n.frontmatter.excerpt} publishedAt={n.frontmatter.publishedAt} category={n.frontmatter.category} />))}
        </div>
      </section>
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-3xl text-denim">DAILY FEED</h2>
          <Link href="/news" className="text-sm text-primary hover:underline">Full archive &rarr;</Link>
        </div>
        <p className="text-sm text-ink/60 mb-4">Fresh Ella Langley updates posted daily. Scroll for the latest news, chart moves, tour talk, and what we&apos;re watching.</p>
        <div className="border-l-2 border-primary/40 pl-5 space-y-6">
          {feed.map((item) => (
            <article key={item.slug} className="relative">
              <div className="absolute -left-[1.62rem] top-2 w-3 h-3 rounded-full bg-primary border-2 border-paper" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.15em] text-ink/50">{formatFeedDate(item.frontmatter.publishedAt)}{item.frontmatter.category && (<span className="ml-2 text-primary">· {item.frontmatter.category}</span>)}</p>
              <h3 className="font-display text-xl md:text-2xl text-denim mt-1 leading-tight"><Link href={`/news/${item.slug}`} className="hover:underline">{item.frontmatter.title}</Link></h3>
              {item.frontmatter.excerpt && (<p className="text-ink/80 mt-2 leading-relaxed">{item.frontmatter.excerpt}</p>)}
              <Link href={`/news/${item.slug}`} className="inline-block mt-2 text-sm text-primary hover:underline">Read the full post &rarr;</Link>
            </article>
          ))}
        </div>
        {allNews.length > feed.length && (<div className="mt-6 text-center"><Link href="/news" className="inline-block px-5 py-2 border border-denim text-denim font-display tracking-wide hover:bg-denim hover:text-paper rounded-md">SEE OLDER POSTS</Link></div>)}
      </section>
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-3xl text-denim">UPCOMING DATES</h2>
          <Link href="/tour" className="text-sm text-primary hover:underline">Full tour &rarr;</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((d) => (<TourCard key={d.id} d={d} />))}
        </div>
      </section>
      <section id="newsletter" className="bg-primary/15 border-2 border-primary rounded-lg p-6 md:p-10 mb-12">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl md:text-4xl text-denim">JOIN THE FELLAS. DAILY.</h2>
          <p className="text-ink/80 mt-2">One short email each morning. News, tour radar, the song of the day.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup placement="homepage" />
        </div>
      </section>
    </div>
  );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}                      