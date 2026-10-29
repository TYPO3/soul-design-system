<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\CodemodeNode;

/**
 * Markup that stands as its author wrote it, for what no directive says.
 *
 *     .. codemode::
 *
 *        <sds-compare before-label="Today" after-label="With the token">
 *          ...
 *        </sds-compare>
 *
 * The body goes into the page as it stands. The elements in it upgrade, and
 * the finishing step renders them before the page ships. The Markdown twin
 * shows the markup. A directive for the same thing is better, because it
 * has a twin of its own: this is the way out, not the way in.
 */
#[Attributes\Directive(name: 'codemode', rawContent: true, valueType: DirectiveValueType::Empty)]
final class CodemodeDirective extends BaseDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        return (new CodemodeNode([]))->withOptions(['source' => $directiveNode->getRawContent()]);
    }
}
