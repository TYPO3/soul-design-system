/* The clipboard, for the two elements that write to it.

   A block and a single value are two shapes of the same gesture. What they
   must agree on is here: how long the button says it worked, and how the value
   gets there. Kept apart from either element, because two lengths of "copied"
   is a difference nobody ever hears about. */

/** How long a button says it worked, in milliseconds. Long enough for a
    reader who looked somewhere else when they pressed. */
export const SAID = 1600;

/**
 * Write, and say if it happened.
 *
 * Two ways, because one of them is not always there. `navigator.clipboard`
 * exists only in a secure context. A reader opens a design system over http
 * on a LAN address or a `.test` domain as often as on localhost. A
 * button drawn only where it exists left no button on exactly the surfaces
 * a review happens on.
 */
export async function toClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* Denied, or refused in this context. The other way can still work. */
    }
  }
  return selected(text);
}

/* The older way, which every browser has and no context withholds: a box off
   the page, selected, copied and taken away again. Not hidden — a selection
   skips `display: none` and `hidden`. The focus goes back where it was, or
   the press moves the reader somewhere they did not ask to be. */
function selected(text: string): boolean {
  if (typeof document === 'undefined') return false;
  const box = document.createElement('textarea');
  box.value = text;
  box.setAttribute('readonly', '');
  box.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0';
  document.body.append(box);
  const was = document.activeElement;
  box.select();
  let done = false;
  try {
    done = document.execCommand('copy');
  } catch {
    done = false;
  }
  box.remove();
  if (was instanceof HTMLElement) was.focus();
  return done;
}
