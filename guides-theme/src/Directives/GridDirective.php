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
 * Cards that reflow by their own minimum width.
 *
 *     .. grid::
 *
 *        .. teaser:: What it is
 *
 *           Two sentences.
 *
 * No column count, and that is the design: three across on a desk, two on a
 * tablet and one on a phone, decided by how narrow a card may get rather than
 * by a breakpoint somebody picked.
 */
final class GridDirective extends SubDirective
{
    public function getName(): string
    {
        return 'grid';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): Node|null {
        return new GridNode($collectionNode->getChildren());
    }
}
