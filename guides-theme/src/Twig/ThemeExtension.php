<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;

/**
 * The theme's settings, where a template can read them.
 *
 * A global rather than a function: `soul.signet` in a template is a value the
 * project set, and a template that had to call something to get it would
 * invite a template that computes it instead.
 */
final class ThemeExtension extends AbstractExtension implements GlobalsInterface
{
    /** @param array<string, mixed> $footer */
    public function __construct(
        private readonly string|null $signet,
        private readonly string|null $product,
        private readonly string|null $home,
        private readonly array $footer = [],
    ) {
    }

    /** @return array<string, mixed> */
    public function getGlobals(): array
    {
        return [
            'soul' => [
                'signet' => $this->signet,
                'product' => $this->product,
                'home' => $this->home,
                'footer' => $this->footer,
            ],
        ];
    }
}
