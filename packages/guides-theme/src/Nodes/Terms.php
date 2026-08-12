<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\DefinitionLists\DefinitionListItemNode;
use phpDocumentor\Guides\Nodes\Node;

/**
 * The entries of a glossary, wherever the parser put them.
 *
 * A directive holds its body in whatever the content rule produced — one
 * definition list, or a collection with one inside it — and a template that
 * guessed which would render nothing on the day the other arrived. So the
 * terms are looked for rather than reached for, and a body that holds none is
 * an empty list the template can fall back from.
 */
final class Terms
{
    /**
     * @param Node|Node[]|null $node the directive's body, however it arrived
     *
     * @return DefinitionListItemNode[]
     */
    public static function of(Node|array|null $node): array
    {
        if ($node instanceof DefinitionListItemNode) {
            return [$node];
        }

        $children = match (true) {
            is_array($node) => $node,
            $node instanceof CompoundNode => $node->getChildren(),
            default => [],
        };

        $terms = [];
        foreach ($children as $child) {
            $terms = [...$terms, ...self::of($child)];
        }

        return $terms;
    }
}
