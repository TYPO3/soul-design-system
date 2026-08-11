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
 *        :tag: Package
 *        :meta: February 2026
 *        :src: /_images/placeholder.svg
 *        :alt: A placeholder
 *
 *        A Composer package that turns reStructuredText into pages set with
 *        this system.
 *
 * The title is the link when `:to:` names a document, and the card follows it
 * on hover — the shape `sds-teaser` renders, and for its reasons.
 *
 * **The options are that element's properties and there are no others.** A
 * directive that renders one of this system's components and answers for half
 * of it is the worse of the two failures a theme can have: an author who reads
 * the card in Storybook and writes the page that shows it has to find out from
 * the render which half arrived, and the part that did not is written by hand
 * into their own stylesheet — which is the thing the whole system exists to
 * prevent. So `tag`, `meta`, `art` and `alt` are here because `sds-teaser` has
 * them, and anything it gains lands here in the same commit.
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
    ): ?Node {
        return (new TeaserNode($collectionNode->getChildren()))->withOptions([
            'title' => $directive->getData(),
            'to' => $directive->getOption('to')->getValue(),
            'tag' => $directive->getOption('tag')->getValue(),
            'meta' => $directive->getOption('meta')->getValue(),
            'src' => $directive->getOption('src')->getValue(),
            'alt' => $directive->getOption('alt')->getValue(),
        ]);
    }
}
