/* A form built out of these elements is a form.

   Every component renders into the light DOM, as `createRenderRoot` returns
   the element itself. So the `<input>` a component draws is a real descendant
   of the `<form>` around it and the browser submits it with the rest. That is
   a decision in `lib/element.ts` and not a property of any markup here. Move
   one control behind a shadow root and every form on every consuming site
   loses its answer, in silence. Nothing else in the suite notices. */

import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as contact from '../stories/pages/ContactPage.stories.ts';
import * as inAForm from '../stories/forms/InAForm.stories.ts';
import * as select from '../stories/forms/Select.stories.ts';
import * as checkbox from '../stories/forms/Checkbox.stories.ts';
import { box, mount, q, qa, stories } from './lib/frame.ts';

const Contact = stories(contact);
const Panel = stories(inAForm);
const Select = stories(select);
const Checkbox = stories(checkbox);

/** What the browser sends. Read from the real form, not from properties:
    the question is what leaves the page, not what the elements believe. */
function submitted(): Record<string, string> {
  const form = document.querySelector<HTMLFormElement>('form.sds-form');
  if (!form) throw new Error('the contact page must hold a form');
  return Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));
}

test('every control on the page carries its answer into the form data', async () => {
  await mount(Contact.Page);
  const data = submitted();

  expect(data['release'], 'a select').toBe('13.4');
  expect(data['reply'], 'the chosen radio, by value and not by label').toBe('email');
  expect(data['scope'], 'a ticked box with no value of its own').toBe('on');
  expect(data, 'an unticked box sends nothing at all').not.toHaveProperty('public');
  /* The two fields on this page are placeholders — `value` without `filled` is
     a prompt, which is the field's own rule and deserves an empty submit. */
  expect(data['email'], 'a placeholder is not an answer').toBe('');
  expect(data['message'], 'nor is the one in the textarea').toBe('');
});

test('a choice of another answer is what the form then sends', async () => {
  await mount(Contact.Page);

  await page.getByRole('radio', { name: 'In the repository' }).click();
  await page.getByRole('checkbox', { name: /may be quoted/ }).click();

  const data = submitted();
  expect(data['reply']).toBe('repository');
  expect(data['public']).toBe('on');
});

test('a reset puts back what the markup said, not what was last clicked', async () => {
  await mount(Contact.Page);

  await page.getByRole('radio', { name: 'No reply' }).click();
  await page.getByRole('checkbox', { name: 'Attach the server scope' }).click();
  q<HTMLFormElement>('form.sds-form').reset();

  const data = submitted();
  expect(data['reply'], 'the answer the page came with').toBe('email');
  expect(data['scope'], 'the box the markup ticked').toBe('on');

  /* And the elements agree with the form they sit in. A reset moves the
     controls and fires no change, so a component that only listens for one
     holds an answer the page no longer shows. */
  const held = {
    reply: (q('sds-radio') as HTMLElement & { value: string }).value,
    scope: (q('sds-checkbox[name="scope"]') as HTMLElement & { checked: boolean }).checked,
  };
  expect(held).toEqual({ reply: 'email', scope: true });
});

/* The controls that are not a box you type in, in a form of their own. What
   each one sends, what a reset puts back, and what a `<fieldset disabled>`
   reaches. The last arrives through `formDisabledCallback` and through
   nothing anybody wrote on the controls themselves. */

/** What the page printed after a submit, as a map. */
async function posted(): Promise<Record<string, string>> {
  await page.getByRole('button', { name: 'Send' }).click();
  await expect.poll(() => q('#posted').textContent).toContain('=');
  const text = q('#posted').textContent ?? '';
  return Object.fromEntries(
    text
      .split('\n')
      .filter((line) => line.includes('='))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  );
}

test('every one of them carries its answer into the form data', async () => {
  await mount(Panel.Default);
  const data = await posted();

  expect(data['release'], 'a select').toBe('13.4');
  expect(data['scope'], 'a set of boxes, one ticked').toBe('versions');
  expect(data['digest'], 'a switch that is on, with no value of its own').toBe('on');
  expect(data['per-page'], 'a slider').toBe('30');
});

test('a disabled fieldset reaches the elements inside it', async () => {
  await mount(Panel.Default);

  /* The controls carry no `disabled` of their own — the fieldset does, and the
     platform tells each element about it. */
  await expect.element(q('#ref')).toBeDisabled();
  await expect.element(q('sds-switch[name="private"] input')).toBeDisabled();

  const data = await posted();
  expect(data, 'a disabled control sends nothing').not.toHaveProperty('ref');
  expect(data, 'nor does the switch beside it').not.toHaveProperty('private');
});

test('a reset puts back what the markup said, for all of them', async () => {
  await mount(Panel.Default);

  await page.getByRole('checkbox', { name: 'Reachable sources' }).click();
  await page.getByRole('checkbox', { name: 'Installed versions' }).click();
  await page.getByRole('switch', { name: 'Send me the weekly digest' }).click();
  await page.elementLocator(q('#per-page')).fill('80');
  await userEvent.click(q('#release'));
  await page.getByRole('option', { name: '14.3' }).click();

  await page.getByRole('button', { name: 'Reset' }).click();
  const data = await posted();

  expect(data['scope'], 'the box the markup ticked').toBe('versions');
  expect(data['digest'], 'the switch the markup turned on').toBe('on');
  expect(data['per-page'], 'where the markup put the thumb').toBe('30');
  expect(data['release'], 'the answer the page came with').toBe('13.4');

  /* And the elements agree with the form they sit in. A reset moves the
     controls and fires no change, so an element that only listens for one
     holds an answer the page no longer shows. */
  const held = {
    scope: (q('sds-checkbox-group') as HTMLElement & { values: string[] }).values,
    digest: (q('sds-switch[name="digest"]') as HTMLElement & { checked: boolean }).checked,
    perPage: (q('sds-range') as HTMLElement & { value: string }).value,
  };
  expect(held).toEqual({ scope: ['versions'], digest: true, perPage: '30' });
});

/* An error the caller wrote is a validity the browser holds, not a colour a
   reader has to notice. The element is form-associated, so the browser blocks
   the send and reports on the box rather than passes in silence. */
test('a control the caller marked wrong will not let the form go', async () => {
  await mount(Select.Invalid);

  const control = q('sds-select') as HTMLElement & { checkValidity(): boolean; reportValidity(): boolean; validationMessage: string; validity: ValidityState; willValidate: boolean };
  expect(control.checkValidity(), 'a select carrying an error is invalid').toBe(false);
  expect(control.reportValidity(), 'and a report says the same').toBe(false);
  expect(control.validity.customError).toBe(true);
  expect(control.willValidate).toBe(true);
  expect(control.validationMessage).toContain('Say which release');
});

/* What the platform lets a caller ask a control: the form it answers to.
   It comes through the internals, and it is what a script that reads a
   form reaches for. The label points at the control the element draws,
   so the element's own list of labels is empty on purpose. */
test('a control knows its form, the way a native one does', async () => {
  await mount(Panel.Default);
  const form = q<HTMLFormElement>('form');
  const control = q('sds-select') as HTMLElement & { form: HTMLFormElement | null; labels: NodeList | undefined };
  expect(control.form, 'the form it stands in').toBe(form);
  expect([...(control.labels ?? [])]).toEqual([]);
  expect(q<HTMLLabelElement>('label[for="release"]').control, 'the label reaches the control it draws').toBe(q('#release'));
});

/* A set whose question the page already asks. The legend stays. It is what
   names the group, and an empty one leaves a `<fieldset>` announced as a group
   with no name. So it speaks and does not draw instead. What this holds is
   that both halves are true at once: still named, and not on the page twice. */
test('a set can say its question without drawing it', async () => {
  await mount(Checkbox.GroupQuestionAbove);

  const set = q('fieldset.sds-choices');
  await expect.element(set, { message: 'the set still takes its name from its own legend' })
    .toHaveAccessibleName('What can we attach to the report?');

  /* Drawn once. The heading above it is what a reader sees; the legend takes
     no room, so the first answer stands where the heading leaves it. */
  const legend = q('legend', set);
  const r = box(legend);
  expect(getComputedStyle(legend).display, 'a legend a reader hears cannot be display:none').not.toBe('none');
  expect(r.width, 'and takes no width').toBeLessThanOrEqual(1);
  expect(r.height, 'and no height').toBeLessThanOrEqual(1);

  const first = box(qa('.sds-check', set)[0] as HTMLElement).top;
  expect(first - box(set).top, 'and leaves no gap where it stood').toBeLessThan(4);
});
