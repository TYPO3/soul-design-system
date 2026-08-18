<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Code;

use Highlight\Highlighter as HighlightPHP;
use phpDocumentor\Guides\Code\Highlighter\Highlighter;
use phpDocumentor\Guides\Code\Highlighter\HighlightResult;

/**
 * The languages no highlighter ships, taught to the one this site renders with.
 *
 * `highlight.php` loads a language from a JSON file and holds the registry
 * statically, so a grammar can be handed to it at any point before a block is
 * coloured — which is what this does, wrapped around the highlighter the code
 * package provides rather than replacing it. Everything it already knows, it
 * still answers; TypoScript it did not.
 *
 * The files beside this package are written from the design system's own
 * sources by `make grammars`, so the colour a reader sees on the server is the
 * colour the element would have drawn in the browser. Never edited here: the
 * name says `.generated.json`, and the next run puts it back.
 */
final class Grammars implements Highlighter
{
    private bool $taught = false;

    public function __construct(private readonly Highlighter $inner) {}

    /** @param array<string, string|null> $debugInformation */
    public function __invoke(string $language, string $code, array $debugInformation): HighlightResult
    {
        $this->teach();

        return ($this->inner)($language, $code, $debugInformation);
    }

    /**
     * Read from the directory rather than from a list: a grammar added to one
     * and not the other is a language that colours in the browser and not on
     * the page, which is exactly the split this file exists to close.
     */
    private function teach(): void
    {
        if ($this->taught) {
            return;
        }

        $this->taught = true;

        foreach (glob(dirname(__DIR__, 2) . '/resources/highlight/*.generated.json') ?: [] as $file) {
            /* Overwriting on purpose. A name this system wrote a grammar for
               is a name it decided the colour of, and a bundled definition
               arriving under it later would change that colour silently. */
            HighlightPHP::registerLanguage(basename($file, '.generated.json'), $file, true);
        }
    }
}
