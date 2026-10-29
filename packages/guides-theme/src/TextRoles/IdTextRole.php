<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\TextRoles;

use phpDocumentor\Guides\Nodes\Inline\AbstractLinkInlineNode;
use phpDocumentor\Guides\Nodes\Inline\PlainTextInlineNode;
use phpDocumentor\Guides\Nodes\Inline\ReferenceNode;
use phpDocumentor\Guides\RestructuredText\TextRoles\AbstractReferenceTextRole;

/**
 * An id in a line that links to what it names, set in mono.
 *
 *     :id:`B10 <feat-b10>`
 *
 * The same reference as `:ref:`. An id is a name the machine gave the
 * thing, and mono says so. A `:ref:` cannot hold a literal in its words.
 */
final class IdTextRole extends AbstractReferenceTextRole
{
    public function getName(): string
    {
        return 'id';
    }

    /** @return list<string> */
    public function getAliases(): array
    {
        return [];
    }

    protected function createNode(string $referenceTarget, ?string $referenceName, string $role): AbstractLinkInlineNode
    {
        $node = new ReferenceNode($referenceTarget, $referenceName !== null ? [new PlainTextInlineNode($referenceName)] : []);
        $node->setClasses(['sds-mono']);

        return $node;
    }
}
