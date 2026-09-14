<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\Nodes\Menu\InternalMenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\MenuEntryNode;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;

/**
 * The pages either side of this one, in the order a reader reads a manual.
 *
 * The renderer computes nothing of the kind. Its own prev/next block has sat
 * commented out of the core template for as long as this theme has existed.
 * So the order is the tree flattened depth first. That is the order the rail
 * lists and the order somebody takes through a manual front to back.
 *
 * A page the tree does not hold has no neighbours rather than the first two.
 * An orphan has its way in from somewhere else. A row that offers the way
 * onward from a page that is not on the way is a row that invents a path.
 */
final class Pager
{
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {}

    /**
     * @return array{previous: array{label: string, href: string}|null, next: array{label: string, href: string}|null}
     */
    public function of(RenderContext $context): array
    {
        /* The root first, and by hand. A toctree lists what is under a page
           and never the page it stands on. So the one document every reader
           starts at is the one the tree does not hold. Without it the way on
           begins on the second page and the first page of a manual offers
           none. */
        $root = $context->getRootDocumentNode();
        $pages = [[
            'label' => $root->getNavigationTitle() ?? $root->getTitle()?->toString() ?? '',
            'url' => $root->getFilePath(),
        ]];
        foreach ($context->getProjectNode()->getGlobalMenues() as $menu) {
            foreach ($this->flatten($menu->getMenuEntries()) as $entry) {
                $pages[] = ['label' => $entry->getValue()?->toString() ?? '', 'url' => $entry->getUrl()];
            }
        }

        $current = $context->getCurrentFileName();
        $at = null;
        foreach ($pages as $index => $page) {
            if ($page['url'] === $current) {
                $at = $index;
                break;
            }
        }

        if ($at === null) {
            return ['previous' => null, 'next' => null];
        }

        return [
            'previous' => isset($pages[$at - 1]) ? $this->link($pages[$at - 1], $context) : null,
            'next' => isset($pages[$at + 1]) ? $this->link($pages[$at + 1], $context) : null,
        ];
    }

    /**
     * The tree as one list, each page before the pages under it.
     *
     * @param list<MenuEntryNode> $entries
     *
     * @return list<InternalMenuEntryNode>
     */
    private function flatten(array $entries): array
    {
        $pages = [];
        foreach ($entries as $entry) {
            /* A link out of the project is not a page of it, and neither is
               whatever hangs below one. */
            if (!$entry instanceof InternalMenuEntryNode) {
                continue;
            }

            $pages[] = $entry;
            $pages = [...$pages, ...$this->flatten($entry->getChildren())];
        }

        return $pages;
    }

    /**
     * @param array{label: string, url: string} $page
     *
     * @return array{label: string, href: string}
     */
    private function link(array $page, RenderContext $context): array
    {
        return [
            'label' => $page['label'],
            'href' => $this->urlGenerator->generateCanonicalOutputUrl($context, $page['url']),
        ];
    }
}
