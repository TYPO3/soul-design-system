<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\NodeRenderers;

use phpDocumentor\Guides\NodeRenderers\NodeRenderer;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RenderContext;
use phpDocumentor\Guides\RestructuredText\Nodes\GeneralDirectiveNode;
use phpDocumentor\Guides\TemplateRenderer;

/**
 * A directive the parser left under its own name, as Markdown.
 *
 * The core reaches these by name rather than by node class — a lookup, not a
 * map — so the format has to do its own. What it does differently is the
 * miss. A directive with no Markdown of its own renders its source, as a
 * shape Markdown does not have is still a passage somebody wrote.
 *
 * @implements NodeRenderer<GeneralDirectiveNode>
 */
final class GeneralDirectiveMarkdownRenderer implements NodeRenderer
{
    public function __construct(private readonly TemplateRenderer $renderer) {}

    public function supports(string $nodeFqcn): bool
    {
        return $nodeFqcn === GeneralDirectiveNode::class || is_a($nodeFqcn, GeneralDirectiveNode::class, true);
    }

    public function render(Node $node, RenderContext $renderContext): string
    {
        if ($node instanceof GeneralDirectiveNode === false) {
            throw new \InvalidArgumentException('Node must be an instance of ' . GeneralDirectiveNode::class);
        }

        $name = str_replace(':', '/', $node->getName());
        $template = 'body/directive/' . preg_replace('/[^a-zA-Z0-9-_\/]/', '_', $name) . '.md.twig';
        $data = ['node' => $node];

        if ($this->renderer->isTemplateFound($renderContext, $template)) {
            return $this->renderer->renderTemplate($renderContext, $template, $data);
        }

        return $this->renderer->renderTemplate($renderContext, 'body/directive/content.md.twig', $data);
    }
}
