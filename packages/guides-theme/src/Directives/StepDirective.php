<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\StepNode;

/**
 * One stop of an instruction, and the blocks that carry it out.
 *
 *     .. step:: Render the site
 *        :name: render-the-site
 *
 *        The first command writes documents, the second turns them into a site.
 *
 * The title is the argument, because that is where a TYPO3 manual already
 * writes what a block is called. What follows is the work, and it stays between
 * the tags: a command, a file to edit and the line that says it worked are what
 * no attribute carries.
 *
 * `:name:` is the address of this one stop, in the meaning every other
 * directive gives it. It lands on the stop rather than on the title, and
 * nothing has to be opened first — a step is not folded away, which is the one
 * thing that made `accordion-item` put its address on the answer.
 *
 * The title is not a heading and takes no level. What tells a reader where they
 * are in an instruction is the number, and a page whose outline is its steps
 * has buried its own sections under them.
 */
final class StepDirective extends SubDirective
{
    public function getName(): string
    {
        return 'step';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        return (new StepNode($collectionNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'optional' => $directive->hasOption('optional'),
            'anchor' => $directive->getOption('name')->getValue(),
            /* Carried for the reason `steps` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
