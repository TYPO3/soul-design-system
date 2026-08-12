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
 *        :href: /guides-theme
 *        :tag: Package
 *        :meta: February 2026
 *        :src: /_images/placeholder.svg
 *        :alt: A placeholder
 *
 *        A Composer package that turns reStructuredText into pages set with
 *        this system.
 *
 * The title is the link when `:href:` names a document, and the card follows
 * it on hover — the shape `sds-teaser` renders, and for its reasons.
 *
 * **The options cover that element and leave nothing of it out.** A directive
 * that renders one of this system's components and answers for half of it is
 * the worse of the two failures a theme can have: an author who reads the card
 * in Storybook and writes the page that shows it has to find out from the
 * render which half arrived, and the part that did not is written by hand into
 * their own stylesheet — which is the thing the whole system exists to
 * prevent. So `tag`, `meta`, `src` and `alt` are here because `sds-teaser`
 * draws them, and anything it gains lands here in the same commit.
 *
 * **And each is spelt the way the element spells it.** `href` and `src` are
 * what everything in this system that links or takes a file is called, so an
 * author who has read the card in Storybook can write the directive without
 * looking anything up, and the two sides cannot be described in two
 * vocabularies. A name of the theme's own — `to` for the link — reads well in
 * exactly one place and is a translation everywhere else.
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
            'href' => $directive->getOption('href')->getValue(),
            'tag' => $directive->getOption('tag')->getValue(),
            'meta' => $directive->getOption('meta')->getValue(),
            'src' => $directive->getOption('src')->getValue(),
            'alt' => $directive->getOption('alt')->getValue(),
        ]);
    }
}
