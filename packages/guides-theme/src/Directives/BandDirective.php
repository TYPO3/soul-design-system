<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\BandNode;

/**
 * A full-bleed section of a page.
 *
 *     .. band::
 *        :quiet:
 *        :id: features
 *
 *        Anything at all.
 *
 * Bands are how a marketing page is built: the ground runs edge to edge, the
 * content inside is held to the page measure, and two of them share one
 * hairline rather than drawing two. `:quiet:` is the second ground — the one
 * that makes a run of bands read as alternating rather than as a wall.
 *
 * On a page whose layout is not `marketing` a band still works; it is simply
 * a section inside a column, which is what it looks like.
 */
final class BandDirective extends SubDirective
{
    public function getName(): string
    {
        return 'band';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        /* The title is an option and not a section heading, because a section
           heading inside a directive is not one: reStructuredText parses
           sections at document level, so a page that wrote `====` under a line
           in here would ship the line and the equals signs as text. */
        return (new BandNode($collectionNode->getChildren()))->withOptions([
            'quiet' => $directive->hasOption('quiet'),
            'id' => $directive->getOption('id')->getValue(),
            'title' => $directive->getData(),
        ]);
    }
}
