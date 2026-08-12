<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionNode;

/**
 * Questions with their answers folded behind them.
 *
 *     .. accordion::
 *        :name: install
 *
 *        .. accordion-item:: What does it need installed?
 *           :open:
 *
 *           PHP 8.2 or newer, and a project it can read.
 *
 * The fold is `<details>`, so it works before any script runs and find-in-page
 * opens the answer it lands in — which is why `sds-accordion` draws it and no
 * template here writes one.
 *
 * **The group is written on the set and on every answer in it**, and that is
 * not two sources of truth: `<details name>` is the platform's own exclusivity
 * and it lives on each answer. In a browser the set hands its name down; a
 * renderer hands nothing anywhere, so it is done here, once, over the children
 * this directive already holds. `:multiple:` empties the group, which is what
 * makes the answers independent.
 *
 * A set nobody named gets one, rather than sharing a default with every other
 * set on the page: two exclusive groups that close each other's answers is the
 * one thing a name is for.
 */
final class AccordionDirective extends SubDirective
{
    /** Sets rendered so far, for the ones that were not named. */
    private int $unnamed = 0;

    public function getName(): string
    {
        return 'accordion';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $multiple = $directive->hasOption('multiple');
        $name = (string)($directive->getOption('name')->getValue() ?? '');
        if ($name === '') {
            $this->unnamed++;
            $name = 'accordion-' . $this->unnamed;
        }

        $group = $multiple ? '' : $name;
        $children = array_map(
            static fn(Node $child): Node => $child instanceof AccordionItemNode
                ? $child->withKeepExistingOptions(['name' => $group])
                : $child,
            $collectionNode->getChildren(),
        );

        return (new AccordionNode($children))->withOptions([
            'name' => $name,
            'multiple' => $multiple,
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
