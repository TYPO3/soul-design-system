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
