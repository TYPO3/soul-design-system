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
final class AccordionDirective extends SubDirective
{
    /** Sets rendered so far, for the ones with no name. */
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
            $collectionNode->getChildren(),
        );

        return (new AccordionNode($children))->withOptions([
            'name' => $name,
            'multiple' => $multiple,
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
