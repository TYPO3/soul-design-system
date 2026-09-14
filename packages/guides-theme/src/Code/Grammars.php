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
 * in a static. So a grammar can reach it at any point before a block gets its
 * colour. That is what this does, wrapped around the highlighter the code
 * package provides rather than in its place. Everything it already knows, it
 * still answers; TypoScript it did not.
 *
 * `make grammars` writes the files beside this package from the design
 * system's own sources. So the colour a reader sees on the server is the
 * colour the element draws in the browser. Never edited here: the name says
 * `.generated.json`, and the next run puts it back.
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
     * Read from the directory rather than from a list. A grammar added to one
     * and not the other is a language that colours in the browser and not on
     * the page. That is exactly the split this file exists to close.
     */
    private function teach(): void
    {
        if ($this->taught) {
            return;
        }

        $this->taught = true;

        foreach (glob(dirname(__DIR__, 2) . '/resources/highlight/*.generated.json') ?: [] as $file) {
            /* An overwrite on purpose. A name this system wrote a grammar for
               is a name it decided the colour of. A bundled definition that
               arrives under it later changes that colour silently. */
            HighlightPHP::registerLanguage(basename($file, '.generated.json'), $file, true);
        }
    }
}
