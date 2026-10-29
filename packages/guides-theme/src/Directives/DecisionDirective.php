<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\AnswerNode;
use TYPO3\Soul\GuidesTheme\Nodes\DecisionNode;

/**
 * The question a concept puts, with the answers it can take.
 *
 *     .. decision:: Does the compact form have tabs?
 *        :label: Decided
 *        :by: Benjamin Kott
 *        :due: 2026-10-26
 *
 *        .. answer:: No: a flat form, one field below the other
 *           :decided:
 *
 *           The declaration is a plain list.
 *
 *        .. answer:: A second showitem with tabs
 *
 *           Rejected.
 *
 * The question is the argument, as a step's title is. The answers go between
 * the tags, each with what it means. An answer with no `:key:` takes the next
 * letter, so an answer put in the middle renames what follows it, the way a
 * step renumbers. Blocks before the first answer are what the paper says
 * about the question.
 */
#[Attributes\Directive(name: 'decision', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'label', description: 'The word over the block: Open, Decided. Decision without one.')]
#[Attributes\Option(name: 'by', description: 'Who decides.')]
#[Attributes\Option(name: 'due', description: 'By when, as written. Once an answer carries decided, the day it fell.')]
#[Attributes\Option(name: 'lead', description: 'A sentence about the question, before the answers.')]
#[Attributes\Option(name: 'name', description: 'The address of the decision.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class DecisionDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();
        $letter = 'A';
        $children = [];
        foreach ($directiveNode->getChildren() as $child) {
            if ($child instanceof AnswerNode) {
                $key = (string)($child->getOption('key') ?? '');
                $child = $child->withOptions(['key' => $key !== '' ? $key : $letter]);
                $letter = chr(ord($letter) + 1);
            }
            $children[] = $child;
        }

        return (new DecisionNode($children))->withOptions([
            'question' => $directive->getData(),
            'label' => $directive->getOption('label')->getValue(),
            'by' => $directive->getOption('by')->getValue(),
            'due' => $directive->getOption('due')->getValue(),
            'lead' => $directive->getOption('lead')->getValue(),
            'anchor' => $directive->getOption('name')->getValue(),
            /* Carried for the reason `steps` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
