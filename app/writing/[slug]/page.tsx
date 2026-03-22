import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/site/markdown"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getWritingEntries,
  getWritingEntry,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const entries = await getWritingEntries()
  return entries.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await getWritingEntry(slug)

  if (!entry) {
    return {}
  }

  return {
    title: entry.title,
    description: entry.excerpt,
  }
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [entry, allEntries] = await Promise.all([
    getWritingEntry(slug),
    getWritingEntries(),
  ])

  if (!entry) {
    notFound()
  }

  const html = await renderMarkdown(entry.body)
  const relatedEntries = allEntries
    .filter((candidate) => candidate.slug !== entry.slug)
    .slice(0, 4)

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(16rem,0.5fr)_minmax(0,1fr)] lg:border-l">
      <aside className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:border-r lg:px-10 lg:py-16">
        <p className="meta-text text-muted-ink">Writing</p>
        <Link
          href="/writing"
          className="meta-text mt-6 inline-flex items-center gap-2 text-accent"
        >
          <span aria-hidden="true">←</span>
          Back to previous
        </Link>

        <div className="mt-12 space-y-6">
          {allEntries.map((item) => (
            <Link
              key={item.slug}
              href={`/writing/${item.slug}`}
              className="group block"
            >
              <p className="meta-text text-muted-ink">
                {formatDisplayDate(item.date)}
              </p>
              <h2
                className={`mt-2 text-xl leading-tight tracking-[-0.03em] ${
                  item.slug === entry.slug
                    ? "text-accent"
                    : "text-ink group-hover:text-accent"
                }`}
              >
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
        <SiteFooter className="mt-auto pt-16" />
      </aside>

      <article className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="max-w-4xl">
          <p className="meta-text text-muted-ink">
            {formatDisplayDate(entry.date)}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
            {entry.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
            {entry.excerpt}
          </p>

          <div className="mt-12 max-w-3xl">
            <Markdown html={html} />
          </div>

          {relatedEntries.length > 0 ? (
            <div className="mt-16 border-t border-line pt-10">
              <p className="meta-text text-muted-ink">Nearby entries</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {relatedEntries.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/writing/${item.slug}`}
                    className="rounded-[1.6rem] border border-line bg-white/35 p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="meta-text text-muted-ink">
                      {formatDisplayDate(item.date)}
                    </p>
                    <h2 className="mt-3 text-2xl leading-tight tracking-[-0.03em] text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted-ink">
                      {item.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  )
}
