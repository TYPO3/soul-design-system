<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Compiler;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Compiler\NodeTransformer;
use phpDocumentor\Guides\Exception\DuplicateLinkAnchorException;
use phpDocumentor\Guides\Meta\InternalTarget;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\Nodes\SectionNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;
use TYPO3\Soul\GuidesTheme\Nodes\DecisionNode;
use TYPO3\Soul\GuidesTheme\Nodes\EntryNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepNode;

/**
 * The address a directive takes with `:name:`, as a target of `:ref:`.
 *
 * The renderer collects its targets before it builds the node of a theme's
 * directive. So the name of a step, an entry or a decision is only an id
 * on the page, and no `:ref:` finds it. An accordion answer is the same.
 * This adds each one as a label, with the title of the node as its text.
 */
final class Addresses implements NodeTransformer
{
    public function supports(Node $node): bool
    {
        return $node instanceof AccordionItemNode || $node instanceof DecisionNode || $node instanceof EntryNode || $node instanceof StepNode;
    }

    public function enterNode(Node $node, CompilerContextInterface $compilerContext): Node
    {
        $anchor = (string)($node->getOption('anchor') ?? '');
        if ($anchor === '') {
            return $node;
        }

        $text = (string)($node->getOption('question') ?? $node->getOption('heading') ?? $node->getOption('title') ?? $anchor);
        try {
            $compilerContext->getProjectNode()->addLinkTarget(
                $anchor,
                new InternalTarget($compilerContext->getDocumentNode()->getFilePath(), $anchor, $text, SectionNode::STD_LABEL),
            );
        } catch (DuplicateLinkAnchorException) {
            /* The renderer names a second target with one name itself. */
        }

        return $node;
    }

    public function leaveNode(Node $node, CompilerContextInterface $compilerContext): ?Node
    {
        return $node;
    }

    /** After the pass that turns a directive into its node, which is 100. */
    public function getPriority(): int
    {
        return 90;
    }
}
