/* The one next step of a page.

   The markup lives in `src/components/cta.ts`. The stories are the forms a
   page uses, and the press with nowhere to go. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/cta.ts';
import { type CtaProps } from '../../packages/frontend/src/components/cta.ts';
import { dsCard, DIVIDER, part, spec, specCap } from '../lib/specimen.ts';

const sdsCta = ({ heading, body, action, href, icon, second, secondHref }: CtaProps) =>
  html`<sds-cta
    heading="${heading}"
    body="${body ?? ''}"
    action="${action}"
    href="${href}"
    icon="${icon ?? ''}"
    second="${second ?? ''}"
    second-href="${secondHref ?? ''}"
  ></sds-cta>`;

const ONE: CtaProps = {
  heading: 'Your first site in ten minutes',
  body: 'Copy the example project and replace its content. The search and the navigation stay in place.',
  action: 'Publish a first site',
  href: '#publish',
};

const TWO: CtaProps = {
  ...ONE,
  icon: 'actions-play',
  second: 'Read the example',
  secondHref: '#example',
};

const meta: Meta<CtaProps> = {
  title: 'Components/Actions/Call to action',
  tags: ['autodocs', '!dev'],
  excludeStories: ['specimenHtml'],
  render: (args) => sdsCta(args),
  argTypes: {
    heading: { control: 'text' },
    body: { control: 'text' },
    action: { control: 'text' },
    href: { control: 'text' },
    icon: { control: 'text' },
    second: { control: 'text' },
    secondHref: { control: 'text' },
  },
  args: TWO,
  parameters: {
    dsCard: dsCard({
      path: 'components/core/cta.card.html',
      name: 'Call to action',
      subtitle: 'What the reader gets, and the one press that starts it',
      viewport: '700x486',
    }),
  },
};

export default meta;
type Story = StoryObj<CtaProps>;

/** The press, and the way for a reader who is not ready. */
export const Default: Story = {};

/** One press. The clearest form, and the first choice. */
export const OnePress: Story = { name: 'One press', args: ONE };

/** The line between the tags, where it carries a link. */
export const LineBetweenTheTags: Story = {
  name: 'Line between the tags',
  render: () => html`<sds-cta heading="${ONE.heading}" action="${ONE.action}" href="${ONE.href}">
    <p>The <a href="#example">example project</a> holds every file a site needs.</p>
  </sds-cta>`,
};

/** A narrow box. The presses go under the text, and no breakpoint says so. */
export const Narrow: Story = {
  render: (args) => html`<div style="max-width:360px">${sdsCta(args)}</div>`,
};

/** An action with no `href`. No button draws: a press must go somewhere. */
export const NowhereToGo: Story = {
  name: 'Nowhere to go',
  args: { ...ONE, href: '' },
};

export const specimenHtml = (): string =>
  spec([
    part(sdsCta(TWO)),
    specCap('THE PRESS AND THE SECOND WAY · THE FILL MARKS THE ONE TO TAKE'),
    part(sdsCta(ONE)),
    specCap('ONE PRESS · THE FIRST CHOICE', DIVIDER),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
