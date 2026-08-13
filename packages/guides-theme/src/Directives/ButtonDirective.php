<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonNode;

/**
 * One press, and where it goes.
 *
 *     .. button:: :doc:`installation`
 *        :icon: actions-download
 *
 * The label carries the target, the way a card's title does: written as a
 * reference, a `:doc:` or an external link, the words are the label and the
 * reference is where the press goes. `:href:` is the same thing said as a path
 * and wins where both are written.
 *
 * A button on a rendered page is a link — the element draws an `<a>` the moment
 * it is given one, which is what gives the reader the browser's own middle
 * click, hover target and status line. A button with nowhere to go is a control
 * that does nothing when pressed, so `type`, `for` and `command` are not
 * offered here: a document has no form to submit and no element to command, and
 * a page that needs them is an application rather than a manual.
 *
 * **The options cover the rest of that element and leave nothing of it out**,
 * spelt the way the element spells them — see `CardDirective` for why both
 * hold. `:icon:` is the one that is not an attribute: a glyph is a node beside
 * the words, so the template composes `sds-icon` into the control the way this
 * system's own pages do.
 */
final class ButtonDirective extends SubDirective
{
    public function getName(): string
    {
        return 'button';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $label = $directive->getDataNode()
            ?? InlineCompoundNode::getPlainTextInlineNode($directive->getData());

        /* The children are dropped, and they are the one thing here that is:
           a control's label is a line, so a block written under a button is a
           paragraph that belongs beside it rather than inside it. */
        return (new ButtonNode($label))->withOptions([
            'href' => $directive->getOption('href')->getValue(),
            'variant' => $directive->getOption('variant')->getValue(),
            'size' => $directive->getOption('size')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            'icon-only' => $directive->hasOption('icon-only'),
            'title' => $directive->getOption('title')->getValue(),
            'rel' => $directive->getOption('rel')->getValue(),
            'disabled' => $directive->hasOption('disabled'),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
