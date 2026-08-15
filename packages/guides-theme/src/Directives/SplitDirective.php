<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;
use TYPO3\Soul\GuidesTheme\Nodes\SplitNode;

/**
 * Two of anything, side by side until there is no room for two.
 *
 *     .. split::
 *        :align: center
 *
 *        .. half::
 *
 *           What the picture beside this is of.
 *
 *        .. half::
 *
 *           .. figure:: /_images/flow.svg
 *
 * A split holds columns and nothing else, so a child written without `half`
 * becomes one here: a run of paragraphs is a run of columns until something
 * says where one of them ends. No width and no count — the halves fold under
 * each other by their own minimum, the way every other set in this system
 * reflows.
 *
 * The two options are the two things the author knows and the layout cannot:
 * how a short half stands against a tall one, and which of them a phone should
 * be given first. That second one is not the first by definition — a picture
 * belongs on the right of the sentence it illustrates and above it once there
 * is one column, and reading order is not source order at every width.
 */
final class SplitDirective extends SubDirective
{
    /** Where the shorter half sits against the taller one. */
    private const ALIGNMENTS = ['start', 'center', 'end'];

    /** Which half is read first once the two have stacked. */
    private const LEADS = ['start', 'end'];

    public function getName(): string
    {
        return 'split';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $align = (string)($directive->getOption('align')->getValue() ?? '');
        $leads = (string)($directive->getOption('leads')->getValue() ?? '');

        /* A split lays out columns, so a child written without `half` becomes
           one here rather than reaching the template as a shape it would have
           to recognise. One node more, and no exception in the stylesheet. */
        $halves = array_map(
            static fn(Node $child): Node => $child instanceof HalfNode ? $child : new HalfNode([$child]),
            $collectionNode->getChildren(),
        );

        return (new SplitNode($halves))->withOptions([
            /* A name nobody defined is not a licence to invent one: what is
               not one of these is the position every split gets anyway. */
            'align' => in_array($align, self::ALIGNMENTS, true) ? $align : 'start',
            'leads' => in_array($leads, self::LEADS, true) ? $leads : 'start',
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
