<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;

/**
 * The opening copy beside a decorative image.
 *
 * The document title remains the page heading, and `Bands` joins it to this
 * node, so navigation and document structure keep their source.
 */
#[Attributes\Directive(name: 'hero', valueType: DirectiveValueType::Path)]
#[Attributes\Option(name: 'alt', description: 'The text of the picture.')]
final class HeroDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new HeroNode($directiveNode->getChildren()))->withOptions([
            'src' => $directive->getData(),
            'alt' => $directive->getOption('alt')->getValue(),
        ]);
    }
}
