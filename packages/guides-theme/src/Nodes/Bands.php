<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\AnchorNode;
use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;

/**
 * A marketing page, as the run of bands it is.
 *
 * `.. band::` does not wrap a page in itself, it opens one. What follows
 * belongs to it, up to the next band. What stands before the first one is a
 * band as well — a page opens on the canvas. That is how the source reads
 * like the page it makes, and it is the only way `.sds-band` works at all.
 *
 * A band is full-bleed and takes the page inset itself. Two of them inside one
 * another indent their text by a gutter nobody asked for. The second one
 * stops at the width of the first.
 *
 * The split has to reach through a section, because reStructuredText nests
 * everything under the heading above it. On a page with one `h1` the whole
 * body is one section, and every band an author writes is inside it. So a
 * section that holds a band keeps its heading and everything up to it. From
 * there, the bands are what the page consists of. The `<div class="section">`
 * around the tail is what goes, and it carries an anchor and no style.
 */
final class Bands
{
    /** @var BandNode[] */
    private array $bands = [];

    /** @var Node[] */
    private array $open = [];

    /** @var array<string, scalar|null> */
    private array $options = [];

    /**
     * @param Node[] $nodes the children of the document
     *
     * @return BandNode[]
     */
    public static function of(array $nodes): array
    {
        $run = new self();
        $run->fill($nodes);
        $run->close();

        return $run->bands;
    }

    /** @param Node[] $nodes */
    private function fill(array $nodes): void
    {
        foreach ($nodes as $node) {
            $opening = $node instanceof SectionNode ? self::opening($node) : null;
            if ($opening !== null) {
                [$hero, $tail] = $opening;
                $this->open[] = $hero;
                $this->fill($tail);

                continue;
            }

            if ($node instanceof BandNode) {
                $this->close();
                $this->options = $node->getOptions();
                $this->fill($node->getChildren());

                continue;
            }

            if ($node instanceof SectionNode && self::holdsBand($node)) {
                /* The title is already the section's first child, so the head
                   starts from the title and fills from the second one on. */
                $head = new SectionNode($node->getTitle());
                $tail = [];
                foreach (array_slice($node->getChildren(), 1) as $child) {
                    if ($tail !== [] || self::holdsBand($child)) {
                        $tail[] = $child;

                        continue;
                    }

                    $head->addChildNode($child);
                }

                $this->open[] = $head;
                $this->fill($tail);

                continue;
            }

            $this->open[] = $node;
        }
    }

    /**
     * A section whose heading a hero follows, as the hero that holds the
     * heading. The heading and the copy share the first column, beside the
     * picture, in every layout. What follows stands under the hero, up to
     * the first band. That and what comes after it are the tail.
     *
     * @return array{0: HeroNode, 1: Node[]}|null
     */
    public static function opening(SectionNode $node): ?array
    {
        /* A label before the title or after it is an anchor, not content. It
           stays on the page, in the copy, so every `:ref:` to it still lands. */
        $anchors = [];
        $rest = [];
        $hero = null;
        foreach ($node->getChildren() as $child) {
            if ($child === $node->getTitle()) {
                continue;
            }

            if ($hero === null && $child instanceof AnchorNode) {
                $anchors[] = $child;

                continue;
            }

            if ($hero === null) {
                if (!$child instanceof HeroNode) {
                    return null;
                }

                $hero = $child;

                continue;
            }

            $rest[] = $child;
        }

        if ($hero === null) {
            return null;
        }

        /* The other half stays a child of the hero, beside the copy, so the
           element finds it as its figure region. */
        $copy = new SectionNode($node->getTitle());
        $figures = [];
        foreach ([...$anchors, ...$hero->getChildren()] as $child) {
            if ($child instanceof HeroFigureNode) {
                $figures[] = $child;

                continue;
            }

            $copy->addChildNode($child);
        }

        $content = [$copy, ...$figures];
        while ($rest !== [] && !self::holdsBand($rest[0])) {
            $content[] = array_shift($rest);
        }

        return [(new HeroNode($content))->withOptions($hero->getOptions()), $rest];
    }

    private static function holdsBand(Node $node): bool
    {
        if ($node instanceof BandNode) {
            return true;
        }

        if (!$node instanceof CompoundNode) {
            return false;
        }

        foreach ($node->getChildren() as $child) {
            if (self::holdsBand($child)) {
                return true;
            }
        }

        return false;
    }

    /** A band with nothing in it and nothing to say is not a band. */
    private function close(): void
    {
        if ($this->open === [] && $this->options === []) {
            return;
        }

        $this->bands[] = (new BandNode($this->open))->withOptions($this->options);
        $this->open = [];
        $this->options = [];
    }
}
