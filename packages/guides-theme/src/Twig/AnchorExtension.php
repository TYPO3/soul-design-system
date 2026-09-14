<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use phpDocumentor\Guides\ReferenceResolvers\AnchorNormalizer;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

/**
 * The id a place gets when the parser gave it none.
 *
 * A section gets its anchor on the way in and a glossary term does not. So a
 * page can define forty words and point at none of them. The name comes from
 * the same normalizer that names every other anchor. Two rules for one job
 * is how a link ends up one character away from the id it meant.
 */
final class AnchorExtension extends AbstractExtension
{
    public function __construct(private readonly AnchorNormalizer $anchors) {}

    /** @return TwigFilter[] */
    public function getFilters(): array
    {
        return [new TwigFilter('anchor', $this->anchor(...))];
    }

    public function anchor(string $text): string
    {
        return $this->anchors->reduceAnchor($text);
    }
}
