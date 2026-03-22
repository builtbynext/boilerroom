import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import { formatDisplayDate, getNotes } from "@/lib/content"

export default async function NotesPage() {
  const notes = await getNotes()
  const featured = notes.find((note) => note.pinned) ?? notes[0]
  const groupedKinds = Array.from(new Set(notes.map((note) => note.kind)))

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:border-l">
      <section className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          Notes
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-ink">
          For things that are not yet fully formed.
        </p>

        <div className="mt-14 space-y-7">
          {notes.length > 0 ? (
            notes.map((note) => (
              <article key={note.slug} className="group">
                <Link href={`/notes/${note.slug}`} className="block space-y-2">
                  <div className="flex items-center">
                    <h2 className="text-2xl leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                      {note.pinned ? "📌 " : ""}
                      {note.title}
                    </h2>
                  </div>
                  <p className="meta-text text-muted-ink">
                    {formatDisplayDate(note.date)}
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
