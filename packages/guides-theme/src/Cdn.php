<?php

declare(strict_types=1);

namespace TYPO3\Soul\GuidesTheme;

/**
 * Where the pages load the drop-in from, when a project asks for a CDN.
 *
 * The address names the release the theme is, never a range. The render
 * takes these exact files, and a script of another release draws markup that
 * does not match it. The release is the one the theme package
 * carries beside its drop-in, so the version and the hashes come from the
 * same files.
 *
 * Each file the page links gets an integrity hash, so a browser runs only the
 * bytes this render expected. What those files load in turn — the faces, the
 * chunks, the sprites — carries no hash, because no tag names them.
 */
final class Cdn
{
    /** The release, wherever jsDelivr serves the npm package. */
    private const JSDELIVR = 'https://cdn.jsdelivr.net/npm/@typo3/soul-frontend@{version}/dist/';

    /** The files a page links, each with its own hash. */
    private const LINKED = ['soul-boot.js', 'soul.css', 'soul.js'];

    /**
     * The address and the hashes, or nothing for a site that carries the
     * drop-in itself.
     *
     * @return array{base: string, version: string, integrity: array<string, string>}|null
     */
    public static function of(?string $setting, string $dist): ?array
    {
        $setting = trim((string)$setting);
        if ($setting === '' || $setting === 'false' || $setting === 'off') {
            return null;
        }

        $versionFile = $dist . '/version';
        if (!is_file($versionFile)) {
            throw new \RuntimeException(sprintf('<cdn> needs the release of the drop-in, and there is no %s', $versionFile));
        }

        $version = trim((string)file_get_contents($versionFile));
        $base = $setting === 'jsdelivr' ? self::JSDELIVR : $setting;
        if (!str_starts_with($base, 'https://')) {
            throw new \RuntimeException(sprintf('<cdn> takes "jsdelivr" or an https:// address, not "%s"', $setting));
        }

        $base = rtrim(str_replace('{version}', $version, $base), '/') . '/';
        $integrity = [];
        foreach (self::LINKED as $file) {
            $path = $dist . '/' . $file;
            if (!is_file($path)) {
                throw new \RuntimeException(sprintf('<cdn> hashes %s, and the drop-in has no such file', $path));
            }

            $integrity[$file] = 'sha384-' . base64_encode(hash_file('sha384', $path, true));
        }

        return ['base' => $base, 'version' => $version, 'integrity' => $integrity];
    }
}
