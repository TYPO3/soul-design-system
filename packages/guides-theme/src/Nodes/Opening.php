<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Nodes;

use phpDocumentor\Guides\Nodes\CompoundNode;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Metadata\MetaNode;
use phpDocumentor\Guides\Nodes\Metadata\TopicNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\ParagraphNode;

/**
 * What a page says it is about, in one line.
 *
 * The author's own words where there are any: an `:abstract:` field, or a
 * `description` in `.. meta::`. The first sentence of the first paragraph
 * where there are none, as what a page opens with is what it says it is
 * about. Read once here, because it stands in two places: the line under a
 * page in `llms.txt` and the `description` a twin opens with. A reader that
 * follows one to the other must find the same sentence.
 */
final class Opening
{
    /** As long a note as a line of a list can carry and still read at a glance. */
    private const NOTE = 200;

    public static function of(?DocumentNode $document): string
    {
        if ($document === null) {
            return '';
        }

        foreach ($document->getHeaderNodes() as $header) {
            $written = match (true) {
                $header instanceof TopicNode && $header->getTitle() === 'abstract' => $header->getBody(),
                $header instanceof MetaNode && $header->getKey() === 'description' => (string)$header->getValue(),
                default => '',
            };
            $written = trim((string)preg_replace('/\s+/', ' ', $written));
            if ($written !== '') {
                return self::short($written);
            }
        }

        foreach ($document->getChildren() as $child) {
            $text = self::sentence($child);
            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }

    /** The first sentence of the first paragraph below a node. */
    private static function sentence(Node $node): string
    {
        if ($node instanceof ParagraphNode) {
            $text = '';
            foreach ($node->getChildren() as $child) {
                if ($child instanceof InlineCompoundNode) {
                    $text .= $child->toString();
                }
            }

            $text = trim((string)preg_replace('/\s+/', ' ', $text));
            if ($text === '') {
                return '';
            }

            $stop = strpos($text, '. ');

            return self::short($stop === false ? $text : substr($text, 0, $stop + 1));
        }

        if (!$node instanceof CompoundNode) {
            return '';
        }

        foreach ($node->getChildren() as $child) {
            $text = self::sentence($child);
            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }

    private static function short(string $text): string
    {
        return mb_strlen($text) > self::NOTE ? rtrim(mb_substr($text, 0, self::NOTE - 1)) . '…' : $text;
    }
}
