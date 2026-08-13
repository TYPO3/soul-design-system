<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonBarNode;

/**
 * The controls of a page, standing in one row.
 *
 *     .. button-bar::
 *
 *        .. button:: :doc:`installation`
 *
 *        .. button:: Read the manual
 *           :href: https://example.org/manual
 *           :variant: secondary
 *
 * Named for what it holds, and the shape it holds them in.
 * A row of controls is layout and not a component, so it is `.sds-actions` and
 * carries no variant: the whole of it is that the things in it sit on one line
 * and are centred against each other, which is what a link beside a button
 * needs.
 *
 * It holds whatever a page puts in it and buttons above all. One of them is the
 * primary and the rest are not — a second `:variant: primary` in a row makes
 * neither of them mean anything — but that is a rule about writing, and a
 * directive that enforced it would be a directive that rewrote what an author
 * said.
 */
final class ButtonBarDirective extends SubDirective
{
    public function getName(): string
    {
        return 'button-bar';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new ButtonBarNode($collectionNode->getChildren()))->withOptions([
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
