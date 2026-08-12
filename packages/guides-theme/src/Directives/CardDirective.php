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
 * **The options cover that element and leave nothing of it out**, for the
 * reason `TeaserDirective` states at length: a directive answering for half of
 * a component sends the other half into a consumer's own stylesheet.
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
