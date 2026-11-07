<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\TextRoles;

use phpDocumentor\Guides\Nodes\Inline\GenericTextRoleInlineNode;
use phpDocumentor\Guides\RestructuredText\Parser\DocumentParserContext;
use phpDocumentor\Guides\RestructuredText\TextRoles\BaseTextRole;

/**
 * A state as a glyph, for a cell of a matrix, as `sds-icon`.
 *
 *     :state:`Available <ok>`  :state:`In part <warn>`  :state:`Missing <error>`
 *
 * The words name the glyph for a reader who cannot see it, and they do not
 * show. The word in angle brackets picks the glyph and its colour. Without one
 * the glyph is the stated boundary, in the ink of the text.
 */
final class StateTextRole extends BaseTextRole
{
    private const TONES = ['ok', 'warn', 'error'];

    protected string $name = 'state';

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

        return new GenericTextRoleInlineNode('state', $label, $tone);
    }
}
