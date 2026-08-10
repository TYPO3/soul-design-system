/* The bundle entry — what `window.SDS` becomes, and what the npm package
   exports.

   Importing this registers every element. Importing a single component
   module registers that one and whatever it composes, because a component
   that uses another imports it.

   `renderStatic` is deliberately NOT re-exported here. It pulls in
   `@lit-labs/ssr`, which is a Node library, and exporting it from the
   browser entry dragged the whole of it into the bundle — 257 kB for a
   function no browser ever calls. The card generator imports it straight
   from `src/lib/render.ts` instead.

   `installHostRule()` is called on import rather than left to the consumer.
   The rule it injects (`display: contents` on every `sds-` host) has to be
   in place before an element upgrades, or the first frame lays out with the
   custom element still in the box tree and every flex gap shifts. */

import { installHostRule } from './lib/element.ts';

/* The registrations. The re-exports below are classes and types; these bare
   imports are what actually run each module. */
import './components/icon.ts';
import './components/button.ts';
import './components/badge.ts';
import './components/link.ts';
import './components/field.ts';
import './components/pills.ts';
import './components/tabs.ts';
import './components/rail.ts';
import './components/card.ts';
import './components/overlay.ts';
import './components/dialog.ts';
import './components/table.ts';
import './components/code.ts';

export { SdsElement, installHostRule, define } from './lib/element.ts';

export { SdsIcon, iconIds, type IconId, type IconSize } from './components/icon.ts';
export { SdsButton, buttonClass, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/button.ts';
export { SdsBadge, type BadgeProps, type BadgeTone } from './components/badge.ts';
export { SdsLink, type LinkProps } from './components/link.ts';
export { SdsField, SdsFieldError, fieldClass, type FieldProps } from './components/field.ts';
export { type NavProps } from './components/nav-base.ts';
export { SdsPills } from './components/pills.ts';
export { SdsTabs } from './components/tabs.ts';
export { SdsRail } from './components/rail.ts';
export { SdsSurface, type SurfaceProps, type Plane } from './components/card.ts';
export { SdsOverlay, SdsModal, SdsDrawer } from './components/overlay.ts';
export { SdsDialog, type DialogProps } from './components/dialog.ts';
export { SdsTable, type TableProps, type Column, type Row, type Density } from './components/table.ts';
export {
  SdsCode,
  SdsDiff,
  codeMeta,
  comment,
  shell,
  ok,
  type CodeBlockProps,
  type CodeLine,
  type DiffProps,
  type DiffLine,
  type DiffKind,
} from './components/code.ts';

if (typeof document !== 'undefined') installHostRule();

/** Every tag this bundle registers. The design agent's adherence config is
    generated from the bundle, so this list is what makes a component
    discoverable rather than merely present. */
export const TAGS = [
  'sds-icon',
  'sds-button',
  'sds-badge',
  'sds-link',
  'sds-field',
  'sds-field-error',
  'sds-pills',
  'sds-tabs',
  'sds-rail',
  'sds-surface',
  'sds-overlay',
  'sds-modal',
  'sds-drawer',
  'sds-dialog',
  'sds-table',
  'sds-code',
  'sds-diff',
] as const;
