<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\EntryNode;

/**
 * One entry of a register. Its title is the argument, what it holds the
 * body, and everything that fits in a string an option. The register
 * numbers it when the page renders, so no option here says a number.
 */
#[Attributes\Directive(name: 'entry', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'group', description: 'The group of the entry.')]
#[Attributes\Option(name: 'origin', description: 'Where the entry comes from.')]
#[Attributes\Option(name: 'todo', description: 'What there is to do.')]
#[Attributes\Option(name: 'name', description: 'The address of the entry.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class EntryDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new EntryNode($directiveNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'group' => $directive->getOption('group')->getValue(),
            'origin' => $directive->getOption('origin')->getValue(),
            'todo' => $directive->getOption('todo')->getValue(),
            'anchor' => $directive->getOption('name')->getValue(),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
