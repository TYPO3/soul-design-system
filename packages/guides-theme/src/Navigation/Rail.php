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
 * it. The root's own section is the site, and a section that is a single page
 * has no rail at all — the bar naming it is the whole of what there is to say.
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

        /* No section in the rootline is the root page itself, and the root's
           section is the site: the sections are what is under it, so they are
           its rail. Under no heading — a list of everything there is answers
           to the site's own name, which the bar already carries. */
        if ($section === null) {
            return $this->list('', null, $node->getMenuEntries(), $node, $context);
        }

        /* A section that is one page has no rail at all. Falling back to the
           sections there hung every other section's tree off a page belonging
           to none of them, and the shape changed under the reader the moment
           they followed one of those links. */
        if ($section->getChildren() === []) {
            return ['label' => '', 'items' => [], 'active' => -1];
        }

        return $this->list($this->label($section), $section, $section->getChildren(), $node, $context);
    }

    /**
     * One list: a heading, the page it is named after, and the tree under it.
     *
     * @param list<MenuEntryNode> $entries
     *
     * @return array{label: string, items: list<array<string, mixed>>, active: int}
     */
    private function list(
        string $label,
        ?MenuEntryNode $own,
        array $entries,
        MenuNode $node,
        RenderContext $context,
    ): array {
        $current = $node instanceof NavMenuNode ? $node->getCurrentPath() : null;

        /* The section's own page, first and ungrouped — where a group puts the
           page it is named after, for the same reason: the heading over the
           list is not a link, so a reader standing on the section's index would
           be the one page missing from it. */
        $items = $own === null ? [] : [$this->link($own, $context)];
        $active = $own !== null && $own->getUrl() === $current ? 0 : -1;
        $flat = count($items);

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

        return ['label' => $label, 'items' => $items, 'active' => $active];
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
