# Boiler Room

A personal blog built with Next.js App Router and Sveltia CMS.

## What is in here

- `Writing` for essays and longer posts
- `Bookshelf` for book notes and reading status
- `Notes` for shorter fragments, lists, and working memory 

Content lives in plain Markdown:

- `content/writing/*.md`
- `content/bookshelf/*.md`
- `content/notes/*.md`

## Local development

Install dependencies and start the app:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Sveltia CMS setup

The `/admin` route is served from [public/admin/index.html](/Users/stewart/Desktop/projects/nextjs/boilerroom/public/admin/index.html), and the CMS collection/backend settings live in [public/admin/config.yml](/Users/stewart/Desktop/projects/nextjs/boilerroom/public/admin/config.yml).

### GitHub publishing flow

1. Create a GitHub OAuth app or compatible auth flow for your Sveltia auth service.
2. Deploy a Sveltia-compatible auth endpoint such as `sveltia-cms-auth`.
3. Update `base_url` in `public/admin/config.yml` to that auth service URL.
4. Update `repo`, `branch`, and `site_url` in `public/admin/config.yml`.
5. Connect the repo to Vercel so pushes to `main` trigger redeploys.

After that, edits created in `/admin` will commit to GitHub and Vercel will republish from the new commit.

## Authoring notes

- `Writing` entries use `title`, `date`, `slug`, `excerpt`, `draft`
- `Bookshelf` entries use `title`, `author`, `year`, `slug`, `status`, `startedAt`, `finishedAt`, `excerpt`, `coverImage`, `draft`
- `Notes` entries use `title`, `date`, `slug`, `kind`, `excerpt`, `pinned`, `draft`

All three collections use Markdown for the body content.
# boilerroom
