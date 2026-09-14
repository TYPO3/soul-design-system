<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\DependencyInjection;

use phpDocumentor\Guides\Code\DependencyInjection\CodeExtension;
use phpDocumentor\Guides\Markdown\DependencyInjection\MarkdownExtension;
use phpDocumentor\Guides\Nodes\Metadata\NavigationTitleNode;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use TYPO3\Soul\GuidesTheme\Brands;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionItemNode;
use TYPO3\Soul\GuidesTheme\Nodes\AccordionNode;
use TYPO3\Soul\GuidesTheme\Nodes\BandNode;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonBarNode;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonNode;
use TYPO3\Soul\GuidesTheme\Nodes\CardNode;
use TYPO3\Soul\GuidesTheme\Nodes\DirectoryTreeNode;
use TYPO3\Soul\GuidesTheme\Nodes\ExampleNode;
use TYPO3\Soul\GuidesTheme\Nodes\FactsNode;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;
use TYPO3\Soul\GuidesTheme\Nodes\HalfNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;
use TYPO3\Soul\GuidesTheme\Nodes\LayoutNode;
use TYPO3\Soul\GuidesTheme\Nodes\QuoteNode;
use TYPO3\Soul\GuidesTheme\Nodes\SplitNode;
use TYPO3\Soul\GuidesTheme\Nodes\StatNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepsNode;
use TYPO3\Soul\GuidesTheme\Nodes\SurfaceNode;
use TYPO3\Soul\GuidesTheme\Nodes\SwatchNode;

/**
 * What a project using this theme can set, and where it says so.
 *
 * Guides' own `<project>` element carries a title, a version, a release and a
 * copyright, and nothing else. There is no place in it for a mark. An
 * `<extension>` element, though, hands everything inside it to the extension
 * it names. That is what makes this configuration rather than a template
 * somebody has to copy:
 *
 *     <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
 *         <signet>_images/signet.svg</signet>
 *         <product>Your product</product>
 *     </extension>
 *
 * Both are optional. Without them the bar carries the project title from
 * `<project>`, which is where a name belongs when there is only one.
 */
final class SoulExtension extends Extension implements ConfigurationInterface, PrependExtensionInterface
{
    /**
     * What a tab icon announces itself as, by the only thing that knows: its
     * name.
     *
     * A `type` is what lets a browser pick between the files before any
     * fetch. That is the whole point of a list of more than one. It comes
     * from here rather than from configuration, for the same reason a social
     * link's glyph does. A second place to say what a file is, is a place
     * that can disagree with the file.
     *
     * @var array<string, string>
     */
    private const MEDIA_TYPES = [
        'gif' => 'image/gif',
        'ico' => 'image/x-icon',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'png' => 'image/png',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
    ];

    public function getAlias(): string
    {
        return 'soul';
    }

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('soul');
        $treeBuilder->getRootNode()
            ->fixXmlConfig('favicon')
            ->children()
                /* A path, relative to the documentation root, of a file the
                   renderer can see. So it goes into the output with the
                   documents rather than points at something that only exists
                   on the machine that built the site. */
                ->scalarNode('signet')->defaultNull()->end()
                /* The same mark, in the tab. One element per file and not
                   one path. This system draws a signet at three optical
                   sizes, and a browser picks between them at the link. A
                   media query inside an SVG only sees its own viewport:

                       <favicon href="_images/signet-s.svg" sizes="16x16"/>
                       <favicon href="_images/signet-l.svg" sizes="32x32"/>

                   Left out entirely, the signet is the tab icon. A bar with a
                   mark above a tab with none is one site that says two
                   things. And the file already has to survive a render on its
                   own — that is what the hex fallback beside every `var()` in
                   it is for. */
                ->arrayNode('favicons')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('href')->isRequired()->end()
                            /* The slot this file exists for, spelt as the
                               attribute spells it: `16x16`. One entry can
                               leave it out, and then it is the file for
                               whatever a browser did not find a size for. */
                            ->scalarNode('sizes')->defaultNull()->end()
                        ->end()
                    ->end()
                ->end()
                /* The name in the bar, when it is not the project's own title.
                   A manual that documents one product inside a larger project
                   says the product. */
                ->scalarNode('product')->defaultNull()->end()
                /* Whose product it is, where that is a second name — the first
                   half of a lockup, with the accent rule between the two. Left
                   out, the mark is one name and there is nothing to separate. */
                ->scalarNode('brand')->defaultNull()->end()
                /* What the bar links back to. The index of the project it is
                   rendering, unless a site puts its documentation under a
                   marketing page that is not part of it. */
                ->scalarNode('home')->defaultNull()->end()
                /* The same documents written again as Markdown, `page.md`
                   beside `page.html`, each page naming its twin. On by
                   default: a reader that is a program is a reader this theme
                   has. `<markdown>false</markdown>` is for a project that
                   will not publish its documents twice. */
                ->booleanNode('markdown')->defaultTrue()->end()
                /* The way on from a page: the pages either side of it in the
                   order the tree reads, at the end of the column.

                       <pager>true</pager>

                   Off by default, and that is a decision rather than caution.
                   The renderer computes no such thing, as its own prev/next
                   block has sat commented out of the core template for years.
                   So this is the theme's offer of a path. A reference nobody
                   reads front to back is a reference where that path is a
                   row of noise under every page. A manual says true. */
                ->booleanNode('pager')->defaultFalse()->end()
                /* The footer, because a marketing page has one and a manual
                   does not get to invent it. Its columns are the toctree and
                   no configuration touches them. What stands here is what
                   the tree cannot know. A column that points somewhere else,
                   the social accounts, and the line that says what this is:

                       <footer>
                           <group title="Elsewhere">
                               <link href="https://…" label="Product site" external="true"/>
                           </group>
                           <social href="https://…" label="GitHub"/>
                           <note>A tool for TYPO3 community projects.</note>
                       </footer>

                   All of it optional. A footer with nothing set renders the
                   site's own sections, the mark and the year, which is the
                   least a page can say. */
                /* The handful of places a site has, in the bar. Left out, it
                   is the top level of the tree, so a project that says nothing
                   still has one. The toctree entire is the rail's job, and a
                   manual's every page in the bar is not navigation. */
                ->arrayNode('navigation')
                    ->fixXmlConfig('link')
                    ->children()
                        ->arrayNode('links')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode('href')->isRequired()->end()
                                    /* Only where the tree has no page to take
                                       the name from — somebody else's site.
                                       A section's name is what its own
                                       `:navigation-title:` says. */
                                    ->scalarNode('label')->defaultNull()->end()
                                    ->booleanNode('external')->defaultFalse()->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('footer')
                    ->fixXmlConfig('group')
                    ->fixXmlConfig('social')
                    ->children()
                        ->arrayNode('groups')
                            ->arrayPrototype()
                                ->fixXmlConfig('link')
                                ->children()
                                    ->scalarNode('title')->defaultNull()->end()
                                    ->arrayNode('links')
                                        ->arrayPrototype()
                                            ->children()
                                                /* A document, spelt the way
                                                   a `:doc:` reference is —
                                                   `/frontend`, not
                                                   `frontend.html`. It
                                                   resolves per page, because a
                                                   footer renders on every
                                                   one of them and they are not
                                                   all at the same depth. An
                                                   external link is a URL and
                                                   says so. */
                                                ->scalarNode('href')->isRequired()->end()
                                                ->scalarNode('label')->isRequired()->end()
                                                ->booleanNode('external')->defaultFalse()->end()
                                            ->end()
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                        /* An account somewhere else. There is no glyph to set:
                           the URL names the service and `Brands` reads the
                           mark out of it, so the two cannot come apart. */
                        ->arrayNode('socials')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode('href')->isRequired()->end()
                                    ->scalarNode('label')->isRequired()->end()
                                ->end()
                            ->end()
                        ->end()
                        ->scalarNode('note')->defaultNull()->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }

    /**
     * The theme's own nodes, and the two that print themselves without this.
     *
     * A node with no template renders as its text. That is how
     * `:navigation-title:` came to stand in the `<head>` of every page, and
     * from there, hoisted by the browser, above the shell. Declared here so a
     * project writes none of it. A theme that needs six lines of map in every
     * consumer's config is a theme that ships broken by default.
     */
    public function prepend(ContainerBuilder $container): void
    {
        /* The two packages this theme needs, registered as if the project
           had named them. A composer dependency the consumer still has to
           repeat in their own config is a dependency they can get wrong.
           Without the first one every code block on the site renders as
           unmarked text. */
        $this->registerDependency($container, new CodeExtension());
        $this->registerDependency($container, new MarkdownExtension());

        $blank = 'structure/header/blank.html.twig';
        $container->prependExtensionConfig('guides', [
            /* A theme rather than a list of template paths. The search reaches
               a path after the packaged templates, so a file that replaces one
               of theirs never wins. A theme's templates come first, which is
               what a theme is for. Select it with `theme="soul"`. */
            'themes' => [
                'soul' => [
                    'extends' => 'default',
                    'templates' => [dirname(__DIR__, 2) . '/resources/template'],
                ],
            ],
            'templates' => [
                ['node' => NavigationTitleNode::class, 'file' => $blank, 'format' => 'html'],
                ['node' => LayoutNode::class, 'file' => $blank, 'format' => 'html'],
                ['node' => BandNode::class, 'file' => 'body/directive/band.html.twig', 'format' => 'html'],
                ['node' => GridNode::class, 'file' => 'body/directive/grid.html.twig', 'format' => 'html'],
                ['node' => SplitNode::class, 'file' => 'body/directive/split.html.twig', 'format' => 'html'],
                ['node' => HalfNode::class, 'file' => 'body/directive/half.html.twig', 'format' => 'html'],
                ['node' => HeroNode::class, 'file' => 'body/directive/hero.html.twig', 'format' => 'html'],
                ['node' => StatNode::class, 'file' => 'body/directive/stat.html.twig', 'format' => 'html'],
                ['node' => SurfaceNode::class, 'file' => 'body/directive/surface.html.twig', 'format' => 'html'],
                ['node' => SwatchNode::class, 'file' => 'body/directive/swatch.html.twig', 'format' => 'html'],
                ['node' => QuoteNode::class, 'file' => 'body/directive/quote.html.twig', 'format' => 'html'],
                ['node' => CardNode::class, 'file' => 'body/directive/card.html.twig', 'format' => 'html'],
                ['node' => ButtonNode::class, 'file' => 'body/directive/button.html.twig', 'format' => 'html'],
                ['node' => ButtonBarNode::class, 'file' => 'body/directive/button-bar.html.twig', 'format' => 'html'],
                ['node' => AccordionNode::class, 'file' => 'body/directive/accordion.html.twig', 'format' => 'html'],
                ['node' => AccordionItemNode::class, 'file' => 'body/directive/accordion-item.html.twig', 'format' => 'html'],
                ['node' => FactsNode::class, 'file' => 'body/directive/facts.html.twig', 'format' => 'html'],
                ['node' => DirectoryTreeNode::class, 'file' => 'body/directive/directory-tree.html.twig', 'format' => 'html'],
                ['node' => StepsNode::class, 'file' => 'body/directive/steps.html.twig', 'format' => 'html'],
                ['node' => StepNode::class, 'file' => 'body/directive/step.html.twig', 'format' => 'html'],
                ['node' => ExampleNode::class, 'file' => 'body/directive/example.html.twig', 'format' => 'html'],
                /* And the same documents as Markdown, node for node. The
                   format's name is the file extension the renderer writes and
                   the one every reference inside it resolves to. So the twin
                   is a site of its own rather than a file beside a page. */
                ...$this->markdown(),
            ],
            /* The two the renderer writes by default, and ours where the
               project has not turned it off. Read out of the raw config
               rather than out of `load()`. A format has to exist before the
               container compiles, and by the time a setting has gone through
               the render already has its configuration. */
            'output_format' => $this->wants($container, 'markdown')
                ? ['html', 'interlink', 'md', 'llms']
                : ['html', 'interlink'],
        ]);
    }

    /** @param array<mixed> $configs */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $config = $this->processConfiguration($this, $configs);

        $container->setParameter('soul.signet', $config['signet']);
        $container->setParameter('soul.favicons', $this->favicons($config));
        $container->setParameter('soul.product', $config['product']);
        $container->setParameter('soul.brand', $config['brand']);
        $container->setParameter('soul.home', $config['home']);
        /* The glyph comes from here rather than from the template. It is a
           fact about the URL and not about the page it renders on. A
           template that computes is a template a project ends up with a copy
           of. */
        $footer = $config['footer'] ?? [];
        foreach ($footer['socials'] ?? [] as $index => $social) {
            $footer['socials'][$index]['icon'] = Brands::icon($social['href']);
        }

        $container->setParameter('soul.footer', $footer);
        $container->setParameter('soul.navigation', $config['navigation'] ?? []);
        $container->setParameter('soul.pager', $config['pager']);
        /* The head names the twin, and can only name one that exists. */
        $container->setParameter('soul.markdown', $config['markdown']);

        $loader = new PhpFileLoader($container, new FileLocator(dirname(__DIR__, 2) . '/resources/config'));
        $loader->load('soul.php');
    }

    /**
     * The Markdown map, as the renderer takes its templates. Written out
     * rather than through the core's `templateArray()`, a function in another
     * package's file scope that exists only where that file loaded.
     *
     * @return list<array{node: string, file: string, format: string}>
     */
    private function markdown(): array
    {
        $templates = [];
        /** @var array<class-string, string> $map */
        $map = require dirname(__DIR__, 2) . '/resources/template/markdown.php';
        foreach ($map as $node => $file) {
            $templates[] = ['node' => $node, 'file' => $file, 'format' => 'md'];
        }

        return $templates;
    }

    /**
     * A setting as the project wrote it, before anything has processed it —
     * XML carries no types, so `false` arrives as the word. Nothing written
     * is the default the tree above states.
     */
    private function wants(ContainerBuilder $container, string $setting, bool $unwritten = true): bool
    {
        foreach ($container->getExtensionConfig($this->getAlias()) as $config) {
            if (isset($config[$setting])) {
                return filter_var($config[$setting], FILTER_VALIDATE_BOOL);
            }
        }

        return $unwritten;
    }

    /**
     * A package this theme cannot render without, registered for the project.
     * It arrives too late in the prepend pass for its own `prepend()` to run,
     * so that happens here. A project that names it itself stays as it is,
     * because an element in `guides.xml` is there to configure it.
     */
    private function registerDependency(ContainerBuilder $container, ExtensionInterface $extension): void
    {
        if ($container->hasExtension($extension->getAlias())) {
            return;
        }

        $container->registerExtension($extension);
        $container->loadFromExtension($extension->getAlias(), []);

        if ($extension instanceof PrependExtensionInterface) {
            $extension->prepend($container);
        }
    }

    /**
     * The tab icons, each with the type its own filename gives it.
     *
     * From here and not from the head, for the reason a social glyph is. It
     * is a fact about the file, and a template that computes is a template a
     * project ends up with a copy of.
     *
     * @param array<string, mixed> $config
     *
     * @return array<int, array<string, string|null>>
     */
    private function favicons(array $config): array
    {
        /** @var array<int, array<string, string|null>> $favicons */
        $favicons = $config['favicons'] ?? [];
        if ($favicons === [] && $config['signet'] !== null) {
            $favicons = [['href' => $config['signet'], 'sizes' => null]];
        }

        foreach ($favicons as $index => $icon) {
            $extension = strtolower(pathinfo((string)$icon['href'], \PATHINFO_EXTENSION));
            $favicons[$index]['type'] = self::MEDIA_TYPES[$extension] ?? null;
        }

        return $favicons;
    }
}
