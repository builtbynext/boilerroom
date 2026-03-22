import Link from "next/link"

import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getBooks,
  groupBooksByStatus,
  isBookStatus,
} from "@/lib/content"

export default async function BookshelfPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const [{ status }, books] = await Promise.all([searchParams, getBooks()])
  const activeStatus = isBookStatus(status) ? status : undefined
  const visibleBooks = activeStatus
    ? books.filter((book) => book.status === activeStatus)
    : books
  const groups = groupBooksByStatus(visibleBooks)
  const featured = books.find((book) => book.status === "reading") ?? books[0]

  const filters = [
    { href: "/bookshelf", label: "All books", active: !activeStatus },
    {
      href: "/bookshelf?status=reading",
      label: "Reading",
      active: activeStatus === "reading",
    },
    {
      href: "/bookshelf?status=finished",
      label: "Finished",
      active: activeStatus === "finished",
    },
    {
      href: "/bookshelf?status=to-read",
      label: "To read",
      active: activeStatus === "to-read",
    },
  ]

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:border-l">
      <section className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          Bookshelf
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-ink">
          Highlights and ideas for progress
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Link
              key={filter.href}
              href={filter.href}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${filter.active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white/45 text-muted-ink hover:text-ink"
                }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {groups.map((group) => (
            <div key={group.status}>
              <p className="meta-text text-muted-ink">{group.label}</p>
              <div className="mt-5 space-y-6">
                {group.items.map((book, index) => (
                  <Link
                    key={book.slug}
                    href={`/bookshelf/${book.slug}`}
                    className="group block"
                  >
                    <div className="flex items-start gap-3"> 
                      <div>
                        <h2 className="text-2xl leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                          {book.title}
                        </h2>
                        <p className="mt-2 text-base leading-7 text-muted-ink">
                          {book.author}, {book.year}
                        </p> 
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SiteFooter className="mt-auto pt-16" />
      </section>

      {/* <section className="px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        {featured ? (
          <div className="max-w-3xl">
            <p className="meta-text text-muted-ink">
              {featured.status === "reading"
                ? "Last picked up"
                : "Recently shelved"}{" "}
              {formatDisplayDate(
                featured.startedAt ??
                featured.finishedAt ??
                `${featured.year}-01-01`
              )}
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-6xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-xl text-muted-ink">
              {featured.author}, {featured.year}
            </p>
            <p className="mt-8 border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
              {featured.excerpt}
            </p>
            <div className="mt-10 space-y-6 text-lg leading-9 text-ink">
              <p>
                Bookshelf is less of a review section and more of a reading
                trail. Some entries are short summaries, others are only a few
                lines I want future me to find again.
              </p>
              <p>
                The grouping keeps the archive legible at a glance while still
                leaving room for the full notes page when a book deserves a
                longer response.
              </p>
            </div>
            <Link
              href={`/bookshelf/${featured.slug}`}
              className="meta-text mt-10 inline-flex items-center gap-2 text-accent"
            >
              Open this book note
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        ) : null}
      </section> */}
    </div>
  )
}
