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
use TYPO3\Soul\GuidesTheme\Nodes\CardGridNode;
use TYPO3\Soul\GuidesTheme\Nodes\CardNode;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;
use TYPO3\Soul\GuidesTheme\Nodes\HeroNode;
use TYPO3\Soul\GuidesTheme\Nodes\LayoutNode;
use TYPO3\Soul\GuidesTheme\Nodes\TeaserNode;

/**
 * What a project using this theme can set, and where it says so.
 *
 * Guides' own `<project>` element carries a title, a version, a release and a
 * copyright, and nothing else — there is no place in it for a mark. An
 * `<extension>` element, though, hands everything inside it to the extension
 * it names, which is what makes this configuration rather than a template
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
     * What a tab icon is announced as, by the only thing that knows: its name.
     *
     * A `type` is what lets a browser pick between the files without fetching
     * them first, which is the whole point of listing more than one. It is
     * read here rather than configured for the same reason a social link's
     * glyph is: a second place to say what a file is, is a place that can
     * disagree with the file.
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
                   renderer can see — so it is copied into the output with the
                   documents rather than pointing at something that only exists
                   on the machine that built the site. */
                ->scalarNode('signet')->defaultNull()->end()
                /* The same mark, in the tab. Written as one element per file
                   and not as one path, because this system draws a signet at
                   three optical sizes and a browser picks between them at the
                   link — a media query inside an SVG only sees its own
                   viewport:

                       <favicon href="_images/signet-s.svg" sizes="16x16"/>
                       <favicon href="_images/signet-l.svg" sizes="32x32"/>

                   Left out entirely, the signet is the tab icon: a bar with a
                   mark above a tab with none is one site saying two things,
                   and the file already has to survive being rendered on its
                   own — that is what the hex fallback beside every `var()` in
                   it is for. */
                ->arrayNode('favicons')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('href')->isRequired()->end()
                            /* The slot this file is drawn for, as the
                               attribute is spelled: `16x16`. One entry may
                               leave it out, and then it is the file for
                               whatever a browser did not find a size for. */
                            ->scalarNode('sizes')->defaultNull()->end()
                        ->end()
                    ->end()
                ->end()
                /* The name in the bar, when it is not the project's own title:
                   a manual that documents one product inside a larger project
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
                /* The footer, because a marketing page has one and a manual
                   does not get to invent it. Its columns are the toctree and
                   are configured nowhere; what is set here is what the tree
                   cannot know — a column pointing somewhere else, the social
                   accounts, and the line that says what this is not:

                       <footer>
                           <group title="Elsewhere">
                               <link href="https://…" label="Product site" external="true"/>
                           </group>
                           <social href="https://…" label="GitHub"/>
                           <note>Not an official product.</note>
                       </footer>

                   All of it optional. A footer with nothing set renders the
                   site's own sections, the mark and the year, which is the
                   least a page can say. */
                /* The handful of places a site has, in the bar. Left out, it
                   is the top level of the tree, so a project that says nothing
                   still has one; the toctree entire is the rail's job, and a
                   manual's every page in the bar is not navigation. */
                ->arrayNode('navigation')
                    ->fixXmlConfig('link')
                    ->children()
                        ->arrayNode('links')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode('href')->isRequired()->end()
                                    ->scalarNode('label')->isRequired()->end()
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
                                                /* A document, written the way
                                                   a `:doc:` reference is —
                                                   `/frontend`, not
                                                   `frontend.html`. It is
                                                   resolved per page, because a
                                                   footer is rendered on every
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
     * A node with no template is rendered as its text, which is how
     * `:navigation-title:` came to stand in the `<head>` of every page — and
     * from there, hoisted by the browser, above the shell. Declared here so a
     * project writes none of it: a theme that needed six lines of mapping in
     * every consumer's config would be a theme that ships broken by default.
     */
    public function prepend(ContainerBuilder $container): void
    {
        /* The two packages this theme requires, registered as if the project
           had named them. A composer dependency the consumer still has to
           repeat in their own config is a dependency they can get wrong, and
           without the first one every code block on the site renders as
           unmarked text. */
        $this->registerDependency($container, new CodeExtension());
        $this->registerDependency($container, new MarkdownExtension());

        $blank = 'structure/header/blank.html.twig';
        $container->prependExtensionConfig('guides', [
            /* A theme rather than a list of template paths. A path is searched
               after the packaged templates, so a file replacing one of theirs
               is never reached; a theme's templates come first, which is what
               a theme is for. Select it with `theme="soul"`. */
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
                ['node' => HeroNode::class, 'file' => 'body/directive/hero.html.twig', 'format' => 'html'],
                ['node' => TeaserNode::class, 'file' => 'body/directive/teaser.html.twig', 'format' => 'html'],
                ['node' => CardNode::class, 'file' => 'body/directive/card.html.twig', 'format' => 'html'],
                ['node' => CardGridNode::class, 'file' => 'body/directive/card-grid.html.twig', 'format' => 'html'],
                ['node' => AccordionNode::class, 'file' => 'body/directive/accordion.html.twig', 'format' => 'html'],
                ['node' => AccordionItemNode::class, 'file' => 'body/directive/accordion-item.html.twig', 'format' => 'html'],
            ],
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
        /* The glyph is worked out here rather than in the template, because it
           is a fact about the URL and not about the page it is rendered on —
           and a template that computes is a template a project ends up
           copying. */
        $footer = $config['footer'] ?? [];
        foreach ($footer['socials'] ?? [] as $index => $social) {
            $footer['socials'][$index]['icon'] = Brands::icon($social['href']);
        }

        $container->setParameter('soul.footer', $footer);
        $container->setParameter('soul.navigation', $config['navigation'] ?? []);

        $loader = new PhpFileLoader($container, new FileLocator(dirname(__DIR__, 2) . '/resources/config'));
        $loader->load('soul.php');
    }

    /**
     * A package this theme cannot render without, registered for the project.
     * It arrives too late in the prepend pass for its own `prepend()` to be
     * called, so that is done here. A project naming it itself is left alone,
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
     * Worked out here and not in the head, for the reason a social glyph is:
     * it is a fact about the file, and a template that computes is a template
     * a project ends up copying.
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
