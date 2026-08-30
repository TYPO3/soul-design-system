/* The bundle entry — what `window.SDS` becomes, and what the package exports.
   Importing it registers every element; importing one component module
   registers that one and whatever it composes.

   `renderStatic` is deliberately NOT re-exported: it pulls in `@lit-labs/ssr`,
   which the browser entry would drag in for a function no browser ever calls. */

/* The registrations. The re-exports below are classes and types; these bare
   imports are what actually run each module. */
import './components/icon.ts';
import './components/search.ts';
import './components/theme.ts';
import './components/button.ts';
import './components/dropdown.ts';
import './components/badge.ts';
import './components/eyebrow.ts';
import './components/link.ts';
import './components/nav-breadcrumb.ts';
import './components/field.ts';
import './components/select.ts';
import './components/textarea.ts';
import './components/switch.ts';
import './components/range.ts';
import './components/file.ts';
import './components/progress.ts';
import './components/field-group.ts';
import './components/field-error.ts';
import './components/checkbox.ts';
import './components/checkbox-group.ts';
import './components/radio.ts';
import './components/form-errors.ts';
import './components/nav-pills.ts';
import './components/nav-main.ts';
import './components/accordion.ts';
import './components/accordion-item.ts';
import './components/run.ts';
import './components/steps.ts';
import './components/step.ts';
import './components/tabs.ts';
import './components/tab-item.ts';
import './components/nav-rail.ts';
import './components/nav-toc.ts';
import './components/footer.ts';
import './components/surface.ts';
import './components/stat.ts';
import './components/figure.ts';
import './components/image.ts';
import './components/embed.ts';
import './components/lightbox.ts';
import './components/overlay.ts';
import './components/modal.ts';
import './components/dialog.ts';
import './components/table.ts';
import './components/card.ts';
import './components/icon-tile.ts';
import './components/swatch.ts';
import './components/grid.ts';
import './components/search-result.ts';
import './components/search-hits.ts';
import './components/nav-pagination.ts';
import './components/nav-pager.ts';
import './components/code.ts';
import './components/diff.ts';
import './components/quote.ts';
import './components/byline.ts';
import './components/note.ts';
import './components/confval.ts';

export { SdsElement, define } from './lib/element.ts';

export { SdsIcon, setIconSprite, iconIds, type IconId, type IconSize } from './components/icon.ts';
export { SdsTheme, themeBoot, type ThemeChoice, type ThemeChange } from './components/theme.ts';
export { SdsButton, buttonClass, type ButtonProps, type ButtonVariant, type ButtonSize } from './components/button.ts';
export { SdsDropdown, type DropdownProps, type DropdownChoice, type DropdownChosen } from './components/dropdown.ts';
export { SdsBadge, type BadgeProps, type BadgeTone } from './components/badge.ts';
export { SdsEyebrow, type EyebrowProps } from './components/eyebrow.ts';
export { SdsLink, type LinkProps } from './components/link.ts';
export { SdsNavBreadcrumb, type CrumbsProps, type Crumb } from './components/nav-breadcrumb.ts';
export { SdsField, type FieldProps } from './components/field.ts';
export { fieldBox, type FieldBox, type FieldSize } from './lib/field-box.ts';
export { fieldRow, type FieldRow } from './lib/field-row.ts';
export { SdsFormElement } from './lib/form-element.ts';
export { SdsSelect, type SelectProps, type SelectOption } from './components/select.ts';
export { SdsTextarea, type TextareaProps, type TextareaResize } from './components/textarea.ts';
export { SdsSwitch, type SwitchProps } from './components/switch.ts';
export { SdsRange, type RangeProps } from './components/range.ts';
export { SdsFile, type FileProps } from './components/file.ts';
export {
  SdsProgress,
  type ProgressProps,
  type ProgressReadout,
  type ProgressSize,
} from './components/progress.ts';
export { SdsFieldGroup } from './components/field-group.ts';
export { SdsFieldError } from './components/field-error.ts';
export { SdsCheckbox, type CheckboxProps } from './components/checkbox.ts';
export { SdsCheckboxGroup, type CheckboxGroupProps, type CheckChoice } from './components/checkbox-group.ts';
export { SdsRadio, type RadioProps, type Choice } from './components/radio.ts';
export { SdsFormErrors, type FormErrorsProps, type FormError } from './components/form-errors.ts';
export { type NavProps, type NavItem, type NavChange } from './components/nav-base.ts';
export { SdsNavPills } from './components/nav-pills.ts';
export { SdsNavMain } from './components/nav-main.ts';
export { SdsAccordion, type AccordionProps, type Entry } from './components/accordion.ts';
export { SdsAccordionItem } from './components/accordion-item.ts';
export { SdsRun, type RunProps, type RunStep, type RunState, type RunVerdict } from './components/run.ts';
export { SdsSteps, type StepsProps, type Step } from './components/steps.ts';
export { SdsStep } from './components/step.ts';
export { SdsTabs } from './components/tabs.ts';
export { SdsTabItem } from './components/tab-item.ts';
export { SdsNavRail } from './components/nav-rail.ts';
export { SdsNavToc } from './components/nav-toc.ts';
export { SdsFooter, type FooterProps, type FooterGroup, type FooterLink } from './components/footer.ts';
export { SdsSurface, type SurfaceProps, type Plane } from './components/surface.ts';
export { SdsStat, type StatProps } from './components/stat.ts';
export { SdsFigure, type FigureProps } from './components/figure.ts';
export { SdsImage, type ImageProps } from './components/image.ts';
export { SdsEmbed, type EmbedProps } from './components/embed.ts';
export { SdsLightbox, type LightboxProps } from './components/lightbox.ts';
export { SdsOverlay } from './components/overlay.ts';
export { SdsModal } from './components/modal.ts';
export { SdsDialog, type DialogProps } from './components/dialog.ts';
export {
  SdsTable,
  type TableProps,
  type Cell,
  type CellValue,
  type Column,
  type Row,
  type Density,
} from './components/table.ts';
export {
  SdsCode,
  type CodeBlockProps,
  type CodeLine,
  type CodeKind,
  type CodeLang,
  type CodeLangName,
} from './components/code.ts';
export { SdsDiff, type DiffProps, type DiffLine, type DiffKind } from './components/diff.ts';
export { SdsQuote, type QuoteProps } from './components/quote.ts';
export { SdsByline, type BylineProps } from './components/byline.ts';
export { SdsNote, type NoteProps, type NoteTone } from './components/note.ts';
export { SdsConfval, type ConfvalProps, type Fact } from './components/confval.ts';
export { SdsCard, type CardProps } from './components/card.ts';
export { SdsIconTile, type IconTileProps } from './components/icon-tile.ts';
export { SdsSwatch, type SwatchProps, type SwatchKind } from './components/swatch.ts';
export { SdsGrid, type GridProps, type GridVariant } from './components/grid.ts';
export { SdsSearchResult, type SearchResultProps } from './components/search-result.ts';
export { SdsSearchHits, type SearchHitsProps } from './components/search-hits.ts';
export { SdsNavPagination, pageNumbers, type PaginationProps } from './components/nav-pagination.ts';
export { SdsNavPager, type PagerProps } from './components/nav-pager.ts';

/** Every tag this bundle registers. The design agent's adherence config is
    generated from the bundle, so this list is what makes a component
    discoverable rather than merely present. */
export const TAGS = [
  'sds-icon',
  'sds-theme',
  'sds-button',
  'sds-dropdown',
  'sds-badge',
  'sds-eyebrow',
  'sds-link',
  'sds-nav-breadcrumb',
  'sds-field',
  'sds-select',
  'sds-textarea',
  'sds-field-group',
  'sds-search',
  'sds-field-error',
  'sds-checkbox',
  'sds-checkbox-group',
  'sds-radio',
  'sds-switch',
  'sds-range',
  'sds-file',
  'sds-progress',
  'sds-form-errors',
  'sds-nav-pills',
  'sds-nav-main',
  'sds-accordion',
  'sds-accordion-item',
  'sds-run',
  'sds-steps',
  'sds-step',
  'sds-tabs',
  'sds-tab-item',
  'sds-nav-rail',
  'sds-nav-toc',
  'sds-footer',
  'sds-surface',
  'sds-stat',
  'sds-figure',
  'sds-image',
  'sds-embed',
  'sds-lightbox',
  'sds-overlay',
  'sds-modal',
  'sds-dialog',
  'sds-table',
  'sds-card',
  'sds-icon-tile',
  'sds-swatch',
  'sds-grid',
  'sds-search-result',
  'sds-search-hits',
  'sds-nav-pagination',
  'sds-nav-pager',
  'sds-code',
  'sds-diff',
  'sds-quote',
  'sds-byline',
  'sds-note',
  'sds-confval',
] as const;
