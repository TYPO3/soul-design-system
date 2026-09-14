<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CodeNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * The source, and what it renders as — from the one body.
 *
 * The source is a `CodeNode`. A code block on this site gets its colour on
 * the server and carries a head and a copy button. It stands beside the
 * children rather than among them. A template that has to know the first
 * child is the source can get a body that starts with something else.
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
