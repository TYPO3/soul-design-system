<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Assets;

use phpDocumentor\Guides\Event\PreRenderProcess;

/**
 * The signet, the tab icons and the preview picture, copied once per render.
 *
 * Each page names them, but no node holds them. They are settings. So they
 * go into the output before the first page renders, and not with each page.
 */
final class MarkFiles
{
    /**
     * @param list<array{href: string}> $favicons
     * @param array{href: string, alt: string|null}|null $image
     */
    public function __construct(
        private readonly Files $files,
        private readonly ?string $signet,
        private readonly array $favicons,
        private readonly ?array $image = null,
    ) {}

    public function __invoke(PreRenderProcess $event): void
    {
        $command = $event->getCommand();
        $paths = array_filter([$this->signet, $this->image['href'] ?? null, ...array_column($this->favicons, 'href')]);
        foreach (array_unique($paths) as $path) {
            $this->files->copy(
                $command->getOrigin(),
                $command->getImageDestination(),
                $command->getDestinationPath(),
                '/' . ltrim($path, '/'),
            );
        }
    }
}
