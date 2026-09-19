/* Work in progress, which is the one component here that changes while
   somebody watches it.

   None of what this holds shows in a screenshot, which is why the card cannot
   carry it. Which rows are a control and which are not. The name of a state
   for a reader who hears rather than sees. And a fold that has to survive
   the work as it moves on. The run redraws itself every time a stop changes,
   and a row the reader opened by hand must not close under them. */

import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as run from '../stories/components/Run.stories.ts';
import * as checks from '../stories/components/RunChecks.stories.ts';
import { mount, q, qa, shown, stories } from './lib/frame.ts';

const Run = stories(run);
const Checks = stories(checks);

/** The step whose label this is, whole and not a part of a longer one. */
const row = (label: string): HTMLElement => {
  const found = qa('.sds-run__step').find((step) =>
    [...step.querySelectorAll('*')].some((el) => el.childElementCount === 0 && el.textContent?.trim() === label));
  if (!found) throw new Error(`no step carries the label ${label}`);
  return found;
};

test('a stop that wrote nothing is not a control, and one that did is', async () => {
  await mount(Run.Default);

  /* The stop in hand wrote something: it opens, and it stands open because the
     work is there now. */
  const building = row('Build the index');
  expect(qa('details', building)).toHaveLength(1);
  expect(q('details', building).hasAttribute('open')).toBe(true);

  /* One that is behind us wrote something too, and stands closed. What a
     reader wants from a finished step is that it finished. */
  expect(qa('details[open]', row('Fetch the sitemap'))).toHaveLength(0);

  /* And a stop the work has not reached has nothing to show, so it offers
     nothing: no fold, no chevron, no press. */
  const ahead = row('Swap it in');
  expect(qa('details', ahead), 'a stop with no output is no fold').toHaveLength(0);
  expect(qa('.sds-run__chevron', ahead), 'and draws no chevron').toHaveLength(0);
});

test('every state has words, not only a mark', async () => {
  await mount(Run.Default);

  /* The mark is a shape and a colour and neither is a sentence. What a reader
     who hears rather than sees gets is the row's own name. */
  for (const [label, said] of [
    ['Fetch the sitemap', 'Done'],
    ['Build the index', 'Running'],
    ['Swap it in', 'Not started'],
  ] as const) {
    expect(q('.sds-run__row', row(label)).getAttribute('aria-label'), `${label} must say it is ${said}`).toMatch(new RegExp(said));
  }

  /* And the whole says what became of it, beside the heading. */
  expect(q('.sds-run__verdict sds-icon').getAttribute('label')).toBe('Running');
});

test("the words for a state are the page's", async () => {
  await mount(Run.Default);

  /* The one thing in a run this element writes rather than gets. A page that
     is not in English draws its own labels and otherwise announces somebody
     else's. So the words come from the page, and the states it did not name
     keep the English they had. */
  (q('sds-run') as HTMLElement & { stateWords: unknown }).stateWords = { running: 'Läuft', done: 'Fertig' };

  await expect.element(q('.sds-run__row', row('Fetch the sitemap'))).toHaveAttribute('aria-label', expect.stringMatching(/Fertig/));
  await expect.element(q('.sds-run__row', row('Build the index'))).toHaveAttribute('aria-label', expect.stringMatching(/Läuft/));
  await expect.element(q('.sds-run__row', row('Swap it in')), { message: 'a state the page named nothing for keeps the word it had' })
    .toHaveAttribute('aria-label', expect.stringMatching(/Not started/));

  /* The verdict is a state too, and it reads the same words. */
  await expect.element(q('.sds-run__verdict sds-icon')).toHaveAttribute('label', 'Läuft');
});

test('a row the reader closed stays closed while the run redraws', async () => {
  await mount(Run.Default);

  const building = q<HTMLDetailsElement>('details', row('Build the index'));
  expect(building.hasAttribute('open')).toBe(true);
  await userEvent.click(q('.sds-run__row', row('Build the index')));
  await expect.element(building, { message: 'the press is the reader’s answer' }).not.toHaveAttribute('open');

  /* Now the work moves on. The element renders again from the new steps, and
     the row the reader shut must not reopen under them. */
  const el = q('sds-run') as HTMLElement & { steps: readonly Record<string, unknown>[]; updateComplete: Promise<unknown> };
  el.steps = el.steps.map((step) =>
    step['label'] === 'Build the index' ? { ...step, state: 'done', meta: '31s' } : step);
  await el.updateComplete;

  expect(q<HTMLDetailsElement>('details', row('Build the index')).hasAttribute('open'), 'and it survives the work moving on').toBe(false);
});

test('many jobs at once sort by state, and each group folds', async () => {
  await mount(Checks.Default);

  const groups = qa<HTMLDetailsElement>('.sds-run__group');
  expect(groups).toHaveLength(3);
  /* The name carries the count, because a group folded away has to say what is
     inside it. */
  expect(q('.sds-run__group-head', groups[0]).textContent).toContain('2 queued');

  await userEvent.click(q('.sds-run__group-head', groups[0]));
  await expect.element(groups[0] as HTMLElement).not.toHaveAttribute('open');
  expect(groups[1]?.hasAttribute('open'), 'and a fold of one leaves the others alone').toBe(true);

  /* A queue is a mark apart from work in hand and a whole answer apart, so the
     row says which it is in words. */
  expect(q('.sds-run__said', row('Build PHP (8.4)')).textContent?.trim()).toBe('In the queue for this check');
});

test('a run nobody watches is the head and nothing else', async () => {
  await mount(Checks.Settled);

  /* `open` stands where a reader watches a run. Absent, the head is the
     whole of it — which is the shape a past run takes in a list of them. */
  expect(q('.sds-run').hasAttribute('open')).toBe(false);
  expect(shown(q('.sds-run__step'))).toBe(false);
  expect(q('.sds-run__head').textContent).toContain('All checks have passed');
});
