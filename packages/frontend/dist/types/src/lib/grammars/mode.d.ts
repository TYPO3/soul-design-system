export interface Mode {
    /** Other names the same grammar answers to. Both highlighters read this
        field, so an alias is stated once and neither end has a list of its
        own. */
    aliases?: string[];
    /** The colour, without the `hljs-` the emitter adds. */
    className?: string;
    begin?: string;
    end?: string;
    /** Keep what `begin` matched outside the span — for an operator that
        introduces a value without being part of it. */
    excludeBegin?: boolean;
    case_insensitive?: boolean;
    contains?: Mode[];
}
