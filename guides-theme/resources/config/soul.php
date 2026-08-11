<?php

declare(strict_types=1);

use TYPO3\Soul\GuidesTheme\Twig\ThemeExtension;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $container): void {
    $container->services()
        ->set(ThemeExtension::class)
        ->args(['%soul.signet%', '%soul.product%', '%soul.home%'])
        ->tag('twig.extension');
};
