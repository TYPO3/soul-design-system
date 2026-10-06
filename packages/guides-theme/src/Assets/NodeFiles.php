<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Assets;

use League\Uri\BaseUri;
use League\Uri\Uri;
use phpDocumentor\Guides\NodeRenderers\PreRenderers\PreNodeRenderer;
use phpDocumentor\Guides\Nodes\EmbeddedFrame;
use phpDocumentor\Guides\Nodes\FigureNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\ReferenceResolvers\DocumentNameResolverInterface;
use phpDocumentor\Guides\RenderContext;
use TYPO3\Soul\GuidesTheme\Nodes\CardNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;

/**
 * The files a node of this theme points at, copied before the node renders.
 *
 * `asset()` gives a URL and copies nothing. So every node whose template
 * calls it with a file of the documentation comes through here first. The
 * path becomes absolute in the source, as the renderer does for an image. A
 * relative path then resolves from the document that wrote it.
 */
final class NodeFiles implements PreNodeRenderer
{
    public function __construct(
        private readonly DocumentNameResolverInterface $documentNameResolver,
        private readonly Files $files,
    ) {}

    public function supports(Node $node): bool
    {
        return $node instanceof EmbeddedFrame
            || $node instanceof FigureNode
            || $node instanceof CardNode
            || $node instanceof HeroNode;
    }

    public function execute(Node $node, RenderContext $renderContext): Node
    {
        if ($node instanceof EmbeddedFrame) {
            $this->bring($node->getUrl(), $renderContext);

            return $node;
        }

        if ($node instanceof FigureNode) {
            $image = $node->getImage();
            $image->setValue($this->bring((string)$image->getValue(), $renderContext));

            return $node;
        }

        $src = $node->getOption('src');
        if (!is_string($src) || $src === '') {
            return $node;
        }

        return $node->withOptions(['src' => $this->bring($src, $renderContext)]);
    }

    /** The path the template gives to `asset()`. A URL stays as it is. */
    private function bring(string $path, RenderContext $renderContext): string
    {
        if (BaseUri::from(Uri::new($path))->isAbsolute()) {
            return $path;
        }

        $absolute = $this->documentNameResolver->absoluteUrl($renderContext->getDirName(), $path);
        $this->files->copy(
            $renderContext->getOrigin(),
            $renderContext->getImageDestination(),
            $renderContext->getDestinationPath(),
            $absolute,
            $renderContext->getLoggerInformation(),
        );

        return $absolute;
    }
}
