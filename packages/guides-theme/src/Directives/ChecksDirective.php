<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\ChecksNode;

/**
 * A list whose items each carry a check.
 *
 *     .. checks::
 *        :tone: ok
 *
 *        - **One overview:** One module shows all applications.
 *
 * The body is an ordinary list. A name the element does not have is the tone
 * every list gets: the ink of the text.
 */
#[Attributes\Directive(name: 'checks', valueType: DirectiveValueType::Empty)]
#[Attributes\Option(name: 'tone', description: 'ok draws the checks in the status green.')]
final class ChecksDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new ChecksNode($directiveNode->getChildren()))->withOptions([
            'tone' => $directive->getOption('tone')->getValue() === 'ok' ? 'ok' : null,
        ]);
    }
}
