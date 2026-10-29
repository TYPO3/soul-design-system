<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;

/**
 * The renderer's `table` around a grid or a simple table. Its title is the
 * caption, and each column takes a role, as in `ListTableDirective`.
 *
 *     .. table:: Baseline features by group
 *        :columns: name fit, , meta
 *
 * A grid table is the one that spans a cell over columns. The renderer
 * builds the table and drops the title, so both go onto its node here.
 */
#[Attributes\Directive(name: 'table')]
final class TableDirective extends BaseDirective
{
    public function __construct(private readonly BaseDirective $table) {}

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $node = $this->table->createNode($directiveNode, $compilerContext);
        if ($node === null) {
            return null;
        }

        $directive = $directiveNode->getDirective();
        $title = trim($directive->getData());
        if ($title !== '' && !$node->hasOption('caption')) {
            $node = $node->withOptions(['caption' => $title]);
        }

        if ($directive->hasOption('columns')) {
            $node = $node->withOptions(['columns' => ListTableDirective::columns((string)$directive->getOption('columns')->getValue())]);
        }

        return $node;
    }
}
