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
import './components/signet.ts';
import './components/theme.ts';
import './components/button.ts';
import './components/badge.ts';
import './components/link.ts';
import './components/field.ts';
import './components/field-error.ts';
import './components/pills.ts';
import './components/menu.ts';
import './components/tabs.ts';
import './components/tab-item.ts';
import './components/rail.ts';
import './components/surface.ts';
import './components/overlay.ts';
import './components/modal.ts';
import './components/drawer.ts';
import './components/dialog.ts';
import './components/table.ts';
import './components/code.ts';
import './components/diff.ts';
import './components/note.ts';

export { SdsElement, installHostRule, define } from './lib/element.ts';

export { SdsIcon, setIconSprite, iconIds, type IconId, type IconSize } from './components/icon.ts';
export { SdsSignet, signetFor, type SignetSize } from './components/signet.ts';
export { SdsTheme, themeBoot, type ThemeChoice, type ThemeChange } from './components/theme.ts';
export { SdsButton, buttonClass, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/button.ts';
export { SdsBadge, type BadgeProps, type BadgeTone } from './components/badge.ts';
export { SdsLink, type LinkProps } from './components/link.ts';
export { SdsField, fieldClass, type FieldProps } from './components/field.ts';
export { SdsFieldError } from './components/field-error.ts';
export { type NavProps, type NavItem, type NavChange } from './components/nav-base.ts';
export { SdsPills } from './components/pills.ts';
export { SdsMenu } from './components/menu.ts';
export { SdsTabs } from './components/tabs.ts';
export { SdsTabItem } from './components/tab-item.ts';
export { SdsRail } from './components/rail.ts';
export { SdsSurface, type SurfaceProps, type Plane } from './components/surface.ts';
export { SdsOverlay } from './components/overlay.ts';
export { SdsModal } from './components/modal.ts';
export { SdsDrawer } from './components/drawer.ts';
export { SdsDialog, type DialogProps } from './components/dialog.ts';
export { SdsTable, type TableProps, type Column, type Row, type Density } from './components/table.ts';
export {
  SdsCode,
  type CodeBlockProps,
  type CodeLine,
  type CodeKind,
  type CodeLang,
} from './components/code.ts';
export { SdsDiff, type DiffProps, type DiffLine, type DiffKind } from './components/diff.ts';
export { SdsNote, type NoteProps, type NoteTone } from './components/note.ts';

if (typeof document !== 'undefined') installHostRule();

/** Every tag this bundle registers. The design agent's adherence config is
    generated from the bundle, so this list is what makes a component
    discoverable rather than merely present. */
export const TAGS = [
  'sds-icon',
  'sds-signet',
  'sds-theme',
  'sds-button',
  'sds-badge',
  'sds-link',
  'sds-field',
  'sds-field-error',
  'sds-pills',
  'sds-menu',
  'sds-tabs',
  'sds-tab-item',
  'sds-rail',
  'sds-surface',
  'sds-overlay',
  'sds-modal',
  'sds-drawer',
  'sds-dialog',
  'sds-table',
  'sds-code',
  'sds-diff',
  'sds-note',
] as const;
