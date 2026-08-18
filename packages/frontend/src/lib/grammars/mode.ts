/* What a highlight.js language definition is, as far as a grammar written
   here uses it. Declared rather than imported: highlight.js types a mode
   against helpers and inherited modes this system never reaches for, and the
   PHP port reads the same fields out of JSON. The names are the library's —
   `className` rather than `scope`, because 9.x is what the port speaks and
   11.x still maps the older name onto the newer one. */

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
