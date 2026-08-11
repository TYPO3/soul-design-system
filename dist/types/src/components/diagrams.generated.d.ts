/** The coordinate system each drawing is in, keyed by file name without
    the extension. `sds-figure` puts it on the wrapper it references the
    drawing from, because `<use>` does not bring a size across. */
export declare const DIAGRAM_VIEWBOX: Readonly<Record<string, string>>;
