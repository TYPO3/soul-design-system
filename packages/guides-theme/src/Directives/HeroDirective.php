<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;

/**
 * The opening copy beside a decorative image.
 *
 * The document title remains the page heading and is joined to this node by
 * `Bands`, so navigation and document structure keep their source.
 */
final class HeroDirective extends SubDirective
{
    public function getName(): string
    {
        return 'hero';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new HeroNode($collectionNode->getChildren()))->withOptions([
            'src' => $directive->getData(),
            'alt' => $directive->getOption('alt')->getValue(),
        ]);
    }
}
