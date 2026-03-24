import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MasterDetailLayout } from "@/components/site/master-detail-layout"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getWritingEntries,
  getWritingEntry,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const entries = await getWritingEntries()
  return [{}, ...entries.map((entry) => ({ slug: [entry.slug] }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const activeSlug = slug?.[0]

  if (!activeSlug) {
    return { title: "Writing" }
  }

  const entry = await getWritingEntry(activeSlug)
  if (!entry) return {}

  return {
    title: entry.title,
    description: entry.excerpt,
  }
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const activeSlug = slug?.[0]

  const allEntries = await getWritingEntries()

  if (allEntries.length === 0) {
    notFound()
  }

  const targetSlug = activeSlug ?? allEntries[0].slug
  const entry = await getWritingEntry(targetSlug)

  if (!entry) {
    notFound()
  }

  const html = await renderMarkdown(entry.body)
  const footer = <SiteFooter />

  return (
    <MasterDetailLayout
      section="Writing"
      basePath="/writing"
      allEntries={allEntries.map((e) => ({
        slug: e.slug,
        title: e.title,
        date: formatDisplayDate(e.date),
      }))}
      activeSlug={targetSlug}
      initialHtml={html}
      activeEntry={{
        title: entry.title,
        date: formatDisplayDate(entry.date),
      }}
      footer={footer}
    />
  )
}
