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
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionNode;

/**
 * Questions with their answers folded behind them.
 *
 *     .. accordion::
 *        :group: install
 *
 *        .. accordion-item:: What does it need installed?
 *           :open:
 *
 *           PHP 8.2 or newer, and a project it can read.
 *
 * The fold is `<details>`, so it works before any script runs and find-in-page
 * opens the answer it lands in. That is why `sds-accordion` draws it and no
 * template here writes one.
 *
 * **The group stands on the set and on every answer in it**, and that is not
 * two sources of truth. `<details name>` is the platform's own exclusivity and
 * it lives on each answer. In a browser the set hands its name down. A
 * renderer hands nothing anywhere, so that happens here, once, over the
 * children this directive already holds. `:multiple:` empties the group, which
 * is what makes the answers independent.
 *
 * A set nobody named gets a name of its own rather than a default every other
 * set on the page shares. Two exclusive groups that close each other's answers
 * is the one thing a name is for.
 *
 * The group is `:group:` and not `:name:`. `:name:` is what a document says
 * everywhere else to give something an address, and an answer takes it in
 * that meaning. A node carries `:name:` as `name` even if no directive reads
 * it. So a group under that key loses to an answer's own address, and the set
 * no longer closes.
 */
#[Attributes\Directive(name: 'accordion', valueType: DirectiveValueType::Empty)]
#[Attributes\Option(name: 'multiple', type: OptionType::Boolean, description: 'More than one answer can stand open.')]
#[Attributes\Option(name: 'group', description: 'The name the answers share.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class AccordionDirective extends SubDirective
{
    /** Sets rendered so far, for the ones with no name. */
    private int $unnamed = 0;

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $multiple = $directive->hasOption('multiple');
        $name = (string)($directive->getOption('group')->getValue() ?? '');
        if ($name === '') {
            $this->unnamed++;
            $name = 'accordion-' . $this->unnamed;
        }

        $group = $multiple ? '' : $name;
        $children = array_map(
            static fn(Node $child): Node => $child instanceof AccordionItemNode
                ? $child->withKeepExistingOptions(['group' => $group])
                : $child,
            $directiveNode->getChildren(),
        );

        return (new AccordionNode($children))->withOptions([
            'name' => $name,
            'multiple' => $multiple,
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
