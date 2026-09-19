/* sds-dialog — the question, and the answer coming back.

   A confirmation is the platform's own: the pair is a `<form method="dialog">`,
   so a press on one closes the dialog and records which. That buys a question
   written entirely in markup. It holds only as long as the two events say
   which press it was, at a second open included. A `returnValue` left in
   place there makes the dialog answer with the last reader's press.

   The size scale measures beside it because a cap is only a cap if something
   gives: the body is what scrolls. And the head measures in every surface
   that draws one. It is `sds-modal`'s node in a `<dialog>` and in a lightbox.
   The lightbox is where a set read off the wrong ancestor showed up as a
   close button in the corner of the border. */

import { beforeEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { box, q, qa, shown, write } from './lib/frame.ts';

const LONG = 'Every size stops somewhere, and this is what it stops. '.repeat(40);

/* A heading nobody shortened, and a word nothing can break. The two ways a
   title takes the whole row and pushes what is beside it out of the box. */
const WIDE = 'Publish the task skills into the workspace and record the setup?';
const UNBREAKABLE = 'Reindexierungsauftragsbestaetigungsbenachrichtigungsdienst';

/* A drawing that needs no server. The lightbox is here for its head, which is
   the modal's, and the stage under it only has to have something in it. */
const DRAWING =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 3%22%3E%3C/svg%3E';

const PAGE = `
  <sds-button id="open" for="confirm" variant="secondary">Remove the token…</sds-button>
  <sds-dialog id="confirm" heading="Remove this token?"
    body="Anything using it stops answering immediately."
    confirm-label="Remove" confirm-icon="actions-delete"
    cancel-label="Keep it" tone="danger"></sds-dialog>

  <sds-button id="open-long" for="long" variant="secondary">A long one…</sds-button>
  <sds-dialog id="long" heading="A great deal to read" body="${LONG}"
    confirm-label="Got it"></sds-dialog>

  <sds-dialog id="wide" heading="${WIDE}" body="Nothing else is touched."
    confirm-label="Publish"></sds-dialog>
  <sds-dialog id="word" heading="${UNBREAKABLE}" body="Nothing else is touched."
    confirm-label="Publish"></sds-dialog>
  <sds-lightbox id="drawing" src="${DRAWING}" alt="A drawing"
    caption="A drawing at its own size"></sds-lightbox>
  <sds-button id="open-drawing" for="drawing" variant="secondary">See the drawing</sds-button>`;

let heard: string[] = [];
for (const name of ['sds-dialog-confirm', 'sds-dialog-cancel']) {
  document.addEventListener(name, (event) => {
    heard.push(`${event.type}:${(event.target as HTMLElement).id}`);
  });
}

beforeEach(async () => {
  heard = [];
  await write(PAGE);
});

const surface = (id: string): HTMLDialogElement => q(`#${id} dialog.sds-modal`);
const foot = (id: string): HTMLElement[] => qa(`#${id} .sds-modal__foot button`);
const opener = (id: string): HTMLElement => q(`#${id} button`);

test('a button that names the dialog opens it, and the pair is the labels', async () => {
  expect(shown(surface('confirm'))).toBe(false);
  await userEvent.click(opener('open'));
  await expect.element(surface('confirm')).toBeVisible();

  /* The way out first and the press with no way back last. That is the order
     the rest of the system reads in. It is also the reason the tone is on the
     second button rather than in the heading. */
  const buttons = foot('confirm');
  expect(buttons).toHaveLength(2);
  expect(buttons[0]?.textContent?.trim()).toBe('Keep it');
  expect(buttons[0]?.className).toMatch(/sds-btn--ghost/);
  expect(buttons[1]?.textContent?.trim()).toBe('Remove');
  expect(buttons[1]?.className).toMatch(/sds-btn--danger/);
  /* The glyph leads, and is a sibling of the label rather than inside it —
     the row's gap is what sets the two apart. */
  expect(buttons[1]?.firstElementChild?.tagName.toLowerCase()).toBe('sds-icon');
});

test('the confirming press is the one that says so', async () => {
  await userEvent.click(opener('open'));
  await userEvent.click(foot('confirm')[1] as HTMLElement);
  await expect.element(surface('confirm')).not.toBeVisible();
  await expect.poll(() => heard).toEqual(['sds-dialog-confirm:confirm']);
});

/* A question dismissed is an answer a caller has to act on, so all three of
   these are one event rather than silence. */
test('the cancel button, the header X and Escape are all a cancel', async () => {
  await userEvent.click(opener('open'));
  await userEvent.click(foot('confirm')[0] as HTMLElement);
  await expect.element(surface('confirm')).not.toBeVisible();

  await userEvent.click(opener('open'));
  await userEvent.click(q('#confirm .sds-modal__head .sds-btn--icon'));
  await expect.element(surface('confirm')).not.toBeVisible();

  await userEvent.click(opener('open'));
  await expect.element(surface('confirm')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await expect.element(surface('confirm')).not.toBeVisible();

  /* Polled, not read once. The element speaks on the platform's `close`,
     which comes in a task of its own after the box has gone. */
  await expect.poll(() => heard).toEqual([
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
  ]);
});

/* `returnValue` outlives a close. Left in place, whoever pressed the first
   question answers the second. */
test('an answered question does not answer the next one', async () => {
  await userEvent.click(opener('open'));
  await userEvent.click(foot('confirm')[1] as HTMLElement);
  await expect.element(surface('confirm')).not.toBeVisible();

  await userEvent.click(opener('open'));
  await expect.element(surface('confirm')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await expect.element(surface('confirm')).not.toBeVisible();

  await expect.poll(() => heard).toEqual(['sds-dialog-confirm:confirm', 'sds-dialog-cancel:confirm']);
});

test('ask() settles on the press', async () => {
  const answer = (q('#confirm') as HTMLElement & { ask(): Promise<boolean> }).ask();
  await expect.element(surface('confirm')).toBeVisible();
  await userEvent.click(foot('confirm')[1] as HTMLElement);
  expect(await answer).toBe(true);
});

/* Both directions of one size: the width it takes, and the height it stops at.
   Past that the head and the foot stay where they are and the body is the
   part that gives. */
test('a size is a width and a height, and the body is what scrolls', async () => {
  await userEvent.click(opener('open-long'));
  await expect.element(surface('long')).toBeVisible();

  const shape = box(surface('long'));
  expect(Math.round(shape.width)).toBe(360);
  expect(shape.height).toBeLessThanOrEqual(window.innerHeight * 0.5 + 1);

  const body = q('#long .sds-modal__body');
  expect(body.scrollHeight > body.clientHeight + 1).toBe(true);
});

/* The head is one row in three surfaces. Every value it draws with once came
   off `.sds-modal`, which a lightbox is not. So its whole set arrived as
   nothing: no padding, no rule, and the close button against the corner. */
test('the head places its title and its close alike in every surface', async () => {
  const heads: Record<string, unknown>[] = [];
  for (const id of ['confirm', 'wide', 'word', 'drawing']) {
    const root = q(`#${id}`) as HTMLElement & { show(): void; close(): void };
    root.show();
    await expect.element(q(`#${id} dialog .sds-modal__head`)).toBeVisible();
    const frame = box(q('dialog', root));
    const title = box(q('.sds-modal__title', root));
    const close = box(q('.sds-modal__close', root));
    const glyph = box(q('.sds-modal__close svg', root));
    heads.push({
      /* The title starts where the mark ends. A square around a glyph reaches
         the padding edge. The head gives that half back, so the two marks
         stand the same distance from their own edges. */
      titleInset: Math.round(title.left - frame.left),
      glyphInset: Math.round(frame.right - glyph.right),
      /* Never squeezed into a rectangle, and never pushed past the border. */
      close: `${Math.round(close.width)}x${Math.round(close.height)}`,
      clear: close.right <= frame.right && close.left > title.right,
    });
    root.close();
  }

  const first = heads[0] as Record<string, unknown>;
  expect(first).toMatchObject({ close: '28x28', clear: true });
  expect(first['titleInset']).toBe(first['glyphInset']);
  for (const head of heads.slice(1)) expect(head).toEqual(first);
});

/* Both strips are a row of controls, and the foot's are the taller. So the
   head gets that band as a floor rather than the height its own smaller
   button happens to make. Unequal, the body sits in a lopsided sandwich. */
test('the head and the foot are the same band', async () => {
  await userEvent.click(opener('open'));
  await expect.element(surface('confirm')).toBeVisible();
  const above = box(q('#confirm .sds-modal__head'));
  const below = box(q('#confirm .sds-modal__foot'));
  expect(Math.round(above.height)).toBe(Math.round(below.height));
});

/* A drawing opens from markup. A button names the viewer by id and sends
   the command, and the viewer listens to itself: show, toggle, close. So a
   page wires the two ends with no script that has to find them. Open, the
   viewer is modal and the page behind it inert, so the commands that close
   it arrive as the event a button sends. */
test('a button that names the drawing opens it, and a command closes it', async () => {
  const viewer = q<HTMLDialogElement>('#drawing dialog');
  const command = (name: string): boolean =>
    q('#drawing').dispatchEvent(new CustomEvent('sds-command', { detail: { command: name }, bubbles: true }));
  expect(shown(viewer)).toBe(false);

  await userEvent.click(opener('open-drawing'));
  await expect.element(viewer).toBeVisible();
  expect(viewer.getAttribute('aria-label'), 'named by its caption').toBe('A drawing at its own size');

  command('close');
  await expect.element(viewer).not.toBeVisible();

  command('toggle');
  await expect.element(viewer).toBeVisible();
  command('toggle');
  await expect.element(viewer).not.toBeVisible();
});
