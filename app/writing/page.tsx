import Link from "next/link"

import { formatDisplayDate, getWritingEntries } from "@/lib/content"

export default async function WritingPage() {
  const entries = await getWritingEntries()
  const featured = entries[0]

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.12fr)] lg:border-l">
      <section className="border-line px-6 py-12 sm:px-10 lg:border-r lg:px-14 lg:py-16">
        <p className="meta-text text-muted-ink">Writing</p>
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          Longer pieces and thoughts.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-ink">
          Essays, experiments, and notes that wanted a little more room than a
          margin could offer.
        </p>

        <div className="mt-14 space-y-8">
          {entries.map((entry, index) => (
            <article key={entry.slug} className="group">
              <Link href={`/writing/${entry.slug}`} className="block space-y-2">
                <div className="flex items-center gap-3">
                  <span className="meta-text text-accent">
                    {index === 0 ? "&gt;" : "·"}
                  </span>
                  <h2 className="text-2xl leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                    {entry.title}
                  </h2>
                </div>
                <p className="meta-text pl-7 text-muted-ink">
                  {formatDisplayDate(entry.date)}
                </p>
                <p className="pl-7 text-base leading-7 text-muted-ink">
                  {entry.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        {featured ? (
          <div className="max-w-3xl">
            <p className="meta-text text-muted-ink">
              {formatDisplayDate(featured.date)}
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
              {featured.title}
            </h2>
            <p className="mt-8 border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
              {featured.excerpt}
            </p>
            <div className="mt-10 space-y-6 text-lg leading-9 text-ink">
              <p>
                The archive is built to feel lightweight and easy to re-enter.
                Writing gets the largest surface area because it usually needs
                the most time and the gentlest pacing.
              </p>
              <p>
                Posts live in Markdown, flow through the CMS, and publish
                through the same Git pipeline as the rest of the site. That
                keeps the system simple enough to maintain and flexible enough
                to grow.
              </p>
            </div>
            <Link
              href={`/writing/${featured.slug}`}
              className="meta-text mt-10 inline-flex items-center gap-2 text-accent"
            >
              Read this entry
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  )
}
