<?php

declare(strict_types=1);

use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Parser\Productions\DirectiveContentRule;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use TYPO3\Soul\GuidesTheme\Directives\AccordionDirective;
use TYPO3\Soul\GuidesTheme\Directives\AccordionItemDirective;
use TYPO3\Soul\GuidesTheme\Directives\BandDirective;
use TYPO3\Soul\GuidesTheme\Directives\CardDirective;
use TYPO3\Soul\GuidesTheme\Directives\CardGridDirective;
use TYPO3\Soul\GuidesTheme\Directives\GridDirective;
use TYPO3\Soul\GuidesTheme\Directives\HeroDirective;
use TYPO3\Soul\GuidesTheme\Directives\SpecimenDirective;
use TYPO3\Soul\GuidesTheme\Directives\TeaserDirective;
use TYPO3\Soul\GuidesTheme\Navigation\Rail;
use TYPO3\Soul\GuidesTheme\Parser\LayoutFieldListItemRule;
use TYPO3\Soul\GuidesTheme\Twig\AnchorExtension;
use TYPO3\Soul\GuidesTheme\Twig\LinkExtension;
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
        ->set(TeaserDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The cards a manual is signposted with, spelled the way TYPO3
           documentation spells them — see `CardGridDirective` for what becomes
           of the column counts. */
        ->set(CardDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(CardGridDirective::class)
        ->tag('phpdoc.guides.directive')

        /* The questions a manual folds its answers behind, spelled the way
           TYPO3 documentation spells them — see `AccordionDirective` for why
           the set hands its group to the answers in it. */
        ->set(AccordionDirective::class)
        ->tag('phpdoc.guides.directive')
        ->set(AccordionItemDirective::class)
        ->tag('phpdoc.guides.directive')

        /* `:layout:` at the top of a document, read like `:navigation-title:`
           is. Tagged the same way, so a project writes the field and nothing
           else. */
        ->set(LayoutFieldListItemRule::class)
        ->tag('phpdoc.guides.parser.rst.fieldlist')

        /* The rail's list, worked out where it can be read. It resolves links
           itself, so it takes the renderer's url generator — autowired, unlike
           the extension below, whose arguments are all settings. */
        ->set(Rail::class)

        /* Where a reference points, for a template handing a target to a
           component instead of writing the link itself. */
        ->set(LinkExtension::class)
        ->tag('twig.extension')

        /* And the other half: the id for a place the parser anchored nowhere,
           named by the normalizer that names every other anchor. */
        ->set(AnchorExtension::class)
        ->tag('twig.extension')

        ->set(ThemeExtension::class)
        ->args(['%soul.signet%', '%soul.favicons%', '%soul.product%', '%soul.brand%', '%soul.home%', '%soul.footer%', '%soul.navigation%', service(Rail::class)])
        ->tag('twig.extension');
};
