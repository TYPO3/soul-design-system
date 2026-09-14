import { type TemplateResult } from 'lit';
import '../components/image.ts';
export interface Lockup {
    /** The mark, as the file that holds the drawing. `sds-image` shows it, so it
        is a link like every other picture and draws in its own file's colours. */
    signet?: string;
    /** Whose product it is, where that is a second name — the quiet half of the
        lockup, with the accent rule between the two. */
    brand?: string;
    /** The machine's name for it, set as the machine's: a product, a package, a
        repository — verbatim, and never title-cased. */
    product?: string;
    /** Where it goes. A bar's mark is the way home. A footer's is not a link:
        the reader has just arrived at the end of the thing it names. */
    href?: string;
}
/** The lockup, or nothing where there is neither a mark nor a name to draw. */
export declare function lockup({ signet, brand, product, href }: Lockup): TemplateResult | '';
