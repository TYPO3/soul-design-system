<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\Nodes\Menu\InternalMenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\MenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\MenuNode;
use phpDocumentor\Guides\Nodes\Menu\NavMenuNode;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;

/**
 * The rail's list: the pages of the section the reader is in.
 *
 * Which section that is comes from the rootline, so a page at any depth finds
 * it. Read instead off the link that resolves to `#`, it was only ever found
 * two levels down and everything deeper lost its rail to the sections.
 *
 * The rail folds once, so a page with a tree under it is a group holding the
 * whole of that tree.
 */
final class Rail
{
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {}

    /**
     * @return array{label: string, items: list<array<string, mixed>>, active: int}
     */
    public function of(MenuNode $node, RenderContext $context): array
    {
        $section = $this->section($node);
        $children = $section instanceof InternalMenuEntryNode ? $section->getChildren() : [];

        /* A section with no pages under it leaves the rail listing the sections
           themselves, which is the only useful thing left to say. */
        $entries = $children === [] ? $node->getMenuEntries() : $children;
        $current = $node instanceof NavMenuNode ? $node->getCurrentPath() : null;

        $items = [];
        $active = -1;
        $flat = 0;

        foreach ($entries as $entry) {
            $below = $this->descendants($entry);
            $links = [];
            foreach ([$entry, ...$below] as $page) {
                if ($page->getUrl() === $current) {
                    $active = $flat;
                }

                $links[] = $this->link($page, $context);
                ++$flat;
            }

            /* A page with pages under it is a group. Its own link is the first
               item inside the fold rather than the summary, because a summary
               that is also a link is a control with two jobs and the fold wins
               the press. */
            $items[] = $below === []
                ? $links[0]
                : ['label' => $this->label($entry), 'items' => $links];
        }

        return [
            'label' => $children === [] ? '' : $this->label($section),
            'items' => $items,
            'active' => $active,
        ];
    }

    /** The entry the reader is on or under, whatever depth they are at. */
    private function section(MenuNode $node): ?InternalMenuEntryNode
    {
        $rootline = $node instanceof NavMenuNode ? $node->getRootlinePaths() : [];
        foreach ($node->getMenuEntries() as $entry) {
            if ($entry instanceof InternalMenuEntryNode && in_array($entry->getUrl(), $rootline, true)) {
                return $entry;
            }
        }

        return null;
    }

    /**
     * Everything below an entry, in reading order.
     *
     * @return list<MenuEntryNode>
     */
    private function descendants(MenuEntryNode $entry): array
    {
        if (!$entry instanceof InternalMenuEntryNode) {
            return [];
        }

        $below = [];
        foreach ($entry->getChildren() as $child) {
            $below = [...$below, $child, ...$this->descendants($child)];
        }

        return $below;
    }

    /** @return array{label: string, href: string} */
    private function link(MenuEntryNode $entry, RenderContext $context): array
    {
        return [
            'label' => $this->label($entry),
            'href' => $this->urlGenerator->generateCanonicalOutputUrl($context, $entry->getUrl()),
        ];
    }

    private function label(?MenuEntryNode $entry): string
    {
        return $entry?->getValue()?->toString() ?? '';
    }
}
