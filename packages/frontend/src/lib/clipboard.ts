/* Putting something on the clipboard, for the two elements that do it.

   A block and a single value are two shapes of the same gesture, and what they
   must agree on is here: how long the button says it worked, and how the value
   gets there. Kept apart from either element, because one of them saying
   "copied" for a different length of time than the other is a difference
   nobody would ever be told about. */

/** How long a button says it worked, in milliseconds. Long enough to be read
    where a reader was looking somewhere else when they pressed. */
export const SAID = 1600;

/**
 * Write, and say whether it happened.
 *
 * Two ways, because one of them is not always there: `navigator.clipboard`
 * exists only in a secure context, and a design system is looked at over http
 * on a LAN address or a `.test` domain as often as on localhost. Asking whether
 * it exists and drawing no button when it does not is what this used to do —
 * which left no icon, no press and no hover on exactly the surfaces it is
 * reviewed on, and looked like the component was broken.
 */
export async function toClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* Denied, or refused in this context. The other way may still work. */
    }
  }
  return selected(text);
}

/* The older way, which every browser has and no context withholds: a box off
   the page, selected, copied and taken away again. Not hidden — `display: none`
   and `hidden` cannot be selected — and the focus goes back where it was, or
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
