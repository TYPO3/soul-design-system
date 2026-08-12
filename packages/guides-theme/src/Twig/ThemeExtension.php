<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use phpDocumentor\Guides\Nodes\Menu\MenuNode;
use phpDocumentor\Guides\RenderContext;
use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;
use Twig\TwigFunction;
use TYPO3\Soul\GuidesTheme\Navigation\Rail;
use TYPO3\Soul\GuidesTheme\Nodes\Bands;

/**
 * The theme's settings, where a template can read them.
 *
 * A global rather than a function: `soul.signet` in a template is a value the
 * project set, and a template that had to call something to get it would
 * invite a template that computes it instead.
 *
 * The functions are for the opposite reason: each answers a question about the
 * document being rendered that only the page can be asked. Both answers are
 * worked out in a class of their own, where they can be read.
 */
final class ThemeExtension extends AbstractExtension implements GlobalsInterface
{
    /**
     * @param array<int, array<string, string|null>> $favicons
     * @param array<string, mixed> $footer
     * @param array<int, array<string, mixed>> $navigation
     */
    public function __construct(
        private readonly ?string $signet,
        private readonly array $favicons,
        private readonly ?string $product,
        private readonly ?string $brand,
        private readonly ?string $home,
        private readonly array $footer,
        private readonly array $navigation,
        private readonly Rail $rail,
    ) {}

    /** @return array<string, mixed> */
    public function getGlobals(): array
    {
        return [
            'soul' => [
                'signet' => $this->signet,
                'favicons' => $this->favicons,
                'product' => $this->product,
                'brand' => $this->brand,
                'home' => $this->home,
                'footer' => $this->footer,
                'navigation' => $this->navigation,
            ],
        ];
    }

    /** @return TwigFunction[] */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('bands', Bands::of(...)),
            new TwigFunction('rail', $this->rail(...), ['needs_context' => true]),
        ];
    }

    /**
     * @param array{env?: RenderContext} $context
     *
     * @return array{label: string, items: list<array<string, mixed>>, active: int}
     */
    public function rail(array $context, MenuNode $node): array
    {
        $renderContext = $context['env'] ?? null;
        if (!$renderContext instanceof RenderContext) {
            throw new \RuntimeException('A rail is the section of a page, so there has to be a page being rendered');
        }

        return $this->rail->of($node, $renderContext);
    }
}
