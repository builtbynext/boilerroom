import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const CONTENT_ROOT = path.join(process.cwd(), "content")

export type CollectionName = "writing" | "bookshelf" | "notes" | "changelog"
export type BookStatus = "to-read" | "reading" | "finished" | "paused"

export type WritingEntry = {
  collection: "writing"
  title: string
  date: string
  slug: string
  excerpt: string
  pinned: boolean
  draft: boolean
  body: string
}

export type BookEntry = {
  collection: "bookshelf"
  title: string
  author: string
  year: number
  slug: string
  status: BookStatus
  startedAt?: string
  finishedAt?: string
  excerpt: string
  coverImage?: string
  draft: boolean
  body: string
}

export type NoteEntry = {
  collection: "notes"
  title: string
  date: string
  slug: string
  kind: string
  excerpt: string
  pinned: boolean
  draft: boolean
  body: string
}

type FrontmatterRecord = Record<string, unknown>

const BOOK_STATUS_ORDER: BookStatus[] = [
  "reading",
  "finished",
  "paused",
  "to-read",
]
const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  reading: "Now reading",
  finished: "Finished",
  paused: "Paused",
  "to-read": "To read",
}

function getString(data: FrontmatterRecord, key: string, fallback = "") {
  const value = data[key]
  return typeof value === "string" ? value : fallback
}

function getOptionalString(data: FrontmatterRecord, key: string) {
  const value = data[key]
  return typeof value === "string" ? value : undefined
}

function getDateString(data: FrontmatterRecord, key: string) {
  const value = data[key]

  if (typeof value === "string") {
    return value
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  return ""
}

function getOptionalDateString(data: FrontmatterRecord, key: string) {
  const value = data[key]

  if (typeof value === "string") {
    return value
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  return undefined
}

function getBoolean(data: FrontmatterRecord, key: string, fallback = false) {
  const value = data[key]

  if (typeof value === "boolean") {
    return value
  }

  return fallback
}

function getNumber(data: FrontmatterRecord, key: string, fallback = 0) {
  const value = data[key]

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

function getBookStatus(data: FrontmatterRecord): BookStatus {
  const value = data.status

  if (
    value === "to-read" ||
    value === "reading" ||
    value === "finished" ||
    value === "paused"
  ) {
    return value
  }

  return "to-read"
}

function isPublished<T extends { draft: boolean }>(entry: T) {
  return !entry.draft
}

function sortByDateDesc<T extends { date?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const rightTime = right.date ? new Date(right.date).getTime() : 0
    const leftTime = left.date ? new Date(left.date).getTime() : 0
    return rightTime - leftTime
  })
}

function sortPinnedFirst<T extends { pinned?: boolean; date?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    if (left.pinned === right.pinned) {
      const rightTime = right.date ? new Date(right.date).getTime() : 0
      const leftTime = left.date ? new Date(left.date).getTime() : 0
      return rightTime - leftTime
    }

    return left.pinned ? -1 : 1
  })
}

function getBookSortDate(book: BookEntry) {
  return book.finishedAt ?? book.startedAt ?? `${book.year}-01-01`
}

function sortBooks(books: BookEntry[]) {
  return [...books].sort((left, right) => {
    const statusGap =
      BOOK_STATUS_ORDER.indexOf(left.status) -
      BOOK_STATUS_ORDER.indexOf(right.status)

    if (statusGap !== 0) {
      return statusGap
    }

    return (
      new Date(getBookSortDate(right)).getTime() -
      new Date(getBookSortDate(left)).getTime()
    )
  })
}

async function readMarkdownFiles(folder: CollectionName) {
  const directory = path.join(CONTENT_ROOT, folder)
  const files = await fs.readdir(directory)
  return files.filter((file) => file.endsWith(".md"))
}

async function readFileSource(folder: CollectionName, fileName: string) {
  const filePath = path.join(CONTENT_ROOT, folder, fileName)
  return fs.readFile(filePath, "utf8")
}

export async function getWritingEntries() {
  const files = await readMarkdownFiles("writing")
  const entries = await Promise.all(
    files.map(async (fileName) => {
      const source = await readFileSource("writing", fileName)
      const { data, content } = matter(source)
      const slug = getString(data, "slug", fileName.replace(/\.md$/, ""))

      const entry: WritingEntry = {
        collection: "writing",
        title: getString(data, "title", slug),
        date: getDateString(data, "date"),
        slug,
        excerpt: getString(data, "excerpt"),
        pinned: getBoolean(data, "pinned"),
        draft: getBoolean(data, "draft"),
        body: content.trim(),
      }

      return entry
    })
  )

  return sortPinnedFirst(entries).filter(isPublished)
}

export async function getWritingEntry(slug: string) {
  const entries = await getWritingEntries()
  return entries.find((entry) => entry.slug === slug)
}

export async function getBooks() {
  const files = await readMarkdownFiles("bookshelf")
  const entries = await Promise.all(
    files.map(async (fileName) => {
      const source = await readFileSource("bookshelf", fileName)
      const { data, content } = matter(source)
      const slug = getString(data, "slug", fileName.replace(/\.md$/, ""))

      const entry: BookEntry = {
        collection: "bookshelf",
        title: getString(data, "title", slug),
        author: getString(data, "author"),
        year: getNumber(data, "year", 2025),
        slug,
        status: getBookStatus(data),
        startedAt: getOptionalDateString(data, "startedAt"),
        finishedAt: getOptionalDateString(data, "finishedAt"),
        excerpt: getString(data, "excerpt"),
        coverImage: getOptionalString(data, "coverImage"),
        draft: getBoolean(data, "draft"),
        body: content.trim(),
      }

      return entry
    })
  )

  return sortBooks(entries).filter(isPublished)
}

export async function getBook(slug: string) {
  const books = await getBooks()
  return books.find((entry) => entry.slug === slug)
}

export async function getNotes() {
  const files = await readMarkdownFiles("notes")
  const entries = await Promise.all(
    files.map(async (fileName) => {
      const source = await readFileSource("notes", fileName)
      const { data, content } = matter(source)
      const slug = getString(data, "slug", fileName.replace(/\.md$/, ""))

      const entry: NoteEntry = {
        collection: "notes",
        title: getString(data, "title", slug),
        date: getDateString(data, "date"),
        slug,
        kind: getString(data, "kind", "Note"),
        excerpt: getString(data, "excerpt"),
        pinned: getBoolean(data, "pinned"),
        draft: getBoolean(data, "draft"),
        body: content.trim(),
      }

      return entry
    })
  )

  return sortPinnedFirst(entries).filter(isPublished)
}

export async function getNote(slug: string) {
  const notes = await getNotes()
  return notes.find((entry) => entry.slug === slug)
}

export type ChangelogEntry = {
  collection: "changelog"
  title: string
  date: string
  slug: string
  excerpt: string
  pinned: boolean
  draft: boolean
  body: string
}

export async function getChangelogEntries() {
  const files = await readMarkdownFiles("changelog")
  const entries = await Promise.all(
    files.map(async (fileName) => {
      const source = await readFileSource("changelog", fileName)
      const { data, content } = matter(source)
      const slug = getString(data, "slug", fileName.replace(/\.md$/, ""))

      const entry: ChangelogEntry = {
        collection: "changelog",
        title: getString(data, "title", slug),
        date: getDateString(data, "date"),
        slug,
        excerpt: getString(data, "excerpt"),
        pinned: getBoolean(data, "pinned"),
        draft: getBoolean(data, "draft"),
        body: content.trim(),
      }

      return entry
    })
  )

  return sortPinnedFirst(entries).filter(isPublished)
}

export async function getChangelogEntry(slug: string) {
  const entries = await getChangelogEntries()
  return entries.find((entry) => entry.slug === slug)
}

export async function getLatestChangelogEntry() {
  const entries = await getChangelogEntries()
  return entries[0]
}

export async function renderMarkdown(source: string) {
  const processed = await remark()
    .use(html, { sanitize: false })
    .process(source)
  return processed.toString()
}

export function formatDisplayDate(
  date: string,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date))
}

export function groupBooksByStatus(books: BookEntry[]) {
  return BOOK_STATUS_ORDER.map((status) => ({
    status,
    label: BOOK_STATUS_LABELS[status],
    items: books.filter((book) => book.status === status),
  })).filter((group) => group.items.length > 0)
}

export function isBookStatus(value: string | undefined): value is BookStatus {
  return (
    value === "to-read" ||
    value === "reading" ||
    value === "finished" ||
    value === "paused"
  )
}
