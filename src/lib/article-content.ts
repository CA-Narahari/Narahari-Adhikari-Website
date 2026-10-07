import type { ServiceItem } from '@/types';
import { sanitizeHtml } from '@/lib/sanitize-html';

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function escapeArticleText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function toArticleHtml(content: string): string {
  const source = String(content || '');
  if (/<[a-z][^>]*>/i.test(source)) return sanitizeHtml(source);
  return sanitizeHtml(source.split(/\n\s*\n/).filter(Boolean)
    .map((paragraph) => `<p>${escapeArticleText(paragraph).replace(/\n/g, '<br>')}</p>`).join(''));
}

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&amp;/g, 'and')
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
}

export function addArticleHeadingIds(content: string): string {
  let index = 0;
  return content.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level: string, attrs: string, inner: string) => {
    const id = `article-${slugifyHeading(inner)}-${index++}`;
    const withoutOldId = attrs.replace(/\s+id=("[^"]*"|'[^']*')/i, '');
    return `<h${level}${withoutOldId} id="${id}">${inner}</h${level}>`;
  });
}

export function getArticleHeadings(content: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const regex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = regex.exec(content)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    if (!text) continue;
    const id = match[2].match(/\bid="([^"]+)"/i)?.[1] || `article-${slugifyHeading(text)}-${index}`;
    headings.push({ id, text, level: Number(match[1]) as 2 | 3 });
    index++;
  }
  return headings;
}

export function serviceArticleHtml(service: ServiceItem): string {
  let content = toArticleHtml(service.full_description || service.short_description || '');
  const sectionTitle = 'Services';
  const existingHeadings = getArticleHeadings(content).map((heading) => heading.text.toLowerCase());
  if (service.deliverables?.length && sectionTitle && !existingHeadings.includes(sectionTitle.toLowerCase())) {
    content += `<h2>${escapeArticleText(sectionTitle)}</h2><ul>${service.deliverables.map((item) => `<li>${escapeArticleText(item)}</li>`).join('')}</ul>`;
  }
  return addArticleHeadingIds(sanitizeHtml(content));
}
