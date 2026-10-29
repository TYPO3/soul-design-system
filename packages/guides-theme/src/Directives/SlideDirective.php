<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\ImageNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\SlideNode;

/**
 * A slide in the text of a paper, and one of its deck.
 *
 *     .. slide:: The use cases
 *        :lead: The first patch fulfils the editing frame and the preview.
 *
 *        .. list-table::
 *           ...
 *
 * The heading is the argument. What the slide shows goes between the tags:
 * a table, facts, steps, a grid of cards or stats, a diagram. The slide
 * shrinks it until it fits. With `:caption:`, the slide is a figure of the
 * paper and counts as one. A `section` slide carries the parts of the paper.
 * An `.. image::` alone on a figure slide is the slide's own picture, with no
 * frame of its own: the slide is the frame.
 */
#[Attributes\Directive(name: 'slide', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'page-only', type: OptionType::Boolean, description: 'A slide of the page that the deck does not play.')]
#[Attributes\Option(name: 'kind', description: 'One of `cover`, `section`, `statement`, `content`, `figure`, `closing`. `content` without one.')]
#[Attributes\Option(name: 'eyebrow', description: 'The line over the heading.')]
#[Attributes\Option(name: 'lead', description: 'The finding, in one sentence under the heading.')]
#[Attributes\Option(name: 'note', description: 'A line the deck shows and the page hides.')]
#[Attributes\Option(name: 'legend', description: 'The key of the drawing, at the right of the heading: entries apart by ` | `, each a key and its words.')]
#[Attributes\Option(name: 'layout', description: 'How a figure slide stands: wide, full, headed, row or text-start.')]
#[Attributes\Option(name: 'ground', description: 'The ground of the slide: paper, or terminal for a dark one.')]
#[Attributes\Option(name: 'caption', description: 'The claim of a figure slide: the slide then stands in a figure, with the caption under it.')]
#[Attributes\Option(name: 'name', description: 'The address of the slide.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class SlideDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();
        $option = static fn(string $name): string => (string)($directive->getOption($name)->getValue() ?? '');

        $children = $directiveNode->getChildren();
        $picture = count($children) === 1 && $children[0] instanceof ImageNode ? $children[0] : null;

        return (new SlideNode($children))->withOptions([
            'picture' => $picture !== null,
            'page-only' => $directive->hasOption('page-only'),
            'heading' => $directive->getData(),
            'kind' => $option('kind') !== '' ? $option('kind') : 'content',
            'eyebrow' => $option('eyebrow'),
            'lead' => $option('lead'),
            'legend' => $option('legend'),
            'note' => $option('note'),
            'layout' => $option('layout'),
            'ground' => $option('ground'),
            'caption' => $option('caption'),
            'anchor' => $option('name'),
            'class' => $option('class'),
        ]);
    }
}
