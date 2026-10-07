<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\EmbeddedFrame;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;

/**
 * A specimen: a rendered card, at the size it exists for.
 *
 *     .. specimen:: guidelines/colors-surfaces.card.html
 *        :viewport: 700x260
 *        :title: Surfaces
 *
 * The design system documents itself with a picture, not a description. Every
 * rule ships with a card that renders it, generated from the same story that
 * documents the component in Storybook. A guideline page that describes a
 * colour in prose and leaves the reader to imagine it is the one thing this
 * system exists to prevent.
 *
 * The card is a whole document with its own stylesheet, so it sits in a frame
 * rather than inline. It carries `_specimen.css`, which a page must not
 * inherit, and it can pin its own mode.
 *
 * The viewport is not decoration. Every card declares the size of its
 * measurement in its own `@dsCard` header, and `make fit` proves it still
 * fits. This is that number. A card at any other size is a card that
 * documents something nobody checked.
 */
#[Attributes\Directive(name: 'specimen', valueType: DirectiveValueType::Path)]
#[Attributes\Option(name: 'viewport', default: '700x260', description: 'The width and height of the card.')]
#[Attributes\Option(name: 'title', description: 'The name of the card.')]
final class SpecimenDirective extends BaseDirective
{
    private const DEFAULT_VIEWPORT = '700x260';

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): EmbeddedFrame
    {
        $directive = $directiveNode->getDirective();
        $viewport = (string)($directive->getOption('viewport')->getValue() ?? self::DEFAULT_VIEWPORT);
        [$width, $height] = explode('x', $viewport) + [1 => null];

        /* `make guides` writes `_cards/` from `specimens/`, with the links
           inside each card rewritten to the site's own stylesheets. It is a
           path in the documentation source. `NodeFiles` copies it into the
           output, and `asset()` in the template resolves it per page. */
        $node = new EmbeddedFrame('/_cards/' . $directive->getData());

        return $node->withOptions(array_filter([
            'width' => $width,
            'height' => $height,
            'title' => $directive->getOption('title')->getValue(),
            'viewport' => $viewport,
            'specimen' => true,
        ]));
    }
}
