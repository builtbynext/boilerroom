import Link from "next/link"

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-16 lg:pl-72">
      <div className="max-w-xl text-center">
        <p className="meta-text text-muted-ink">Not found</p>
        <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.04em] text-ink sm:text-7xl">
          That page seems to have slipped between the shelves.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-ink">
          The archive could not find what you were looking for, but the main
          sections are still in easy reach.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/writing"
            className="rounded-full border border-accent bg-accent px-5 py-3 text-sm text-white"
          >
            Go to Writing
          </Link>
          <Link
            href="/bookshelf"
            className="rounded-full border border-line bg-white/50 px-5 py-3 text-sm text-ink"
          >
            Browse Bookshelf
          </Link>
          <Link
            href="/notes"
            className="rounded-full border border-line bg-white/50 px-5 py-3 text-sm text-ink"
          >
            Open Notes
          </Link>
        </div>
      </div>
    </div>
  )
}
