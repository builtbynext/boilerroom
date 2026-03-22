import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import { formatDisplayDate, getWritingEntries } from "@/lib/content"

export default async function WritingPage() {
  const entries = await getWritingEntries()

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.12fr)] lg:border-l">
      <section className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          Writing
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-ink">
          Longer essays & thoughts.
        </p>

        <div className="mt-14 space-y-8">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <article key={entry.slug} className="group">
                <Link href={`/writing/${entry.slug}`} className="block space-y-2">
                  <div className="flex items-center">
                    <h2 className="text-2xl leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                      {entry.pinned ? "📌 " : ""}
                      {entry.title}
                    </h2>
                  </div>
                  <p className="meta-text text-muted-ink">
                    {formatDisplayDate(entry.date)}
                  </p>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-base leading-8 text-muted-ink">No posts now</p>
          )}
        </div>
        <SiteFooter className="mt-auto pt-16" />
      </section> 
    </div>
  )
}
