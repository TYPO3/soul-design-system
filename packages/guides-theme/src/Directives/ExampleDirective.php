<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\CodeNode;
use phpDocumentor\Guides\Nodes\Inline\PlainTextInlineNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
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
 * **The block a reader copies is the block that ran.** A page that shows
 * markup in a `code-block` and then writes it a second time to render it holds
 * two copies of one example. The one nobody checks is the one readers copy.
 * This is `specimen` a level down. There the picture and the card are the same
 * file; here the print and the render are the same body.
 *
 * The print comes from the lines the parser got, and the parse from those same
 * lines. So the options above it are not in the print, and the indentation is
 * the author's, unindented once as any directive body is. The render stands in
 * `.sds-example`, dashed and unfilled. The frame is not part of the page, and
 * what is inside keeps its real ground.
 *
 * **A band, a hero and `:layout:` are not for this.** They are the shape of a
 * page. A band nested inside anything indents its text by a gutter and stops
 * at its parent's width, which is a render of something nobody writes. Those
 * three keep a `code-block` beside prose that says what they do.
 */
#[Attributes\Directive(name: 'example', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'language', default: 'text', description: 'The language of the print.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class ExampleDirective extends SubDirective
{
    /* No highlighter here knows reStructuredText, and a language the server
       cannot colour is better said than faked. */
    private const DEFAULT_LANGUAGE = 'text';

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $language = $directive->getOption('language')->getValue();
        $source = new CodeNode(
            $this->body($directiveNode),
            trim((string)($language ?? self::DEFAULT_LANGUAGE)),
        );

        $caption = trim($directive->getData());
        if ($caption !== '') {
            /* Plain text, because the template strips the tags off a caption
               before it hands the sentence to the element as a property. */
            $source->setCaption(new InlineCompoundNode([new PlainTextInlineNode($caption)]));
        }

        return (new ExampleNode($source, $directiveNode->getChildren()))->withOptions([
            /* An author who wrote `:class:` meant it for their own stylesheet.
               To drop what a theme does not understand is the one thing it
               must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }

    /**
     * The lines the parser got, with the blank ones at either end gone.
     *
     * The parser keeps the body as it read it, beside the nodes it made of it.
     * So the print is the same body the render came from.
     *
     * @return list<string>
     */
    private function body(DirectiveNode $directiveNode): array
    {
        $lines = explode("\n", $directiveNode->getRawContent());

        while ($lines !== [] && trim($lines[0]) === '') {
            array_shift($lines);
        }

        while ($lines !== [] && trim($lines[count($lines) - 1]) === '') {
            array_pop($lines);
        }

        return array_values($lines);
    }
}
