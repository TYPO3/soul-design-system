<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme\Directives;

use phpDocumentor\Guides\Nodes\Node;
use phpDocumentor\Guides\RestructuredText\Directives\BaseDirective;
use phpDocumentor\Guides\RestructuredText\Parser\BlockContext;
use phpDocumentor\Guides\RestructuredText\Parser\Directive;

/**
 * The renderer's `list-table`, with its title as the caption and a role for
 * each column.
 *
 *     .. list-table:: The use cases and how this concept fulfils them
 *        :columns: name fit, , meta end
 *
 * The renderer builds the table and drops the title. A table that a page
 * names has a caption, so this one keeps it. `:columns:` gives each column,
 * comma by comma, the roles the element knows: `name`, `meta`, `note`,
 * `fit`, `end`, `into`, `sign`. It wraps the renderer's own `process()`,
 * because that directive does not build its node later.
 */
final class ListTableDirective extends BaseDirective
{
    /** The roles a column can take, each the cell class the element styles. */
    private const ROLES = ['name', 'meta', 'note', 'fit', 'end', 'into', 'sign'];
    public function __construct(private readonly BaseDirective $table) {}

    public function getName(): string
    {
        return $this->table->getName();
    }

    public function process(BlockContext $blockContext, Directive $directive): ?Node
    {
        $node = $this->table->process($blockContext, $directive);
        if ($node === null) {
            return null;
        }

        $title = trim($directive->getData());
        if ($title !== '' && !$node->hasOption('caption')) {
            $node = $node->withOptions(['caption' => $title]);
        }

        if ($directive->hasOption('columns')) {
            $node = $node->withOptions(['columns' => self::columns((string)$directive->getOption('columns')->getValue())]);
        }

        return $node;
    }

    /**
     * Each column's cell classes, in order: `sds-td-name sds-td-fit`.
     *
     * @return list<string>
     */
    public static function columns(string $written): array
    {
        return array_map(
            static fn(string $column): string => implode(' ', array_map(
                static fn(string $role): string => 'sds-td-' . $role,
                array_values(array_intersect(preg_split('/\s+/', trim($column)) ?: [], self::ROLES)),
            )),
            explode(',', $written),
        );
    }
}
