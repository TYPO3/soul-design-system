<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\StepsNode;

/**
 * An instruction read from the top, numbered down one rail.
 *
 *     .. steps::
 *
 *        .. step:: Require the package
 *
 *           .. code-block:: bash
 *
 *              composer require typo3/soul-guides-theme
 *
 *        .. step:: Select the theme
 *
 *           ``theme="soul"`` in ``guides.xml`` names it.
 *
 * For work that has an order: the numbers are the claim that step two follows
 * step one, and a set of things to do in any order is a bullet list. It takes
 * no options of its own beyond `:class:` — how far along a reader is, is the
 * page's business and not the set's, and there is no state here to carry.
 *
 * **No option numbers a stop.** The number is the set's own count, so a step
 * put in the middle renumbers everything under it and no document has to be
 * edited twice — which is the whole reason this is a set and not four
 * paragraphs each opening with a figure somebody typed.
 */
final class StepsDirective extends SubDirective
{
    public function getName(): string
    {
        return 'steps';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new StepsNode($collectionNode->getChildren()))->withOptions([
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `accordion` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
