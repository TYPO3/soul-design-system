<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;

/**
 * One side of a `split`: the blocks that stand together in a column.
 *
 *     .. half:: What this side is about
 *
 *        Its paragraph and the press under it are one side of the split
 *        rather than three of its columns.
 *
 * It has nothing to say on its own and takes no position — where a half stands
 * is the split's decision, because the other half is what it is standing
 * against. Written anywhere else it is the run of blocks it holds, in the
 * rhythm a page sets between them.
 */
final class HalfDirective extends SubDirective
{
    public function getName(): string
    {
        return 'half';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new HalfNode($collectionNode->getChildren()))->withOptions([
            /* A section title inside a directive is parsed as text. The
               argument gives the grouped side a real heading instead. */
            'heading' => $directive->getData(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
