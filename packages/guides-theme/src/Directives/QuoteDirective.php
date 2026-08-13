<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\QuoteNode;

/**
 * A sentence borrowed from somewhere, with where it came from.
 *
 *     .. quote:: Benjamin Kott
 *        :as: maintainer
 *        :meta: 24 July 2026
 *        :initials: BK
 *
 *        The fallback was never the problem. Not saying it was a fallback
 *        was the problem.
 *
 * **The attribution is the argument**, which is the one thing this directive
 * decides on its own. `sds-quote` requires it — an unattributed quotation in a
 * product's own writing is the product quoting itself for emphasis — and a
 * required thing said as an option is a thing an author leaves out. The
 * sentence goes between the tags instead: out of a document it carries links
 * and emphasis, which an attribute cannot hold.
 *
 * A block quote would be the spelling to reach for, and it is not available:
 * the parser resolves an indented block with an attribution line into a
 * definition list, so `<blockquote>` never reaches a template. See `GAPS.md`.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them — see `CardDirective` for why both hold.
 * `initials` is the one that reads oddly and is not optional: a quote cannot
 * tell a person's name from a filename, and a monogram derived from a document
 * is a person invented for a source that has none.
 */
final class QuoteDirective extends SubDirective
{
    public function getName(): string
    {
        return 'quote';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new QuoteNode($collectionNode->getChildren()))->withOptions([
            'by' => $directive->getData(),
            'as' => $directive->getOption('as')->getValue(),
            'meta' => $directive->getOption('meta')->getValue(),
            'initials' => $directive->getOption('initials')->getValue(),
            'href' => $directive->getOption('href')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
