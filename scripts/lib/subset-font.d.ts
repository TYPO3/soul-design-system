/* The one call `make fonts` makes of `subset-font`, which ships no types. */
declare module 'subset-font' {
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: { targetFormat?: 'woff2' | 'woff' | 'truetype' | 'sfnt'; variationAxes?: Record<string, number> },
  ): Promise<Buffer>;
}
