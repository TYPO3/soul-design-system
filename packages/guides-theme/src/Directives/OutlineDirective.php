<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\OutlineNode;

/**
 * The short name the outline of a paper gives the next section.
 *
 *     .. outline:: Overview
 *
 *     In short: the whole concept on one page
 *     ========================================
 *
 * A heading says what a section claims, and a list of thirty claims reads
 * slowly. `Parts` moves the name onto the section, as it moves a part.
 */
#[Attributes\Directive(name: 'outline', valueType: DirectiveValueType::String)]
final class OutlineDirective extends BaseDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        return new OutlineNode($directiveNode->getDirective()->getData());
    }
}
