<?php

declare(strict_types=1);

use TYPO3\Soul\GuidesTheme\Directives\SpecimenDirective;
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

        ->set(ThemeExtension::class)
        ->args(['%soul.signet%', '%soul.product%', '%soul.home%'])
        ->tag('twig.extension');
};
