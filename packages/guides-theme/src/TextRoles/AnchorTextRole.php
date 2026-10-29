<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\TextRoles;

use phpDocumentor\Guides\Exception\DuplicateLinkAnchorException;
use phpDocumentor\Guides\Meta\InternalTarget;
use phpDocumentor\Guides\Nodes\Inline\GenericTextRoleInlineNode;
use phpDocumentor\Guides\Nodes\SectionNode;
use phpDocumentor\Guides\RestructuredText\Parser\DocumentParserContext;
use phpDocumentor\Guides\RestructuredText\TextRoles\BaseTextRole;

/**
 * An address in a line, as a target of `:ref:`.
 *
 *     :anchor:`P2 <step-p2>`
 *
 * A label stands before a block, so a word in a table cell or in a sentence
 * has none. This gives it one: the words stay as they are, and the address
 * in angle brackets is the id a `:ref:` names. Without brackets, the words
 * are the address too.
 */
final class AnchorTextRole extends BaseTextRole
{
    protected string $name = 'anchor';

    public function processNode(
        DocumentParserContext $documentParserContext,
        string $role,
        string $content,
        string $rawContent,
    ): GenericTextRoleInlineNode {
        $words = trim($content);
        $address = '';
        if (preg_match('/^(.*\S)\s*<([^<>]+)>$/', $words, $match) === 1) {
            $words = $match[1];
            $address = trim($match[2]);
        }

        $address = strtolower((string)preg_replace('/[^A-Za-z0-9_-]+/', '-', $address !== '' ? $address : $words));
        try {
            $documentParserContext->getProjectNode()->addLinkTarget(
                $address,
                new InternalTarget($documentParserContext->getContext()->getCurrentFileName(), $address, $words, SectionNode::STD_LABEL),
            );
        } catch (DuplicateLinkAnchorException) {
            /* The renderer names a second target with one name itself. */
        }

        return new GenericTextRoleInlineNode('anchor', $words, $address);
    }
}
