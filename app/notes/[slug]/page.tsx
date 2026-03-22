import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/site/markdown"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getNote,
  getNotes,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const notes = await getNotes()
  return notes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note) {
    return {}
  }

  return {
    title: note.title,
    description: note.excerpt,
  }
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [note, notes] = await Promise.all([getNote(slug), getNotes()])

  if (!note) {
    notFound()
  }

  const html = await renderMarkdown(note.body)

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(16rem,0.5fr)_minmax(0,1fr)] lg:border-l">
      <aside className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:border-r lg:px-10 lg:py-16">
        <p className="meta-text text-muted-ink">Notes</p>
        <Link
          href="/notes"
          className="meta-text mt-6 inline-flex items-center gap-2 text-accent"
        >
          <span aria-hidden="true">←</span>
          Back to notes
        </Link>

        <div className="mt-12 space-y-6">
          {notes.map((item) => (
            <Link
              key={item.slug}
              href={`/notes/${item.slug}`}
              className="group block"
            >
              <p className="meta-text text-muted-ink">
                {formatDisplayDate(item.date)}
              </p>
              <h2
                className={`mt-2 text-xl leading-tight tracking-[-0.03em] ${item.slug === note.slug
                    ? "text-accent"
                    : "text-ink group-hover:text-accent"
                  }`}
              >
                {item.pinned ? "📌 " : ""}
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
            {formatDisplayDate(note.date)}
          </p>
          <p className="mt-5 font-serif leading-none tracking-[-0.04em] text-ink text-4xl">
            {note.title}
          </p>
          <div className="mt-12 max-w-3xl">
            <Markdown html={html} />
          </div>
        </div>
      </article>
    </div>
  )
}
