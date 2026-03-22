import Link from "next/link"

import { getLatestChangelogEntry } from "@/lib/content"

export async function SiteFooter({ className }: { className?: string }) {
  const changelog = await getLatestChangelogEntry()

  if (!changelog) return null

  return (
    <p className={`meta-text text-muted-ink ${className ?? ""}`}>
      © BoilerRoom 2026 {changelog.title}{" "}
      <Link href="/changelog" className="text-accent hover:text-ink">
        Changelog
      </Link>
    </p>
  )
}
