import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullish().transform((value) => value || undefined),
    category: z.enum(['Интерьер', 'Экстерьер']),
    year: z.coerce.number().int(),
    location: z.string(),
    area: z.string().nullish().transform((value) => value || undefined),
    excerpt: z.string(),
    cover: z.string(),
    gallery: z.array(z.string()).nullish().transform((value) => value ?? []),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    order: z.coerce.number().int().default(0),
  }),
});

export const collections = { projects };
