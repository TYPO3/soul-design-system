<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\PartNode;

/**
 * Where a part of a paper begins: the sections from the next heading on,
 * up to the next part.
 *
 *     .. part:: Problem
 *
 *     The problem
 *     ===========
 *
 * reStructuredText has no group of sections without a heading of its own.
 * So the name stands before the first heading of the part, and `Parts` moves
 * it onto that section. The section draws it over its heading, and the
 * outline of a paper groups the sections under it.
 */
#[Attributes\Directive(name: 'part', valueType: DirectiveValueType::String)]
final class PartDirective extends BaseDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        return new PartNode($directiveNode->getDirective()->getData());
    }
}
