<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\FactsNode;

/**
 * A block of facts, scanned down the terms. The body is a field list, the
 * shape a name-and-value pair already has in the source. The field's name
 * is the term, and its body the value.
 */
#[Attributes\Directive(name: 'facts', valueType: DirectiveValueType::Empty)]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class FactsDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new FactsNode($directiveNode->getChildren()))->withOptions([
            /* An author who wrote `:class:` meant it for their own stylesheet.
               To drop what a theme does not understand is the one thing it
               must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
