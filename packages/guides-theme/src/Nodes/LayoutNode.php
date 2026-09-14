<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;

/**
 * Which shell a page sits in.
 *
 * A manual page and a landing page are not the same shape and never were. One
 * reads in a column beside a list of pages, on a measure. The other is a run
 * of full-bleed bands with no rail at all. There is nothing to navigate yet,
 * and that is the whole point of a landing page.
 *
 * Written at the top of a document, beside `:navigation-title:`:
 *
 *     :layout: marketing
 *
 * Anything else, including nothing, is the manual.
 */
final class LayoutNode extends MetadataNode
{
    public const MARKETING = 'marketing';
}
