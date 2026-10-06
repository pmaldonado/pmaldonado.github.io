# pmaldonado.com

Personal site built with [Astro](https://astro.build), React, and Tailwind CSS.

## Develop

Requires Node 22.12+.

```sh
npm install
npm run dev      # http://localhost:4321 (runs in the background; stop with `npx astro dev stop`)
npm run build    # type-check, then build the static site into dist/
npm run preview  # serve dist/ locally
npm run lint
```

## Layout

| Path | What it is |
|---|---|
| `src/pages/` | One file per URL: `index.astro` is `/`, `photos.astro` is `/photos/`, etc. |
| `src/layouts/` | `BaseLayout` (HTML `<head>`) and `SiteLayout` (paper background, optional nav, footer) |
| `src/components/` | React components. They render to static HTML unless a page adds a `client:*` directive (only the map does). |
| `src/content/blog/` | Blog posts as Markdown |
| `src/content/photos/` | Photos plus `photos.yaml`, which lists them |
| `src/content.config.ts` | Frontmatter/metadata schemas for posts and photos |
| `public/` | Copied to the site as-is (favicons, `CNAME`, map data) |

## Writing a post

Add `src/content/blog/my-post.md` (published at `/blog/my-post/`):

```md
---
title: My post
description: One-line summary for the post list and RSS feed.
date: 2026-10-06
draft: true   # optional: drafts show in `npm run dev` only
---

Post body in Markdown.
```

Published posts appear on `/blog/` and in the RSS feed at `/rss.xml`. See `hello-world.md` for an example.

## Adding photos

```sh
npm run photos:add -- ~/Desktop/sunset.jpg ~/Desktop/train.jpg
```

This resizes each photo to at most 2400px, **strips all EXIF metadata (including GPS location)**, saves it
in `src/content/photos/`, and appends an entry to `photos.yaml`. Then fill in the `alt` text (required; the
build fails without it) and optionally a `caption` and `date`. Photos show on `/photos/` in the order they
appear in `photos.yaml`.

Don't copy photos into `src/content/photos/` by hand: the repo is public, so the original files (and any
location data in them) would be published. iPhone HEIC files aren't supported; export them as JPEG first.

At build time Astro makes AVIF/WebP versions at several sizes, so visitors only download what fits their
screen.

## Deploy

```sh
npm run deploy
```

This builds the site and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves at
[pmaldonado.com](https://pmaldonado.com). The custom domain comes from `public/CNAME`, and `--nojekyll`
stops GitHub Pages from hiding Astro's `_astro/` asset folder.
