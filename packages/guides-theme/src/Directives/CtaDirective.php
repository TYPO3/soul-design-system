<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\CtaNode;

/**
 * The one thing a reader can do next.
 *
 *     .. cta:: Your first site in ten minutes
 *        :action: Publish a first site
 *        :href: /guides-theme/quickstart
 *
 *        Copy the example project and replace its content.
 *
 * The argument is the heading, and the body is the line under it. The body is
 * not an option, because out of a document it carries links.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them.
 */
#[Attributes\Directive(name: 'cta', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'action', description: 'The press, in words.')]
#[Attributes\Option(name: 'href', description: 'Where the press goes.')]
#[Attributes\Option(name: 'icon', description: 'The name of an icon.')]
#[Attributes\Option(name: 'second', description: 'The quieter way, in words.')]
#[Attributes\Option(name: 'second-href', description: 'Where the quieter way goes.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class CtaDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new CtaNode($directiveNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'action' => $directive->getOption('action')->getValue(),
            'href' => $directive->getOption('href')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            'second' => $directive->getOption('second')->getValue(),
            'second-href' => $directive->getOption('second-href')->getValue(),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
