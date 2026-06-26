import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  body: z
    .string()
    .max(50000, 'Body cannot exceed 50000 characters')
    .default(''),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color must be a valid hex color')
    .default('#10b981'),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(30)
        .regex(/^[a-zA-Z0-9 _-]+$/, 'Tags can only contain letters, numbers, spaces, hyphens, and underscores')
    )
    .max(20, 'Maximum 20 tags allowed')
    .default([]),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  body: z
    .string()
    .max(50000, 'Body cannot exceed 50000 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color must be a valid hex color')
    .optional(),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(30)
        .regex(/^[a-zA-Z0-9 _-]+$/, 'Tags can only contain letters, numbers, spaces, hyphens, and underscores')
    )
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
});
