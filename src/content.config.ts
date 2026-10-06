import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { parse } from "yaml";

// Blog posts: one Markdown file per post in src/content/blog/.
// The file name (minus .md) becomes the URL: hello-world.md -> /blog/hello-world/
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Drafts render in `npm run dev` but are left out of production builds and the RSS feed.
    draft: z.boolean().default(false),
  }),
});

// Photos: image files live next to photos.yaml, which lists them in display order.
// Add new photos with `npm run photos:add -- <files>` so they're resized and stripped of EXIF/GPS data.
const photos = defineCollection({
  loader: file("./src/content/photos/photos.yaml", {
    // Record each photo's position so the page can keep the order from the file.
    parser: (text) => (parse(text) ?? []).map((photo: object, order: number) => ({ ...photo, order })),
  }),
  schema: ({ image }) =>
    z.object({
      src: image(),
      alt: z.string().min(1, "Every photo needs alt text describing it."),
      caption: z.string().optional(),
      date: z.coerce.date().optional(),
      order: z.number(),
    }),
});

export const collections = { blog, photos };
