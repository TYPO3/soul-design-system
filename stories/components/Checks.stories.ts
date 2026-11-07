/* A list whose items each carry a check. The element is `sds-checks`, and the
   glyph is `actions-check` of the icon set. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/checks.ts';

const ITEMS = html`<ul>
  <li><strong>Faster integrations:</strong> The API gives access to records and files.</li>
  <li><strong>One overview:</strong> One module shows all applications with access.</li>
  <li><strong>Known standards:</strong> The API uses OAuth 2.0, OpenAPI and JSON Schema. A longer item wraps, and its second line stands under the first and not under the check.</li>
</ul>`;

const meta: Meta = { title: 'Components/Content/Checks', tags: ['autodocs', '!dev'] };

export default meta;
type Story = StoryObj;

/** In the ink of the text. */
export const Default: Story = { render: () => html`<sds-checks>${ITEMS}</sds-checks>` };

/** In the status green, for what a reader gets. */
export const Ok: Story = { render: () => html`<sds-checks tone="ok">${ITEMS}</sds-checks>` };

/** A list inside an item keeps its own mark. */
export const Nested: Story = {
  render: () => html`<sds-checks><ul><li>Records<ul><li>Pages</li><li>Content</li></ul></li></ul></sds-checks>`,
};
