<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\CardNode;

/**
 * One card: a title that goes somewhere, and what is behind it.
 *
 *     .. card:: :ref:`Installation <installation>`
 *        :label: Chapter
 *        :icon: actions-book
 *        :action: Read it
 *
 *        What the package needs, and the three commands that render a project
 *        with it.
 *
 * The title is where TYPO3 documentation says the target — as a reference,
 * a `:doc:` or an external link — so that is where this reads it from, and
 * `:href:` is the same thing said as a path. Either way the whole card becomes
 * the link: `sds-card` stretches the title's anchor over the frame, which is
 * why there is no option for a button. A second anchor to the same place is a
 * second destination under one frame.
 *
 * **The options cover that element and leave nothing of it out.** A directive
 * that renders one of this system's components and answers for half of it is
 * the worse of the two failures a theme can have: an author who reads the card
 * in Storybook and writes the page that shows it has to find out from the
 * render which half arrived, and the part that did not is written by hand into
 * their own stylesheet — which is the thing the whole system exists to
 * prevent. So `tag`, `src` and `alt` are here because `sds-card` draws them,
 * and anything it gains lands here in the same commit.
 *
 * **And each is spelt the way the element spells it.** `href` and `src` are
 * what everything in this system that links or takes a file is called, so an
 * author who has read the card in Storybook can write the directive without
 * looking anything up, and the two sides cannot be described in two
 * vocabularies. A name of the theme's own — `to` for the link — reads well in
 * exactly one place and is a translation everywhere else.
 */
final class CardDirective extends SubDirective
{
    public function getName(): string
    {
        return 'card';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $title = $directive->getDataNode()
            ?? InlineCompoundNode::getPlainTextInlineNode($directive->getData());

        return (new CardNode($title, $collectionNode->getChildren()))->withOptions([
            'href' => $directive->getOption('href')->getValue(),
            'label' => $directive->getOption('label')->getValue(),
            'tag' => $directive->getOption('tag')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            'src' => $directive->getOption('src')->getValue(),
            'alt' => $directive->getOption('alt')->getValue(),
            'footer' => $directive->getOption('footer')->getValue(),
            'action' => $directive->getOption('action')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `topic` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
