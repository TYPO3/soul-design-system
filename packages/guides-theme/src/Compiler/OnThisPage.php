<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Compiler;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Compiler\NodeTransformer;
use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\Menu\ContentMenuNode;
use phpDocumentor\Guides\Nodes\Menu\SectionMenuEntryNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;
use TYPO3\Soul\GuidesTheme\Nodes\LayoutNode;

/**
 * The contents an author did not write.
 *
 * What is on a page is the page's own, the way its breadcrumb and the way on
 * from it are: read out of the document rather than typed at the top of it, so
 * a heading added to a page reaches the list by itself and no page is missing
 * one because somebody forgot a line. `.. contents::` stays what it always
 * was and wins wherever it is written — with a caption, a `:depth:`, or
 * somewhere other than under the title.
 *
 * It is the directive's own node that is inserted, so everything after this
 * point is the path a written one takes: the core fills the entries in, and
 * `body/menu/content-menu.html.twig` draws them.
 */
final class OnThisPage implements NodeTransformer
{
    /**
     * How many headings a page owes a reader before a list of them is worth
     * the column. One is the page itself said twice.
     */
    private const LEAST = 2;

    public function supports(Node $node): bool
    {
        return $node instanceof SectionNode;
    }

    public function enterNode(Node $node, CompilerContextInterface $compilerContext): Node
    {
        return $node;
    }

    public function leaveNode(Node $node, CompilerContextInterface $compilerContext): ?Node
    {
        $document = $compilerContext->getDocumentNode();
        if (!$node instanceof SectionNode || $this->opener($document) !== $node) {
            return $node;
        }

        if ($this->marketing($document) || $this->written($document) || $this->headings($node) < self::LEAST) {
            return $node;
        }

        return $this->with($node, $document);
    }

    /** Before the core resolves a contents into entries, which is 4500. */
    public function getPriority(): int
    {
        return 4600;
    }

    /**
     * The section a page opens with. Everything a reader sees is under it —
     * reStructuredText nests a document beneath its own title — and a page
     * with a second one at that level is two pages in a file.
     */
    private function opener(DocumentNode $document): ?SectionNode
    {
        foreach ($document->getChildren() as $child) {
            if ($child instanceof SectionNode) {
                return $child;
            }
        }

        return null;
    }

    /** A landing page navigates nothing: it is the way in, not a reference. */
    private function marketing(DocumentNode $document): bool
    {
        foreach ($document->getHeaderNodes() as $header) {
            if ($header instanceof LayoutNode && $header->getValue() === LayoutNode::MARKETING) {
                return true;
            }
        }

        return false;
    }

    /** Written anywhere in the document, at any depth, and it stands. */
    private function written(Node $node): bool
    {
        if ($node instanceof ContentMenuNode) {
            return true;
        }

        if (!$node instanceof CompoundNode) {
            return false;
        }

        foreach ($node->getChildren() as $child) {
            if ($this->written($child)) {
                return true;
            }
        }

        return false;
    }

    private function headings(SectionNode $section): int
    {
        $count = 0;
        foreach ($section->getChildren() as $child) {
            if ($child instanceof SectionNode) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Under the title and above everything else, which is where an author
     * writes one and the only place it reads as being about the page rather
     * than about the section it landed in. The section is cloned rather than
     * built again: a heading carries classes and options of its own, and a new
     * node would be that heading with them dropped.
     */
    private function with(SectionNode $section, DocumentNode $document): SectionNode
    {
        $children = $section->getChildren();
        array_splice($children, 1, 0, [new ContentMenuNode([new SectionMenuEntryNode($document->getFilePath())])]);

        $written = clone $section;
        $written->setValue($children);

        return $written;
    }
}
