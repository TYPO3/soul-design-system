<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * A block of a marketing page.
 *
 * The directives share one shape because each is a run of content with
 * options; the node class selects the template that draws it.
 *
 * @extends CompoundNode<Node>
 */
class BlockNode extends CompoundNode {}
