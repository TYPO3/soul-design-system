/* The sync record, read.

   The record a build writes is what the last upload put in the artifact. A
   hash per published file, and a record per upload with its blob id. Plus
   the card, screen and element hashes the status report speaks in. The index
   and the record itself change every sync and hash nothing. So the path list
   assembles here rather than sits in the file, in one place. A plan that
   removes from a different list than the one it uploads is how files become
   orphans.
*/

export const ANCHOR_FILE = 'project/sync.json';
export const INDEX_FILE = 'project/design-system.json';

export interface UploadRecord {
  sha: string;
  bytes: number;
  type: string;
  blob: string | null;
}

export type Anchor = {
  fileHashes?: Record<string, string>;
  uploads?: Record<string, UploadRecord>;
  pending?: string[];
};

/* Every published path the record accounts for, the two it cannot hash
   included. */
export function pathsOf(anchor: Anchor): string[] {
  return [...Object.keys(anchor.fileHashes ?? {}), INDEX_FILE, ANCHOR_FILE].sort();
}

/* The content hashes, or null when the record has none — which is "unknown"
   rather than "unchanged", and the caller re-uploads everything that once. */
export function hashesOf(anchor: Anchor): Record<string, string> | null {
  return anchor.fileHashes ?? null;
}

/* The uploads with a blob id, keyed by path under `project/`. */
export function uploadsOf(anchor: Anchor): Record<string, UploadRecord> {
  return anchor.uploads ?? {};
}
