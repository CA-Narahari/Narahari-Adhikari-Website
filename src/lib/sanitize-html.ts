const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'figure', 'figcaption', 'img', 'div', 'span',
  'section', 'article', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'sup', 'sub', 'mark', 'style',
]);
const ALLOWED_ATTRS = new Set([
  'class', 'href', 'target', 'rel', 'src', 'alt', 'title', 'id', 'width', 'height', 'colspan', 'rowspan', 'scope', 'style',
]);
const SAFE_CSS_PROPERTIES = new Set([
  'align-items', 'background', 'background-color', 'border', 'border-bottom', 'border-color', 'border-radius', 'border-style',
  'border-top', 'border-width', 'box-shadow', 'bottom', 'color', 'cursor', 'display', 'flex', 'flex-basis', 'flex-direction',
  'flex-grow', 'flex-shrink', 'flex-wrap', 'font-family', 'font-size', 'font-style', 'font-weight', 'gap',
  'grid-template-columns', 'height', 'inset', 'justify-content', 'left', 'letter-spacing', 'line-height', 'margin',
  'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-width', 'min-width', 'object-fit', 'opacity',
  'overflow', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'text-align',
  'text-decoration', 'text-transform', 'top', 'transform', 'transition', 'vertical-align', 'white-space', 'width',
]);

function safeCssDeclarations(input: string): string {
  return input.split(';').flatMap((declaration) => {
    const separator = declaration.indexOf(':');
    if (separator < 1) return [];
    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).trim();
    if (!SAFE_CSS_PROPERTIES.has(property) || !value || /url\s*\(|expression\s*\(|@import|javascript:|[<>\\{}]/i.test(value)) return [];
    return [`${property}: ${value}`];
  }).join('; ');
}

function scopeStylesheet(input: string): string {
  const css = input.replace(/\/\*[\s\S]*?\*\//g, '');
  const output: string[] = [];
  let cursor = 0;
  while (cursor < css.length) {
    const open = css.indexOf('{', cursor);
    if (open < 0) break;
    const selectorText = css.slice(cursor, open).trim();
    let depth = 1;
    let close = open + 1;
    for (; close < css.length && depth > 0; close++) {
      if (css[close] === '{') depth++;
      else if (css[close] === '}') depth--;
    }
    if (depth !== 0) break;
    const body = css.slice(open + 1, close - 1).trim();
    if (/^@(media|supports)\s+[\w\s():.,%/-]+$/i.test(selectorText)) {
      const nested = scopeStylesheet(body);
      if (nested) output.push(`${selectorText} { ${nested} }`);
    } else {
      const safeDeclarations = safeCssDeclarations(body);
      const selectors = selectorText.split(',').map((selector) => selector.trim()).filter((selector) =>
        selector && /^[\w\s.#:[\]="'*-]+$/.test(selector),
      );
      if (safeDeclarations && selectors.length) {
        const scoped = selectors.map((selector) => {
          const localSelector = selector.replace(/^(html|body|:root)\b\s*/i, '').trim();
          return localSelector ? `.cms-article-content ${localSelector}` : '.cms-article-content';
        });
        output.push(`${scoped.join(', ')} { ${safeDeclarations} }`);
      }
    }
    cursor = close;
  }
  return output.join('\n');
}

function decodeAttributeEntities(value: string): string {
  return value
    .replace(/&#x([\da-f]+);?/gi, (_match, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_match, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&colon;/gi, ':')
    .replace(/&Tab;/gi, '\t')
    .replace(/&NewLine;/gi, '\n');
}

/** Sanitizes CMS HTML and scopes user-authored CSS to the article body. */
export function sanitizeHtml(input: string): string {
  const styleBlocks: string[] = [];
  const encodedMarkupPattern = /&lt;\/?(?:p|br|hr|strong|b|em|i|u|s|h[1-6]|ul|ol|li|a|blockquote|code|pre|figure|figcaption|img|div|span|section|article|table|thead|tbody|tfoot|tr|th|td|caption|sup|sub|mark|style)\b[\s\S]*?&gt;/i;
  const decodedInput = encodedMarkupPattern.test(input)
    ? input.replace(/&lt;(\/?(?:p|br|hr|strong|b|em|i|u|s|h[1-6]|ul|ol|li|a|blockquote|code|pre|figure|figcaption|img|div|span|section|article|table|thead|tbody|tfoot|tr|th|td|caption|sup|sub|mark|style)\b[\s\S]*?)&gt;/gi, (_tag, inner: string) => `<${inner.replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")}>`)
    : input;
  const withoutDangerousContent = decodedInput
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<(script|iframe|object|embed|svg|math|template|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|iframe|object|embed|svg|math|template|form)\b[^>]*\/?\s*>/gi, '')
    .replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, (_match, css: string) => {
      const scopedCss = scopeStylesheet(css);
      if (scopedCss) styleBlocks.push(scopedCss);
      return '';
    });

  const sanitized = withoutDangerousContent.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    const closing = full.startsWith('</');
    if (closing) return `</${tag}>`;
    const attrs = rawAttrs.replace(/([a-zA-Z:-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g, (_attr, rawName: string, rawValue: string) => {
      const name = rawName.toLowerCase();
      const value = rawValue.replace(/^["']|["']$/g, '');
      if (!ALLOWED_ATTRS.has(name) || /^on/i.test(name)) return '';
      if (name === 'style') {
        const safeStyle = safeCssDeclarations(value);
        return safeStyle ? ` style="${safeStyle.replace(/"/g, '&quot;')}"` : '';
      }
      const decoded = decodeAttributeEntities(value).replace(/[\u0000-\u0020\u007f]/g, '').trim();
      if (name === 'href' || name === 'src') {
        if (decoded.includes('\\')) return '';
        const allowedProtocol = name === 'href' ? /^(https?:|mailto:|tel:)/i : /^https?:/i;
        const relative = decoded.startsWith('/') && !decoded.startsWith('//') || decoded.startsWith('#');
        if (!allowedProtocol.test(decoded) && !relative) return '';
        if (/^(?:javascript|data|vbscript):/i.test(decoded)) return '';
      }
      return ` ${name}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    });
    return `<${tag}${attrs}>`;
  });

  return styleBlocks.length
    ? `<style>${styleBlocks.join('\n')}</style>${sanitized}`
    : sanitized;
}
