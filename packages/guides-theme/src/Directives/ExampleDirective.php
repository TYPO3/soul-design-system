<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\CodeNode;
use phpDocumentor\Guides\Nodes\CollectionNode;
use phpDocumentor\Guides\Nodes\Inline\PlainTextInlineNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;
use TYPO3\Soul\GuidesTheme\Nodes\ExampleNode;

/**
 * The source, and under it the same source rendered.
 *
 *     .. example:: A card in a grid
 *
 *        .. grid::
 *
 *           .. card:: What it is
 *              :href: /overview
 *
 *              Two sentences.
 *
 * **The block a reader copies is the block that was run.** A page that shows
 * markup in a `code-block` and then writes it a second time to render it holds
 * two copies of one example, and the one nobody checks is the one being copied.
 * This is `specimen` a level down: there the picture and the card are the same
 * file, here the print and the render are the same body.
 *
 * The body is printed from the lines the parser was handed and then parsed
 * from those same lines — so the options above it are not in the print, and
 * the indentation is the author's, unindented once as any directive body is.
 * The rendering stands in `.sds-example`, dashed and unfilled: the frame is
 * not part of the page, and what is inside keeps its real ground.
 *
 * **A band, a hero and `:layout:` are not for this.** They are the shape of a
 * page: a band nested inside anything indents its text by a gutter and stops
 * at its parent's width, which is a rendering of something nobody would write.
 * Those three keep a `code-block` beside prose that says what they do.
 */
final class ExampleDirective extends SubDirective
{
    /* No highlighter here knows reStructuredText, and a language the server
       cannot colour is better said than faked. */
    private const DEFAULT_LANGUAGE = 'text';

    public function getName(): string
    {
        return 'example';
    }

    protected function processSub(
        BlockContext $blockContext,
        CollectionNode $collectionNode,
        Directive $directive,
    ): ?Node {
        $language = $directive->getOption('language')->getValue();
        $source = new CodeNode(
            $this->body($blockContext),
            trim((string)($language ?? self::DEFAULT_LANGUAGE)),
        );

        $caption = trim($directive->getData());
        if ($caption !== '') {
            /* Plain text, because the template strips the tags off a caption
               before it hands the sentence to the element as a property. */
            $source->setCaption(new InlineCompoundNode([new PlainTextInlineNode($caption)]));
        }

        return (new ExampleNode($source, $collectionNode->getChildren()))->withOptions([
            /* An author who wrote `:class:` meant it for their own stylesheet,
               and dropping what a theme does not understand is the one thing
               it must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }

    /**
     * The lines the parser was given, with the blank ones at either end gone.
     *
     * `toArray()` is the whole block and not what is left of it: the iterator
     * has been read to the end by the rule that parsed the children, and the
     * print has to be the same body they came from.
     *
     * @return list<string>
     */
    private function body(BlockContext $blockContext): array
    {
        $lines = $blockContext->getDocumentIterator()->toArray();

        while ($lines !== [] && trim($lines[0]) === '') {
            array_shift($lines);
        }

        while ($lines !== [] && trim($lines[count($lines) - 1]) === '') {
            array_pop($lines);
        }

        return array_values($lines);
    }
}
