<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\TextRoles;

use phpDocumentor\Guides\Nodes\Inline\GenericTextRoleInlineNode;
use phpDocumentor\Guides\RestructuredText\Parser\DocumentParserContext;
use phpDocumentor\Guides\RestructuredText\TextRoles\BaseTextRole;

/**
 * A short state in a line, as `sds-badge`.
 *
 *     :badge:`Closed <ok>`  :badge:`Under review <warn>`  :badge:`New`
 *
 * The tone stands in angle brackets after the label, the way a link writes
 * its target: `ok`, `warn`, `error` or `accent`. A word in brackets that is
 * no tone stays part of the label.
 */
final class BadgeTextRole extends BaseTextRole
{
    private const TONES = ['accent', 'ok', 'warn', 'error'];

    protected string $name = 'badge';

    public function processNode(
        DocumentParserContext $documentParserContext,
        string $role,
        string $content,
        string $rawContent,
    ): GenericTextRoleInlineNode {
        $label = trim($content);
        $tone = '';
        if (preg_match('/^(.*\S)\s*<([a-z]+)>$/', $label, $match) === 1 && in_array($match[2], self::TONES, true)) {
            $label = $match[1];
            $tone = $match[2];
        }

        return new GenericTextRoleInlineNode('badge', $label, $tone);
    }
}
