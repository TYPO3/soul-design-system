<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\StatNode;

/**
 * One number stated as a fact.
 *
 *     .. stat:: 240
 *        :unit: ms
 *        :label: median answer
 *        :icon: actions-clock
 *
 *        Measured over the last release, on a warm index.
 *
 * The figure is the argument, because it is what the line is about. The body
 * is what bounds it, and it is a paragraph rather than an option since out of
 * a document it carries links. **Without that line the number is a boast.**
 * That is the whole reason `sds-stat` is a component and not two divs. It is
 * why the directive cannot offer a shorter form that leaves it out.
 *
 * `:of:` is the whole the figure is a part of. It stands in words and in the
 * drawing, and only where the figure really is a part: a measurement is out
 * of nothing.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them — see `CardDirective` for why both hold.
 */
#[Attributes\Directive(name: 'stat', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'unit', description: 'The unit of the number.')]
#[Attributes\Option(name: 'label', description: 'What the number counts.')]
#[Attributes\Option(name: 'of', description: 'The whole it is a part of.')]
#[Attributes\Option(name: 'icon', description: 'The name of an icon.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class StatDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new StatNode($directiveNode->getChildren()))->withOptions([
            'value' => $directive->getData(),
            'unit' => $directive->getOption('unit')->getValue(),
            'label' => $directive->getOption('label')->getValue(),
            'of' => $directive->getOption('of')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet.
               To drop what a theme does not understand is the one thing it
               must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
