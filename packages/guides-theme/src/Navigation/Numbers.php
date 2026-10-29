<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Navigation;

/**
 * The numbers of a paper that counts its parts: its sections, figures,
 * tables and decisions, and which label names which of them.
 *
 * `Counting` fills it while the documents compile, and a template reads it.
 * Read rather than written into the tree, because a node the compiler
 * replaces is a node a later pass no longer finds.
 */
final class Numbers
{
    /** @var array<string, array<string, string>> kind, then key, then number */
    private array $numbers = [];

    /** @var array<string, array{string, string}> label, then kind and number */
    private array $labels = [];

    /** @var array<string, list<string>> document, then its parts in order */
    private array $parts = [];

    public function part(string $document, string $name): void
    {
        $this->parts[$document][] = $name;
    }

    /** @return list<string> */
    public function parts(string $document): array
    {
        return $this->parts[$document] ?? [];
    }

    public function set(string $kind, string $key, string $number): void
    {
        $this->numbers[$kind][$key] = $number;
    }

    public function label(string $label, string $kind, string $number): void
    {
        $this->labels[strtolower($label)] = [$kind, $number];
    }

    /** The number of a section, a figure, a table or a decision, or ''. */
    public function of(string $kind, string $key): string
    {
        return $this->numbers[$kind][$key] ?? '';
    }

    /** What a reference to a label says after its words: `section 3.1`, or ''. */
    public function at(string $label): string
    {
        $found = $this->labels[strtolower($label)] ?? null;

        return $found === null ? '' : $found[0] . ' ' . $found[1];
    }
}
