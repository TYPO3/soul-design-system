<?php

declare(strict_types=1);

use TYPO3\Soul\GuidesTheme\Directives\BandDirective;
use TYPO3\Soul\GuidesTheme\Directives\GridDirective;
use TYPO3\Soul\GuidesTheme\Directives\SpecimenDirective;
use TYPO3\Soul\GuidesTheme\Directives\TeaserDirective;
use TYPO3\Soul\GuidesTheme\Parser\LayoutFieldListItemRule;
use TYPO3\Soul\GuidesTheme\Twig\ThemeExtension;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\DirectiveContentRule;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

return static function (ContainerConfigurator $container): void {
    $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure()
        /* A directive that holds content parses it with a rule, and the rule
           is an interface the container cannot guess. Bound once here rather
           than in each of the three. */
        ->instanceof(SubDirective::class)
        ->bind('$startingRule', service(DirectiveContentRule::class))

        /* The one directive this theme brings. Tagged the way every directive
           is, so the parser finds it without the project saying anything. */
        ->set(SpecimenDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The marketing blocks. Three directives, one node shape — see
           `BlockNode`. */
        ->set(BandDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(GridDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(TeaserDirective::class)
        ->tag('phpdoc.guides.directive')

        /* `:layout:` at the top of a document, read like `:navigation-title:`
           is. Tagged the same way, so a project writes the field and nothing
           else. */
        ->set(LayoutFieldListItemRule::class)
        ->tag('phpdoc.guides.parser.rst.fieldlist')

        ->set(ThemeExtension::class)
        ->args(['%soul.signet%', '%soul.product%', '%soul.brand%', '%soul.home%', '%soul.footer%', '%soul.navigation%'])
        ->tag('twig.extension');
};
