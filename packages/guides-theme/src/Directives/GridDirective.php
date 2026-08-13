<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;

/**
 * A set read side by side, reflowing by its own minimum width.
 *
 *     .. grid:: dense
 *
 *        .. stat:: 240
 *           :unit: ms
 *           :label: median answer
 *
 *           Measured over the last release.
 *
 * No column count, and that is the design: three across on a desk, two on a
 * tablet and one on a phone, decided by how narrow an item may get rather than
 * by a breakpoint somebody picked.
 *
 * The argument is that minimum, said as what the items hold rather than as a
 * number — `wide` for a card carrying a picture and a paragraph, `dense` for a
 * figure or a name and a glyph, `flush` for the gutter taken out so the set
 * reads as one wall. Anything else is the width every set gets unless it says
 * otherwise, because a name nobody defined is not a licence to invent one.
 */
final class GridDirective extends SubDirective
{
    /** What the element answers to. See `GridVariant` in `grid.ts`. */
    private const VARIANTS = ['default', 'wide', 'dense', 'flush'];

    public function getName(): string
    {
        return 'grid';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        /* The width is the one decision the set makes about itself, so it is
           the argument rather than an option; `:variant:` is the same thing
           written the way an option-only directive would say it. */
        $asked = $directive->getData() !== ''
            ? $directive->getData()
            : $directive->getOption('variant')->getValue();

        return (new GridNode($collectionNode->getChildren()))->withOptions([
            'variant' => in_array($asked, self::VARIANTS, true) ? $asked : 'default',
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
