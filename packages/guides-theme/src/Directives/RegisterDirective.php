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
use TYPO3\Soul\GuidesTheme\Nodes\RegisterNode;

/**
 * A list a reader cites: numbered, addressed, and scanned at a glance first.
 * The entries stand in the body, and the element numbers them, groups them
 * and writes the tables when the page renders. `:findings:` is the one
 * preset, a review's four groups; `:groups:` takes any other set as JSON, the
 * form the element takes it in.
 */
#[Attributes\Directive(name: 'register', valueType: DirectiveValueType::Empty)]
#[Attributes\Option(name: 'name', description: 'The address of the register.')]
#[Attributes\Option(name: 'prefix', description: 'The prefix of a number.')]
#[Attributes\Option(name: 'todo-prefix', description: 'The prefix of an open entry.')]
#[Attributes\Option(name: 'findings', type: OptionType::Boolean, description: 'The groups of a review.')]
#[Attributes\Option(name: 'groups', description: 'The groups, as JSON.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class RegisterDirective extends SubDirective
{
    /** A review's findings, in the order a review reads them. */
    private const FINDINGS = '[{"key":"blocks","heading":"Blocks submission","label":"blocks","tone":"error"},'
        . '{"key":"back","heading":"Sent back","label":"sent back","tone":"warn"},'
        . '{"key":"change","heading":"Worth a change","label":"worth a change","tone":"default"},'
        . '{"key":"ok","heading":"Checked and correct","label":"checked","tone":"ok"}]';

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $groups = (string)($directive->getOption('groups')->getValue() ?? '');
        if ($groups === '' && $directive->hasOption('findings')) {
            $groups = self::FINDINGS;
        }

        return (new RegisterNode($directiveNode->getChildren()))->withOptions([
            'name' => $directive->getOption('name')->getValue(),
            'prefix' => $directive->getOption('prefix')->getValue(),
            'todo-prefix' => $directive->getOption('todo-prefix')->getValue(),
            'groups' => $groups,
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
