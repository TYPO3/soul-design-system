<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

use phpDocumentor\Guides\Nodes\Menu\ContentMenuNode;
use phpDocumentor\Guides\Nodes\Menu\SectionMenuEntryNode;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;

/**
 * What is on this page, as the entry every navigation of this theme is given.
 *
 * The sections of the document being rendered, nested as deep as the document
 * nests them, so the element beside the column is handed a list and owns all
 * of its markup — including the entry the reader has scrolled to, which is the
 * one thing about this list no renderer can work out.
 *
 * Separate from `Menu`, which reads the tree the site is: this reads one
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
     * The anchor alone where the section is on the page being rendered, which
     * is every section a contents lists: a fragment moves the page a reader
     * already has, while the document's own URL before it fetches that page
     * again to arrive in the same place. A document is named where it is
     * somebody else's, which is what a list of another page's sections is.
     */
    private function href(SectionMenuEntryNode $node, RenderContext $context): string
    {
        $url = $node->getUrl();
        $here = $context->hasCurrentFileName() && $url === $context->getCurrentFileName();
        $anchor = $node->getAnchor() === '' ? '' : '#' . $node->getAnchor();

        return ($here ? '' : $this->urlGenerator->generateCanonicalOutputUrl($context, $url)) . $anchor;
    }
}
