<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\LogoNode;

/**
 * One mark of a wall. The argument is the file, and `:alt:` is its name.
 */
#[Attributes\Directive(name: 'logo', valueType: DirectiveValueType::Path)]
#[Attributes\Option(name: 'alt', description: 'The name the mark stands for.')]
#[Attributes\Option(name: 'href', description: 'Where the mark goes.')]
final class LogoDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new LogoNode([]))->withOptions([
            'src' => $directive->getData(),
            'alt' => $directive->getOption('alt')->getValue(),
            'href' => $directive->getOption('href')->getValue(),
        ]);
    }
}
