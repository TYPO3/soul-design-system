/* What stands on a tag, read out of the markup as the author wrote it.

   An element that renders its children itself, rather than places them, gets
   them under a prerender as one string: `authored` on the base. Its facts are
   the attributes on the child's tag, escaped the way HTML escapes them. A
   boolean attribute stands alone, and reads as the empty string. */

const FACT = /\s([\w-]+)(?:="([^"]*)")?/g;

const unescape = (text: string): string =>
  text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** The attributes of one tag, from the run between its name and its `>`. */
export function facts(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, key, value] of tag.matchAll(FACT)) out[key!] = unescape(value ?? '');
  return out;
}
