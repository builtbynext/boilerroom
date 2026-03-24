import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MasterDetailLayout } from "@/components/site/master-detail-layout"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getBook,
  getBooks,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const books = await getBooks()
  return [{}, ...books.map((book) => ({ slug: [book.slug] }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const activeSlug = slug?.[0]

  if (!activeSlug) {
    return { title: "Bookshelf" }
  }

  const book = await getBook(activeSlug)
  if (!book) return {}

  return {
    title: `${book.title} by ${book.author}`,
    description: book.excerpt,
  }
}

export default async function BookshelfPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const activeSlug = slug?.[0]

  const allBooks = await getBooks()

  const defaultBook =
    allBooks.find((b) => b.status === "reading") ?? allBooks[0]
  const targetSlug = activeSlug ?? defaultBook?.slug
  const book = targetSlug ? await getBook(targetSlug) : null

  if (targetSlug && !book) {
    notFound()
  }

  const html = book ? await renderMarkdown(book.body) : undefined
  const footer = <SiteFooter />

  const dateMeta = book
    ? book.finishedAt
      ? `Finished ${formatDisplayDate(book.finishedAt)}`
      : book.startedAt
        ? `Started ${formatDisplayDate(book.startedAt)}`
        : book.status.replace("-", " ")
    : undefined

  return (
    <MasterDetailLayout
      section="Bookshelf"
      basePath="/bookshelf"
      allEntries={allBooks.map((b) => ({
        slug: b.slug,
        title: b.title,
        date: b.status.replace("-", " "),
        subtitle: `${b.author}, ${b.year}`,
      }))}
      activeSlug={targetSlug}
      initialHtml={html}
      activeEntry={
        book
          ? {
              title: book.title,
              date: dateMeta!,
              subtitle: `${book.author}, ${book.year}`,
              coverImage: book.coverImage,
            }
          : undefined
      }
      footer={footer}
    />
  )
}
