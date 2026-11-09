<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;

/**
 * The picture a link to this page shows on another site, from the fields at
 * the top of the document. `:image:` is the file, `:image-alt:` its text.
 * Either one replaces the `<image>` setting for this page alone.
 */
final class PreviewNode extends MetadataNode
{
    public const FIELDS = ['image', 'image-alt'];

    public function __construct(public readonly string $field, string $value)
    {
        parent::__construct($value);
    }
}
