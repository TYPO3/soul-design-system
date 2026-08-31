<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\Inline\InlineNodeInterface;
use phpDocumentor\Guides\Nodes\Inline\LiteralInlineNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\ListItemNode;
use phpDocumentor\Guides\Nodes\ListNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\DirectoryTreeNode;

/**
 * A directory, as the shape it has on disk.
 *
 *     .. directory-tree::
 *        :level: 2
 *
 *        * ``docs/`` the sources, as a project already writes them
 *
 *          * ``Index.rst``
 *          * ``guides.xml`` the theme, the mark and the versions
 *
 * A nested list, because that is what a tree is. The spelling is the one TYPO3
 * documentation already uses, so a page written for the other theme renders
 * here without being touched.
 *
 * **The name is the first literal in the item and the rest of the line is what
 * it is for.** No syntax of this directive's own: a filename is written as a
 * literal anyway, and prose after it is prose about it. An item with no literal
 * is a name and nothing else.
 *
 * `:level:` is how deep it stands **open**, and not how deep it is drawn. The
 * theme this was taken from stops rendering below the level, which loses what a
 * reader came for and cannot be undone by them; a fold can.
 */
final class DirectoryTreeDirective extends SubDirective
{
    public function getName(): string
    {
        return 'directory-tree';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $entries = [];
        foreach ($collectionNode->getChildren() as $child) {
            if ($child instanceof ListNode) {
                $entries = [...$entries, ...$this->walk($child)];
            }
        }

        $level = (int)($directive->getOption('level')->getValue() ?? 2);

        return (new DirectoryTreeNode([]))->withOptions([
            'entries' => $entries,
            'level' => max(0, $level),
            'icons' => $directive->hasOption('show-file-icons'),
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }

    /**
     * One list, as the entries under it.
     *
     * @return list<array<string, mixed>>
     */
    private function walk(ListNode $list): array
    {
        $out = [];
        foreach ($list->getChildren() as $item) {
            if (!$item instanceof ListItemNode) {
                continue;
            }

            [$label, $note] = $this->said($item);
            if ($label === '') {
                continue;
            }

            $entry = ['label' => $label];
            if ($note !== '') {
                $entry['note'] = $note;
            }

            $under = [];
            foreach ($item->getChildren() as $child) {
                if ($child instanceof ListNode) {
                    $under = [...$under, ...$this->walk($child)];
                }
            }
            if ($under !== []) {
                $entry['items'] = $under;
            }

            $out[] = $entry;
        }

        return $out;
    }

    /**
     * What the item says: the name, and what it is for.
     *
     * @return array{0: string, 1: string}
     */
    private function said(ListItemNode $item): array
    {
        $label = '';
        $note = '';
        $named = false;

        foreach ($this->inlines($item) as $inline) {
            if (!$named && $inline instanceof LiteralInlineNode) {
                $label = $inline->toString();
                $named = true;
                continue;
            }
            if ($named) {
                $note .= $inline->toString();
                continue;
            }
            $label .= $inline->toString();
        }

        /* Whatever the author put between the name and the sentence about it —
           a dash, a colon — is punctuation for a line this does not draw. */
        return [trim($label), trim(ltrim(trim($note), "-–—:\u{00A0}"))];
    }

    /**
     * The inline nodes of an item, in the order it says them. A nested list is
     * what is *under* the item rather than part of what it says, so the walk
     * stops at one.
     *
     * @return list<InlineNodeInterface>
     */
    private function inlines(Node $node): array
    {
        if ($node instanceof InlineNodeInterface && !$node instanceof InlineCompoundNode) {
            return [$node];
        }

        $out = [];
        if ($node instanceof CompoundNode) {
            foreach ($node->getChildren() as $child) {
                if ($child instanceof ListNode) {
                    continue;
                }
                $out = [...$out, ...$this->inlines($child)];
            }
        }

        return $out;
    }
}
