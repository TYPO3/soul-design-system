/* The faces a drawing carries inside its file.

   A drawing shown as an image is a document of its own and sees no face of
   the page. So the file brings the cuts it sets its text in, and only
   those. A renderer that drops the block sets the shipped face or the
   system's instead, and the measure in `text.ts` holds for both. */

import { CUTS, RANGES } from './faces.generated.ts';
import { CARRIED, type Face } from './paint.ts';

/* The characters of the second subset. A drawing with none of them does
   not carry it. */
const EXTENDED = /[Ā-˿ᴀ-ỿⱠ-Ɀ꜠-ꟿ]/;

const decode = (s: string): string =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** The `<style>` block with a face rule for every cut `body` sets text in. */
export const faces = (body: string): string => {
  const used = new Set<string>();
  let extended = false;
  for (const [, attrs = '', content = ''] of body.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const face: Face = attrs.includes(CARRIED.mono) ? 'mono' : 'sans';
    used.add(`${face}-${/font-weight="600"/.test(attrs) ? 600 : 400}`);
    for (const [, inner = ''] of content.matchAll(/<tspan\b([^>]*)>/g)) used.add(`${face}-${/font-weight="600"/.test(inner) ? 600 : 400}`);
    if (EXTENDED.test(decode(content.replace(/<[^>]+>/g, '')))) extended = true;
  }
  const rules = [...used].sort().flatMap((key) => {
    const [face = 'sans', weight = '400'] = key.split('-');
    return Object.keys(RANGES)
      .filter((subset) => subset === 'latin' || extended)
      .map((subset) => {
        const data = CUTS[`${key}-${subset}`];
        if (!data) throw new Error(`no cut of ${key} for ${subset} — run \`make fonts\``);
        return `@font-face{font-family:'${CARRIED[face as Face]}';font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${RANGES[subset]}}`;
      });
  });
  return rules.length ? `<style>${rules.join('')}</style>` : '';
};
