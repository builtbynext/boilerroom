import Link from "next/link"

import { formatDisplayDate, getChangelogEntries } from "@/lib/content"

export default async function ChangelogPage() {
  const entries = await getChangelogEntries()
  const latest = entries[0]

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:border-l">
      <section className="border-line px-6 py-12 sm:px-10 lg:border-r lg:px-14 lg:py-16">
        <p className="meta-text text-muted-ink">Changelog</p>
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          What changed and why.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-ink">
          A running log of minor and major releases, design shifts, new sections, and anything
          else worth marking.
        </p>

        <div className="mt-14 space-y-7">
          {entries.map((entry) => (
            <article key={entry.slug} className="group">
              <Link href={`/changelog/${entry.slug}`} className="block space-y-2">
                <div className="flex items-center gap-3">
                  <span className="meta-text text-accent">&gt;</span>
                  <h2 className="text-2xl leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                    {entry.pinned ? "📌 " : ""}
                    {entry.title}
                  </h2>
                </div>
                <div className="pl-7">
                  <p className="meta-text text-muted-ink">{formatDisplayDate(entry.date)}</p>
                  <p className="mt-2 text-base leading-7 text-muted-ink">{entry.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        {latest ? (
          <div className="max-w-3xl">
            <p className="meta-text text-muted-ink">Latest · {formatDisplayDate(latest.date)}</p>
            <h2 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-6xl">
              {latest.title}
            </h2>
            <p className="mt-8 border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
              {latest.excerpt}
            </p>
            <Link
              href={`/changelog/${latest.slug}`}
              className="meta-text mt-8 inline-flex items-center gap-2 text-accent"
            >
              Read the changelog <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  )
}
