import Link from "next/link"

import { formatDisplayDate, getNotes } from "@/lib/content"

export default async function NotesPage() {
  const notes = await getNotes()
  const featured = notes.find((note) => note.pinned) ?? notes[0]
  const groupedKinds = Array.from(new Set(notes.map((note) => note.kind)))

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:border-l">
      <section className="border-line px-6 py-12 sm:px-10  lg:px-14 lg:py-16"> 
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
      </section>

      {/* <section className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        {featured ? (
          <div className="max-w-3xl">
            <p className="meta-text text-muted-ink">
              {formatDisplayDate(featured.date)}
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-6xl">
              {featured.title}
            </h2>
            <p className="mt-8 border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
              {featured.excerpt}
            </p>

            <div className="mt-10 rounded-[1.8rem] border border-line bg-white/38 p-6">
              <p className="meta-text text-muted-ink">Kinds in this archive</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {groupedKinds.map((kind) => (
                  <span
                    key={kind}
                    className="rounded-full border border-line bg-white/65 px-4 py-2 text-sm text-muted-ink"
                  >
                    {kind}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg leading-9 text-ink">
              <p>
                Notes is the loosest section of the site by design. It can hold
                categories, monthly link bundles, rough lists, or a single
                sentence that might become useful later.
              </p>
              <p>
                The point is not polish. It is retrieval. If a thought matters
                enough to keep, it deserves a place that is easy to return to.
              </p>
            </div>
          </div>
        ) : null}
      </section> */}
    </div>
  )
}
