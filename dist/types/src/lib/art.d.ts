import { type TemplateResult } from 'lit';
/**
 * The picture, as whatever it has to be to arrive in the right mode.
 *
 * @param cls    the class the surface hangs its own sizing on, `sds-art` alone
 *               unless a surface needs more.
 * @param width  a size in pixels, for a picture the stylesheet does not size —
 *               a mark in a bar. A figure passes neither and fills its column.
 * @param height
 */
export declare function art(src: string, alt: string, cls?: string, width?: number, height?: number): TemplateResult;
