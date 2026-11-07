<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;

/**
 * One side of a `split`: the blocks that stand together in a column.
 *
 *     .. half:: What this side is about
 *
 *        Its paragraph and the press under it are one side of the split
 *        rather than three of its columns.
 *
 * Where the halves stand is the split's decision, because each stands against
 * the other. `:align:` is the one half that differs: at the top, level or at the
 * foot. Anywhere else a half is the run of blocks it holds.
 */
#[Attributes\Directive(name: 'half', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'align', description: 'Where this half stands, top to foot.')]
final class HalfDirective extends SubDirective
{
    private const ALIGNMENTS = ['start', 'center', 'end'];

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $align = (string)($directive->getOption('align')->getValue() ?? '');

        return (new HalfNode($directiveNode->getChildren()))->withOptions([
            'align' => in_array($align, self::ALIGNMENTS, true) ? $align : null,
            /* A section title inside a directive parses as text. The
               argument gives the grouped side a real heading instead. */
            'heading' => $directive->getData(),
        ]);
    }
}
