<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\BylineNode;

/**
 * Who wrote the page, what they are to it, and when.
 *
 *     .. byline:: Benjamin Kott
 *        :as: responsible for the content and the schedule
 *        :meta: version 1.0
 *
 * The name is the argument, because a byline without one names nobody. The
 * options are the element's, spelt as `quote` spells them. A byline takes
 * the monogram from the name; `:initials:` says it where the name does not.
 */
#[Attributes\Directive(name: 'byline', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'as', description: 'What they are to the subject.')]
#[Attributes\Option(name: 'meta', description: 'When, and the rest of the label line.')]
#[Attributes\Option(name: 'initials', description: 'The initials of the monogram.')]
#[Attributes\Option(name: 'href', description: 'Where the name leads.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class BylineDirective extends BaseDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new BylineNode([]))->withOptions([
            'name' => $directive->getData(),
            'as' => $directive->getOption('as')->getValue(),
            'meta' => $directive->getOption('meta')->getValue(),
            'initials' => $directive->getOption('initials')->getValue(),
            'href' => $directive->getOption('href')->getValue(),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
