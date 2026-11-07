<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;

/**
 * The renderer's `figure`, and the one option this theme adds to it.
 *
 *     .. figure:: /_images/placeholder.svg
 *        :zoomable:
 *
 * The renderer gives a node the options of its directive, but only those with
 * a value. `:zoomable:` has none: it is a flag. So it goes onto the node here,
 * and everything else is the renderer's own figure.
 */
#[Attributes\Directive(name: 'figure')]
#[Attributes\Option(name: 'zoomable', type: OptionType::Boolean, description: 'A press opens the picture at full size.')]
#[Attributes\Option(name: 'plain', type: OptionType::Boolean, description: 'No frame around the picture.')]
final class FigureDirective extends BaseDirective
{
    public function __construct(private readonly BaseDirective $figure) {}

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $node = $this->figure->createNode($directiveNode, $compilerContext);
        if ($node === null) {
            return null;
        }

        $directive = $directiveNode->getDirective();
        $flags = [];
        foreach (['zoomable', 'plain'] as $flag) {
            if ($directive->hasOption($flag)) {
                $flags[$flag] = true;
            }
        }

        return $flags === [] ? $node : $node->withOptions($flags);
    }
}
