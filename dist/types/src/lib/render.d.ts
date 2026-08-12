import type { TemplateResult } from 'lit';
/** Render a template to markup that still holds this system's elements. A page
    loads the bundle, so its tags have to survive and upgrade; it needs the
    markup only to be there already, for the first frame and for a reader who
    runs no script. Only the declarative shadow root comes off. */
export declare function renderUpgradable(template: TemplateResult): string;
export declare function renderStatic(template: TemplateResult): string;
