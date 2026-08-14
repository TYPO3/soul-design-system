<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

/**
 * A unified diff, read into the rows `sds-diff` draws.
 *
 * The element takes its rows as data and colours them itself; it never gets
 * markup, because a row's own class is the element's name for its own node
 * and no renderer may write one. So the reading happens here — the same
 * arrangement `sds-tabs` and `sds-nav-breadcrumb` are fed by, and the reason a reader
 * with no JavaScript still gets a coloured diff.
 *
 * `+++` and `---` are the file headers rather than changed lines: the block's
 * head already says which file this is, and tinting them green and red says a
 * file was added and removed. Everything else unmarked is context, which
 * covers `@@` and `diff --git` without naming them.
 */
final class DiffExtension extends AbstractExtension
{
    /** @return TwigFilter[] */
    public function getFilters(): array
    {
        return [new TwigFilter('diff_rows', $this->rows(...))];
    }

    /** @return list<array{kind: string, text: string}> */
    public function rows(string $source): array
    {
        return array_map($this->row(...), explode("\n", rtrim($source, "\n")));
    }

    /** @return array{kind: string, text: string} */
    private function row(string $line): array
    {
        if (str_starts_with($line, '+++') || str_starts_with($line, '---')) {
            return ['kind' => 'context', 'text' => $line];
        }

        if (str_starts_with($line, '+')) {
            return ['kind' => 'add', 'text' => substr($line, 1)];
        }

        if (str_starts_with($line, '-')) {
            return ['kind' => 'del', 'text' => substr($line, 1)];
        }

        /* A context line carries one leading space in the format, and the
           element draws the gutter itself. */
        return ['kind' => 'context', 'text' => str_starts_with($line, ' ') ? substr($line, 1) : $line];
    }
}
