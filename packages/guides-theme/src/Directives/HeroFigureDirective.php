<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroFigureNode;

/**
 * The other half of a hero, written rather than named as a file.
 *
 *     .. hero::
 *
 *        API Hub checks every request before TYPO3 answers it.
 *
 *        .. hero-figure::
 *
 *           .. diagram::
 *
 *              flow
 *              Request -> Check -> TYPO3
 *
 * It stands in the body of a `hero`, and what it holds is the half beside the
 * copy: a diagram, code, a card, a picture. An element there reads the page's
 * tokens and follows its mode, which a picture file cannot. It wins over the
 * hero's image argument.
 */
#[Attributes\Directive(name: 'hero-figure')]
final class HeroFigureDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        return new HeroFigureNode($directiveNode->getChildren());
    }
}
