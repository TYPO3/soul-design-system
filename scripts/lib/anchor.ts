/* Reading a sync anchor.

   The anchor a build writes is the record of what the last upload put in the
   project: a hash per file, plus the card, screen and element hashes the status
   report speaks in. Its own name is not in it — a file cannot hash itself — so
   the path list is assembled here rather than stored, in one place, because a
   plan that computes deletes from a different list than the one it uploads is
   how files are orphaned.
*/

export const ANCHOR_FILE = '_ds_sync.json';

export type Anchor = {
  fileHashes?: Record<string, string>;
  files?: string[];
};

/* Every path the anchor accounts for, its own included. An anchor from before
   per-file hashes carries `files` instead: those paths are still good for
   deletes, but it vouches for no content, which `hashesOf` answers separately. */
export function pathsOf(anchor: Anchor): string[] {
  if (anchor.fileHashes) return [...Object.keys(anchor.fileHashes), ANCHOR_FILE].sort();
  return [...(anchor.files ?? [])].sort();
}

/* The content hashes, or null when the anchor has none — which is "unknown"
   rather than "unchanged", and the caller re-uploads everything that once. */
export function hashesOf(anchor: Anchor): Record<string, string> | null {
  return anchor.fileHashes ?? null;
}
