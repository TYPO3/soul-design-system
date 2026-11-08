<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;

/**
 * If a manual page lists its own headings beside them.
 *
 * Written at the top of a document, beside `:navigation-title:`:
 *
 *     :on-this-page: no
 *
 * A way in, such as a page for one audience, has a few sections and no
 * reader who navigates them. The list then takes width from the hero and
 * the cards. The headings stay, with their addresses.
 */
final class OnThisPageNode extends MetadataNode
{
    /** The words that turn the list off. Anything else leaves it on. */
    public const OFF = ['no', 'none', 'off', 'false', '0'];

    public function isOff(): bool
    {
        return in_array($this->getValue(), self::OFF, true);
    }
}
