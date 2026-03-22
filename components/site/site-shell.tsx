"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { use, useState } from "react"

import { cn } from "@/lib/utils"
import type { ChangelogEntry } from "@/lib/content"

const navItems = [
  {
    href: "/about",
    label: "About",
    description: "A short note on the person behind the archive.",
  },
  {
    href: "/bookshelf",
    label: "Bookshelf",
    description: "Books read, in progress, and worth returning to.",
  },
  {
    href: "/notes",
    label: "Notes",
    description: "Small fragments, collections, and working memory.",
  },
  {
    href: "/writing",
    label: "Writing",
    description: "Longer pieces and essays.",
  },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string
  label: string
  pathname: string
  onNavigate?: () => void
}) {
  const active = isActive(pathname, href)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "meta-text flex items-center gap-2 transition-colors",
        active ? "text-accent" : "text-muted-ink hover:text-ink"
      )}
    >
      <span
        aria-hidden="true"
        className={cn("text-xs", active ? "opacity-100" : "opacity-0")}
      >
        &gt;
      </span>
      <span>{label}</span>
    </Link>
  )
}

export function SiteShell({
  children,
  latestChangelogPromise,
}: {
  children: React.ReactNode
  latestChangelogPromise: Promise<ChangelogEntry | undefined>
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const latestChangelog = use(latestChangelogPromise)

  if (pathname.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen">
      <aside className="site-panel paper-grid fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line lg:flex lg:flex-col">
        <div className="flex h-full flex-col px-8 py-10">
          <div className="mb-14 flex items-start gap-5">
            <div className="h-32 w-8 rounded-b-full bg-accent shadow-[0_10px_25px_rgba(159,47,31,0.2)]" />
            <div className="space-y-2 pt-10">
              <p className="meta-text text-muted-ink">Boiler Room</p>
              <p className="max-w-[10rem] text-sm leading-7 text-muted-ink">
                A third space for my writing, reading notes, and mixtapes I want to keep near
                at hand.
              </p>
            </div>
          </div>

          <nav className="space-y-5">
            {navItems.map((item) => (
              <div key={item.href} className="space-y-1.5">
                <NavLink
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                /> 
              </div>
            ))}
          </nav>

        </div>
      </aside>

      <header className="site-panel sticky top-0 z-20 border-b border-line lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/writing"
            className="font-serif text-3xl tracking-tight text-ink"
          >
            Boiler Room
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-full border border-line bg-white/60 p-2 text-ink"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {mobileOpen ? (
          <nav className="border-t border-line px-5 py-4">
            <div className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
              <div className="pt-2">
                <Link
                  href="/changelog"
                  onClick={() => setMobileOpen(false)}
                  className="meta-text text-accent"
                >
                  Changelog
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="min-h-screen lg:pl-72">
        <div className="mx-auto max-w-[110rem]">{children}</div>
        {latestChangelog ? (
          <div className="mx-auto max-w-[110rem] border-t border-line px-8 py-6">
            <span className="meta-text text-muted-ink">
              © BoilerRoom 2026 {latestChangelog.title}{" "}
              <Link href="/changelog" className="text-accent hover:text-ink">
                Changelog
              </Link>
            </span>
          </div>
        ) : null}
      </main>
    </div>
  )
}
