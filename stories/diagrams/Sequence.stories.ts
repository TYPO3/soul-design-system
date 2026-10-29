/* Lanes and numbered steps, in phases.

   Time runs down. The stories are a flow that works, a flow with a step
   that fails, and the first flow in the room of a slide. Each story is
   `<sds-diagram>` with its text in `source`, which the controls edit. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { sdsDiagram } from '../lib/diagram.ts';

export const HANDOFF = `sequence
title "The editor previews on another domain"
description "Four lanes: the browser, the backend, the site and the database. Three phases: issue, redeem once, and every request after."

lane browser "Browser"
  person
lane backend "Backend"
  sub "site-a.com/typo3"
lane site "Site"
  sub "site-b.com"
lane db "Database"
  store
host "one installation" backend site db

phase "Issue"
  browser -> backend "View on page 42"
  backend -> db "grant G1 for session S1"
  backend -> browser "302 with a token, valid 30 s"
phase "Redeem once"
  browser -> site "/news?_preview=token"
  site => db "G1 active, token unused: bind"
  site -> browser "302 /news?_ps=code"
phase "Every request after"
  tone ok
  browser -> site "/team?_ps=code"
  site -> site "binding matches"
  site -> browser "page with hidden content"
`;

export const REVOKED = `sequence
  claim error
title "A revoked grant ends the next request"
description "Four lanes. The editor revokes the grant in the backend. The next request of the visitor fails the check, and the site sends the live page."

lane editor "Editor"
  person
lane backend "Backend"
lane visitor "Visitor"
  person
lane site "Site"

phase "Revoke"
  editor -> backend "revoke G1"
  note "Nothing goes to the visitor’s browser."
    over visitor,site
phase "Next request"
  tone error
  visitor -> site "/team?_ps=code"
  site -x backend "G1 active?"
    emphasis
  site -> visitor "the live page"
`;

const meta: Meta<DiagramProps> = {
  title: 'Diagrams/Sequence',
  tags: ['autodocs', '!dev'],
  excludeStories: ['HANDOFF', 'REVOKED'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' }, room: { control: 'text' } },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** Three phases of a handoff. The one step the drawing is about carries the
    emphasis. A step to its own lane is a loop. */
export const Phases: Story = { args: { source: HANDOFF } };

/** A step that fails ends in a cross on the lifeline it does not get past.
    The drawing is about a failure, so the claim is in the error colour. */
export const AFailingStep: Story = {
  name: 'A failing step',
  args: { source: REVOKED },
};

/** The handoff in the room of a slide, at its own pixels. */
export const OnASlide: Story = { name: 'On a slide', args: { source: HANDOFF, room: '1640,760' } };
