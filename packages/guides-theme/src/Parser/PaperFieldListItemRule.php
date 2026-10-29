<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Parser;

use phpDocumentor\Guides\Nodes\FieldLists\FieldListItemNode;
use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\FieldList\FieldListItemRule;
use TYPO3\Soul\GuidesTheme\Nodes\PaperFieldNode;

/**
 * Reads `:eyebrow:` and `:foot:` from the field list at the top of a paper,
 * for the reason `LayoutFieldListItemRule` reads `:layout:`. A field nobody
 * claims renders as a definition list in the body.
 */
final class PaperFieldListItemRule implements FieldListItemRule
{
    public function applies(FieldListItemNode $fieldListItemNode): bool
    {
        return in_array(strtolower($fieldListItemNode->getTerm()), PaperFieldNode::FIELDS, true);
    }

    public function apply(FieldListItemNode $fieldListItemNode, BlockContext $blockContext): MetadataNode
    {
        return new PaperFieldNode(strtolower($fieldListItemNode->getTerm()), trim($fieldListItemNode->getPlaintextContent()));
    }
}
