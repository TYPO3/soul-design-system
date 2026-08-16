/* One configuration value in a reference.

   The markup lives in `src/components/confval.ts`. The card is the shape a
   page of these has to hold: two entries in a column, so what is being judged
   is the rhythm between them rather than one entry on its own.

   `sdsConfval` is exported because the documentation page composes a run of
   these, and a page writing the element's attributes a second time is a page
   that drifts from the card. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/confval.ts';
import '../../packages/frontend/src/components/note.ts';
import { type ConfvalProps } from '../../packages/frontend/src/components/confval.ts';
import { DIVIDER, dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** The element, addressed. The description goes in as a property rather than
    between the tags: a card is rendered outside a browser, where an element
    never sees the children it was written with. */
export const sdsConfval = ({ name, anchor, required, type, default: unset, facts, body }: ConfvalProps): TemplateResult =>
  html`<sds-confval
    name="${name}"
    anchor="${anchor ?? ''}"
    ?required="${required ?? false}"
    type="${type ?? ''}"
    default="${unset ?? ''}"
    .facts="${facts ?? []}"
    .body="${body ?? ''}"
  ></sds-confval>`;

/** A settings reference, as one would be written: the value that has to be
    set, and the one that is safe to leave alone. Exported so the
    documentation page shows these rather than a second set of its own. */
export const SETTINGS: readonly ConfvalProps[] = [
  {
    name: 'siteTitle',
    anchor: 'confval-sitetitle',
    required: true,
    type: 'string',
    default: '"TYPO3"',
    body: html`The name the site calls itself — the browser tab, the header lockup, and
      the fallback for any page that declares no title of its own.`,
  },
  {
    name: 'cache.lifetime',
    anchor: 'confval-cache-lifetime',
    type: 'int',
    default: '86400',
    facts: [{ label: 'unit', value: 'seconds' }],
    body: html`How long a rendered page may be served from cache.
      <span class="sds-mono">0</span> disables caching, which is a development
      setting and never a production one.`,
  },
];

const meta: Meta<ConfvalProps> = {
  title: 'Components/Confval',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsConfval', 'SETTINGS', 'specimenHtml'],
  render: (args) => sdsConfval(args),
  argTypes: {
    name: { control: 'text' },
    anchor: { control: 'text' },
    required: { control: 'boolean' },
    type: { control: 'text' },
    default: { control: 'text' },
    facts: { control: 'object' },
    body: { control: 'text' },
  },
  args: SETTINGS[0] as ConfvalProps,
  parameters: {
    dsCard: dsCard({
      path: 'components/data/confval.card.html',
      name: 'Configuration values',
      subtitle: 'A reference entry — the name, the facts a machine checks, and the prose under both',
      viewport: '700x392',
    }),
  },
};

export default meta;
type Story = StoryObj<ConfvalProps>;

/** What a reader has to set, and the one thing they cannot leave alone. */
export const Required: Story = {};

/** A value with a default is a value a page works without, so the badge is
    absent rather than replaced by the word "optional". */
export const Optional: Story = { args: SETTINGS[1] as ConfvalProps };

/** An option the directive does not name is set the same way and prints the
    same way — the label is whatever the source called it. */
export const Options: Story = {
  args: {
    name: 'domains',
    anchor: 'confval-domains',
    type: 'array of string',
    facts: [
      { label: 'since', value: '13.4' },
      { label: 'scope', value: 'site' },
    ],
    body: html`Every host this site answers to. The first entry is canonical; the rest
      redirect to it.`,
  },
};

/** A value with nothing to state about it but its name: no facts, no badge,
    and the entry is the name and the sentence under it. */
export const Bare: Story = {
  args: {
    name: 'noindex',
    anchor: 'confval-noindex',
    type: '',
    default: '',
    body: 'Keeps the value out of the index, and the mark beside its name with it.',
  },
};

/** The form a renderer uses: the description written between the tags,
    because out of a document it is blocks. This form cannot be exported —
    see `FromContent` in `Code.stories.ts`. */
export const FromContent: Story = {
  render: () => html`<sds-confval name="cache.lifetime" anchor="confval-cache" type="int" default="86400">
    <p>How long a rendered page may be served from cache, in seconds.</p>
    <sds-note tone="warn" label="Warning">
      <p>A confval holds a whole block, including an admonition. Anything that
        assumes its description is one line of text is wrong about the node.</p>
    </sds-note>
  </sds-confval>`,
};

export const specimenHtml = (): string =>
  spec([
    ...SETTINGS.map((one) => part(sdsConfval(one))),
    specCap(
      'HAIRLINE ABOVE EACH ENTRY, NO BOX AROUND ONE · NAME AND VALUES MONO · ' +
        'FACTS IN ONE ROW ON --surface-inset · REQUIRED IS A BADGE, OPTIONAL IS SILENCE',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
