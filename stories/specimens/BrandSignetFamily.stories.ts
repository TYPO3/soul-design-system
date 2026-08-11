/* The family: three marks, one construction.

   The system's own mark and the two product marks beside it, so the
   construction is read as a family rather than as a logo. Each ships three
   files, which the card shows, because a mark that exists in one size is a
   mark that will be scaled. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec" style="--spec-gap:20px">

  <div class="sds-note sds-note--info">
    <span class="sds-note__icon"><svg class="sds-icon" viewBox="0 0 16 16"><g fill="currentColor"><path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"></path><path d="M7,4.999999C7,4.4477148,7.4477148,4,7.999999,4H8.000001C8.5522852,4,9,4.4477148,9,4.999999V5.000001C9,5.5522852,8.5522852,6,8.000001,6H7.999999C7.4477148,6,7,5.5522852,7,5.000001V4.999999z"></path><path d="M7,7.999999C7,7.4477148,7.4477148,7,7.999999,7H8.000001C8.5522852,7,9,7.4477148,9,7.999999v3.0000019C9,11.5522852,8.5522852,12,8.000001,12H7.999999C7.4477148,12,7,11.5522852,7,11.000001V7.999999z"></path></g></svg></span>
    <div>
      <div class="sds-note__title">What is shared is the construction, not the drawing</div>
      <div class="sds-note__body">
        Every mark is a 128&#8239;&#215;&#8239;100 box, outer corners at radius 20, rounding
        half the stroke, gap never less than the stroke, and orange used exactly
        once &#8212; in the top-right corner. Everything else belongs to the product.
        Each ships three files, redrawn per optical size and never scaled.
      </div>
    </div>
  </div>

  <div style="display:flex; align-items:center; gap:28px;">
    <svg class="sds-signet" width="96" height="76.8" aria-hidden="true"><use href="../assets/design-system-signet-l.svg#art"></use></svg>
    <div style="display:flex; flex-direction:column; gap:6px; width:186px; flex:none;">
      <div class="spec-cap">SOUL DESIGN SYSTEM</div>
      <div class="spec-note">Crop marks around three unequal parts. The one mark with no window &#8212; it is the frame, not a product.</div>
    </div>
    <div style="display:flex; align-items:flex-end; gap:18px; flex:none;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="32" height="25.6" aria-hidden="true"><use href="../assets/design-system-signet-l.svg#art"></use></svg><span class="spec-cap">L</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="24" height="19.2" aria-hidden="true"><use href="../assets/design-system-signet-m.svg#art"></use></svg><span class="spec-cap">M</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="16" height="16" aria-hidden="true"><use href="../assets/design-system-signet-s.svg#art"></use></svg><span class="spec-cap">S</span></div>
    </div>
    <div class="sds-mono" style="font-size:10px; color:var(--text-muted); line-height:1.7;">design-system-<br />signet-l.svg<br />-m.svg &#183; -s.svg</div>
  </div>

  <div style="display:flex; align-items:center; gap:28px;">
    <svg class="sds-signet" width="96" height="76.8" aria-hidden="true"><use href="../assets/dev-companion-signet-l.svg#art"></use></svg>
    <div style="display:flex; flex-direction:column; gap:6px; width:186px; flex:none;">
      <div class="spec-cap">DEV COMPANION</div>
      <div class="spec-note">A terminal frame holding a session that ends in one answer.</div>
    </div>
    <div style="display:flex; align-items:flex-end; gap:18px; flex:none;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="32" height="25.6" aria-hidden="true"><use href="../assets/dev-companion-signet-l.svg#art"></use></svg><span class="spec-cap">L</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="24" height="19.2" aria-hidden="true"><use href="../assets/dev-companion-signet-m.svg#art"></use></svg><span class="spec-cap">M</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="16" height="16" aria-hidden="true"><use href="../assets/dev-companion-signet-s.svg#art"></use></svg><span class="spec-cap">S</span></div>
    </div>
    <div class="sds-mono" style="font-size:10px; color:var(--text-muted); line-height:1.7;">dev-companion-<br />signet-l.svg<br />-m.svg &#183; -s.svg</div>
  </div>

  <div style="display:flex; align-items:center; gap:28px;">
    <svg class="sds-signet" width="96" height="76.8" aria-hidden="true"><use href="../assets/tryout-signet-l.svg#art"></use></svg>
    <div style="display:flex; flex-direction:column; gap:6px; width:186px; flex:none;">
      <div class="spec-cap">TRYOUT</div>
      <div class="spec-note">The same frame around the thing you press. Clear the setup, start it, done.</div>
    </div>
    <div style="display:flex; align-items:flex-end; gap:18px; flex:none;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="32" height="25.6" aria-hidden="true"><use href="../assets/tryout-signet-l.svg#art"></use></svg><span class="spec-cap">L</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="24" height="19.2" aria-hidden="true"><use href="../assets/tryout-signet-m.svg#art"></use></svg><span class="spec-cap">M</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;"><svg class="sds-signet" width="16" height="16" aria-hidden="true"><use href="../assets/tryout-signet-s.svg#art"></use></svg><span class="spec-cap">S</span></div>
    </div>
    <div class="sds-mono" style="font-size:10px; color:var(--text-muted); line-height:1.7;">tryout-<br />signet-l.svg<br />-m.svg &#183; -s.svg</div>
  </div>

  <div class="spec-note" style="max-width:74ch; border-top:1px solid var(--border-subtle); padding-top:14px;">
    The system's own mark breaks one rule on purpose: its accent is a <em>stroke</em>,
    where both products fill theirs. A frame that outweighs what is composed inside it
    is the wrong shape for the job, and this mark is the frame. That is the only
    licensed deviation &#8212; a product mark fills its accent.
    To draw a new one, follow <span class="sds-mono">guidelines/signet-prompt.md</span>.
  </div>

</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Signet — the family',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-signet-family.card.html',
      group: 'Brand',
      name: 'Signet — the family',
      subtitle: 'Three marks, one construction — and the three files each of them ships',
      viewport: '700x574',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => CARD;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
