/* A numbered list: what each marker of a sketch stands for.

   The numbers are the markers of the drawing beside it, so a reader goes
   from a place to its sentence and back. Each entry is a title and one
   line under it. */

import type { Context, Drawn, Room } from './context.ts';
import { SECONDARY, SIZE, marker, text } from './paint.ts';
import { wrap } from './text.ts';

export interface NotesSpec {
  kind: 'notes';
  notes: { marker: string; title: string; body?: string }[];
}

export const notes = (spec: NotesSpec, room: Room, ctx: Context): Drawn => {
  const out: string[] = [];
  let y = room.y;
  for (const n of spec.notes) {
    const what = `${ctx.name}: note ${n.marker}`;
    const title = wrap(n.title, room.width - 36, { size: SIZE.node, weight: 600 }, what);
    const body = n.body ? wrap(n.body, room.width - 36, { size: SIZE.body }, what) : [];
    out.push(marker(room.x + 11, y + 11, n.marker));
    title.forEach((l, i) => out.push(text(room.x + 36, y + 16 + i * 21, l, { size: SIZE.node, weight: 600 })));
    body.forEach((l, i) => out.push(text(room.x + 36, y + 16 + title.length * 21 + i * 19, l, { size: SIZE.body, fill: SECONDARY })));
    y += title.length * 21 + body.length * 19 + 12;
  }
  return { svg: out.join('\n'), height: y - 12 - room.y };
};
