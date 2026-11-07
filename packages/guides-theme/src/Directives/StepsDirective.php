<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepsNode;

/**
 * An instruction read from the top, numbered down one rail.
 *
 *     .. steps::
 *
 *        .. step:: Add the package
 *
 *           .. code-block:: bash
 *
 *              composer require typo3/soul-guides-theme
 *
 *        .. step:: Select the theme
 *
 *           ``theme="soul"`` in ``guides.xml`` names it.
 *
 * For work that has an order. The numbers are the claim that step two follows
 * step one, and a set of things to do in any order is a bullet list. It takes
 * no options of its own. How far along a reader is, is the
 * page's business and not the set's, and there is no state here to carry.
 *
 * **No option numbers a stop.** The number is the set's own count. A step put
 * in the middle renumbers everything under it, and no document needs a second
 * edit. That is the whole reason this is a set and not four paragraphs that
 * each open with a figure somebody typed.
 */
#[Attributes\Directive(name: 'steps', valueType: DirectiveValueType::Empty)]
final class StepsDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new StepsNode($directiveNode->getChildren()))->withOptions([
        ]);
    }
}
