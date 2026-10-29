/* A drawing that stands in a file of its own, and the few lines a page keeps
   in its place. The page refers to the group `soul-ref` in the file, so the
   shapes read the page's tokens and turn with its mode. The build writes the
   file, and the element writes the same reference where the file exists. */

/** The size and the name of a drawing, read off its own markup. */
export interface Drawn {
  width: number;
  height: number;
  title: string;
  desc: string;
}

const escape = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const unescape = (text: string): string =>
  text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** The size, title and description of drawn markup. `undefined` where the
    markup holds no drawing of the engine. */
export const drawnOf = (svg: string): Drawn | undefined => {
  if (!/<g id="soul-ref">/.test(svg)) return undefined;
  const box = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  if (!box) return undefined;
  return {
    width: Number(box[1]),
    height: Number(box[2]),
    title: unescape(/<title[^>]*>([\s\S]*?)<\/title>/.exec(svg)?.[1] ?? ''),
    desc: unescape(/<desc[^>]*>([\s\S]*?)<\/desc>/.exec(svg)?.[1] ?? ''),
  };
};

/** The markup a page keeps for a drawing in the file at `href`. */
export const reference = (href: string, drawn: Drawn): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${drawn.width}" height="${drawn.height}" viewBox="0 0 ${drawn.width} ${drawn.height}" role="img">` +
  `<title>${escape(drawn.title)}</title><desc>${escape(drawn.desc)}</desc>` +
  `<use href="${escape(href)}#soul-ref"></use></svg>`;
