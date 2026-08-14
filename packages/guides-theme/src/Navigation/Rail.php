<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\RenderContext;

/**
 * The rail's entry: the section of the site the reader is in.
 *
 * A slice of the same menu the bar is given, so the two cannot disagree about
 * where the reader is — which section that is comes from the entry that says
 * `current` or `here`, and both are worked out once, in `Menu`.
 *
 * A section that is a single page has no rail at all: the bar naming it is the
 * whole of what there is to say. Neither has the root, which is in no section
 * — the whole site is what the bar's menu carries, on every page alike.
 */
final class Rail
{
    public function __construct(
        private readonly Menu $menu,
    ) {}

    /** @return array<string, mixed>|null */
    public function of(RenderContext $context): ?array
    {
        foreach ($this->menu->of($context, '', [])['items'] as $entry) {
            if (($entry['current'] ?? false) !== true && ($entry['here'] ?? false) !== true) {
                continue;
            }

            return ($entry['items'] ?? []) === [] ? null : $entry;
        }

        return null;
    }
}
