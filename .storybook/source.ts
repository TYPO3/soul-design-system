/* The markup a story shows, laid out so it can be read.

   Storybook serialises the rendered fragment with `innerHTML`, so the source
   panel carries whatever whitespace the template literal happened to have — a
   story written on one line documents itself on one line, and a list built by
   `.map` arrives with no break in it at all. This lays the fragment out again,
   but only where a break cannot reach the render: beside an element the page
   lays out as a block, or where whitespace already stood. Two inline elements
   written flush stay flush, because the space a break leaves between them is a
   space the reader would copy along with the markup. */

const STEP = '  ';

/** Where a line stops being read and starts being scanned. */
const WIDTH = 100;

const HTML = 'http://www.w3.org/1999/xhtml';

const escText = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escAttr = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** What no layout of a markup may change: its tags, their attributes and the
    text between them, read off the parsed tree so that two spellings of one
    thing — `&nbsp;` and the character, `copy` and `copy=""` — compare equal.
    The whitespace between tags is what this file writes, so it is left out. */
function skeleton(root: ParentNode): string {
  const parts: string[] = [];
  const walk = (parent: ParentNode): void => {
    for (const n of parent.childNodes) {
      if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as Element;
        const attrs = [...el.attributes].map((a) => `${a.name}=${a.value}`).join(' ');
        parts.push(`<${el.tagName.toLowerCase()} ${attrs}`);
        walk(el);
        parts.push(`/${el.tagName.toLowerCase()}`);
      } else if (n.nodeType === Node.COMMENT_NODE) parts.push(`!${n.nodeValue ?? ''}`);
      else {
        const t = (n.nodeValue ?? '').replace(/\s+/g, ' ').trim();
        if (t) parts.push(t);
      }
    }
  };
  walk(root);
  return parts.join('\n');
}

function parse(markup: string): DocumentFragment {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup;
  return tpl.content;
}

const text = (n: ChildNode | undefined): string =>
  n?.nodeType === Node.TEXT_NODE ? (n.nodeValue ?? '') : '';

const laid = new Map<string, string>();
let bench: HTMLElement | undefined;

/** The layouts that drop the whitespace between their children on the floor,
    so a break anywhere inside one is free. */
const GAPLESS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);

/** The box a custom element draws, taken from the one the story just put on
    the page. Almost always the element itself; for the few that draw nothing
    where they stand it is the first child — and reading a rendered one rather
    than building one keeps a layout question from running a constructor. */
function drawn(tag: string): string | undefined {
  const live = document.querySelector(tag);
  if (!live) return undefined;
  const host = getComputedStyle(live).display;
  if (host !== 'contents') return host;
  const box = live.firstElementChild;
  return box ? getComputedStyle(box).display : undefined;
}

/** An element with its class and its own style, laid out off-screen. Plain
    tags only: this is what the browser and the stylesheet together say a
    `div.sds-grid` is — and a story that writes `display:flex` on the spot is
    answered by the same question. */
function probed(tag: string, cls: string, style: string): string {
  if (!bench) {
    bench = document.createElement('div');
    bench.setAttribute('style', 'position:absolute;left:-9999px;top:0;visibility:hidden');
    document.body.append(bench);
  }
  const probe = bench.appendChild(document.createElement(tag));
  probe.className = cls;
  if (style) probe.setAttribute('style', style);
  const display = getComputedStyle(probe).display;
  probe.remove();
  return display;
}

/** How the page lays this element out — asked of the page, not kept as a list
    here, which would be a second copy of the stylesheet. An element nothing
    can be asked about has no answer, and the caller then takes the reading
    under which no break happens. */
function display(n: Node | undefined | null): string | undefined {
  if (!n || n.nodeType !== Node.ELEMENT_NODE) return undefined;
  const el = n as Element;
  const tag = el.tagName.toLowerCase();
  const custom = tag.includes('-');
  const cls = el.getAttribute('class') ?? '';
  const style = el.getAttribute('style') ?? '';
  const key = custom ? tag : `${tag}|${cls}|${style}`;
  const known = laid.get(key);
  if (known !== undefined) return known;

  const found = custom ? drawn(tag) : probed(tag, cls, style);
  if (found !== undefined) laid.set(key, found);
  return found;
}

function isBlock(n: ChildNode | undefined): boolean {
  const d = display(n);
  return d !== undefined && !d.startsWith('inline') && d !== 'none' && d !== 'contents';
}

/** Whether a break at this boundary is one the render cannot see: whitespace
    stood here already, one side is laid out as a block, or the two sit in a
    layout that drops the gaps between its children. */
const breakable = (before: ChildNode | undefined, after: ChildNode | undefined): boolean =>
  /\s$/.test(text(before)) ||
  /^\s/.test(text(after)) ||
  isBlock(before) ||
  isBlock(after) ||
  GAPLESS.has(display((before ?? after)?.parentNode) ?? '');

function openTag(el: Element, depth: number): string {
  const tag = el.tagName.toLowerCase();
  /* Every attribute keeps its value, `copy=""` included. Writing an empty one
     as the bare name reads better for a flag and lies about the rest: a story
     passes `tag=""` for a card that has no tag, and `tag` is not that. */
  const attrs = [...el.attributes].map((a) => `${a.name}="${escAttr(a.value)}"`);
  const flat = `<${tag}${attrs.map((a) => ` ${a}`).join('')}>`;
  if (attrs.length < 2 || depth * STEP.length + flat.length <= WIDTH) return flat;

  const pad = STEP.repeat(depth + 1);
  return `<${tag}\n${attrs.map((a) => pad + a).join('\n')}\n${STEP.repeat(depth)}>`;
}

interface Laid {
  /** Runs of markup that must stay on one line together. */
  chunks: string[];
  openEdge: boolean;
  closeEdge: boolean;
}

/** Group the children into runs, given what each one renders as — rendered
    once by the caller, because a tree re-rendered at every level it sits under
    is the same page laid out a thousand times. */
function lay(kids: readonly ChildNode[], rendered: readonly string[]): Laid {
  const chunks: string[] = [];
  let run = '';
  kids.forEach((kid, i) => {
    if (i > 0 && breakable(kids[i - 1], kid)) {
      chunks.push(run);
      run = '';
    }
    run += rendered[i] ?? '';
  });
  chunks.push(run);

  const openEdge = breakable(undefined, kids[0]);
  const closeEdge = breakable(kids[kids.length - 1], undefined);
  const trimmed = chunks.map((c, i) => {
    const head = i === 0 && !openEdge ? c : c.replace(/^\s+/, '');
    return i === chunks.length - 1 && !closeEdge ? head : head.replace(/\s+$/, '');
  });
  return { chunks: trimmed.filter(Boolean), openEdge, closeEdge };
}

function element(el: Element, depth: number): string {
  const tag = el.tagName.toLowerCase();
  /* A drawing is not composed markup: an inlined icon is one blob a reader
     skips, and inside `<svg>` the whitespace rules are not the ones above. */
  if (el.namespaceURI !== HTML) return el.outerHTML;

  const open = openTag(el, depth);
  /* A void element closes itself, and which ones do is the parser's answer,
     not a list kept here: serialise the element without its children and see
     whether the closing tag comes back. */
  if (!(el.cloneNode(false) as Element).outerHTML.endsWith(`</${tag}>`)) return open;

  const kids = [...el.childNodes];
  if (kids.length === 0) return `${open}</${tag}>`;

  const rendered = kids.map((k) => node(k, depth + 1));
  const inline = `${open}${rendered.join('')}</${tag}>`;
  /* Content that is only text stays exactly as it stands: the body of an
     `sds-code` is the sample, and its newlines are what it says. */
  const prose = kids.every((k) => k.nodeType !== Node.ELEMENT_NODE);
  if (prose || (!inline.includes('\n') && depth * STEP.length + inline.length <= WIDTH)) return inline;

  const { chunks, openEdge, closeEdge } = lay(kids, rendered);
  const pad = STEP.repeat(depth + 1);
  const body = chunks.map((c, i) => (i === 0 && !openEdge ? c : `\n${pad}${c}`)).join('');
  return `${open}${body}${closeEdge ? `\n${STEP.repeat(depth)}` : ''}</${tag}>`;
}

function node(n: ChildNode, depth: number): string {
  if (n.nodeType === Node.COMMENT_NODE) return `<!--${n.nodeValue ?? ''}-->`;
  if (n.nodeType === Node.ELEMENT_NODE) return element(n as Element, depth);
  return escText(n.nodeValue ?? '');
}

/** The `docs.source.transform` hook: the same markup, laid out. What comes
    back out with a different skeleton is not laid out at all — a panel that is
    nearly right is worse than one that is merely dense — and so is anything
    that holds no element, which is a snippet in some other language. */
export function readable(code: string): string {
  if (typeof document === 'undefined') return code;

  const fragment = parse(code);
  if (!fragment.firstElementChild) return code;

  const kids = [...fragment.childNodes];
  const out = lay(kids, kids.map((k) => node(k, 0))).chunks.join('\n');
  return skeleton(parse(out)) === skeleton(fragment) ? out : code;
}
