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
export { SdsElement, installHostRule, define } from './lib/element.js';
export { SdsIcon, iconIds, type IconId, type IconSize } from './components/icon.js';
export { SdsButton, buttonClass, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/button.js';
export { SdsBadge, type BadgeProps, type BadgeTone } from './components/badge.js';
export { SdsLink, type LinkProps } from './components/link.js';
export { SdsField, SdsFieldError, fieldClass, type FieldProps } from './components/field.js';
export { type NavProps } from './components/nav-base.js';
export { SdsPills } from './components/pills.js';
export { SdsTabs } from './components/tabs.js';
export { SdsRail } from './components/rail.js';
export { SdsSurface, type SurfaceProps, type Plane } from './components/card.js';
export { SdsOverlay, SdsModal, SdsDrawer } from './components/overlay.js';
export { SdsDialog, type DialogProps } from './components/dialog.js';
export { SdsTable, type TableProps, type Column, type Row, type Density } from './components/table.js';
export { SdsCode, SdsDiff, type CodeBlockProps, type CodeLine, type CodeKind, type CodeLang, type DiffProps, type DiffLine, type DiffKind, } from './components/code.js';
/** Every tag this bundle registers. The design agent's adherence config is
    generated from the bundle, so this list is what makes a component
    discoverable rather than merely present. */
export declare const TAGS: readonly ['sds-icon', 'sds-button', 'sds-badge', 'sds-link', 'sds-field', 'sds-field-error', 'sds-pills', 'sds-tabs', 'sds-rail', 'sds-surface', 'sds-overlay', 'sds-modal', 'sds-drawer', 'sds-dialog', 'sds-table', 'sds-code', 'sds-diff'];
