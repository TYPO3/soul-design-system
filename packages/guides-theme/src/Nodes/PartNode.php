<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\AbstractNode;

/**
 * The name of a part, before the first heading in it. `Parts` takes it out
 * of the tree and puts it on that section.
 *
 * @extends AbstractNode<string>
 */
final class PartNode extends AbstractNode
{
    public function __construct(string $label)
    {
        $this->value = $label;
    }
}
