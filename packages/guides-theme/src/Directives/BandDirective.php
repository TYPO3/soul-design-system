<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\BandNode;

/**
 * A full-bleed section of a page.
 *
 *     .. band::
 *        :quiet:
 *        :id: features
 *
 *        Anything at all.
 *
 * Bands are what a marketing page consists of. The ground runs edge to edge,
 * the content inside stays on the page measure, and two of them share one
 * hairline rather than draw two. `:quiet:` is the second ground — the one
 * that makes a run of bands read as alternate rather than as a wall.
 *
 * On a page whose layout is not `marketing` a band still works. It is simply
 * a section inside a column, which is what it looks like.
 */
#[Attributes\Directive(name: 'band', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'quiet', type: OptionType::Boolean, description: 'The second ground.')]
#[Attributes\Option(name: 'id', description: 'The anchor of the band.')]
final class BandDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        /* The title is an option and not a section heading. A section
           heading inside a directive is not one. reStructuredText parses
           sections at document level. A page that writes `====` under a line
           in here ships the line and the equals signs as text. */
        return (new BandNode($directiveNode->getChildren()))->withOptions([
            'quiet' => $directive->hasOption('quiet'),
            'id' => $directive->getOption('id')->getValue(),
            'title' => $directive->getData(),
        ]);
    }
}
