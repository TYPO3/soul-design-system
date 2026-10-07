<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Compiler\CompilerContextInterface;
use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\Attributes;
use phpDocumentor\Guides\RestructuredText\Directives\DirectiveValueType;
use phpDocumentor\Guides\RestructuredText\Directives\OptionType;
use phpDocumentor\Guides\RestructuredText\Directives\SubDirective;
use phpDocumentor\Guides\RestructuredText\Nodes\DirectiveNode;
use TYPO3\Soul\GuidesTheme\Nodes\StepNode;

/**
 * One stop of an instruction, and the blocks that carry it out.
 *
 *     .. step:: Render the site
 *        :name: render-the-site
 *
 *        The first command writes documents, the second turns them into a site.
 *
 * The title is the argument, because that is where a TYPO3 manual already
 * writes a block's name. What follows is the work, and it stays between the
 * tags. A command, a file to edit and the line that says it worked are what
 * no attribute carries.
 *
 * `:name:` is the address of this one stop, in the meaning every other
 * directive gives it. It lands on the stop rather than on the title, and
 * nothing has to open first. A step does not fold away, which is the one
 * thing that made `accordion-item` put its address on the answer.
 *
 * The title is not a heading and takes no level. The number tells a reader
 * where they are in an instruction. A page whose outline is its steps has
 * buried its own sections under them.
 */
#[Attributes\Directive(name: 'step', valueType: DirectiveValueType::String)]
#[Attributes\Option(name: 'optional', type: OptionType::Boolean, description: 'A reader can skip the step.')]
#[Attributes\Option(name: 'name', description: 'The address of the step.')]
#[Attributes\Option(name: 'class', description: 'Classes for the frame.')]
final class StepDirective extends SubDirective
{
    public function createNode(DirectiveNode $directiveNode, CompilerContextInterface $compilerContext): ?Node
    {
        $directive = $directiveNode->getDirective();

        return (new StepNode($directiveNode->getChildren()))->withOptions([
            'heading' => $directive->getData(),
            'optional' => $directive->hasOption('optional'),
            'anchor' => $directive->getOption('name')->getValue(),
            /* Carried for the reason `steps` carries it. */
            'class' => $directive->getOption('class')->getValue(),
        ]);
    }
}
