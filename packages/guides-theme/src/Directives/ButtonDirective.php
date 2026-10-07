<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\InlineCompoundNode;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\ButtonNode;

/**
 * One press, and where it goes.
 *
 *     .. button:: :doc:`installation`
 *        :icon: actions-download
 *
 * The label carries the target, the way a card's title does. As a reference,
 * a `:doc:` or an external link, the words are the label and the reference is
 * where the press goes. `:href:` is the same thing said as a path and wins
 * where both stand.
 *
 * A button on a rendered page is a link. The element draws an `<a>` the moment
 * it gets one. That gives the reader the browser's own middle click, hover
 * target and status line. A button with nowhere to go is a control that
 * does nothing on a press, so `type`, `for` and `command` are not on offer
 * here. A document has no form to submit and no element to command, and a
 * page that needs them is an application rather than a manual.
 *
 * **The options cover the rest of that element and leave nothing of it out.**
 * Spelt the way the element spells them — see `CardDirective` for why both
 * hold. `:icon:` is the one that is not an attribute. A glyph is a node beside
 * the words, so the template composes `sds-icon` into the control the way this
 * system's own pages do.
 */
#[Attributes\Directive(name: 'button')]
#[Attributes\Option(name: 'href', description: 'Where the press goes.')]
#[Attributes\Option(name: 'variant', description: 'The kind of button.')]
#[Attributes\Option(name: 'size', description: 'The size of the button.')]
#[Attributes\Option(name: 'icon', description: 'The name of an icon.')]
#[Attributes\Option(name: 'icon-only', type: OptionType::Boolean, description: 'Only the icon shows.')]
#[Attributes\Option(name: 'title', description: 'The name a reader hears.')]
#[Attributes\Option(name: 'rel', description: 'The relation of the link.')]
#[Attributes\Option(name: 'disabled', type: OptionType::Boolean, description: 'The button does nothing.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class ButtonDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        $label = $directive->getDataNode()
            ?? InlineCompoundNode::getPlainTextInlineNode($directive->getData());

        /* The children drop out, and they are the one thing here that does.
           A control's label is a line, so a block under a button is a
           paragraph that belongs beside it rather than inside it. */
        return (new ButtonNode($label))->withOptions([
            'href' => $directive->getOption('href')->getValue(),
            'variant' => $directive->getOption('variant')->getValue(),
            'size' => $directive->getOption('size')->getValue(),
            'icon' => $directive->getOption('icon')->getValue(),
            'icon-only' => $directive->hasOption('icon-only'),
            'title' => $directive->getOption('title')->getValue(),
            'rel' => $directive->getOption('rel')->getValue(),
            'disabled' => $directive->hasOption('disabled'),
            /* An author who wrote `:class:` meant it for their own stylesheet.
               To drop what a theme does not understand is the one thing it
               must not do. Carried the way `card` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
