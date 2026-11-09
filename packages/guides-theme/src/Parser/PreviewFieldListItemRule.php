<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Parser;

use phpDocumentor\Guides\Nodes\FieldLists\FieldListItemNode;
use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\FieldList\FieldListItemRule;
use TYPO3\Soul\GuidesTheme\Nodes\PreviewNode;

/**
 * Reads `:image:` and `:image-alt:` from the field list at the top of a
 * document, for the reason `LayoutFieldListItemRule` reads `:layout:`.
 */
final class PreviewFieldListItemRule implements FieldListItemRule
{
    public function applies(FieldListItemNode $fieldListItemNode): bool
    {
        return in_array(strtolower($fieldListItemNode->getTerm()), PreviewNode::FIELDS, true);
    }

    public function apply(FieldListItemNode $fieldListItemNode, BlockContext $blockContext): MetadataNode
    {
        return new PreviewNode(strtolower($fieldListItemNode->getTerm()), trim($fieldListItemNode->getPlaintextContent()));
    }
}
