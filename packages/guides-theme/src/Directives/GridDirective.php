<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;

/**
 * A set read side by side, reflowing by its own minimum width.
 *
 *     .. grid:: dense
 *
 *        .. stat:: 240
 *           :unit: ms
 *           :label: median answer
 *
 *           Measured over the last release.
 *
 * No column count, and that is the design. Three across on a desk, two on a
 * tablet and one on a phone. How narrow an item can get decides, rather than
 * a breakpoint somebody picked.
 *
 * The argument is that minimum, said as what the items hold rather than as a
 * number. `wide` for a card with a picture and a paragraph, `dense` for a
 * figure or a name and a glyph. `flush` for the gutter taken out so the set
 * reads as one wall. Anything else is the width every set gets unless it says
 * otherwise, because a name nobody defined is not a licence to invent one.
 */
#[Attributes\Directive(name: 'grid', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'variant', description: 'The width of an item.')]
#[Attributes\Option(name: 'columns', description: 'This many across, while each item keeps its minimum.')]
#[Attributes\Option(name: 'align', description: 'Where a shorter item stands in its row.')]
final class GridDirective extends SubDirective
{
    /** What the element answers to. See `GridVariant` in `grid.ts`. */
    private const VARIANTS = ['default', 'wide', 'dense', 'flush'];

    /** Where a shorter item stands in its row. See `GridValign` in `grid.ts`. */
    private const ALIGNMENTS = ['start', 'center', 'end'];

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        /* The width is the one decision the set makes about itself, so it is
           the argument rather than an option. `:variant:` is the same thing
           spelt the way an option-only directive says it. */
        $asked = $directive->getData() !== ''
            ? $directive->getData()
            : $directive->getOption('variant')->getValue();

        $align = (string)($directive->getOption('align')->getValue() ?? '');

        return (new GridNode($directiveNode->getChildren()))->withOptions([
            'align' => in_array($align, self::ALIGNMENTS, true) ? $align : null,
            'variant' => in_array($asked, self::VARIANTS, true) ? $asked : 'default',
            'columns' => $directive->getOption('columns')->getValue(),
        ]);
    }
}
