/* The opening of a page.

   The markup lives in `src/components/hero.ts`. The stories are the forms a
   page uses: the whole opening, the copy alone, and the copy between the tags. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/hero.ts';
import { type HeroProps } from '../../packages/frontend/src/components/hero.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

const sdsHero = ({ heading, eyebrow, lead, action, href, icon, second, secondHref, src, alt, plain, valign, leads }: HeroProps) =>
  html`<sds-hero
    heading="${heading ?? ''}"
    eyebrow="${eyebrow ?? ''}"
    lead="${lead ?? ''}"
    action="${action ?? ''}"
    href="${href ?? ''}"
    icon="${icon ?? ''}"
    second="${second ?? ''}"
    second-href="${secondHref ?? ''}"
    src="${src ?? ''}"
    alt="${alt ?? ''}"
    ?plain="${Boolean(plain)}"
    valign="${valign ?? 'center'}"
    leads="${leads ?? 'start'}"
  ></sds-hero>`;

const WHOLE: HeroProps = {
  eyebrow: 'Guides theme',
  heading: 'Your first site in ten minutes',
  lead: 'Copy the example project and replace its content. The search and the navigation stay in place.',
  action: 'Publish a first site',
  href: '#publish',
  second: 'Read the example',
  secondHref: '#example',
  src: 'assets/placeholders/design-system-workbench-cutout.webp',
  plain: true,
};

const meta: Meta<HeroProps> = {
  title: 'Components/Content/Hero',
  tags: ['autodocs', '!dev'],
  excludeStories: ['specimenHtml'],
  render: (args) => sdsHero(args),
  argTypes: {
    heading: { control: 'text' },
    eyebrow: { control: 'text' },
    lead: { control: 'text' },
    action: { control: 'text' },
    href: { control: 'text' },
    second: { control: 'text' },
    secondHref: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    plain: { control: 'boolean' },
    valign: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    leads: { control: 'inline-radio', options: ['start', 'end'] },
  },
  args: WHOLE,
  parameters: {
    dsCard: dsCard({
      path: 'components/content/hero.card.html',
      name: 'Hero',
      subtitle: 'The opening of a page: the claim, its press and one picture',
      viewport: '900x368',
    }),
  },
};

export default meta;
type Story = StoryObj<HeroProps>;

/** The claim, its press, a quieter way and the picture. */
export const Default: Story = {};

/** The copy alone. With no picture there is no second half. */
export const NoPicture: Story = { name: 'No picture', args: { ...WHOLE, src: '' } };

/** A picture that keeps its frame: a screenshot, or a drawing with a ground. */
export const Framed: Story = { args: { ...WHOLE, src: 'assets/placeholders/design-system-workbench.webp', plain: false } };

/** The picture over the copy, once the two have stacked. */
export const PictureLeads: Story = { name: 'Picture leads', args: { ...WHOLE, leads: 'end' } };

/** Blocks between the tags, the way a renderer writes its own heading. */
export const BlocksBetweenTheTags: Story = {
  name: 'Blocks between the tags',
  render: () => html`<sds-hero action="${WHOLE.action}" href="${WHOLE.href}" src="${WHOLE.src}" alt="">
    <h1>A heading the renderer wrote</h1>
    <p>A paragraph, and <a href="#more">a link</a> in it.</p>
  </sds-hero>`,
};

export const specimenHtml = (): string =>
  spec([
    part(sdsHero(WHOLE)),
    specCap('THE CLAIM, THE PRESS, THE QUIETER WAY · THE PICTURE IS DECORATION AND DOES NOT OPEN'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
