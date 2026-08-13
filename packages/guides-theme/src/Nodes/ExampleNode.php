<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CodeNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * What was written, and what it renders as — from the one body.
 *
 * The source is a `CodeNode` because a code block on this site is highlighted
 * on the server and carries a head and a copy button. It is held beside the
 * children rather than among them: a template that had to know the first child
 * was the source could be handed a body starting with something else.
 */
final class ExampleNode extends BlockNode
{
    /** @param list<Node> $children */
    public function __construct(private readonly CodeNode $source, array $children = [])
    {
        parent::__construct($children);
    }

    public function getSource(): CodeNode
    {
        return $this->source;
    }
}
