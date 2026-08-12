<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;

/**
 * One question, and the blocks folded behind it.
 *
 *     .. accordion-item:: Can it run in CI?
 *        :open:
 *
 *        Yes, and it answers less there.
 *
 * The question is the argument, because that is where a TYPO3 manual already
 * writes it. What follows is the answer, and it stays between the tags: a
 * paragraph, a list and a code block are what no attribute carries.
 *
 * `:show:` is the same flag under the name the Bootstrap theme gave it, so a
 * manual written for that theme opens the same answer here. `:header-level:`
 * and `:name:` are accepted and dropped — a summary is a control and not a
 * heading, and where a link into one answer lands is not decided; both are in
 * `GAPS.md` rather than half-answered here.
 */
final class AccordionItemDirective extends SubDirective
{
    public function getName(): string
    {
        return 'accordion-item';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new AccordionItemNode($collectionNode->getChildren()))->withOptions([
            'question' => $directive->getData(),
            'open' => $directive->hasOption('open') || $directive->hasOption('show'),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
