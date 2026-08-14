<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\Nodes\Menu\ExternalMenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\InternalMenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\MenuEntryNode;
use phpDocumentor\Guides\Nodes\TitleNode;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;

/**
 * The site, as the one entry every navigation of this theme is given.
 *
 * Label, target, what is under it, and what is true of it on the page being
 * rendered — `current` for the page itself and `here` for the entries it sits
 * under. The renderer knows all of that and the elements work none of it out;
 * a bar draws as much of the entry as the width allows, and a rail draws the
 * section of it the reader is in.
 *
 * `front` is the one thing the tree cannot say: which of a site's sections are
 * its front doors. That is configuration, and a link configured that the tree
 * has no page for — somebody else's site — joins the entries as its own.
 */
final class Menu
{
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {}

    /**
     * @param array<int, array<string, mixed>> $navigation
     *
     * @return array<string, mixed>
     */
    public function of(RenderContext $context, string $label, array $navigation): array
    {
        $current = $context->hasCurrentFileName() ? $context->getCurrentFileName() : null;
        $rootline = $current === null ? [] : $context->getCurrentFileRootline();

        $items = [];
        $documents = [];
        foreach ($context->getProjectNode()->getGlobalMenues() as $menu) {
            foreach ($menu->getMenuEntries() as $entry) {
                $items[] = $this->entry($entry, $context, $current, $rootline);
                /* The document rather than the href beside it: a configured
                   link names `/guide/index`, while the href is resolved
                   against the page being rendered and reads `../guide/`
                   from anywhere but the root. */
                $documents[] = $entry instanceof ExternalMenuEntryNode ? null : trim($entry->getUrl(), '/');
            }
        }

        return [
            'label' => $label,
            'items' => $this->front($items, $documents, $navigation, $context, $current, $rootline),
        ];
    }

    /**
     * One entry and everything under it.
     *
     * @param list<string> $rootline
     *
     * @return array<string, mixed>
     */
    private function entry(
        MenuEntryNode $node,
        RenderContext $context,
        ?string $current,
        array $rootline,
    ): array {
        $url = $node->getUrl();
        $away = $node instanceof ExternalMenuEntryNode;

        $entry = [
            'label' => $node->getValue()?->toString() ?? '',
            'href' => $away ? $url : $this->urlGenerator->generateCanonicalOutputUrl($context, $url),
        ];
        if ($away) {
            $entry['external'] = true;

            return $entry;
        }

        if ($url === $current) {
            $entry['current'] = true;
        } elseif (in_array($url, $rootline, true)) {
            /* On the way to the page rather than the page itself: a section a
               reader is inside is where they are, without being what they are
               reading. */
            $entry['here'] = true;
        }

        $under = [];
        foreach ($node instanceof InternalMenuEntryNode ? $node->getChildren() : [] as $child) {
            $under[] = $this->entry($child, $context, $current, $rootline);
        }

        if ($under !== []) {
            $entry['items'] = $under;
        }

        return $entry;
    }

    /**
     * Which entries stand in the bar's row, and in which order.
     *
     * A written list wins over the tree, as it does for anything the tree
     * cannot know, and it decides the order of the whole menu: the row is the
     * top of the list rather than a second list beside it, so a reader who
     * opens the drawer finds the sections in the order the bar had them.
     * Everything the configuration did not name follows, in the tree's own
     * order. With nothing written, every section is a front door — a site that
     * has said nothing still has a bar to move around in.
     *
     * A front door the tree has no page for is a page it does not reach or
     * somebody else's site; either way it joins the menu, because on a phone
     * the drawer is the only navigation there is.
     *
     * @param list<array<string, mixed>> $items
     * @param list<string|null> $documents
     * @param array<int, array<string, mixed>> $navigation
     * @param list<string> $rootline
     *
     * @return list<array<string, mixed>>
     */
    private function front(
        array $items,
        array $documents,
        array $navigation,
        RenderContext $context,
        ?string $current,
        array $rootline,
    ): array {
        if ($navigation === []) {
            return array_map(static fn(array $entry): array => $entry + ['front' => true], $items);
        }

        $doors = [];
        $named = [];
        foreach ($navigation as $link) {
            $href = trim((string)($link['href'] ?? ''), '/');
            $at = array_search($href, $documents, true);
            if ($at !== false) {
                $named[] = $at;
                /* Named by the page and not by the link: a section is called
                   what its own `:navigation-title:` says, everywhere it is
                   named — the bar, the drawer, the rail's heading, the trail,
                   the footer's column. A label written here as well is a
                   second name for one section, and the one no page carries. */
                $named[] = $at;
                $doors[] = $items[$at] + ['front' => true];
                continue;
            }

            $doors[] = $this->configured($link, $href, $context, $current, $rootline);
        }

        $rest = [];
        foreach ($items as $at => $entry) {
            if (!in_array($at, $named, true)) {
                $rest[] = $entry;
            }
        }

        return [...$doors, ...$rest];
    }

    /**
     * A configured link the tree has no entry for.
     *
     * @param array<string, mixed> $link
     * @param list<string> $rootline
     *
     * @return array<string, mixed>
     */
    /**
     * What a document calls itself in a navigation: its `:navigation-title:`
     * where it wrote one, its own title otherwise — the same order the tree
     * uses for every other entry, and the reason a section is named once.
     */
    private function titled(string $document, RenderContext $context, string $written): string
    {
        $entry = $context->getProjectNode()->findDocumentEntry($document);
        if ($entry === null) {
            return $written;
        }

        $navigation = $entry->getAdditionalData('navigationTitle');

        return $navigation instanceof TitleNode ? $navigation->toString() : $entry->getTitle()->toString();
    }

    private function configured(
        array $link,
        string $document,
        RenderContext $context,
        ?string $current,
        array $rootline,
    ): array {
        $away = ($link['external'] ?? false) === true || str_contains($document, '://');
        $entry = [
            /* Named by the page here too, where there is one to ask: a link to
               a document the tree does not list — the root itself, most often
               — still has a title of its own. The written label is what is
               left for somebody else's site, which this renderer cannot ask. */
            'label' => $away ? (string)($link['label'] ?? '') : $this->titled($document, $context, (string)($link['label'] ?? '')),
            'href' => $away ? (string)($link['href'] ?? '') : $this->urlGenerator->generateCanonicalOutputUrl($context, $document),
            'front' => true,
        ];
        if ($away) {
            $entry['external'] = true;

            return $entry;
        }

        if ($document === $current) {
            $entry['current'] = true;
        } elseif (in_array($document, $rootline, true)) {
            $entry['here'] = true;
        }

        return $entry;
    }
}
