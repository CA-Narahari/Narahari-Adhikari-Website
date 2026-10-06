const ALLOWED_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'figure', 'figcaption', 'img']);
const ALLOWED_ATTRS = new Set(['class', 'href', 'target', 'rel', 'src', 'alt', 'title']);

/** Small, deterministic allow-list sanitizer for stored article markup. */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return '';
      const closing = full.startsWith('</');
      if (closing) return `</${tag}>`;
      const attrs = rawAttrs.replace(/([a-zA-Z:-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g, (attr: string, rawName: string, rawValue: string) => {
        const name = rawName.toLowerCase();
        const value = rawValue.replace(/^['"]|['"]$/g, '');
        if (!ALLOWED_ATTRS.has(name) || /^on/i.test(name) || /^(javascript|data|vbscript):/i.test(value)) return '';
        if ((name === 'href' || name === 'src') && !/^(https?:|mailto:|tel:|\/|#)/i.test(value)) return '';
        return ` ${name}="${value.replace(/"/g, '&quot;')}"`;
      });
      return `<${tag}${attrs}>`;
    });
}
