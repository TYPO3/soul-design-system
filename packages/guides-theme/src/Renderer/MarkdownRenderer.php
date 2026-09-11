<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Renderer;

use phpDocumentor\Guides\Renderer\BaseTypeRenderer;

/**
 * The same documents, written a second time as Markdown.
 *
 * A format is a file extension to this renderer — `createFileUrl()` is the
 * name plus the format — so a document rendered as `md` lands beside its page
 * and every reference inside it resolves to the Markdown of the page it points
 * at, which is what makes the twin a site of its own rather than a file beside
 * a page. Nothing to override: the base walks the documents and hands each to
 * the node renderers registered for the format it was asked for.
 */
final class MarkdownRenderer extends BaseTypeRenderer {}
