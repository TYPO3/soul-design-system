/* One reading of the page a frame, for every element that follows it.
   Each reads what it needs and hands back what it writes. All reads come
   first, then all writes, so the frame lays the page out once and not once
   for each element. */

type Read = () => (() => void) | undefined;

const queued = new Set<Read>();
let frame = 0;

/** Read in the next frame, with every other element that asks. */
export function readSoon(read: Read): void {
  queued.add(read);
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const reads = [...queued];
    queued.clear();
    const writes = reads.map((one) => one());
    for (const write of writes) write?.();
  });
}

/** Drop a reading an element asked for and no longer needs. */
export function dropReading(read: Read): void {
  queued.delete(read);
}
