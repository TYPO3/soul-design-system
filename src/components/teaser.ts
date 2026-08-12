/* sds-teaser — one entry in a list of them.

   What a list page is made of: an image where the entry has one, what it is
   and when, the headline, and the two lines that decide whether the reader
   opens it. Everything else a teaser is sometimes given — an author, a reading
   time, a share count — is either in `meta` or is not worth the row.

   **The title is the link and the card is not.** A card wrapped in one anchor
   announces its entire contents as that link's name, and takes selecting the
   text inside it away from the reader. The card follows on hover instead,
   which is what makes it feel like the target it deliberately is not.

   The image is one file and is shown unchanged in both modes. A photograph is
   the same photograph whichever mode the page is in, and what a teaser carries
   is a photograph.

   **Two forms, and the written one wins.** A story and a product surface set
   properties: they know the entry, and a summary in a string is what they
   have. A documentation renderer cannot — a summary from a document is
   paragraphs, a title may be a resolved link, and none of it can be squeezed
   through an attribute — so it writes the parts between the tags and this
   keeps them, exactly as `sds-code` keeps a block that arrived already
   coloured. It is also what a reader with no JavaScript gets: the card is in
   the page before any script has run, and the element does no more than frame
   what is already there. */

import { html, type TemplateResult } from 'lit';
import './badge.ts';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface TeaserProps {
  heading: string;
  /** The two lines that decide whether it is opened. Not the first two lines
      of the entry — a summary is written, not cut. */
  body: string | TemplateResult;
  href?: string;
  /** What kind of entry it is. A badge, because it is a fact about the entry
      rather than a result — no tone. */
  tag?: string;
  /** When, and anything else that belongs in the label register. */
  meta?: string;
  /** The picture. Named `src` because every element in this system that
      takes a file names it `src` — `sds-image`, `sds-figure`, `sds-embed`,
      `sds-lightbox` — and a component that is the odd one out is one an
      author has to look up rather than write. */
  src?: string;
  alt?: string;
}

/* What a renderer wrote, told apart by the class the component itself would
   emit for it — the marker `sds-figure` and `sds-code` both use, and for the
   same reasons: light DOM has no slot to name a part with, and a class the
   stylesheet already defines is what makes the part read in the window before
   the upgrade. */
const isPart = (node: Node, part: string): boolean =>
  node.nodeType === 1 && (node as Element).matches(part);

/* The newlines a template left between the tags, and the markers Lit leaves
   among its own bindings. Neither is a part of a card. */
const isNothing = (node: Node): boolean =>
  node.nodeType === 8 || (node.nodeType === 3 && !(node.textContent ?? '').trim());

export class SdsTeaser extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    href: { type: String },
    tag: { type: String },
    meta: { type: String },
    src: { type: String },
    alt: { type: String },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare href: string;
  declare tag: string;
  declare meta: string;
  declare src: string;
  declare alt: string;

  /* The picture a renderer wrote, and the body it wrote, taken before Lit
     renders over them. The two are kept apart because the frame around the
     picture is the card's own part and a renderer writes it: reading the pair
     back as one block would put the summary inside the ground the picture
     sits on. */
  private taken: Node[] | null = null;
  private written: Node[] | null = null;

  /* Anything else between the tags is the summary. A surface that knows the
     entry but not how to spell the card — a product template with a paragraph
     in hand — writes that paragraph and nothing else, and the row and the
     title come from the properties beside it. Left unclaimed it would be
     dropped, and content a component silently loses is the worst of the three
     outcomes. */
  private summary: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.href = '#';
    this.tag = '';
    this.meta = '';
    this.src = '';
    this.alt = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isNothing(node));
    const picture = written.filter((node) => isPart(node, '.sds-teaser__image'));
    const body = written.filter((node) => isPart(node, '.sds-teaser__body'));
    const rest = written.filter((node) => !picture.includes(node) && !body.includes(node));
    if (picture.length) this.taken = picture;
    if (body.length) this.written = body;
    if (rest.length) this.summary = rest;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    /* What a renderer wrote, where it wrote one. The two forms answer the same
       question and the nodes win, because they are already in the page:
       rewriting them from `src` would replace a picture the reader can see
       with a second request for the same file. */
    const medium = this.taken
      ? html`${this.taken}`
      : this.src
        ? html`<div class="sds-teaser__image">
    ${art(this.src, this.alt)}
  </div>`
        : '';

    /* The row is dropped rather than left empty: a card whose first line is
       blank is a card with a hole where a set of them lines up. */
    const meta =
      this.tag || this.meta
        ? html`<div class="sds-row">
      ${this.tag ? html`<sds-badge label="${this.tag}"></sds-badge>` : ''}
      ${this.meta ? html`<span class="sds-label">${this.meta}</span>` : ''}
    </div>`
        : '';

    /* A summary written between the tags is blocks — a renderer's summary is
       paragraphs and a list is not unheard of — so it is held in a `div`. The
       property form stays a `p`: it is a sentence, and a paragraph is what a
       sentence goes in. */
    const text = this.summary
      ? html`<div class="sds-teaser__text">${this.summary}</div>`
      : html`<p class="sds-teaser__text">${this.body}</p>`;

    /* The body a renderer wrote, whole. Its row and its title carry markup
       this element cannot be handed — a title that resolved to a link, a
       literal in a summary — and it arrives already spelt in the card's own
       parts, so the element frames it and writes nothing over it. */
    const body = this.written
      ? html`${this.written}`
      : html`<div class="sds-teaser__body">
    ${meta}
    <h3 class="sds-teaser__title"><a href="${this.href}">${this.heading}</a></h3>
    ${text}
  </div>`;

    return html`<article class="sds-teaser">
  ${medium}
  ${body}
</article>`;
  }
}

define('sds-teaser', SdsTeaser);
