<?php

declare(strict_types=1);

/*
 * The format of the theme's PHP: `make php`, and the `php` check in the
 * gate says when it has drifted.
 *
 * The rules are `typo3/coding-standards` and nothing on top of them. They
 * are the house style of the ecosystem this theme exists for. That makes
 * them the one list nobody here has to maintain, argue about or keep in
 * step with a fixer release. A hand-written ruleset is a second opinion
 * about brace placement that this repository has no reason to hold.
 *
 * No `setHeader()`. The upstream default stamps a licence banner onto every
 * file, and a comment in this tree carries a reason or does not exist.
 *
 * The finder takes the whole directory rather than a list of paths. So a
 * source file added later gets its format, and nobody has to remember this
 * file. `create()` already excludes `vendor/`.
 */

$config = \TYPO3\CodingStandards\CsFixerConfig::create();
$config->getFinder()
    ->in(__DIR__)
;

return $config;
