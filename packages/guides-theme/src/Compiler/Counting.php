<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Compiler;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Compiler\NodeTransformer;
use phpDocumentor\Guides\Nodes\AnchorNode;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\FigureNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;
use phpDocumentor\Guides\Nodes\TableNode;
use phpDocumentor\Guides\Nodes\TitleNode;
use TYPO3\Soul\GuidesTheme\Navigation\Numbers;
use TYPO3\Soul\GuidesTheme\Nodes\DecisionNode;
use TYPO3\Soul\GuidesTheme\Nodes\DiagramNode;
use TYPO3\Soul\GuidesTheme\Nodes\PaperFieldNode;
use TYPO3\Soul\GuidesTheme\Nodes\SlideNode;

/**
 * The numbers of a paper with `:numbered:`.
 *
 * A section under the title counts on across the parts, and a section in it
 * takes the number of the one above: 3, then 3.1. A figure, a table and a
 * decision each count on their own, in the order of the page. A label in
 * front of any of them names that number, so a reference can say it.
 */
final class Counting implements NodeTransformer
{
    private bool $on = false;
    private int $top = 0;
    private int $sub = 0;

    /** @var array<string, int> */
    private array $count = ['figure' => 0, 'table' => 0, 'decision' => 0];

    public function __construct(private readonly Numbers $numbers) {}

    public function supports(Node $node): bool
    {
        return $node instanceof DocumentNode || $node instanceof SectionNode;
    }

    public function enterNode(Node $node, CompilerContextInterface $compilerContext): Node
    {
        if ($node instanceof DocumentNode) {
            $this->on = false;
            foreach ($node->getHeaderNodes() as $header) {
                if ($header instanceof PaperFieldNode && $header->field === 'numbered') {
                    $this->on = !in_array(strtolower((string)$header->getValue()), ['', 'no', 'false', '0'], true);
                }
            }
            $this->top = $this->sub = 0;
            $this->count = ['figure' => 0, 'table' => 0, 'decision' => 0];

            return $node;
        }

        if ($this->on && $node instanceof SectionNode) {
            $this->section($node);
        }

        return $node;
    }

    public function leaveNode(Node $node, CompilerContextInterface $compilerContext): ?Node
    {
        return $node;
    }

    /** After `Parts` and `Addresses`, which run at 90. */
    public function getPriority(): int
    {
        return 80;
    }

    /** A section under the title starts its own count of sections. */
    private function chapter(): string
    {
        $this->sub = 0;

        return (string)++$this->top;
    }

    /** The section's number, then what it holds in the order of the page. */
    private function section(SectionNode $section): void
    {
        $number = match ($section->getTitle()->getLevel()) {
            2 => $this->chapter(),
            3 => $this->top . '.' . (++$this->sub),
            default => '',
        };
        if ($number !== '') {
            $this->numbers->set('section', $section->getTitle()->getId(), $number);
        }

        $labels = [];
        foreach ($section->getChildren() as $child) {
            if ($child instanceof AnchorNode) {
                $labels[] = (string)$child->getValue();
                continue;
            }

            [$kind, $key, $own] = $this->counted($child);
            if ($child instanceof TitleNode && $number !== '') {
                [$kind, $n] = ['section', $number];
            } elseif ($kind !== '') {
                $n = (string)(++$this->count[$kind]);
                $this->numbers->set($kind, $key, $n);
                if ($own !== '') {
                    $labels[] = $own;
                }
            } else {
                $labels = [];
                continue;
            }

            foreach ($labels as $label) {
                $this->numbers->label($label, $kind, $n);
            }
            $labels = [];
        }
    }

    /**
     * What a node counts as, under which key a template finds it, and the
     * label it carries itself.
     *
     * @return array{string, string, string}
     */
    private function counted(Node $node): array
    {
        if ($node instanceof DiagramNode && (string)$node->getOption('caption') !== '') {
            return ['figure', (string)$node->getOption('caption'), ''];
        }
        if ($node instanceof SlideNode && (string)$node->getOption('caption') !== '') {
            return ['figure', (string)$node->getOption('caption'), (string)$node->getOption('anchor')];
        }
        if ($node instanceof FigureNode) {
            return ['figure', (string)$node->getImage()->getValue(), ''];
        }
        if ($node instanceof TableNode && (string)$node->getOption('caption') !== '') {
            return ['table', (string)$node->getOption('caption'), ''];
        }
        if ($node instanceof DecisionNode) {
            return ['decision', (string)$node->getOption('question'), (string)$node->getOption('anchor')];
        }

        return ['', '', ''];
    }
}
