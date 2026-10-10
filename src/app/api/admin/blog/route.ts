import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';
import { sanitizeHtml } from '@/lib/sanitize-html';

const BLOG_COLUMNS = [
  'title',
  'slug',
  'category',
  'excerpt',
  'content',
  'author',
  'read_time',
  'featured_image',
  'image_name',
  'tags',
  'status',
  'published_at',
  'meta_title',
  'meta_description',
  'focus_keyword',
  'image_alt',
] as const;

const MAX_LENGTHS = {
  title: 180, slug: 180, category: 100, excerpt: 1200, content: 250_000,
  author: 120, read_time: 40, featured_image: 2048, image_name: 255,
  meta_title: 180, meta_description: 500, focus_keyword: 100, image_alt: 300,
} as const;

type BlogColumn = (typeof BLOG_COLUMNS)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getBlogPayload(input: Record<string, unknown>, partial = false) {
  const payload: Partial<Record<BlogColumn, unknown>> = {};
  for (const column of BLOG_COLUMNS) {
    if (column in input) payload[column] = input[column];
  }

  if (!partial && (!payload.title || !payload.slug || !payload.category || typeof payload.content !== 'string')) {
    return { error: 'Title, slug, category, and content are required.' } as const;
  }
  if (payload.status !== undefined && payload.status !== 'draft' && payload.status !== 'published') {
    return { error: 'Choose Draft or Published status.' } as const;
  }
  if (payload.tags !== undefined && (!Array.isArray(payload.tags) || payload.tags.some((tag) => typeof tag !== 'string'))) {
    return { error: 'Tags must be a list of text values.' } as const;
  }
  for (const column of ['title', 'slug', 'category', 'excerpt', 'content', 'author', 'read_time', 'meta_title', 'meta_description', 'focus_keyword', 'image_name', 'image_alt'] as const) {
    if (payload[column] !== undefined && typeof payload[column] !== 'string') {
      return { error: `The ${column.replaceAll('_', ' ')} field must be text.` } as const;
    }
  }
  for (const [column, maxLength] of Object.entries(MAX_LENGTHS) as Array<[keyof typeof MAX_LENGTHS, number]>) {
    const value = payload[column];
    if (typeof value === 'string' && value.length > maxLength) {
      return { error: `The ${column.replaceAll('_', ' ')} field is too long.` } as const;
    }
  }
  if (typeof payload.content === 'string') payload.content = sanitizeHtml(payload.content);
  if (payload.tags !== undefined && (payload.tags as string[]).length > 20) return { error: 'Use no more than 20 tags.' } as const;
  if (Array.isArray(payload.tags) && payload.tags.some((tag) => tag.length > 40)) return { error: 'Each tag must be 40 characters or fewer.' } as const;

  return { payload } as const;
}

function databaseError(error: { message: string; code?: string; details?: string | null }) {
  console.error('Blog CMS database operation failed', { code: error.code, message: error.message });
  return NextResponse.json({ error: 'The blog article could not be saved. Check the required fields and try again.' }, { status: 400 });
}

export async function POST(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > 300 * 1024) return NextResponse.json({ error: 'The article details exceed the allowed size.' }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'The blog details could not be read.' }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: 'Enter the blog details and try again.' }, { status: 400 });

  const validated = getBlogPayload(body);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

  const { data, error } = await access.adminClient.from('posts').insert(validated.payload).select('*').single();
  if (error) return databaseError(error);
  return NextResponse.json({ post: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > 300 * 1024) return NextResponse.json({ error: 'The article details exceed the allowed size.' }, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'The blog details could not be read.' }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.id !== 'string' || !body.id) {
    return NextResponse.json({ error: 'A blog ID is required to update an article.' }, { status: 400 });
  }

  const validated = getBlogPayload(body, true);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400 });
  if (!Object.keys(validated.payload).length) return NextResponse.json({ error: 'There are no blog changes to save.' }, { status: 400 });

  const { data, error } = await access.adminClient.from('posts').update(validated.payload).eq('id', body.id).select('*').maybeSingle();
  if (error) return databaseError(error);
  if (!data) return NextResponse.json({ error: 'This blog article no longer exists. Refresh the list and try again.' }, { status: 404 });
  return NextResponse.json({ post: data });
}

export async function DELETE(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'The delete request could not be read.' }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.id !== 'string' || !body.id) {
    return NextResponse.json({ error: 'A blog ID is required to delete an article.' }, { status: 400 });
  }

  const { data, error } = await access.adminClient.from('posts').delete().eq('id', body.id).select('id').maybeSingle();
  if (error) return databaseError(error);
  if (!data) return NextResponse.json({ error: 'This blog article no longer exists. Refresh the list and try again.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
