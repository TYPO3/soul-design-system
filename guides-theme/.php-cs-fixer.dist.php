<?php

declare(strict_types=1);

/*
 * How the theme's PHP is formatted: `make php`, and the `php` check in the
 * gate says when it has drifted.
 *
 * The rules are `typo3/coding-standards` and nothing on top of them. They
 * are the house style of the ecosystem this theme is written for, which
 * makes them the one list nobody here has to maintain, argue about or keep
 * in step with a fixer release — a hand-written ruleset would be a second
 * opinion about brace placement that this repository has no reason to hold.
 *
 * No `setHeader()`. The upstream default stamps a licence banner onto every
 * file, and a comment in this tree carries a reason or it is not written.
 *
 * The finder takes the whole directory rather than a list of paths, so a
 * source file added later is formatted without anyone remembering this
 * file. `vendor/` is already excluded by `create()`.
 */

$config = \TYPO3\CodingStandards\CsFixerConfig::create();
$config->getFinder()
    ->in(__DIR__)
;

return $config;
