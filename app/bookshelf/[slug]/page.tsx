import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/site/markdown"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getBook,
  getBooks,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map((book) => ({ slug: book.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    return {}
  }

  return {
    title: `${book.title} by ${book.author}`,
    description: book.excerpt,
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [book, books] = await Promise.all([getBook(slug), getBooks()])

  if (!book) {
    notFound()
  }

  const html = await renderMarkdown(book.body)

  return (
    <div className="grid min-h-screen border-line lg:grid-cols-[minmax(16rem,0.5fr)_minmax(0,1fr)] lg:border-l">
      <aside className="flex min-h-screen flex-col border-line px-6 py-12 sm:px-10 lg:border-r lg:px-10 lg:py-16">
        <p className="meta-text text-muted-ink">Bookshelf</p>
        <Link
          href="/bookshelf"
          className="meta-text mt-6 inline-flex items-center gap-2 text-accent"
        >
          <span aria-hidden="true">←</span>
          Back to shelf
        </Link>

        <div className="mt-12 space-y-6">
          {books.map((item) => (
            <Link
              key={item.slug}
              href={`/bookshelf/${item.slug}`}
              className="group block"
            >
              <p className="meta-text text-muted-ink">
                {item.status.replace("-", " ")}
              </p>
              <h2
                className={`mt-2 text-xl leading-tight tracking-[-0.03em] ${
                  item.slug === book.slug
                    ? "text-accent"
                    : "text-ink group-hover:text-accent"
                }`}
              >
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-muted-ink">
                {item.author}, {item.year}
              </p>
            </Link>
          ))}
        </div>
        <SiteFooter className="mt-auto pt-16" />
      </aside>

      <article className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="max-w-4xl">
          <p className="meta-text text-muted-ink">
            {book.finishedAt
              ? `Finished ${formatDisplayDate(book.finishedAt)}`
              : book.startedAt
                ? `Started ${formatDisplayDate(book.startedAt)}`
                : book.status.replace("-", " ")}
          </p>
          <p className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-ink">
            {book.title}
          </p>
          <p className="mt-4 text-xl leading-8 text-muted-ink">
            {book.author}, {book.year}
          </p>

          {book.coverImage ? (
            <div className="mt-10 overflow-hidden rounded-[1.8rem] border border-line bg-white/45 p-3">
              <Image
                src={book.coverImage}
                alt={book.title}
                width={1200}
                height={900}
                className="h-auto w-full rounded-[1.2rem] object-cover"
              />
            </div>
          ) : null}

          <div className="mt-12 max-w-3xl">
            <Markdown html={html} />
          </div>
        </div>
      </article>
    </div>
  )
}
