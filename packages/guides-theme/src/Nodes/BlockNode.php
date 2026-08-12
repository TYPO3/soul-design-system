<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * A block of a marketing page: a band, a grid, a teaser.
 *
 * One node for three directives, because they are the same thing to a
 * renderer — a run of content with a class on it — and differ only in which
 * template draws them. The template is chosen by the directive that built the
 * node, not by a `switch` here.
 *
 * @extends CompoundNode<Node>
 */
class BlockNode extends CompoundNode {}
