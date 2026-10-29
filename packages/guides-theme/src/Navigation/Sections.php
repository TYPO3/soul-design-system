<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\Menu\ContentMenuNode;
use phpDocumentor\Guides\Nodes\Menu\SectionMenuEntryNode;
use phpDocumentor\Guides\Nodes\SectionNode;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;

/**
 * What is on this page, as the entry every navigation of this theme gets.
 *
 * The sections of the document in hand, nested as deep as the document nests
 * them. So the element beside the column gets a list and owns all of its
 * markup, the entry the reader has scrolled to included. That entry is the
 * one thing about this list no renderer can work out.
 *
 * Separate from `Menu`, which reads the tree the site is. This reads one
 * document, and the two lists answer different questions with the same shape.
 */
final class Sections
{
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
    ) {}

    /** @return list<array<string, mixed>> */
    public function of(RenderContext $context, ContentMenuNode $node): array
    {
        $entries = [];
        foreach ($node->getMenuEntries() as $entry) {
            if (!$entry instanceof SectionMenuEntryNode) {
                continue;
            }

            $entries[] = $this->entry($entry, $context);
        }

        return $entries;
    }

    /**
     * The outline of a whole document: every section under its title, nested
     * as the document nests them. For the panel of a paper, which lists the
     * page it stands beside.
     *
     * @return list<array<string, mixed>>
     */
    public function outline(DocumentNode $document): array
    {
        foreach ($document->getChildren() as $child) {
            if ($child instanceof SectionNode) {
                return $this->parts($child);
            }
        }

        return [];
    }

    /**
     * The sections under the title, each part as an entry that holds the
     * sections from the one it begins on. The outline draws it as a head.
     *
     * @return list<array<string, mixed>>
     */
    private function parts(SectionNode $opener): array
    {
        $entries = [];
        $part = null;
        foreach ($opener->getChildren() as $child) {
            if (!$child instanceof SectionNode) {
                continue;
            }

            $entry = $this->section($child);
            $name = $child->getOption('part');
            if (is_string($name) && $name !== '') {
                if ($part !== null) {
                    $entries[] = $part;
                }
                $part = ['label' => $name, 'part' => true, 'items' => []];
            }

            if ($part === null) {
                $entries[] = $entry;
            } else {
                $part['items'][] = $entry;
            }
        }

        if ($part !== null) {
            $entries[] = $part;
        }

        return $entries;
    }

    /** @return array<string, mixed> */
    private function section(SectionNode $section): array
    {
        $short = $section->getOption('short');
        $label = is_string($short) && $short !== '' ? $short : $section->getTitle()->toString();
        $entry = ['label' => $label, 'href' => '#' . $section->getTitle()->getId()];
        $items = $this->under($section);
        if ($items !== []) {
            $entry['items'] = $items;
        }

        return $entry;
    }

    /** @return list<array<string, mixed>> */
    private function under(SectionNode $section): array
    {
        $entries = [];
        foreach ($section->getChildren() as $child) {
            if (!$child instanceof SectionNode) {
                continue;
            }

            $entries[] = $this->section($child);
        }

        return $entries;
    }

    /**
     * One section and everything under it.
     *
     * @return array<string, mixed>
     */
    private function entry(SectionMenuEntryNode $node, RenderContext $context): array
    {
        $entry = [
            'label' => $node->getValue()?->toString() ?? '',
            'href' => $this->href($node, $context),
        ];

        $under = [];
        foreach ($node->getSections() as $section) {
            $under[] = $this->entry($section, $context);
        }

        if ($under !== []) {
            $entry['items'] = $under;
        }

        return $entry;
    }

    /**
     * The anchor alone where the section is on the page in hand, which is
     * every section a contents lists. A fragment moves the page a reader
     * already has. The document's own URL before it fetches that page again
     * to arrive in the same place. The document's name stands where it
     * is somebody else's, which is what a list of another page's sections is.
     */
    private function href(SectionMenuEntryNode $node, RenderContext $context): string
    {
        $url = $node->getUrl();
        $here = $context->hasCurrentFileName() && $url === $context->getCurrentFileName();
        $anchor = $node->getAnchor() === '' ? '' : '#' . $node->getAnchor();

        return ($here ? '' : $this->urlGenerator->generateCanonicalOutputUrl($context, $url)) . $anchor;
    }
}
