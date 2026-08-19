/* Every control at once, inside a real `<form>`.

   The other stories show one control and what it looks like. This one is the
   question a page has before it ships any of them: what does the form actually
   send, what does a reset put back, and what happens to everything inside a
   `<fieldset disabled>`. None of the three shows in a screenshot, and all three
   are what `ElementInternals` buys — so the suite drives this page.

   Press Send and the page prints what the browser would have posted. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/checkbox-group.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/file.ts';
import '../../packages/frontend/src/components/range.ts';
import '../../packages/frontend/src/components/select.ts';
import '../../packages/frontend/src/components/switch.ts';

/** What the browser would post, read off the form itself — not off what the
    elements believe. A control that holds the right value and sends nothing is
    the failure this page exists to make visible. */
function posted(form: HTMLFormElement): string {
  const pairs = [...new FormData(form).entries()].map(([k, v]) => `${k}=${v instanceof File ? v.name || '(none)' : v}`);
  return pairs.length ? pairs.join('\n') : 'the form would send nothing';
}

function panel(onSubmit: (form: HTMLFormElement) => void, sent: string): TemplateResult {
  return html`<form
  class="sds-form"
  @submit="${(e: Event) => {
    e.preventDefault();
    onSubmit(e.target as HTMLFormElement);
  }}"
>
  <sds-select
    caption="Which release is this about?"
    field-id="release"
    name="release"
    value="13.4"
    filled
    .options="${[
      { label: '14.3', group: 'Supported' },
      { label: '13.4', group: 'Supported' },
      { label: '11.5', group: 'Out of support', disabled: true },
    ]}"
  ></sds-select>

  <sds-checkbox-group
    legend="What may we attach?"
    name="scope"
    .values="${['versions']}"
    .choices="${[
      { label: 'Installed versions', value: 'versions' },
      { label: 'Reachable sources', value: 'sources' },
    ]}"
  ></sds-checkbox-group>

  <sds-switch name="digest" label="Send me the weekly digest" checked></sds-switch>

  <sds-range
    caption="Results per page"
    field-id="per-page"
    name="per-page"
    min="10"
    max="100"
    step="10"
    value="30"
  ></sds-range>

  <sds-file caption="Attach a screenshot" field-id="shot" name="shot" accept="image/*"></sds-file>

  <fieldset class="sds-choices" disabled>
    <legend class="sds-field-label">Not while the project is public</legend>
    <sds-field caption="Internal reference" field-id="ref" name="ref" value="RPT-0000" filled></sds-field>
    <sds-switch name="private" label="Keep the report private"></sds-switch>
  </fieldset>

  <div class="sds-actions">
    <sds-button variant="primary" type="submit">Send</sds-button>
    <sds-button variant="secondary" type="reset">Reset</sds-button>
  </div>

  <pre class="sds-mono" id="posted">${sent}</pre>
</form>`;
}

const meta: Meta = {
  title: 'Forms/In a form',
};

export default meta;
type Story = StoryObj;

/** Change anything, press Send, and read what would have gone. Then press
    Reset: every control goes back to what the *markup* said, not to what was
    last clicked. The fieldset at the bottom is disabled, and nothing under it
    is sent — that reaches the elements through `formDisabledCallback` rather
    than through an attribute somebody wrote on each one. */
export const Default: Story = {
  name: 'In a form',
  render: () => {
    const host = document.createElement('div');
    const draw = (sent: string): void => {
      render(panel((form) => draw(posted(form)), sent), host);
    };
    draw('nothing sent yet');
    return html`${host}`;
  },
};
