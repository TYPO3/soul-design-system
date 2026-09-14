<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use TYPO3\Soul\GuidesTheme\Nodes\Opening;

/**
 * What a Markdown template cannot do with the language it is written in.
 *
 * Markdown is a whitespace format: a block is separated by a blank line, a
 * nested one by a prefix on every line of it, and a fence by a run of
 * backticks longer than anything inside it. None of that is a string
 * operation, and a template computing it in `replace` filters is a template
 * nobody can read — so each is a filter here, and a container separates the
 * blocks it holds rather than every template guessing what follows it.
 */
final class MarkdownExtension extends AbstractExtension
{
    /** @return TwigFilter[] */
    public function getFilters(): array
    {
        return [
            new TwigFilter('md_tidy', $this->tidy(...)),
            new TwigFilter('md_indent', $this->indent(...)),
            new TwigFilter('md_quote', $this->quote(...)),
            new TwigFilter('md_fence', $this->fence(...)),
            new TwigFilter('md_escape', $this->escape(...)),
            new TwigFilter('md_code', $this->code(...)),
            new TwigFilter('md_line', $this->line(...)),
            new TwigFilter('md_cell', $this->cell(...)),
            new TwigFilter('md_break', $this->lineBreak(...)),
            new TwigFilter('md_yaml', $this->yaml(...)),
            new TwigFilter('md_opening', Opening::of(...)),
        ];
    }

    /**
     * A block as its container takes it: trimmed, no run of blank lines
     * inside it longer than one. The container puts the blank line between
     * two blocks, so a template never has to know what follows it.
     */
    public function tidy(?string $text): string
    {
        $text = str_replace("\r\n", "\n", $text ?? '');
        /* Trailing blanks are what an indented block leaves behind, and a line
           that is only whitespace is not a blank line to a parser. */
        $text = (string)preg_replace('/[ \t]+$/m', '', $text);

        return trim((string)preg_replace('/\n{3,}/', "\n\n", $text));
    }

    /**
     * Every line of a block moved in — a list item, a definition, a step. The
     * first line takes the marker and the rest the space it occupies, so what
     * follows a bullet stays inside the item it belongs to.
     */
    public function indent(?string $text, string $marker, ?string $rest = null): string
    {
        $rest ??= str_repeat(' ', mb_strlen($marker));
        $lines = explode("\n", $this->tidy($text));
        foreach ($lines as $index => $line) {
            $lines[$index] = $line === '' ? '' : ($index === 0 ? $marker : $rest) . $line;
        }

        return implode("\n", $lines);
    }

    /** A block set inside a quote, blank lines and all. */
    public function quote(?string $text): string
    {
        $lines = explode("\n", $this->tidy($text));
        foreach ($lines as $index => $line) {
            $lines[$index] = $line === '' ? '>' : '> ' . $line;
        }

        return implode("\n", $lines);
    }

    /**
     * A code block, fenced longer than anything in it: a block quoting
     * Markdown carries three backticks of its own and would otherwise close
     * the fence on its first line.
     */
    public function fence(?string $code, string $language = ''): string
    {
        $code = trim(str_replace("\r\n", "\n", $code ?? ''), "\n");
        preg_match_all('/`{3,}/', $code, $runs);
        $longest = 2;
        foreach ($runs[0] as $run) {
            $longest = max($longest, mb_strlen($run));
        }

        $rail = str_repeat('`', $longest + 1);

        return $rail . $language . "\n" . $code . "\n" . $rail;
    }

    /**
     * Text that is not markup, kept from reading as some — the punctuation
     * anywhere, and the line openers a paragraph would become a heading or a
     * list by.
     */
    public function escape(?string $text): string
    {
        $text = (string)preg_replace('/([\\\\`*_\[\]<>])/', '\\\\$1', $text ?? '');

        return (string)preg_replace('/^(\s*)([#>+-]|\d+[.)])(\s)/m', '$1\\\\$2$3', $text);
    }

    /**
     * One line of a line block, ending in the break that keeps it one: a verse
     * is lines because the author wrote lines, and a Markdown reader joins two
     * of them into a paragraph unless the first ends in a break.
     */
    public function lineBreak(?string $text): string
    {
        $text = rtrim($this->tidy($text), "\\ \t");

        return $text === '' ? '' : $text . "\\\n";
    }

    /**
     * A literal, in the backticks that can hold it: one carrying a backtick of
     * its own needs a longer run around it and a space inside, which is the
     * one place a run of them is not a mistake.
     */
    public function code(?string $text): string
    {
        $text ??= '';
        if (!str_contains($text, '`')) {
            return '`' . $text . '`';
        }

        preg_match_all('/`+/', $text, $runs);
        $longest = 0;
        foreach ($runs[0] as $run) {
            $longest = max($longest, mb_strlen($run));
        }

        $rail = str_repeat('`', $longest + 1);

        return $rail . ' ' . $text . ' ' . $rail;
    }

    /**
     * A block on one line — a heading, a label, a cell. What stood between
     * two blocks becomes the break GFM reads inside a cell.
     */
    public function line(?string $text): string
    {
        $text = $this->tidy($text);

        return trim((string)preg_replace('/\n/', ' ', (string)preg_replace('/\n{2,}/', '<br>', $text)));
    }

    /**
     * A value in the front matter, as one YAML scalar. Always quoted: a JSON
     * string is a YAML double-quoted scalar to the letter, and the plain form
     * is a list of exceptions — `yes` is a boolean, `2024` a number, `a: b` a
     * map — that a title falls into one day without anyone reading it.
     */
    public function yaml(?string $text): string
    {
        return json_encode($text ?? '', JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }

    /**
     * One cell of a table, the only place a pipe means anything — which is
     * why it is escaped here and not wherever text is: escaped in prose it is
     * a backslash nobody wrote, and escaped twice it is two.
     */
    public function cell(?string $text): string
    {
        return str_replace('|', '\\|', $this->line($text));
    }
}
