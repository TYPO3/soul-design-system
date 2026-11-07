<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\LogosNode;

/**
 * A wall of marks.
 *
 *     .. logos:: Used by
 *
 *        .. logo:: /_images/one.svg
 *           :alt: One
 *           :href: https://example.org
 *
 * The argument is what the marks have in common, and it is optional.
 */
#[Attributes\Directive(name: 'logos', valueType: DirectiveValueType::String)]
final class LogosDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new LogosNode($directiveNode->getChildren()))->withOptions([
            'label' => $directive->getData(),
        ]);
    }
}
