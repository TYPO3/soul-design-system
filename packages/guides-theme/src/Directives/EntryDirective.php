<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\EntryNode;

/**
 * One entry of a register. Its title is the argument, what it holds the
 * body, and everything that fits in a string an option. The register
 * numbers it when the page renders, so no option here says a number.
 */
final class EntryDirective extends SubDirective
{
    public function getName(): string
    {
        return 'entry';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new EntryNode($collectionNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'group' => $directive->getOption('group')->getValue(),
            'origin' => $directive->getOption('origin')->getValue(),
            'todo' => $directive->getOption('todo')->getValue(),
            'anchor' => $directive->getOption('name')->getValue(),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
