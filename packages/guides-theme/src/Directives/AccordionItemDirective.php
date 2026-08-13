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
 * is accepted and dropped: a summary is a control and not a heading.
 *
 * `:name:` is the address of one answer, and it is put on the answer rather
 * than on the question — the platform opens a fold that a fragment points
 * *into* and leaves one shut that it points *at*. The element spells that
 * `anchor`, `name` there being the set a `<details>` closes with.
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
            'anchor' => $directive->getOption('name')->getValue(),
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
