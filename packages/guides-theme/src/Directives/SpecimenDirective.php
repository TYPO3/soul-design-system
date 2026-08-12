<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\EmbeddedFrame;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;

/**
 * A specimen: a rendered card, shown at the size it was drawn for.
 *
 *     .. specimen:: guidelines/colors-surfaces.card.html
 *        :viewport: 700x260
 *        :title: Surfaces
 *
 * The design system documents itself by showing, not by describing — every
 * rule ships with a card that renders it, generated from the same story that
 * documents the component in Storybook. A guideline page that described a
 * colour in prose and left the reader to imagine it would be the one thing
 * this system exists to prevent.
 *
 * The card is a whole document with its own stylesheet, so it is embedded in a
 * frame rather than inlined: it carries `_specimen.css`, which a page must not
 * inherit, and it may pin its own mode.
 *
 * The viewport is not decoration. Every card declares the size it was measured
 * at in its own `@dsCard` header, `make fit` proves it still fits, and this is
 * that number — a card shown at any other size is a card documenting something
 * that was never checked.
 */
final class SpecimenDirective extends BaseDirective
{
    private const DEFAULT_VIEWPORT = '700x260';

    public function getName(): string
    {
        return 'specimen';
    }

    public function process(BlockContext $blockContext, Directive $directive): EmbeddedFrame
    {
        $viewport = (string)($directive->getOption('viewport')->getValue() ?? self::DEFAULT_VIEWPORT);
        [$width, $height] = explode('x', $viewport) + [1 => null];

        /* `_cards/` is written by `make guides` from `specimens/`, with the
           links inside each card rewritten to the site's own stylesheets. It
           is a path in the documentation source, so `asset()` in the template
           copies it into the output and resolves it per page. */
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
