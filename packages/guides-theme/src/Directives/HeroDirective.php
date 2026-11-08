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
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;

/**
 * The opening copy beside a decorative image.
 *
 * The document title remains the page heading, and `Bands` joins it to this
 * node in every layout, so navigation and document structure keep their source.
 *
 * The image is the short form of the other half. A `hero-figure` in the body
 * is the long one, and it wins.
 *
 * The options are the rest of `sds-hero`, spelt the way the element spells
 * them. A name the element does not have is the position every hero gets.
 */
#[Attributes\Directive(name: 'hero', valueType: DirectiveValueType::Path)]
#[Attributes\Option(name: 'alt', description: 'The text of the picture.')]
#[Attributes\Option(name: 'plain', type: OptionType::Boolean, description: 'No frame around the picture.')]
#[Attributes\Option(name: 'eyebrow', description: 'The line over the title.')]
#[Attributes\Option(name: 'action', description: 'The press, in words.')]
#[Attributes\Option(name: 'href', description: 'Where the press goes.')]
#[Attributes\Option(name: 'icon', description: 'The name of an icon.')]
#[Attributes\Option(name: 'second', description: 'The quieter way, in words.')]
#[Attributes\Option(name: 'second-href', description: 'Where the quieter way goes.')]
#[Attributes\Option(name: 'align', description: 'How the copy and the picture align.')]
#[Attributes\Option(name: 'leads', description: 'The half that comes first.')]
final class HeroDirective extends SubDirective
{
    private const ALIGNMENTS = ['start', 'center', 'end'];

    private const LEADS = ['start', 'end'];

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $align = (string)($directive->getOption('align')->getValue() ?? '');
        $leads = (string)($directive->getOption('leads')->getValue() ?? '');

        return (new HeroNode($directiveNode->getChildren()))->withOptions([
            'src' => $directive->getData(),
            'alt' => $directive->getOption('alt')->getValue(),
            'plain' => $directive->hasOption('plain'),
            'eyebrow' => $directive->getOption('eyebrow')->getValue(),
            'action' => $directive->getOption('action')->getValue(),
            'href' => $directive->getOption('href')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            'second' => $directive->getOption('second')->getValue(),
            'second-href' => $directive->getOption('second-href')->getValue(),
            'align' => in_array($align, self::ALIGNMENTS, true) ? $align : 'center',
            'leads' => in_array($leads, self::LEADS, true) ? $leads : 'start',
        ]);
    }
}
