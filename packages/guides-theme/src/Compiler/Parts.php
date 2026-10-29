<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Compiler;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Compiler\NodeTransformer;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;
use TYPO3\Soul\GuidesTheme\Navigation\Numbers;
use TYPO3\Soul\GuidesTheme\Nodes\OutlineNode;
use TYPO3\Soul\GuidesTheme\Nodes\PaperFieldNode;
use TYPO3\Soul\GuidesTheme\Nodes\PartNode;

/**
 * A part on the section it begins.
 *
 * `.. part::` stands before a heading, so the parser puts it at the end of
 * the section before. Left there, its name sits a section's distance above
 * the heading it names. This gives its name to the next section in the
 * document, as the option `part`, and the part itself draws nothing.
 */
final class Parts implements NodeTransformer
{
    /** The name of the part the next section begins, in the document in hand. */
    private ?string $pending = null;

    /** The short name of the next section in the outline. */
    private ?string $short = null;
    public function __construct(private readonly Numbers $numbers) {}

    public function supports(Node $node): bool
    {
        return $node instanceof DocumentNode || $node instanceof PartNode || $node instanceof OutlineNode || $node instanceof SectionNode;
    }

    /**
     * On the way in, because the traversal replaces a node through its parent
     * only before it walks the children.
     */
    public function enterNode(Node $node, CompilerContextInterface $compilerContext): Node
    {
        if ($node instanceof DocumentNode) {
            /* The `:eyebrow:` of a paper stands over its title and in its
               panel, as the first part does over its heading. */
            $this->pending = null;
            foreach ($node->getHeaderNodes() as $header) {
                if ($header instanceof PaperFieldNode && $header->field === 'eyebrow') {
                    $this->pending = (string)$header->getValue();
                }
            }
        } elseif ($node instanceof PartNode) {
            $this->pending = (string)$node->getValue();
            $this->numbers->part($compilerContext->getDocumentNode()->getFilePath(), $this->pending);
        } elseif ($node instanceof OutlineNode) {
            $this->short = (string)$node->getValue();
        } elseif ($node instanceof SectionNode && ($this->pending !== null || $this->short !== null)) {
            $node = $node->withOptions(array_filter(['part' => $this->pending, 'short' => $this->short], static fn($v) => $v !== null));
            $this->pending = $this->short = null;
        }

        return $node;
    }

    /**
     * The part stays where it stands and renders as nothing. A removed node
     * renumbers its siblings, and the next replace then lands one place off.
     */
    public function leaveNode(Node $node, CompilerContextInterface $compilerContext): ?Node
    {
        return $node;
    }

    /** After the pass that turns a directive into its node, which is 100. */
    public function getPriority(): int
    {
        return 90;
    }
}
