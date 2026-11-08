<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Parser;

use phpDocumentor\Guides\Nodes\FieldLists\FieldListItemNode;
use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\FieldList\FieldListItemRule;
use TYPO3\Soul\GuidesTheme\Nodes\OnThisPageNode;

/**
 * Reads `:on-this-page:` from the field list at the top of a document, for
 * the reason `LayoutFieldListItemRule` reads `:layout:`. A field nobody
 * claims is visible text on the page it exists to configure.
 */
final class OnThisPageFieldListItemRule implements FieldListItemRule
{
    public function applies(FieldListItemNode $fieldListItemNode): bool
    {
        return strtolower($fieldListItemNode->getTerm()) === 'on-this-page';
    }

    public function apply(FieldListItemNode $fieldListItemNode, BlockContext $blockContext): MetadataNode
    {
        return new OnThisPageNode(strtolower(trim($fieldListItemNode->getPlaintextContent())));
    }
}
