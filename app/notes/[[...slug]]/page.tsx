import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MasterDetailLayout } from "@/components/site/master-detail-layout"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getNote,
  getNotes,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const notes = await getNotes()
  return [{}, ...notes.map((note) => ({ slug: [note.slug] }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const activeSlug = slug?.[0]

  if (!activeSlug) {
    return { title: "Notes" }
  }

  const note = await getNote(activeSlug)
  if (!note) return {}

  return {
    title: note.title,
    description: note.excerpt,
  }
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const activeSlug = slug?.[0]

  const allNotes = await getNotes()

  if (allNotes.length === 0) {
    notFound()
  }

  // Default to pinned note first, otherwise latest
  const defaultNote = allNotes.find((n) => n.pinned) ?? allNotes[0]
  const targetSlug = activeSlug ?? defaultNote.slug
  const note = await getNote(targetSlug)

  if (!note) {
    notFound()
  }

  const html = await renderMarkdown(note.body)
  const footer = <SiteFooter />

  return (
    <MasterDetailLayout
      section="Notes"
      basePath="/notes"
      allEntries={allNotes.map((n) => ({
        slug: n.slug,
        title: n.title,
        date: formatDisplayDate(n.date),
        pinned: n.pinned,
      }))}
      activeSlug={targetSlug}
      initialHtml={html}
      activeEntry={{
        title: note.title,
        date: formatDisplayDate(note.date),
      }}
      footer={footer}
    />
  )
}
