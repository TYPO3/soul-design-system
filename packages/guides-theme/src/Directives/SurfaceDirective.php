<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\SurfaceNode;

/**
 * One filled plane stating something in place.
 *
 *     .. surface:: Read, never write
 *        :icon: actions-file-shield
 *
 *        Every source is read. Nothing is written back.
 *
 * A plane out of a set, so it belongs in a `grid` the way `stat` and `card`
 * do, and the set is read across itself: the glyph tells the items apart
 * before they are read and the label numbers or sources them. It states
 * something rather than going somewhere, which is the whole line between this
 * and `card` — a card is a way into something and its frame is the link.
 *
 * **This is not what `topic` is.** A topic is a digression in the reading
 * flow that the outline does not list, and it stays the `<aside>` on
 * `.sds-panel` the three templates draw; see `GAPS.md`. A component fitted to
 * that node would have to give up its host, and the author's `:class:` with
 * it.
 *
 * **The options cover that element and leave nothing of it out**, spelt the
 * way the element spells them — see `CardDirective` for why both hold.
 * `box-style` is the exception and it is not an option: it is a CSS
 * declaration, and a directive that takes one hands a document the stylesheet.
 * What it is there for — a plane sized against the others in its row — is what
 * a `grid` already decides.
 */
final class SurfaceDirective extends SubDirective
{
    public function getName(): string
    {
        return 'surface';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new SurfaceNode($collectionNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            /* `raised` sits on the canvas, `sunken` is machine output. Named
               for the fill, which is what tells two planes apart in a system
               with no shadows. */
            'plane' => $directive->getOption('plane')->getValue(),
            'label' => $directive->getOption('label')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
