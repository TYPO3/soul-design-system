<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use phpDocumentor\Guides\Settings\SettingsManager;
use TYPO3\Soul\GuidesTheme\Nodes\DiagramNode;

/**
 * A drawing, written as the text that describes it.
 *
 *     .. diagram::
 *
 *        flow columns=1,1
 *        title "One slot answers two languages"
 *        description "Two calls for the same key reach the same slot."
 *        ...
 *
 * The body is the text of a `.diagram` file, as it is: one statement per
 * line, read by the system's own parser. `:file:` reads that text from a
 * file instead, relative to the document, so the text has a file of its own. So the directive takes the body
 * raw, and the parser of reStructuredText never reads it. The element draws it, and the finishing step
 * renders it before the page ships, so a reader with no script gets it.
 */
#[Attributes\Directive(name: 'diagram', rawContent: true, valueType: DirectiveValueType::Empty)]
#[Attributes\Option(name: 'name', description: 'The prefix of the ids inside the drawing.')]
#[Attributes\Option(name: 'file', description: 'A .diagram file to read the text from, relative to the document.')]
#[Attributes\Option(name: 'caption', description: 'The claim of the drawing: it then stands in a figure, with the caption under it.')]
#[Attributes\Option(name: 'label', description: 'On a slide of the row layout: the word over the drawing.')]
#[Attributes\Option(name: 'zoomable', type: OptionType::Boolean, description: 'A press opens the drawing at the size of the window.')]
final class DiagramDirective extends BaseDirective
{
    public function __construct(private readonly SettingsManager $settings) {}

    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();
        $file = (string)$directive->getOption('file')->getValue();

        return (new DiagramNode([]))->withOptions([
            'source' => $file === '' ? $directiveNode->getRawContent() : $this->read($file, $compilerContext),
            'name' => $directive->getOption('name')->getValue(),
            'caption' => $directive->getOption('caption')->getValue(),
            'zoomable' => $directive->hasOption('zoomable'),
            'label' => $directive->getOption('label')->getValue(),
        ]);
    }

    /**
     * The text of a file beside the document. A path that leads nowhere
     * stops the render, as a missing include does.
     */
    private function read(string $file, CompilerContextInterface $compilerContext): string
    {
        $input = $this->settings->getProjectSettings()->getInput();
        $document = dirname($compilerContext->getDocumentNode()->getFilePath());
        $path = str_starts_with($file, '/')
            ? $input . $file
            : $input . '/' . ($document === '.' ? '' : $document . '/') . $file;
        $text = is_file($path) ? file_get_contents($path) : false;
        if ($text === false) {
            throw new \RuntimeException(sprintf('Diagram "%s" (%s) does not exist or is not readable.', $file, $path));
        }

        return $text;
    }
}
