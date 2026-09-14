<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Twig;

use phpDocumentor\Guides\Nodes\Inline\LinkInlineNode;
use phpDocumentor\Guides\ReferenceResolvers\DelegatingReferenceResolver;
use phpDocumentor\Guides\ReferenceResolvers\Messages;
use phpDocumentor\Guides\RenderContext;
use Psr\Log\LoggerInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Where a reference points, as a string a template can put in an attribute.
 *
 * A pre-renderer turns a reference into a URL as the link itself renders.
 * That is no use to a template that hands the target to a component as a
 * property instead of writes an `<a>`. This asks the same resolvers the same
 * question, so the answer cannot differ from the one an ordinary link gets.
 * And it warns in the same place when there is no answer. A card that
 * points at a document nobody wrote is a broken page, not an unlinked title.
 */
final class LinkExtension extends AbstractExtension
{
    public function __construct(
        private readonly DelegatingReferenceResolver $resolver,
        private readonly LoggerInterface $logger,
    ) {}

    /** @return TwigFunction[] */
    public function getFunctions(): array
    {
        return [
            new TwigFunction('linkUrl', $this->linkUrl(...), ['needs_context' => true]),
        ];
    }

    /** @param array{env?: RenderContext} $context */
    public function linkUrl(array $context, ?LinkInlineNode $node): string
    {
        $renderContext = $context['env'] ?? null;
        if (!$node instanceof LinkInlineNode || !$renderContext instanceof RenderContext) {
            return '';
        }

        $messages = new Messages();
        if (!$this->resolver->resolve($node, $renderContext, $messages)) {
            $this->logger->warning(
                $messages->getLastWarning()?->getMessage() ?? sprintf(
                    'Reference %s did not resolve in %s',
                    $node->getTargetReference(),
                    $renderContext->getCurrentFileName(),
                ),
                $renderContext->getLoggerInformation(),
            );
        }

        return $node->getUrl();
    }
}
