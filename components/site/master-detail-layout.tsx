"use client"

import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

import { Markdown } from "@/components/site/markdown"
import { cn } from "@/lib/utils"

interface Entry {
  slug: string
  title: string
  date: string
  subtitle?: string
  pinned?: boolean
}

interface MasterDetailLayoutProps {
  section: string
  basePath: string
  allEntries: Entry[]
  activeSlug?: string
  initialHtml?: string
  activeEntry?: { title: string; date: string; subtitle?: string; excerpt?: string; coverImage?: string }
  footer: React.ReactNode
}

export function MasterDetailLayout({
  section,
  basePath,
  allEntries,
  activeSlug,
  initialHtml,
  activeEntry,
  footer,
}: MasterDetailLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isDetailView = pathname !== basePath
  const isEmpty = allEntries.length === 0

  function handleSelect(slug: string) {
    router.push(`${basePath}/${slug}`, { scroll: false })
  }

  function handleBack() {
    router.push(basePath, { scroll: false })
  }

  return (
    <div className="border-line lg:grid lg:border-l lg:grid-cols-[minmax(16rem,0.5fr)_minmax(0,1fr)]">
      {/* Left panel — list */}
      <aside
        className={cn(
          "border-line lg:border-r lg:h-screen lg:overflow-y-auto",
          isDetailView && !isEmpty && "hidden lg:block"
        )}
      >
        <div className="flex min-h-screen flex-col justify-between px-6 py-12 sm:px-10 lg:min-h-full lg:px-10 lg:py-16">
          <div>
            <p className="meta-text text-muted-ink">{section}</p>

            {isEmpty ? (
              <p className="mt-12 text-muted-ink">No posts yet.</p>
            ) : (
              <div className="mt-12 space-y-6">
                {allEntries.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => handleSelect(item.slug)}
                    className="group block w-full text-left"
                  >
                    <p className="meta-text text-muted-ink">{item.date}</p>
                    <h2
                      className={cn(
                        "mt-2 text-xl leading-tight tracking-[-0.03em]",
                        item.slug === activeSlug
                          ? "text-accent"
                          : "text-ink group-hover:text-accent"
                      )}
                    >
                      {item.pinned ? "📌 " : ""}
                      {item.title}
                    </h2>
                    {item.subtitle ? (
                      <p className="mt-1 text-sm text-muted-ink">{item.subtitle}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {footer}
        </div>
      </aside>

      {/* Right panel — content */}
      <article
        className={cn(
          "px-6 py-12 sm:px-10 lg:h-screen lg:overflow-y-auto lg:px-16 lg:py-16",
          (!isDetailView || isEmpty) && "hidden lg:block"
        )}
      >
        {/* Mobile back button */}
        <button
          type="button"
          onClick={handleBack}
          className="meta-text mb-8 inline-flex items-center gap-2 text-accent lg:hidden"
        >
          <span aria-hidden="true">←</span>
          Back to {section.toLowerCase()}
        </button>

        {activeEntry && (
          <div className="max-w-4xl">
            <p className="meta-text text-muted-ink">{activeEntry.date}</p>
            <p className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-ink">
              {activeEntry.title}
            </p>
            {activeEntry.subtitle ? (
              <p className="mt-4 text-xl leading-8 text-muted-ink">
                {activeEntry.subtitle}
              </p>
            ) : null}
            {activeEntry.excerpt ? (
              <p className="mt-8 max-w-3xl border-l-2 border-accent/20 pl-6 text-xl leading-9 text-muted-ink">
                {activeEntry.excerpt}
              </p>
            ) : null}
            {activeEntry.coverImage ? (
              <div className="mt-10 overflow-hidden rounded-[1.8rem] border border-line bg-white/45 p-3">
                <Image
                  src={activeEntry.coverImage}
                  alt={activeEntry.title}
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-[1.2rem] object-cover"
                />
              </div>
            ) : null}
            <div className="mt-12 max-w-3xl">
              <Markdown html={initialHtml ?? ""} />
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
