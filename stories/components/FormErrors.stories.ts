/* What stopped the form, at the top of it.

   The markup lives in `src/components/form-errors.ts`. No `parameters.dsCard`:
   the box is `sds-note`, which has a card already, and what this adds is
   behaviour a still picture cannot hold — the focus is sent here after a
   failed submit, and each entry is a link to the field it is about.

   `Pages/Contact` shows it doing that. What is here is the shape at one, at
   several, and at none. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/form-errors.ts';
import { type FormErrorsProps } from '../../packages/frontend/src/components/form-errors.ts';

const sdsFormErrors = ({ errors, heading }: FormErrorsProps) =>
  html`<sds-form-errors .errors="${errors}" heading="${heading ?? ''}"></sds-form-errors>`;

const meta: Meta<FormErrorsProps> = {
  title: 'Components/Form errors',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsFormErrors(args),
  argTypes: { heading: { control: 'text' } },
  args: {
    errors: [
      { message: 'An email address is needed for a reply by email', for: 'email' },
      { message: 'Say which release the question is about', for: 'release' },
      { message: 'The message is empty', for: 'message' },
    ],
  },
};

export default meta;
type Story = StoryObj<FormErrorsProps>;

/** Three failures, each a link to the field it is about — so pressing one
    moves the focus to the control rather than to a heading near it. */
export const Default: Story = {};

/** One. The heading counts what it found rather than saying "there were
    errors", which is the sentence that tells a reader nothing. */
export const Single: Story = {
  args: { errors: [{ message: 'The message is empty', for: 'message' }] },
};

/** What the form calls itself, where "3 answers need changing" is not specific
    enough to act on. */
export const Named: Story = {
  args: { heading: 'The report was not sent — three answers need changing' },
};

/** None. It renders nothing at all: an empty error box above a form is a form
    that looks broken before it has been filled in. */
export const Empty: Story = { args: { errors: [] } };
