<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\AbstractNode;

/**
 * The short name of the next section, before its heading. `Parts` puts it
 * on that section, and the node itself draws nothing.
 *
 * @extends AbstractNode<string>
 */
final class OutlineNode extends AbstractNode
{
    public function __construct(string $label)
    {
        $this->value = $label;
    }
}
