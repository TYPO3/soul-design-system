<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;

/**
 * A line of the panel of a paper, from the fields at the top of the
 * document. `:eyebrow:` stands over the title, `:foot:` under the outline.
 */
final class PaperFieldNode extends MetadataNode
{
    public const FIELDS = ['eyebrow', 'foot', 'numbered', 'deck'];

    public function __construct(public readonly string $field, string $value)
    {
        parent::__construct($value);
    }
}
