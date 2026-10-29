<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\AnswerNode;

/**
 * One answer a decision can take, and what it means.
 *
 *     .. answer:: primaryFields, shown as "Main fields"
 *        :recommended:
 *
 *        Neutral, and close to "primary" in the backend UI.
 *
 * The answer in a few words is the argument. What it means and what it
 * costs go between the tags. `:recommended:` marks the one the paper
 * proposes, and `:decided:` the one the decision took. `:key:` is the
 * letter the paper cites it by; without it, `decision` counts.
 */
#[Attributes\Directive(name: 'answer', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'key', description: 'The letter or number the paper cites the answer by.')]
#[Attributes\Option(name: 'recommended', type: OptionType::Boolean, description: 'The answer the paper proposes.')]
#[Attributes\Option(name: 'decided', type: OptionType::Boolean, description: 'The answer the decision took.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class AnswerDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new AnswerNode($directiveNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'key' => $directive->getOption('key')->getValue(),
            'recommended' => $directive->hasOption('recommended'),
            'decided' => $directive->hasOption('decided'),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
