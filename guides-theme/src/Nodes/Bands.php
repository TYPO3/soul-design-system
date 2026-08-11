<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;

use function array_slice;

/**
 * A marketing page, as the run of bands it is.
 *
 * `.. band::` does not wrap a page in itself, it opens one: what follows
 * belongs to it, up to the next band, and what stands before the first one is
 * a band as well — a page opens on the canvas. That is how the source reads
 * like the page it makes, and it is the only way `.sds-band` works at all: a
 * band is full-bleed and takes the page inset itself, so two of them inside
 * one another indent their text by a gutter nobody asked for and the second
 * one stops at the width of the first.
 *
 * The split has to reach through a section, because reStructuredText nests
 * everything under the heading above it — on a page with one `h1` the whole
 * body is one section, and every band an author writes is inside it. So a
 * section that holds a band keeps its heading and everything up to it; from
 * there, the bands are what the page is made of. The `<div class="section">`
 * around the tail is what is lost, and it carries an anchor and no style.
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
            if ($node instanceof BandNode) {
                $this->close();
                $this->options = $node->getOptions();
                $this->fill($node->getChildren());

                continue;
            }

            if ($node instanceof SectionNode && $this->holdsBand($node)) {
                /* The title is already the section's first child, so the head
                   is built from the title and filled from the second one on. */
                $head = new SectionNode($node->getTitle());
                $tail = [];
                foreach (array_slice($node->getChildren(), 1) as $child) {
                    if ($tail !== [] || $this->holdsBand($child)) {
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

    private function holdsBand(Node $node): bool
    {
        if ($node instanceof BandNode) {
            return true;
        }

        if (!$node instanceof CompoundNode) {
            return false;
        }

        foreach ($node->getChildren() as $child) {
            if ($this->holdsBand($child)) {
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
