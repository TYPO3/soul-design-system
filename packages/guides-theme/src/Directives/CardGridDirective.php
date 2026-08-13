<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\CardGridNode;

/**
 * Cards that reflow, spelled the way TYPO3 documentation spells it.
 *
 *     .. card-grid::
 *        :columns: 1
 *        :columns-md: 2
 *
 *        .. card:: :ref:`Introduction <introduction>`
 *
 *           Two sentences.
 *
 * The column counts are read as one question — how much room does a card in
 * here need — and answered with a minimum width rather than a track count, so
 * the grid still reflows and no page names a breakpoint. Two or fewer is the
 * wide grid, five or more the dense one, and everything between is the grid
 * every other set of cards on the site uses.
 *
 * `:gap: 0` is the one gutter a page may ask for, because it is not a distance
 * but a shape: the cards share a hairline and read as one block. Every other
 * `:gap:`, and `:card-height:`, are accepted and dropped — the gap is the
 * system's spacing scale and equal heights are what a grid row already does.
 * All of them exist so a manual written for the Bootstrap theme renders
 * unchanged.
 */
final class CardGridDirective extends SubDirective
{
    /** What the counts are asked in — the largest, since the smaller ones are a page at a narrower width. */
    private const COUNTS = ['columns', 'columns-sm', 'columns-md', 'columns-lg'];

    public function getName(): string
    {
        return 'card-grid';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new CardGridNode($collectionNode->getChildren()))->withOptions([
            'variant' => $this->variant($directive),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }

    private function columns(Directive $directive): int
    {
        $columns = 0;
        foreach (self::COUNTS as $name) {
            if ($directive->hasOption($name)) {
                $columns = max($columns, (int)$directive->getOption($name)->getValue());
            }
        }

        return $columns;
    }

    private function variant(Directive $directive): string
    {
        /* The wall wins the question. A page that asked for no gutter asked
           about the shape of the set, and how much room one card needs is then
           the grid's to answer. */
        if ($directive->hasOption('gap') && (int)$directive->getOption('gap')->getValue() === 0) {
            return 'flush';
        }

        $columns = $this->columns($directive);
        if ($columns > 0 && $columns <= 2) {
            return 'wide';
        }

        return $columns >= 5 ? 'dense' : 'default';
    }
}
