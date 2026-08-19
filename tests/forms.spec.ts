/* A form built out of these elements is a form.

   Every component renders into the light DOM — `createRenderRoot` returns the
   element itself — so the `<input>` a component draws is a real descendant of
   the `<form>` around it and the browser submits it with the rest. That is a
   decision in `lib/element.ts` and not a property of any markup here: move one
   control behind a shadow root and every form on every consuming site stops
   carrying its answer, silently, with nothing else in the suite noticing. */

import { test, expect } from '@playwright/test';

import { gotoStory } from './lib/story.ts';

const CONTACT = 'pages-contact--page';

/** What the browser would send. Read from the real form, not from properties:
    the question is what leaves the page, not what the elements believe. */
async function submitted(page: import('@playwright/test').Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const form = document.querySelector('form.sds-form') as HTMLFormElement | null;
    if (!form) throw new Error('the contact page should hold a form');
    return Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));
  });
}

test('every control on the page carries its answer into the form data', async ({ page }) => {
  await gotoStory(page, CONTACT);
  const data = await submitted(page);

  expect(data['release'], 'a select').toBe('13.4');
  expect(data['reply'], 'the chosen radio, by value and not by label').toBe('email');
  expect(data['scope'], 'a ticked box with no value of its own').toBe('on');
  expect(data, 'an unticked box sends nothing at all').not.toHaveProperty('public');
  /* The two fields on this page are placeholders — `value` without `filled` is
     a prompt, which is the field's own rule and is worth submitting nothing. */
  expect(data['email'], 'a placeholder is not an answer').toBe('');
  expect(data['message'], 'nor is the one in the textarea').toBe('');
});

test('choosing another answer is what the form then sends', async ({ page }) => {
  await gotoStory(page, CONTACT);

  await page.getByRole('radio', { name: 'In the repository' }).check();
  await page.getByRole('checkbox', { name: /may be quoted/ }).check();

  const data = await submitted(page);
  expect(data['reply']).toBe('repository');
  expect(data['public']).toBe('on');
});

test('a reset puts back what the markup said, not what was last clicked', async ({ page }) => {
  await gotoStory(page, CONTACT);

  await page.getByRole('radio', { name: 'No reply' }).check();
  await page.getByRole('checkbox', { name: 'Attach the server scope' }).uncheck();
  await page.evaluate(() => (document.querySelector('form.sds-form') as HTMLFormElement).reset());

  const data = await submitted(page);
  expect(data['reply'], 'the answer the page was drawn with').toBe('email');
  expect(data['scope'], 'the box the markup ticked').toBe('on');

  /* And the elements agree with the form they sit in. A reset moves the
     controls without firing a change, so a component that only listens for
     one holds an answer the page no longer shows. */
  const held = await page.evaluate(() => ({
    reply: (document.querySelector('sds-radio') as HTMLElement & { value: string }).value,
    scope: (document.querySelector('sds-checkbox[name="scope"]') as HTMLElement & { checked: boolean }).checked,
  }));
  expect(held).toEqual({ reply: 'email', scope: true });
});

/* The controls that are not a box you type in, in a form of their own. What
   each one sends, what a reset puts back, and what a `<fieldset disabled>`
   reaches — the last of which arrives through `formDisabledCallback` and
   through nothing anybody wrote on the controls themselves. */

const PANEL = 'forms-in-a-form--default';

/** What the page printed after a submit, as a map. */
async function posted(page: import('@playwright/test').Page): Promise<Record<string, string>> {
  await page.getByRole('button', { name: 'Send' }).click();
  const text = (await page.locator('#posted').textContent()) ?? '';
  return Object.fromEntries(
    text
      .split('\n')
      .filter((line) => line.includes('='))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  );
}

test('every one of them carries its answer into the form data', async ({ page }) => {
  await gotoStory(page, PANEL);
  const data = await posted(page);

  expect(data['release'], 'a select').toBe('13.4');
  expect(data['scope'], 'a set of boxes, one ticked').toBe('versions');
  expect(data['digest'], 'a switch that is on, with no value of its own').toBe('on');
  expect(data['per-page'], 'a slider').toBe('30');
});

test('a disabled fieldset reaches the elements inside it', async ({ page }) => {
  await gotoStory(page, PANEL);

  /* The controls carry no `disabled` of their own — the fieldset does, and the
     platform tells each element about it. */
  await expect(page.locator('#ref')).toBeDisabled();
  await expect(page.locator('sds-switch[name="private"] input')).toBeDisabled();

  const data = await posted(page);
  expect(data, 'a disabled control sends nothing').not.toHaveProperty('ref');
  expect(data, 'nor does the switch beside it').not.toHaveProperty('private');
});

test('a reset puts back what the markup said, for all of them', async ({ page }) => {
  await gotoStory(page, PANEL);

  await page.getByRole('checkbox', { name: 'Reachable sources' }).check();
  await page.getByRole('checkbox', { name: 'Installed versions' }).uncheck();
  await page.getByRole('switch', { name: 'Send me the weekly digest' }).uncheck();
  await page.locator('#per-page').fill('80');
  await page.locator('#release').click();
  await page.getByRole('option', { name: '14.3' }).click();

  await page.getByRole('button', { name: 'Reset' }).click();
  const data = await posted(page);

  expect(data['scope'], 'the box the markup ticked').toBe('versions');
  expect(data['digest'], 'the switch the markup turned on').toBe('on');
  expect(data['per-page'], 'where the markup put the thumb').toBe('30');
  expect(data['release'], 'the answer the page was drawn with').toBe('13.4');

  /* And the elements agree with the form they sit in: a reset moves the
     controls without firing a change, so an element that only listens for one
     holds an answer the page no longer shows. */
  const held = await page.evaluate(() => ({
    scope: (document.querySelector('sds-checkbox-group') as HTMLElement & { values: string[] }).values,
    digest: (document.querySelector('sds-switch[name="digest"]') as HTMLElement & { checked: boolean }).checked,
    perPage: (document.querySelector('sds-range') as HTMLElement & { value: string }).value,
  }));
  expect(held).toEqual({ scope: ['versions'], digest: true, perPage: '30' });
});

/* An error the caller wrote is a validity the browser holds, not a colour a
   reader has to notice: the element is form-associated, so the send is blocked
   and reported on the box rather than passing silently. */
test('a control the caller marked wrong will not let the form go', async ({ page }) => {
  await gotoStory(page, 'forms-select--invalid');

  const blocked = await page.evaluate(() => {
    const select = document.querySelector('sds-select') as HTMLElement & { checkValidity(): boolean };
    return { valid: select.checkValidity(), said: (select as unknown as { validationMessage: string }).validationMessage };
  });
  expect(blocked.valid, 'a select carrying an error is invalid').toBe(false);
  expect(blocked.said).toContain('Say which release');
});
