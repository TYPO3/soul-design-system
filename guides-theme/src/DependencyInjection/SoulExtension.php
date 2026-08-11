<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\DependencyInjection;

use phpDocumentor\Guides\Nodes\Metadata\NavigationTitleNode;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use TYPO3\Soul\GuidesTheme\Nodes\BandNode;
use TYPO3\Soul\GuidesTheme\Nodes\GridNode;
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
    public function getAlias(): string
    {
        return 'soul';
    }

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('soul');
        $treeBuilder->getRootNode()
            ->children()
                /* A path, relative to the documentation root, of a file the
                   renderer can see — so it is copied into the output with the
                   documents rather than pointing at something that only exists
                   on the machine that built the site. */
                ->scalarNode('signet')->defaultNull()->end()
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
                   does not get to invent it. Groups of links, the social
                   accounts, and the line that says what this is not:

                       <footer>
                           <group title="Documentation">
                               <link href="index.html" label="Overview"/>
                           </group>
                           <social href="https://…" label="GitHub"/>
                           <note>Not an official product.</note>
                       </footer>

                   All of it optional. A footer with nothing in it renders as
                   the mark and the year, which is the least a page can say. */
                /* The handful of places a site has, in the bar. Not the
                   toctree: that is the rail's job, and a manual's every page
                   in the bar is not navigation. */
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
        $blank = 'structure/header/blank.html.twig';
        $container->prependExtensionConfig('guides', [
            /* A theme rather than a list of template paths. A path is searched
               after the packaged templates, so a file replacing one of theirs
               is never reached; a theme's templates come first, which is what
               a theme is for. Select it with `theme="soul"`. */
            'themes' => [
                'soul' => [
                    'extends' => 'default',
                    'templates' => [\dirname(__DIR__, 2) . '/resources/template'],
                ],
            ],
            'templates' => [
                ['node' => NavigationTitleNode::class, 'file' => $blank, 'format' => 'html'],
                ['node' => LayoutNode::class, 'file' => $blank, 'format' => 'html'],
                ['node' => BandNode::class, 'file' => 'body/directive/band.html.twig', 'format' => 'html'],
                ['node' => GridNode::class, 'file' => 'body/directive/grid.html.twig', 'format' => 'html'],
                ['node' => TeaserNode::class, 'file' => 'body/directive/teaser.html.twig', 'format' => 'html'],
            ],
        ]);
    }

    /** @param array<mixed> $configs */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $config = $this->processConfiguration($this, $configs);

        $container->setParameter('soul.signet', $config['signet']);
        $container->setParameter('soul.product', $config['product']);
        $container->setParameter('soul.brand', $config['brand']);
        $container->setParameter('soul.home', $config['home']);
        $container->setParameter('soul.footer', $config['footer'] ?? []);
        $container->setParameter('soul.navigation', $config['navigation'] ?? []);

        $loader = new PhpFileLoader($container, new FileLocator(\dirname(__DIR__, 2) . '/resources/config'));
        $loader->load('soul.php');
    }
}
