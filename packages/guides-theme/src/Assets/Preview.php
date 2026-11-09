<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Assets;

use League\Uri\BaseUri;
use League\Uri\Uri;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\ReferenceResolvers\DocumentNameResolverInterface;
use phpDocumentor\Guides\RenderContext;
use TYPO3\Soul\GuidesTheme\Nodes\PreviewNode;

/**
 * The picture a link to a page shows on another site, and what it is.
 *
 * The page's own `:image:` first, then the project's `<image>`. A path from
 * a page resolves from that page and goes into the output here, because no
 * node of the body holds it. The size comes out of the file, so a crawler
 * can lay out the card before it fetches the picture.
 */
final class Preview
{
    /** @param array{href: string, alt: string|null}|null $image */
    public function __construct(
        private readonly DocumentNameResolverInterface $documentNameResolver,
        private readonly Files $files,
        private readonly ?array $image = null,
    ) {}

    /** @return array{src: string, alt: string|null, width: int|null, height: int|null}|null */
    public function of(RenderContext $renderContext, DocumentNode $document): ?array
    {
        $fields = [];
        foreach ($document->getHeaderNodes() as $header) {
            if ($header instanceof PreviewNode && (string)$header->getValue() !== '') {
                $fields[$header->field] = (string)$header->getValue();
            }
        }

        if (isset($fields['image'])) {
            $src = $this->bring($fields['image'], $renderContext);
            $alt = $fields['image-alt'] ?? null;
        } elseif ($this->image !== null) {
            $src = '/' . ltrim($this->image['href'], '/');
            $alt = $fields['image-alt'] ?? $this->image['alt'];
        } else {
            return null;
        }

        return ['src' => $src, 'alt' => $alt, ...$this->measure($src, $renderContext)];
    }

    /** The path in the source, the file copied into the output. A URL stays. */
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

    /**
     * The size the file says it has. Nothing where it says nothing, because a
     * wrong size is worse for a crawler than none.
     *
     * @return array{width: int|null, height: int|null}
     */
    private function measure(string $src, RenderContext $renderContext): array
    {
        $none = ['width' => null, 'height' => null];
        if (BaseUri::from(Uri::new($src))->isAbsolute()) {
            return $none;
        }

        try {
            $contents = $renderContext->getOrigin()->has($src) ? $renderContext->getOrigin()->read($src) : false;
        } catch (\Throwable) {
            return $none;
        }

        $size = is_string($contents) ? @getimagesizefromstring($contents) : false;
        if ($size === false) {
            return $none;
        }

        return [
            'width' => $size[0] ?: null,
            'height' => $size[1] ?: null,
        ];
    }
}
