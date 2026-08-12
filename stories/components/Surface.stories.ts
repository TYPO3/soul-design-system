/* The filled planes: raised and sunken.

   The markup lives in `src/components/surface.ts`. The two differ only in
   fill, because the system has no shadows — a plane is told apart by its fill
   and a hairline and by nothing else.

   The plane with no fill is `sds-card` and stands first on the specimen, so
   the three boxes a page can reach for are in one picture with the element
   that draws each. It is the odd one there on purpose: its title is a heading
   in the document outline and sets larger, which is the difference between a
   plane holding a statement and a card that goes somewhere. The fills alone,
   with nothing else varying, are `guidelines/colors-surfaces`.

   The card shows the planes *and* the overlays over them, because that claim
   is about the pair too: without a shadow an overlay needs a plane under it to
   be an overlay of anything. The three that float have their own pages. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/overlay.ts';
import '../../packages/frontend/src/components/modal.ts';
import '../../packages/frontend/src/components/drawer.ts';
import '../../packages/frontend/src/components/button.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type SurfaceProps } from '../../packages/frontend/src/components/surface.ts';
import { sdsCard } from './Card.stories.ts';
import { dsCard, indent, part, px, spec, specCap } from '../lib/specimen.ts';

const sdsSurface = ({ plane = 'raised', title, body, label, icon }: SurfaceProps) =>
  html`<sds-surface plane="${plane}" heading="${title}" .body="${body}" label="${label ?? ''}" icon="${ifDefined(icon)}"></sds-surface>`;

/** A plane with a wash, a modal and a drawer over it — the only arrangement
    in which the no-shadow claim can be read at all. The card is generated
    from this. */
export const scene = (): TemplateResult => html`<sds-overlay></sds-overlay>
<sds-modal
  heading="Publish the task skills?"
  .body="${html`This writes into <span class="sds-mono">.agents/skills</span> and records the setup. Nothing else is touched.`}"
  .actions="${[
    buttonMarkup({ variant: 'ghost', size: 'sm' }, 'Cancel'),
    buttonMarkup({ variant: 'primary', size: 'sm' }, 'Publish'),
  ]}"
></sds-modal>
<sds-drawer .body="${html`<span class=\"spec-cap\">DRAWER</span>`}"></sds-drawer>`;

const meta: Meta<SurfaceProps> = {
  title: 'Components/Surface',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml', 'scene'],
  render: (args) => sdsSurface(args),
  argTypes: {
    plane: { control: 'inline-radio', options: ['raised', 'sunken'] },
    title: { control: 'text' },
    body: { control: 'text' },
    label: { control: 'text' },
    icon: {
      control: 'select',
      options: [undefined, 'actions-database', 'actions-book', 'actions-extension', 'actions-tag'],
    },
  },
  /* The narrow no-break space before a unit is the system's own typography —
     `6 px`, `560 PX` all set with U+202F so a number cannot be split from
     its unit across a line. It belongs in the copy, not in CSS. */
  args: { plane: 'raised', title: 'Raised', body: 'Raised fill, for when it sits on the canvas and has to read as a plane.' },
  parameters: {
    dsCard: dsCard({
      path: 'components/surfaces/surfaces.card.html',
      name: 'The planes, and what floats over them',
      subtitle: 'No shadows anywhere — a wash and a border do the separating',
      viewport: '700x420',
    }),
  },
};

export default meta;
type Story = StoryObj<SurfaceProps>;

/** A raised fill, for when it sits on the canvas and has to read as a plane. */
export const Raised: Story = { args: { plane: 'raised', title: 'Raised', body: 'Raised fill, for when it sits on the canvas and has to read as a plane.' } };

/** Machine output: code, logs, structured content. */
export const Sunken: Story = { args: { plane: 'sunken', title: 'Sunken', body: 'For machine output: code, logs, structured content.' } };

/** A glyph above the label, for a set of cards that is scanned before it is
    read. It sits over the label rather than on the title's line, because a set
    is scanned down its left edge and a glyph beside a title competes with it.
    Muted, never in a status colour: a card is a subject, not a result. */
export const WithIcon: Story = {
  args: {
    plane: 'raised',
    icon: 'actions-database',
    label: 'source 01',
    title: 'Bundled knowledge',
    body: 'Curated and version-bound. It answers with nothing running — no installation booted, and no request leaving the machine.',
  },
};

/** The form a document uses: the statement between the tags. A plane on a
    product surface holds a sentence somebody composed and a property carries
    it; a passage set beside an argument is paragraphs, a list, a block of its
    own, and that is markup or it is nothing. */
export const FromContent: Story = {
  render: () => html`<sds-surface heading="What a topic is" box-style="max-width:520px">
    <p>A block with a title of its own that stays out of the outline — a
      digression, not a step in the argument.</p>
    <ul>
      <li>it is not an admonition: nothing here is true of the reader</li>
      <li>it does not float, because a column of sixty-six characters has
        nothing for it to float beside</li>
    </ul>
  </sds-surface>`,
};

export const specimenHtml = (): string =>
  spec([
    /* The unfilled plane first, drawn by the element that owns it. Three boxes
       differing in one thing each is the whole of the claim. */
    `<div style="display:flex; gap:14px; flex-wrap:wrap;">\n${indent(
      [
        part(sdsCard({ heading: 'Card', body: `Hairline border, ${px(6)} radius, no fill.`, href: '' })),
        ...[Raised, Sunken].map((s) => part(sdsSurface(s.args as SurfaceProps))),
      ].join('\n'),
      2,
    )}\n</div>`,
    `<div style="position:relative; height:210px; border:1px solid var(--border-subtle); border-radius:var(--radius-card); overflow:hidden; background:var(--surface-canvas);">\n${indent(part(scene()), 2)}\n</div>`,
    specCap(`OVERLAY --surface-overlay · MODAL CENTRED, MAX ${px(560, 'PX')} · DRAWER FROM THE RIGHT · NO SHADOW ON EITHER`),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
