<?php

declare(strict_types=1);

/**
 * Every node this theme can be handed, as Markdown.
 *
 * The shape the core uses for `html` and `tex`: one file per node, named for
 * the format, so a document is written twice from one tree rather than read
 * back out of the first rendering. A node missing here is rendered as its own
 * children, and one whose content is a string is an error the render stops on
 * — which is what keeps this list honest.
 */

use phpDocumentor\Guides\Nodes\AdmonitionNode;
use phpDocumentor\Guides\Nodes\AnchorNode;
use phpDocumentor\Guides\Nodes\AnnotationListNode;
use phpDocumentor\Guides\Nodes\CitationNode;
use phpDocumentor\Guides\Nodes\CodeNode;
use phpDocumentor\Guides\Nodes\Configuration\ConfigurationBlockNode;
use phpDocumentor\Guides\Nodes\DefinitionListNode;
use phpDocumentor\Guides\Nodes\DefinitionLists\DefinitionNode;
use phpDocumentor\Guides\Nodes\DocumentNode;
use phpDocumentor\Guides\Nodes\EmbeddedFrame;
use phpDocumentor\Guides\Nodes\FieldListNode;
use phpDocumentor\Guides\Nodes\FigureNode;
use phpDocumentor\Guides\Nodes\FootnoteNode;
use phpDocumentor\Guides\Nodes\ImageNode;
use phpDocumentor\Guides\Nodes\Inline\AbbreviationInlineNode;
use phpDocumentor\Guides\Nodes\Inline\CitationInlineNode;
use phpDocumentor\Guides\Nodes\Inline\DocReferenceNode;
use phpDocumentor\Guides\Nodes\Inline\EmphasisInlineNode;
use phpDocumentor\Guides\Nodes\Inline\FootnoteInlineNode;
use phpDocumentor\Guides\Nodes\Inline\GenericTextRoleInlineNode;
use phpDocumentor\Guides\Nodes\Inline\HyperLinkNode;
use phpDocumentor\Guides\Nodes\Inline\ImageInlineNode;
use phpDocumentor\Guides\Nodes\Inline\LiteralInlineNode;
use phpDocumentor\Guides\Nodes\Inline\NewlineInlineNode;
use phpDocumentor\Guides\Nodes\Inline\PlainTextInlineNode;
use phpDocumentor\Guides\Nodes\Inline\ReferenceNode;
use phpDocumentor\Guides\Nodes\Inline\StrongInlineNode;
use phpDocumentor\Guides\Nodes\Inline\VariableInlineNode;
use phpDocumentor\Guides\Nodes\Inline\WhitespaceInlineNode;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\ListItemNode;
use phpDocumentor\Guides\Nodes\ListNode;
use phpDocumentor\Guides\Nodes\LiteralBlockNode;
use phpDocumentor\Guides\Nodes\MathNode;
use phpDocumentor\Guides\Nodes\Menu\MenuEntryNode;
use phpDocumentor\Guides\Nodes\Menu\MenuNode;
use phpDocumentor\Guides\Nodes\Metadata\MetadataNode;
use phpDocumentor\Guides\Nodes\ParagraphNode;
use phpDocumentor\Guides\Nodes\QuoteNode;
use phpDocumentor\Guides\Nodes\SectionNode;
use phpDocumentor\Guides\Nodes\SeparatorNode;
use phpDocumentor\Guides\Nodes\TableNode;
use phpDocumentor\Guides\Nodes\TitleNode;
use phpDocumentor\Guides\RestructuredText\Nodes\ConfvalNode;
use phpDocumentor\Guides\RestructuredText\Nodes\ContainerNode;
use phpDocumentor\Guides\RestructuredText\Nodes\OptionNode;
use phpDocumentor\Guides\RestructuredText\Nodes\SidebarNode;
use phpDocumentor\Guides\RestructuredText\Nodes\TabsNode;
use phpDocumentor\Guides\RestructuredText\Nodes\TopicNode;
use phpDocumentor\Guides\RestructuredText\Nodes\VersionChangeNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionNode;
use TYPO3\Soul\GuidesTheme\Nodes\BandNode;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonBarNode;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonNode;
use TYPO3\Soul\GuidesTheme\Nodes\CardNode;
use TYPO3\Soul\GuidesTheme\Nodes\DirectoryTreeNode;
use TYPO3\Soul\GuidesTheme\Nodes\ExampleNode;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;
use TYPO3\Soul\GuidesTheme\Nodes\QuoteNode as SoulQuoteNode;
use TYPO3\Soul\GuidesTheme\Nodes\SplitNode;
use TYPO3\Soul\GuidesTheme\Nodes\StatNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepsNode;
use TYPO3\Soul\GuidesTheme\Nodes\SurfaceNode;
use TYPO3\Soul\GuidesTheme\Nodes\SwatchNode;

/* What a page says about itself rather than in itself. The head of an HTML
   page carries it; a Markdown file has no head, and a `:author:` printed as a
   paragraph would read as the document's first sentence. */
$blank = 'structure/blank.md.twig';

return [
    // The document, and the shape of it
    DocumentNode::class => 'structure/document.md.twig',
    SectionNode::class => 'structure/section.md.twig',
    TitleNode::class => 'structure/header-title.md.twig',
    SidebarNode::class => 'structure/sidebar.md.twig',
    MetadataNode::class => $blank,
    AnchorNode::class => 'inline/anchor.md.twig',

    // Blocks
    ParagraphNode::class => 'body/paragraph.md.twig',
    QuoteNode::class => 'body/quote.md.twig',
    SeparatorNode::class => 'body/separator.md.twig',
    CodeNode::class => 'body/code.md.twig',
    ConfigurationBlockNode::class => 'body/configuration-block.md.twig',
    LiteralBlockNode::class => 'body/literal-block.md.twig',
    MathNode::class => 'body/math.md.twig',
    ListNode::class => 'body/list/list.md.twig',
    ListItemNode::class => 'body/list/list-item.md.twig',
    DefinitionListNode::class => 'body/definition-list.md.twig',
    DefinitionNode::class => 'body/definition.md.twig',
    FieldListNode::class => 'body/field-list.md.twig',
    TableNode::class => 'body/table.md.twig',
    FigureNode::class => 'body/figure.md.twig',
    ImageNode::class => 'body/image.md.twig',
    EmbeddedFrame::class => 'body/embedded-frame.md.twig',
    AdmonitionNode::class => 'body/admonition.md.twig',
    ContainerNode::class => 'body/container.md.twig',
    TopicNode::class => 'body/topic.md.twig',
    VersionChangeNode::class => 'body/version-change.md.twig',
    CitationNode::class => 'body/citation.md.twig',
    FootnoteNode::class => 'body/footnote.md.twig',
    AnnotationListNode::class => 'body/annotation-list.md.twig',
    MenuNode::class => 'body/menu/menu.md.twig',
    MenuEntryNode::class => 'body/menu/menu-item.md.twig',

    // What a reference documents
    ConfvalNode::class => 'body/directive/confval.md.twig',
    OptionNode::class => 'body/directive/option.md.twig',
    TabsNode::class => 'body/directive/tabs.md.twig',

    /* Inline, and the compound one last: a renderer supports the node it is
       mapped for *and everything below it*, and the first one that supports a
       node is the one that renders it. Emphasis, strong and every kind of
       link are compound nodes, so a compound mapping written above them takes
       all three and a page loses its marks without losing a word. */
    PlainTextInlineNode::class => 'inline/plain-text.md.twig',
    LiteralInlineNode::class => 'inline/literal.md.twig',
    VariableInlineNode::class => 'inline/variable.md.twig',
    EmphasisInlineNode::class => 'inline/emphasis.md.twig',
    StrongInlineNode::class => 'inline/strong.md.twig',
    HyperLinkNode::class => 'inline/link.md.twig',
    DocReferenceNode::class => 'inline/link.md.twig',
    ReferenceNode::class => 'inline/link.md.twig',
    ImageInlineNode::class => 'inline/image.md.twig',
    AbbreviationInlineNode::class => 'inline/abbreviation.md.twig',
    CitationInlineNode::class => 'inline/annotation.md.twig',
    FootnoteInlineNode::class => 'inline/annotation.md.twig',
    GenericTextRoleInlineNode::class => 'inline/generic.md.twig',
    NewlineInlineNode::class => 'inline/newline.md.twig',
    WhitespaceInlineNode::class => 'inline/whitespace.md.twig',
    InlineCompoundNode::class => 'inline/inline-node.md.twig',

    // This theme's own directives
    BandNode::class => 'body/directive/band.md.twig',
    GridNode::class => 'body/directive/grid.md.twig',
    SplitNode::class => 'body/directive/split.md.twig',
    HalfNode::class => 'body/directive/half.md.twig',
    HeroNode::class => 'body/directive/hero.md.twig',
    StatNode::class => 'body/directive/stat.md.twig',
    SurfaceNode::class => 'body/directive/surface.md.twig',
    SwatchNode::class => 'body/directive/swatch.md.twig',
    SoulQuoteNode::class => 'body/directive/quote.md.twig',
    CardNode::class => 'body/directive/card.md.twig',
    ButtonNode::class => 'body/directive/button.md.twig',
    ButtonBarNode::class => 'body/directive/button-bar.md.twig',
    AccordionNode::class => 'body/directive/accordion.md.twig',
    AccordionItemNode::class => 'body/directive/accordion-item.md.twig',
    DirectoryTreeNode::class => 'body/directive/directory-tree.md.twig',
    StepsNode::class => 'body/directive/steps.md.twig',
    StepNode::class => 'body/directive/step.md.twig',
    ExampleNode::class => 'body/directive/example.md.twig',
];
