<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use Symfony\Component\Config\FileLocator;

use function dirname;

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
final class SoulExtension extends Extension implements ConfigurationInterface
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
                /* What the bar links back to. The index of the project it is
                   rendering, unless a site puts its documentation under a
                   marketing page that is not part of it. */
                ->scalarNode('home')->defaultNull()->end()
            ->end();

        return $treeBuilder;
    }

    /** @param array<mixed> $configs */
    public function load(array $configs, ContainerBuilder $container): void
    {
        $config = $this->processConfiguration($this, $configs);

        $container->setParameter('soul.signet', $config['signet']);
        $container->setParameter('soul.product', $config['product']);
        $container->setParameter('soul.home', $config['home']);

        $loader = new PhpFileLoader($container, new FileLocator(dirname(__DIR__, 2) . '/resources/config'));
        $loader->load('soul.php');
    }
}
