<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Assets;

use League\Flysystem\FilesystemInterface;
use phpDocumentor\FileSystem\FileSystem;
use Psr\Log\LoggerInterface;

/**
 * Copies a file of the documentation into the output.
 *
 * The renderer copies only the image of an `image` or a `figure` node that it
 * renders. This theme points at more files than that: a card, a specimen, the
 * signet. Each of these goes through here, to the same place and with the
 * same errors as an image.
 */
final class Files
{
    public function __construct(private readonly LoggerInterface $logger) {}

    /**
     * @param string $path the path in the documentation, with the leading slash
     * @param array<string, mixed> $context what the log says about the document
     */
    public function copy(
        FilesystemInterface|FileSystem $origin,
        FileSystem $destination,
        string $destinationPath,
        string $path,
        array $context = [],
    ): void {
        try {
            if ($origin->has($path) === false) {
                $this->logger->error(sprintf('File not found "%s"', $path), $context);

                return;
            }

            $contents = $origin->read($path);
            if ($contents === false) {
                $this->logger->error(sprintf('Unable to read file "%s"', $path), $context);

                return;
            }

            if ($destination->put('/' . ltrim($destinationPath . '/' . $path, '/'), $contents) === false) {
                $this->logger->error(sprintf('Unable to write file "%s"', $path), $context);
            }
        } catch (\Throwable $e) {
            $this->logger->error(sprintf('Unable to write file "%s", %s', $path, $e->getMessage()), $context);
        }
    }
}
