<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\TeaserNode;

/**
 * One card in a grid: a title, a few sentences, and where it goes.
 *
 *     .. teaser:: As a render guide template
 *        :to: /guides-theme
 *
 *        A Composer package that turns reStructuredText into pages set with
 *        this system.
 *
 * The whole card is the link when `:to:` names a document — a teaser whose
 * title alone is clickable asks a reader to aim at four words.
 */
final class TeaserDirective extends SubDirective
{
    public function getName(): string
    {
        return 'teaser';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): Node|null {
        return (new TeaserNode($collectionNode->getChildren()))->withOptions([
            'title' => $directive->getData(),
            'to' => $directive->getOption('to')->getValue(),
        ]);
    }
}
