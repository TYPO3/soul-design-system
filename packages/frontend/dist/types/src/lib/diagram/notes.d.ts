import type { Context, Drawn, Room } from './context.js';
export interface NotesSpec {
    kind: 'notes';
    notes: {
        marker: string;
        title: string;
        body?: string;
    }[];
}
export declare const notes: (spec: NotesSpec, room: Room, ctx: Context) => Drawn;
