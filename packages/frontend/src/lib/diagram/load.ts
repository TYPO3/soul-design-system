import { later } from '../later.ts';

/* The engine, for the element. A page fetches it on its first drawing. */
export const engine = later(() => import('./engine.ts'));
