<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Inline\LinkInlineNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * A card, whose title is written as inline markup.
 *
 * That is not a preference: TYPO3 documentation writes where a card goes into
 * the title itself — `.. card:: :ref:`Introduction <introduction>`` — so the
 * argument arrives as a reference and not as a string. The text of it is the
 * heading and the reference is the target, which is why both are read off here
 * instead of in the template: what the two are is a fact about the node, and a
 * template that worked it out would be a template a project ends up copying.
 */
final class CardNode extends BlockNode
{
    /** @param list<Node> $children */
    public function __construct(private readonly InlineCompoundNode $title, array $children = [])
    {
        parent::__construct($children);
    }

    public function getTitle(): InlineCompoundNode
    {
        return $this->title;
    }

    /** The link the title is, where it is one. Its URL is resolved at render. */
    public function getLink(): ?LinkInlineNode
    {
        return $this->linkIn($this->title);
    }

    private function linkIn(CompoundNode $node): ?LinkInlineNode
    {
        foreach ($node->getChildren() as $child) {
            if ($child instanceof LinkInlineNode) {
                return $child;
            }

            if ($child instanceof CompoundNode) {
                $found = $this->linkIn($child);
                if ($found instanceof LinkInlineNode) {
                    return $found;
                }
            }
        }

        return null;
    }
}
