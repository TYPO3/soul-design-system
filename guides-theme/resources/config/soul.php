<?php

declare(strict_types=1);

use TYPO3\Soul\GuidesTheme\Directives\SpecimenDirective;
use TYPO3\Soul\GuidesTheme\Parser\LayoutFieldListItemRule;
use TYPO3\Soul\GuidesTheme\Twig\ThemeExtension;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $container): void {
    $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure()

        /* The one directive this theme brings. Tagged the way every directive
           is, so the parser finds it without the project saying anything. */
        ->set(SpecimenDirective::class)
        ->tag('phpdoc.guides.directive')

        /* `:layout:` at the top of a document, read like `:navigation-title:`
           is. Tagged the same way, so a project writes the field and nothing
           else. */
        ->set(LayoutFieldListItemRule::class)
        ->tag('phpdoc.guides.parser.rst.fieldlist')

        ->set(ThemeExtension::class)
        ->args(['%soul.signet%', '%soul.product%', '%soul.home%', '%soul.footer%'])
        ->tag('twig.extension');
};
