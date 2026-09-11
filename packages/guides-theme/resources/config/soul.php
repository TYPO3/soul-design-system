<?php

declare(strict_types=1);

use League\Tactician\CommandBus;
use phpDocumentor\Guides\Code\Highlighter\Highlighter;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\DirectiveContentRule;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use TYPO3\Soul\GuidesTheme\Code\Grammars;
use TYPO3\Soul\GuidesTheme\Compiler\OnThisPage;
use TYPO3\Soul\GuidesTheme\Directives\AccordionDirective;
use TYPO3\Soul\GuidesTheme\Directives\AccordionItemDirective;
use TYPO3\Soul\GuidesTheme\Directives\BandDirective;
use TYPO3\Soul\GuidesTheme\Directives\ButtonBarDirective;
use TYPO3\Soul\GuidesTheme\Directives\ButtonDirective;
use TYPO3\Soul\GuidesTheme\Directives\CardDirective;
use TYPO3\Soul\GuidesTheme\Directives\DirectoryTreeDirective;
use TYPO3\Soul\GuidesTheme\Directives\ExampleDirective;
use TYPO3\Soul\GuidesTheme\Directives\GridDirective;
use TYPO3\Soul\GuidesTheme\Directives\HalfDirective;
use TYPO3\Soul\GuidesTheme\Directives\HeroDirective;
use TYPO3\Soul\GuidesTheme\Directives\QuoteDirective;
use TYPO3\Soul\GuidesTheme\Directives\SpecimenDirective;
use TYPO3\Soul\GuidesTheme\Directives\SplitDirective;
use TYPO3\Soul\GuidesTheme\Directives\StatDirective;
use TYPO3\Soul\GuidesTheme\Directives\StepDirective;
use TYPO3\Soul\GuidesTheme\Directives\StepsDirective;
use TYPO3\Soul\GuidesTheme\Directives\SurfaceDirective;
use TYPO3\Soul\GuidesTheme\Directives\SwatchDirective;
use TYPO3\Soul\GuidesTheme\Navigation\Menu;
use TYPO3\Soul\GuidesTheme\Navigation\Pager;
use TYPO3\Soul\GuidesTheme\Navigation\Rail;
use TYPO3\Soul\GuidesTheme\Navigation\Sections;
use TYPO3\Soul\GuidesTheme\NodeRenderers\GeneralDirectiveMarkdownRenderer;
use TYPO3\Soul\GuidesTheme\Parser\LayoutFieldListItemRule;
use TYPO3\Soul\GuidesTheme\Renderer\LlmsRenderer;
use TYPO3\Soul\GuidesTheme\Renderer\MarkdownRenderer;
use TYPO3\Soul\GuidesTheme\Twig\AnchorExtension;
use TYPO3\Soul\GuidesTheme\Twig\DiffExtension;
use TYPO3\Soul\GuidesTheme\Twig\LinkExtension;
use TYPO3\Soul\GuidesTheme\Twig\MarkdownExtension;
use TYPO3\Soul\GuidesTheme\Twig\ThemeExtension;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

return static function (ContainerConfigurator $container): void {
    $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure()
        /* A directive that holds content parses it with a rule, and the rule
           is an interface the container cannot guess. Bound once here rather
           than in each implementation. */
        ->instanceof(SubDirective::class)
        ->bind('$startingRule', service(DirectiveContentRule::class))

        /* The specimen directive is tagged so the parser finds it without the
           project saying anything. */
        ->set(SpecimenDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The marketing blocks share the node shape described by `BlockNode`. */
        ->set(BandDirective::class)
            ->tag('phpdoc.guides.directive')
        ->set(GridDirective::class)
            ->tag('phpdoc.guides.directive')
        ->set(HeroDirective::class)
            ->tag('phpdoc.guides.directive')
        ->set(SplitDirective::class)
            ->tag('phpdoc.guides.directive')
        /* A column of a split, and only there — see `HalfDirective`. */
        ->set(HalfDirective::class)
            ->tag('phpdoc.guides.directive')
        ->set(StatDirective::class)
            ->tag('phpdoc.guides.directive')
        ->set(SurfaceDirective::class)
            ->tag('phpdoc.guides.directive')
        /* One colour of a palette — see `SwatchDirective`. */
        ->set(SwatchDirective::class)
            ->tag('phpdoc.guides.directive')

        /* A sentence borrowed from somewhere, which the parser leaves no core
           node for — see `QuoteDirective`. */
        ->set(QuoteDirective::class)
        ->tag('phpdoc.guides.directive')

        /* One card, whose title carries where it goes — see `CardDirective`. */
        ->set(CardDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The press a page asks for, and the row the presses stand in — see
           `ButtonDirective` for why the label carries where it goes. */
        ->set(ButtonDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(ButtonBarDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The questions a manual folds its answers behind, spelled the way
           TYPO3 documentation spells them — see `AccordionDirective` for why
           the set hands its group to the answers in it. */
        ->set(AccordionDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(AccordionItemDirective::class)
        ->tag('phpdoc.guides.directive')

        /* A directory as the shape it has on disk, spelled the way TYPO3
           documentation spells it — see `DirectoryTreeDirective` for how a name
           and what it is for are told apart without a syntax of its own. */
        ->set(DirectoryTreeDirective::class)
        ->tag('phpdoc.guides.directive')

        /* An instruction and its stops, numbered by the set rather than by
           whoever wrote it — see `StepsDirective`. */
        ->set(StepsDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(StepDirective::class)
        ->tag('phpdoc.guides.directive')

        /* What was written and what it renders as, from one body — see
           `ExampleDirective` for why the print cannot be a second copy. */
        ->set(ExampleDirective::class)
        ->tag('phpdoc.guides.directive')

        /* `:layout:` at the top of a document, read like `:navigation-title:`
           is. Tagged the same way, so a project writes the field and nothing
           else. */
        ->set(LayoutFieldListItemRule::class)
        ->tag('phpdoc.guides.parser.rst.fieldlist')

        /* What is on a page, written into every page that has headings to
           list and no contents of its own — see `OnThisPage`. Tagged by hand:
           the rule that tags a transformer by its interface is the renderer's
           own configuration and does not reach a file outside it. */
        ->set(OnThisPage::class)
        ->tag('phpdoc.guides.compiler.nodeTransformers')

        /* The site as the one entry every navigation is given, worked out
           where it can be read. It resolves links itself, so it takes the
           renderer's url generator — autowired, unlike the extension below,
           whose arguments are all settings. */
        ->set(Menu::class)

        /* And the slice of it a page's own column carries. */
        ->set(Rail::class)

        /* And the one list that is a document rather than the tree: the
           sections of the page being rendered, for the column beside it. */
        ->set(Sections::class)

        /* And the way on from the page being rendered, worked out the same
           way and for the same reason: the order a manual is read in is the
           tree walked, which a template can only fake. */
        ->set(Pager::class)

        /* The languages the highlighter this site renders with does not
           ship — see `Grammars`. Wrapped around it rather than replacing it,
           so everything it already colours it still colours. */
        ->set(Grammars::class)
        ->decorate(Highlighter::class)
        ->args([service('.inner')])

        /* Where a reference points, for a template handing a target to a
           component instead of writing the link itself. */
        ->set(LinkExtension::class)
        ->tag('twig.extension')

        /* And the other half: the id for a place the parser anchored nowhere,
           named by the normalizer that names every other anchor. */
        ->set(AnchorExtension::class)
        ->tag('twig.extension')

        /* And the rows of a diff, read out of the block a `code-block:: diff`
           carries — see `DiffExtension` for why the reading is not the
           template's and not the element's. */
        ->set(DiffExtension::class)
        ->tag('twig.extension')

        /* The second output format: the same documents written as Markdown,
           for a reader that is a program. The node renderers it draws on are
           the ones tagged for `md`, which is the whole of what a format is
           here — see `MarkdownRenderer`. */
        ->set(MarkdownRenderer::class)
        ->args(['$commandBus' => service(CommandBus::class)])
        ->tag('phpdoc.renderer.typerenderer', [
            'noderender_tag' => 'phpdoc.guides.noderenderer.md',
            'format' => 'md',
        ])

        /* And the twin's own table of contents at the publish root, for a
           reader that arrived with no navigation — one file for the whole
           project, which is why it is a renderer of its own rather than a
           template. See `LlmsRenderer`. */
        ->set(LlmsRenderer::class)
        ->tag('phpdoc.renderer.typerenderer', ['format' => 'llms'])

        /* A directive the core reaches by name rather than by node class, in
           the second format — see `GeneralDirectiveMarkdownRenderer` for why a
           miss renders the passage instead of a warning. */
        ->set(GeneralDirectiveMarkdownRenderer::class)
        ->tag('phpdoc.guides.noderenderer.md')

        /* And what a Markdown template cannot say in Twig: the blank line
           between two blocks, the prefix on a nested one, a fence longer than
           what it holds — see `MarkdownExtension`. */
        ->set(MarkdownExtension::class)
        ->tag('twig.extension')

        ->set(ThemeExtension::class)
        ->args([
            '%soul.signet%', '%soul.favicons%', '%soul.product%', '%soul.brand%', '%soul.home%',
            '%soul.footer%', '%soul.navigation%', '%soul.pager%', '%soul.markdown%',
            service(Menu::class), service(Rail::class), service(Pager::class), service(Sections::class),
        ])
        ->tag('twig.extension');
};
