<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\SwatchNode;

/**
 * One colour of a palette.
 *
 *     .. swatch:: var(--accent)
 *        :name: --accent
 *        :resolved: #FF8700
 *
 * The value that paints the chip is the argument, because it is what the line
 * is about; what the colour is called and what it resolves to are options.
 * There is no body: a colour a page has to explain in a paragraph is a rule
 * about where it may be used, and that is prose beside the palette rather than
 * inside one entry of it.
 *
 * `:kind: line` is for a value that is one pixel wide wherever it is really
 * used. Filled, a hairline is a different job being done by the same number.
 *
 * Written inside `.. grid::`, which lays a set side by side.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them — see `CardDirective` for why both hold.
 */
final class SwatchDirective extends SubDirective
{
    public function getName(): string
    {
        return 'swatch';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new SwatchNode($collectionNode->getChildren()))->withOptions([
            'value' => $directive->getData(),
            'name' => $directive->getOption('name')->getValue(),
            'resolved' => $directive->getOption('resolved')->getValue(),
            'kind' => $directive->getOption('kind')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
