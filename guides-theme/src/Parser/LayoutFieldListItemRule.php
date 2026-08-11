<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Parser;

use phpDocumentor\Guides\Nodes\FieldLists\FieldListItemNode;
use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\FieldList\FieldListItemRule;
use TYPO3\Soul\GuidesTheme\Nodes\LayoutNode;

/**
 * Reads `:layout:` from the field list at the top of a document.
 *
 * A field nobody claims is rendered as a definition list in the body, so this
 * rule is not decoration: without it, `:layout: marketing` would appear as
 * visible text on the page it was meant to configure.
 */
final class LayoutFieldListItemRule implements FieldListItemRule
{
    public function applies(FieldListItemNode $fieldListItemNode): bool
    {
        return \strtolower($fieldListItemNode->getTerm()) === 'layout';
    }

    public function apply(FieldListItemNode $fieldListItemNode, BlockContext $blockContext): MetadataNode
    {
        return new LayoutNode(\strtolower(\trim($fieldListItemNode->getPlaintextContent())));
    }
}
