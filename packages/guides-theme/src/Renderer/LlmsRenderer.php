<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Renderer;

use phpDocumentor\Guides\Handlers\RenderCommand;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\DocumentTree\DocumentEntryNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\Renderer\TypeRenderer;
use phpDocumentor\Guides\Renderer\UrlGenerator\UrlGeneratorInterface;
use TYPO3\Soul\GuidesTheme\Nodes\Opening;
use TYPO3\Soul\GuidesTheme\Twig\MarkdownExtension;

/**
 * `llms.txt` at the publish root: the site's own table of contents, for a
 * reader that arrived with no navigation.
 *
 * One file for the whole project rather than one per document, which is the
 * shape `objects.inv` is written in and the reason this is a format of its
 * own. It names the twins and never the pages: a program that follows a link
 * from here stays in Markdown for the rest of the site.
 */
final class LlmsRenderer implements TypeRenderer
{
    /* The twin's own escaping, because a title is text and a `]` in one is
       the end of a link. */
    public function __construct(
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly MarkdownExtension $markdown,
    ) {}

    public function render(RenderCommand $renderCommand): void
    {
        $project = $renderCommand->getProjectNode();
        $context = RenderContext::forProject(
            $project,
            $renderCommand->getDocumentArray(),
            $renderCommand->getOrigin(),
            $renderCommand->getDestination(),
            $renderCommand->getDestinationPath(),
            /* The twin's format, because the links written below are the
               twins: a format is the extension `createFileUrl()` appends. */
            'md',
        )->withOutputFilePath('llms.txt');

        $documents = [];
        foreach ($renderCommand->getDocumentArray() as $document) {
            $documents[$document->getFilePath()] = $document;
        }

        $root = $project->getRootDocumentEntry();
        $lines = ['# ' . $this->markdown->escape($project->getTitle() ?? $root->getTitle()->toString())];

        /* The line under a page is what its twin opens with as `description`
           — see `Opening` — so a reader following one to the other finds the
           same sentence. */
        $summary = Opening::of($documents[$root->getFile()] ?? null);
        if ($summary !== '') {
            $lines[] = '';
            $lines[] = '> ' . $this->markdown->escape($summary);
        }

        /* A section per branch of the tree, which is what the bar carries and
           what a reader would have been given as navigation. A page with
           nothing under it is not a section — those are gathered at the end,
           under the one heading a list needs to stand in. */
        $loose = [];
        foreach ($this->entries($root) as $entry) {
            if ($entry->getChildren() === []) {
                $loose[] = $this->line($context, $entry, $documents);
                continue;
            }

            $lines[] = '';
            $lines[] = '## ' . $this->markdown->escape($entry->getTitle()->toString());
            $lines[] = '';
            $lines[] = $this->line($context, $entry, $documents);
            foreach ($this->below($entry) as $child) {
                $lines[] = $this->line($context, $child, $documents);
            }
        }

        if ($loose !== []) {
            $lines[] = '';
            $lines[] = '## Pages';
            $lines[] = '';
            $lines = [...$lines, ...$loose];
        }

        $context->getDestination()->put(
            $renderCommand->getDestinationPath() . '/llms.txt',
            implode("\n", $lines) . "\n",
        );
    }

    /**
     * One page, as the list entry it is.
     *
     * @param array<string, DocumentNode> $documents
     */
    private function line(RenderContext $context, DocumentEntryNode $entry, array $documents): string
    {
        $url = $this->urlGenerator->createFileUrl($context, $entry->getFile());
        $note = Opening::of($documents[$entry->getFile()] ?? null);

        $title = $this->markdown->escape($entry->getTitle()->toString());

        return '- [' . $title . '](' . $url . ')' . ($note === '' ? '' : ': ' . $this->markdown->escape($note));
    }

    /**
     * Every page under this one, however deep: `llms.txt` has one heading
     * level to put a list under, whatever the tree does.
     *
     * @return list<DocumentEntryNode>
     */
    private function below(DocumentEntryNode $entry): array
    {
        $out = [];
        foreach ($this->entries($entry) as $child) {
            $out[] = $child;
            $out = [...$out, ...$this->below($child)];
        }

        return $out;
    }

    /**
     * The entries under one that are pages here — an external entry names
     * somebody else's site.
     *
     * @return list<DocumentEntryNode>
     */
    private function entries(DocumentEntryNode $entry): array
    {
        return array_values(array_filter(
            $entry->getChildren(),
            static fn(Node $child): bool => $child instanceof DocumentEntryNode,
        ));
    }
}
