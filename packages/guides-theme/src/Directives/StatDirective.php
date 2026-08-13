<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
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
 * The figure is the argument, because it is what the line is about; the body
 * is what bounds it, and it is a paragraph rather than an option since out of
 * a document it carries links. **Without that line the number is a boast** —
 * which is the whole reason `sds-stat` is a component and not two divs, and it
 * is why the directive cannot offer a shorter form that leaves it out.
 *
 * `:of:` is the whole the figure is a part of. It is said and drawn, and only
 * where the figure really is a part: a measurement is out of nothing.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them — see `CardDirective` for why both hold.
 */
final class StatDirective extends SubDirective
{
    public function getName(): string
    {
        return 'stat';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new StatNode($collectionNode->getChildren()))->withOptions([
            'value' => $directive->getData(),
            'unit' => $directive->getOption('unit')->getValue(),
            'label' => $directive->getOption('label')->getValue(),
            'of' => $directive->getOption('of')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
