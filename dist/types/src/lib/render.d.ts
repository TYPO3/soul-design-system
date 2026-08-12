import type { TemplateResult } from 'lit';
/**
 * Render a template to markup that still holds this system's elements.
 *
 * The other function here exports a card: every element is flattened away,
 * because the Design System pane opens those files with no JavaScript at all
 * and an unupgraded tag would be an empty box. A page is the opposite case —
 * it *does* load the bundle, and the tags have to survive so they upgrade and
 * behave. What it needs from Node is only that the markup is already there for
 * the frame before that happens, and for a reader who runs no script.
 *
 * So this keeps every tag and unwraps only what `@lit-labs/ssr` puts around an
 * element's own rendering. These are light-DOM components: the declarative
 * shadow root is an artefact of how SSR renders, not of how they behave, and
 * taking it off is what makes the two agree.
 */
export declare function renderUpgradable(template: TemplateResult): string;
export declare function renderStatic(template: TemplateResult): string;
