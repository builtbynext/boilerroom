import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MasterDetailLayout } from "@/components/site/master-detail-layout"
import { SiteFooter } from "@/components/site/site-footer"
import {
  formatDisplayDate,
  getChangelogEntries,
  getChangelogEntry,
  renderMarkdown,
} from "@/lib/content"

export async function generateStaticParams() {
  const entries = await getChangelogEntries()
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
    return { title: "Changelog" }
  }

  const entry = await getChangelogEntry(activeSlug)
  if (!entry) return {}

  return {
    title: `${entry.title} changelog`,
    description: entry.excerpt,
  }
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const activeSlug = slug?.[0]

  const allEntries = await getChangelogEntries()

  if (allEntries.length === 0) {
    notFound()
  }

  const targetSlug = activeSlug ?? allEntries[0].slug
  const entry = await getChangelogEntry(targetSlug)

  if (!entry) {
    notFound()
  }

  const html = await renderMarkdown(entry.body)
  const footer = <SiteFooter />

  return (
    <MasterDetailLayout
      section="Changelog"
      basePath="/changelog"
      allEntries={allEntries.map((e) => ({
        slug: e.slug,
        title: e.title,
        date: formatDisplayDate(e.date),
        subtitle: e.excerpt,
        pinned: e.pinned,
      }))}
      activeSlug={targetSlug}
      initialHtml={html}
      activeEntry={{
        title: entry.title,
        date: formatDisplayDate(entry.date),
        excerpt: entry.excerpt,
      }}
      footer={footer}
    />
  )
}
