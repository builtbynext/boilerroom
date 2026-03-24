import Link from "next/link"

import { getLatestChangelogEntry } from "@/lib/content"

export async function SiteFooter({ className }: { className?: string }) {
  const changelog = await getLatestChangelogEntry()

  if (!changelog) return null

  return (
    <footer className={`meta-text pt-8 pb-2 text-muted-ink/50 ${className ?? ""}`}>
      <p>
        © BoilerRoom 2026 · {changelog.title}{" "}
        <Link href="/changelog" className="hover:text-muted-ink transition-colors">
          Changelog
        </Link>
      </p>
    </footer>
  )
}
