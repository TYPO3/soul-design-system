<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use phpDocumentor\Guides\RenderContext;
use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;
use Twig\TwigFilter;
use Twig\TwigFunction;
use TYPO3\Soul\GuidesTheme\Navigation\Menu;
use TYPO3\Soul\GuidesTheme\Navigation\Pager;
use TYPO3\Soul\GuidesTheme\Navigation\Rail;
use TYPO3\Soul\GuidesTheme\Nodes\Bands;
use TYPO3\Soul\GuidesTheme\Nodes\Terms;

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
        private readonly bool $pager,
        private readonly Menu $menu,
        private readonly Rail $rail,
        private readonly Pager $pages,
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
                'pager' => $this->pager,
            ],
        ];
    }

    /** @return TwigFilter[] */
    public function getFilters(): array
    {
        return [new TwigFilter('plain', $this->plain(...))];
    }

    /**
     * A rendered node as the words in it, for a value that has to travel in an
     * attribute.
     *
     * Rendering escapes and Twig escapes again on the way into the attribute,
     * so a type written `"string"` arrives as `&amp;quot;string&amp;quot;` and
     * is read by nobody. Decoded here and escaped once by Twig, it arrives as
     * it was written.
     */
    public function plain(string $rendered): string
    {
        return trim(html_entity_decode(strip_tags($rendered), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }

    /** @return TwigFunction[] */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('bands', Bands::of(...)),
            new TwigFunction('terms', Terms::of(...)),
            new TwigFunction('menu', $this->menu(...), ['needs_context' => true]),
            new TwigFunction('rail', $this->rail(...), ['needs_context' => true]),
            new TwigFunction('pager', $this->pager(...), ['needs_context' => true]),
        ];
    }

    /**
     * The section of it a page's own column carries, or nothing where the
     * section is a single page and the bar naming it says everything.
     *
     * @param array{env?: RenderContext} $context
     *
     * @return array<string, mixed>|null
     */
    public function rail(array $context): ?array
    {
        return $this->rail->of($this->context($context, 'A rail is the section of a page'));
    }

    /**
     * The site as one entry, on every page alike: the contract every
     * navigation of this theme is given.
     *
     * A function with no node, unlike a directive's: the answer is the
     * project's and not the document's, so any template can ask for it — and
     * the one that does is the bar's, which draws as much of it as the width
     * allows.
     *
     * @param array{env?: RenderContext} $context
     *
     * @return array<string, mixed>
     */
    public function menu(array $context): array
    {
        $renderContext = $this->context($context, 'The menu is the site read from a page');

        return $this->menu->of(
            $renderContext,
            $this->product ?? $renderContext->getProjectNode()->getTitle() ?? '',
            $this->navigation['links'] ?? [],
        );
    }

    /**
     * The page being rendered, or the reason there has to be one.
     *
     * @param array{env?: RenderContext} $context
     */
    private function context(array $context, string $because): RenderContext
    {
        $renderContext = $context['env'] ?? null;
        if (!$renderContext instanceof RenderContext) {
            throw new \RuntimeException($because . ', so there has to be a page being rendered');
        }

        return $renderContext;
    }

    /**
     * @param array{env?: RenderContext} $context
     *
     * @return array{previous: array{label: string, href: string}|null, next: array{label: string, href: string}|null}
     */
    public function pager(array $context): array
    {
        return $this->pages->of($this->context($context, 'The way on is the way on from a page'));
    }
}
