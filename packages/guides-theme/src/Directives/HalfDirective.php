<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;

/**
 * One side of a `split`: the blocks that stand together in a column.
 *
 *     .. half:: What this side is about
 *
 *        Its paragraph and the press under it are one side of the split
 *        rather than three of its columns.
 *
 * It has nothing to say on its own and takes no position. Where a half stands
 * is the split's decision, because the other half is what it stands against.
 * Anywhere else it is the run of blocks it holds, in the rhythm a page sets
 * between them.
 */
#[Attributes\Directive(name: 'half', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class HalfDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new HalfNode($directiveNode->getChildren()))->withOptions([
            /* A section title inside a directive parses as text. The
               argument gives the grouped side a real heading instead. */
            'heading' => $directive->getData(),
            /* An author who wrote `:class:` meant it for their own stylesheet.
               To drop what a theme does not understand is the one thing it
               must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
