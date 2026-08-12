<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme;

/**
 * Which glyph a social account carries, read out of its own URL.
 *
 * Nothing configures this. A social entry is an account on a service, and the
 * URL already names the service — a second place to say which one is a place
 * that can disagree with the link beside it, and a Mastodon glyph on a link
 * that opens Bluesky is a footer lying about where pressing it goes.
 *
 * The identifiers are the icon set's own `actions-brand-*`, which is the whole
 * set there is. A host that is not below keeps its label and no glyph: a
 * service the set has no mark for is not one to substitute another mark for,
 * and a label alone is what the footer said yesterday.
 *
 * An instance somebody runs themselves — a GitLab of one's own, a Mastodon
 * that is not mastodon.social — is a host no URL can answer for. That is a
 * line added here, where every reader of the theme gets it, rather than a
 * setting each project fills in again.
 */
final class Brands
{
    /**
     * Host, without a leading `www.`, to the brand half of the identifier.
     *
     * `twitter.com` is X's old address and its glyph is X's: the mark follows
     * the service, not the spelling a link was written in.
     *
     * @var array<string, string>
     */
    private const HOSTS = [
        'bsky.app' => 'bluesky',
        'discord.com' => 'discord',
        'discord.gg' => 'discord',
        'facebook.com' => 'facebook',
        'github.com' => 'github',
        'gitlab.com' => 'gitlab',
        'instagram.com' => 'instagram',
        'linkedin.com' => 'linkedin',
        'mastodon.social' => 'mastodon',
        'slack.com' => 'slack',
        'threads.net' => 'threads',
        'twitter.com' => 'x',
        'typo3.org' => 'typo3',
        'x.com' => 'x',
        'xing.com' => 'xing',
        'youtu.be' => 'youtube',
        'youtube.com' => 'youtube',
    ];

    /** The icon identifier for a social link's URL, or null where there is none. */
    public static function icon(string $url): ?string
    {
        $host = strtolower((string)(parse_url($url, \PHP_URL_HOST) ?: ''));
        if (str_starts_with($host, 'www.')) {
            $host = substr($host, 4);
        }

        $brand = self::HOSTS[$host] ?? null;

        return $brand === null ? null : 'actions-brand-' . $brand;
    }
}
