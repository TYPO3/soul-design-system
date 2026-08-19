var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/highlight.js/lib/core.js
var require_core = __commonJS({
  "node_modules/highlight.js/lib/core.js"(exports, module) {
    function deepFreeze(obj) {
      if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
          throw new Error("map is read-only");
        };
      } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
          throw new Error("set is read-only");
        };
      }
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach((name) => {
        const prop = obj[name];
        const type = typeof prop;
        if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      });
      return obj;
    }
    var Response = class {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        if (mode.data === void 0) mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
      }
      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    };
    function escapeHTML(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function inherit$1(original, ...objects) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return (
        /** @type {T} */
        result
      );
    }
    var SPAN_CLOSE = "</span>";
    var emitsWrappingTags = (node) => {
      return !!node.scope;
    };
    var scopeToCSSClass = (name, { prefix }) => {
      if (name.startsWith("language:")) {
        return name.replace("language:", "language-");
      }
      if (name.includes(".")) {
        const pieces = name.split(".");
        return [
          `${prefix}${pieces.shift()}`,
          ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
        ].join(" ");
      }
      return `${prefix}${name}`;
    };
    var HTMLRenderer = class {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }
      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML(text);
      }
      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;
        const className = scopeToCSSClass(
          node.scope,
          { prefix: this.classPrefix }
        );
        this.span(className);
      }
      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;
        this.buffer += SPAN_CLOSE;
      }
      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }
      // helpers
      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    };
    var newNode = (opts = {}) => {
      const result = { children: [] };
      Object.assign(result, opts);
      return result;
    };
    var TokenTree = class _TokenTree {
      constructor() {
        this.rootNode = newNode();
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }
      /** @param {string} scope */
      openNode(scope) {
        const node = newNode({ scope });
        this.add(node);
        this.stack.push(node);
      }
      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        return void 0;
      }
      closeAllNodes() {
        while (this.closeNode()) ;
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
      }
      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }
      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;
        if (node.children.every((el) => typeof el === "string")) {
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            _TokenTree._collapse(child);
          });
        }
      }
    };
    var TokenTreeEmitter = class extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }
      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") {
          return;
        }
        this.add(text);
      }
      /** @param {string} scope */
      startScope(scope) {
        this.openNode(scope);
      }
      endScope() {
        this.closeNode();
      }
      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      __addSublanguage(emitter, name) {
        const node = emitter.root;
        if (name) node.scope = `language:${name}`;
        this.add(node);
      }
      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }
      finalize() {
        this.closeAllNodes();
        return true;
      }
    };
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function anyNumberOfTimes(re) {
      return concat("(?:", re, ")*");
    }
    function optional(re) {
      return concat("(?:", re, ")?");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];
      if (typeof opts === "object" && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function countMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }
    var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;
      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = "";
        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === "\\" && match[1]) {
            out += "\\" + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === "(") {
              numCaptures++;
            }
          }
        }
        return out;
      }).map((re) => `(${re})`).join(joinWith);
    }
    var MATCH_NOTHING_RE = /\b\B/;
    var IDENT_RE3 = "[a-zA-Z]\\w*";
    var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
    var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
    var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    var BINARY_NUMBER_RE = "\\b(0b[01]+)";
    var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    var SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/
        );
      }
      return inherit$1({
        scope: "meta",
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };
    var BACKSLASH_ESCAPE = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    };
    var APOS_STRING_MODE = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var QUOTE_STRING_MODE = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    var COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: "comment",
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: "doctag",
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/,
        // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/
        // allow capitalized words at beginning of sentences
      );
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---
          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827
          begin: concat(
            /[ ]+/,
            // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            "(",
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            "){3}"
          )
          // look for 3 words in a row
        }
      );
      return mode;
    };
    var C_LINE_COMMENT_MODE = COMMENT("//", "$");
    var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
    var HASH_COMMENT_MODE = COMMENT("#", "$");
    var NUMBER_MODE = {
      scope: "number",
      begin: NUMBER_RE,
      relevance: 0
    };
    var C_NUMBER_MODE = {
      scope: "number",
      begin: C_NUMBER_RE,
      relevance: 0
    };
    var BINARY_NUMBER_MODE = {
      scope: "number",
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    var REGEXP_MODE = {
      scope: "regexp",
      begin: /\/(?=[^/\n]*\/)/,
      end: /\/[gimuy]*/,
      contains: [
        BACKSLASH_ESCAPE,
        {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [BACKSLASH_ESCAPE]
        }
      ]
    };
    var TITLE_MODE = {
      scope: "title",
      begin: IDENT_RE3,
      relevance: 0
    };
    var UNDERSCORE_TITLE_MODE = {
      scope: "title",
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(
        mode,
        {
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          /** @type {ModeCallback} */
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
          }
        }
      );
    };
    var MODES3 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      APOS_STRING_MODE,
      BACKSLASH_ESCAPE,
      BINARY_NUMBER_MODE,
      BINARY_NUMBER_RE,
      COMMENT,
      C_BLOCK_COMMENT_MODE,
      C_LINE_COMMENT_MODE,
      C_NUMBER_MODE,
      C_NUMBER_RE,
      END_SAME_AS_BEGIN,
      HASH_COMMENT_MODE,
      IDENT_RE: IDENT_RE3,
      MATCH_NOTHING_RE,
      METHOD_GUARD,
      NUMBER_MODE,
      NUMBER_RE,
      PHRASAL_WORDS_MODE,
      QUOTE_STRING_MODE,
      REGEXP_MODE,
      RE_STARTERS_RE,
      SHEBANG,
      TITLE_MODE,
      UNDERSCORE_IDENT_RE,
      UNDERSCORE_TITLE_MODE
    });
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }
    function scopeClassName(mode, _parent) {
      if (mode.className !== void 0) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;
      mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;
      if (mode.relevance === void 0) mode.relevance = 0;
    }
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;
      mode.illegal = either(...mode.illegal);
    }
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
      mode.begin = mode.match;
      delete mode.match;
    }
    function compileRelevance(mode, _parent) {
      if (mode.relevance === void 0) mode.relevance = 1;
    }
    var beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch) return;
      if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key) => {
        delete mode[key];
      });
      mode.keywords = originalMode.keywords;
      mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;
      delete originalMode.beforeMatch;
    };
    var COMMON_KEYWORDS = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      // common variable name
      "list",
      // common variable name
      "value"
      // common variable name
    ];
    var DEFAULT_KEYWORD_SCOPE = "keyword";
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      const compiledKeywords = /* @__PURE__ */ Object.create(null);
      if (typeof rawKeywords === "string") {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName2) {
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
          );
        });
      }
      return compiledKeywords;
      function compileList(scopeName2, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map((x) => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split("|");
          compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }
    function scoreForKeyword(keyword, providedScore) {
      if (providedScore) {
        return Number(providedScore);
      }
      return commonKeyword(keyword) ? 0 : 1;
    }
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }
    var seenDeprecations = {};
    var error = (message) => {
      console.error(message);
    };
    var warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };
    var deprecated = (version2, message) => {
      if (seenDeprecations[`${version2}/${message}`]) return;
      console.log(`Deprecated as of ${version2}. ${message}`);
      seenDeprecations[`${version2}/${message}`] = true;
    };
    var MultiClassError = new Error();
    function remapScopeNames(mode, regexes, { key }) {
      let offset = 0;
      const scopeNames = mode[key];
      const emit = {};
      const positions = {};
      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      mode[key] = positions;
      mode[key]._emit = emit;
      mode[key]._multi = true;
    }
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin)) return;
      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.begin, { key: "beginScope" });
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end)) return;
      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.end, { key: "endScope" });
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }
    function MultiClass(mode) {
      scopeSugar(mode);
      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }
      beginMultiClass(mode);
      endMultiClass(mode);
    }
    function compileLanguage(language) {
      function langRe(value, global) {
        return new RegExp(
          source(value),
          "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
        );
      }
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
          if (this.regexes.length === 0) {
            this.exec = () => null;
          }
          const terminators = this.regexes.map((el) => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
          this.lastIndex = 0;
        }
        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) {
            return null;
          }
          const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
          const matchData = this.matchIndexes[i];
          match.splice(0, i);
          return Object.assign(match, matchData);
        }
      }
      class ResumableMultiRegex {
        constructor() {
          this.rules = [];
          this.multiRegexes = [];
          this.count = 0;
          this.lastIndex = 0;
          this.regexIndex = 0;
        }
        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];
          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }
        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ;
            else {
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }
          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              this.considerAll();
            }
          }
          return result;
        }
      }
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }
        return mm;
      }
      function compileMode(mode, parent) {
        const cmode = (
          /** @type CompiledMode */
          mode
        );
        if (mode.isCompiled) return cmode;
        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach((ext) => ext(mode, parent));
        language.compilerExtensions.forEach((ext) => ext(mode, parent));
        mode.__beforeBegin = null;
        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach((ext) => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;
        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(cmode.begin);
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(cmode.end);
          cmode.terminatorEnd = source(cmode.end) || "";
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(
          /** @type {RegExp | string} */
          mode.illegal
        );
        if (!mode.contains) mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === "self" ? mode : c);
        }));
        mode.contains.forEach(function(c) {
          compileMode(
            /** @type Mode */
            c,
            cmode
          );
        });
        if (mode.starts) {
          compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }
      if (!language.compilerExtensions) language.compilerExtensions = [];
      if (language.contains && language.contains.includes("self")) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }
      language.classNameAliases = inherit$1(language.classNameAliases || {});
      return compileMode(
        /** @type Mode */
        language
      );
    }
    function dependencyOnParent(mode) {
      if (!mode) return false;
      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }
      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }
      return mode;
    }
    var version = "11.11.1";
    var HTMLInjectionError = class extends Error {
      constructor(reason, html62) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html62;
      }
    };
    var escape = escapeHTML;
    var inherit = inherit$1;
    var NO_MATCH = /* @__PURE__ */ Symbol("nomatch");
    var MAX_KEYWORD_HITS = 7;
    var HLJS = function(hljs) {
      const languages = /* @__PURE__ */ Object.create(null);
      const aliases = /* @__PURE__ */ Object.create(null);
      const plugins = [];
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
      let options = {
        ignoreUnescapedHTML: false,
        throwUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        cssSelector: "pre code",
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }
      function blockLanguage(block) {
        let classes = block.className + " ";
        classes += block.parentNode ? block.parentNode.className : "";
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : "no-highlight";
        }
        return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }
      function highlight3(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }
        if (ignoreIllegals === void 0) {
          ignoreIllegals = true;
        }
        const context = {
          code,
          language: languageName
        };
        fire("before:highlight", context);
        const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
      }
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = /* @__PURE__ */ Object.create(null);
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }
        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }
          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";
          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";
              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substring(lastIndex);
          emitter.addText(buf);
        }
        function processSubLanguage() {
          if (modeBuffer === "") return;
          let result2 = null;
          if (typeof top.subLanguage === "string") {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */
            result2._top;
          } else {
            result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }
          if (top.relevance > 0) {
            relevance += result2.relevance;
          }
          emitter.__addSublanguage(result2._emitter, result2.language);
        }
        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = "";
        }
        function emitKeyword(keyword, scope) {
          if (keyword === "") return;
          emitter.startScope(scope);
          emitter.addText(keyword);
          emitter.endScope();
        }
        function emitMultiClass(scope, match) {
          let i = 1;
          const max = match.length - 1;
          while (i <= max) {
            if (!scope._emit[i]) {
              i++;
              continue;
            }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text = match[i];
            if (klass) {
              emitKeyword(text, klass);
            } else {
              modeBuffer = text;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            if (mode.beginScope._wrap) {
              emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);
          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }
            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            modeBuffer += lexeme[0];
            return 1;
          } else {
            resumeScanAtSamePosition = true;
            return 0;
          }
        }
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;
          const resp = new Response(newMode);
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }
          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substring(match.index);
          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) {
            return NO_MATCH;
          }
          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list.unshift(current.scope);
            }
          }
          list.forEach((item) => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];
          modeBuffer += textBeforeMatch;
          if (lexeme == null) {
            processBuffer();
            return 0;
          }
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;
          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }
          if (match.type === "illegal" && lexeme === "") {
            modeBuffer += "\n";
            return 1;
          }
          if (iterations > 1e5 && iterations > match.index * 3) {
            const err = new Error("potential infinite loop, way more iterations than matches");
            throw err;
          }
          modeBuffer += lexeme;
          return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language);
        let result = "";
        let top = continuation || md;
        const continuations = {};
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = "";
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
          if (!language.__emitTokens) {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (resumeScanAtSamePosition) {
                resumeScanAtSamePosition = false;
              } else {
                top.matcher.considerAll();
              }
              top.matcher.lastIndex = index;
              const match = top.matcher.exec(codeToHighlight);
              if (!match) break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substring(index));
          } else {
            language.__emitTokens(codeToHighlight, emitter);
          }
          emitter.finalize();
          result = emitter.toHTML();
          return {
            language: languageName,
            value: result,
            relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes("Illegal")) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }
      function justTextHighlightResult(code) {
        const result = {
          value: escape(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
      }
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext2 = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
          (name) => _highlight(name, code, false)
        );
        results.unshift(plaintext2);
        const sorted = results.sort((a, b) => {
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }
          return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.secondBest = secondBest;
        return result;
      }
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang && aliases[currentLang] || resultLang;
        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }
      function highlightElement(element) {
        let node = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language)) return;
        fire(
          "before:highlightElement",
          { el: element, language }
        );
        if (element.dataset.highlighted) {
          console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
          return;
        }
        if (element.children.length > 0) {
          if (!options.ignoreUnescapedHTML) {
            console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
            console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
            console.warn("The element with unescaped HTML:");
            console.warn(element);
          }
          if (options.throwUnescapedHTML) {
            const err = new HTMLInjectionError(
              "One of your code blocks includes unescaped HTML.",
              element.innerHTML
            );
            throw err;
          }
        }
        node = element;
        const text = node.textContent;
        const result = language ? highlight3(text, { language, ignoreIllegals: true }) : highlightAuto(text);
        element.innerHTML = result.value;
        element.dataset.highlighted = "yes";
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }
        fire("after:highlightElement", { el: element, result, text });
      }
      function configure(userOptions) {
        options = inherit(options, userOptions);
      }
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }
      let wantsHighlight = false;
      function highlightAll() {
        function boot() {
          highlightAll();
        }
        if (document.readyState === "loading") {
          if (!wantsHighlight) {
            window.addEventListener("DOMContentLoaded", boot, false);
          }
          wantsHighlight = true;
          return;
        }
        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
      }
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          if (!SAFE_MODE) {
            throw error$1;
          } else {
            error(error$1);
          }
          lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);
        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }
      function listLanguages() {
        return Object.keys(languages);
      }
      function getLanguage(name) {
        name = (name || "").toLowerCase();
        return languages[name] || languages[aliases[name]];
      }
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === "string") {
          aliasList = [aliasList];
        }
        aliasList.forEach((alias) => {
          aliases[alias.toLowerCase()] = languageName;
        });
      }
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }
      function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }
      function removePlugin(plugin) {
        const index = plugins.indexOf(plugin);
        if (index !== -1) {
          plugins.splice(index, 1);
        }
      }
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
      }
      Object.assign(hljs, {
        highlight: highlight3,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin,
        removePlugin
      });
      hljs.debugMode = function() {
        SAFE_MODE = false;
      };
      hljs.safeMode = function() {
        SAFE_MODE = true;
      };
      hljs.versionString = version;
      hljs.regex = {
        concat,
        lookahead,
        either,
        optional,
        anyNumberOfTimes
      };
      for (const key in MODES3) {
        if (typeof MODES3[key] === "object") {
          deepFreeze(MODES3[key]);
        }
      }
      Object.assign(hljs, MODES3);
      return hljs;
    };
    var highlight2 = HLJS({});
    highlight2.newInstance = () => HLJS({});
    module.exports = highlight2;
    highlight2.HighlightJS = highlight2;
    highlight2.default = highlight2;
  }
});

// packages/frontend/src/components/icon.ts
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// packages/frontend/src/lib/element.ts
import { LitElement } from "lit";
var CONTENT = "data-sds-content";
var SdsElement = class extends LitElement {
  createRenderRoot() {
    return this;
  }
  /** Asked once. These elements render into themselves, so after the first
      render the children are the element's own output — and `connectedCallback`
      runs again every time an element is moved in the document. A second look
      lifts that output and treats it as what the author wrote. */
  #looked = false;
  /** Lit renders *after* whatever children it finds rather than emptying the
      container, so an element arriving with its own prerendered markup would
      hold two copies. The marker says the build wrote that markup; content a
      caller wrote carries none and stays. */
  connectedCallback() {
    if (this.querySelector(`:scope > template[${CONTENT}]`)) {
      for (const node of [...this.childNodes]) node.remove();
    }
    super.connectedCallback();
  }
  lifted() {
    if (this.#looked) return [];
    this.#looked = true;
    const kept = this.querySelector(`:scope > template[${CONTENT}]`);
    const nodes = kept ? [...kept.content.childNodes] : [...this.childNodes];
    if (kept) for (const node of [...this.childNodes]) node.remove();
    for (const node of nodes) node.remove();
    return nodes;
  }
};
var isBlank = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
function define(tag, ctor) {
  if (typeof customElements === "undefined") return;
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// packages/frontend/src/components/icons.generated.ts
var ICON_IDS = [
  "actions-accessibility",
  "actions-approve",
  "actions-archive",
  "actions-arrow-down",
  "actions-arrow-down-alt",
  "actions-arrow-down-end",
  "actions-arrow-down-end-alt",
  "actions-arrow-down-left",
  "actions-arrow-down-left-alt",
  "actions-arrow-down-right",
  "actions-arrow-down-right-alt",
  "actions-arrow-down-start",
  "actions-arrow-down-start-alt",
  "actions-arrow-end",
  "actions-arrow-end-alt",
  "actions-arrow-end-down",
  "actions-arrow-end-down-alt",
  "actions-arrow-end-up",
  "actions-arrow-end-up-alt",
  "actions-arrow-left",
  "actions-arrow-left-alt",
  "actions-arrow-right",
  "actions-arrow-right-alt",
  "actions-arrow-right-down",
  "actions-arrow-right-down-alt",
  "actions-arrow-right-up",
  "actions-arrow-right-up-alt",
  "actions-arrow-start",
  "actions-arrow-start-alt",
  "actions-arrow-up",
  "actions-arrow-up-alt",
  "actions-aspect-ratio",
  "actions-badge",
  "actions-ban",
  "actions-barcode",
  "actions-barcode-read",
  "actions-barcode-scan",
  "actions-bell",
  "actions-bell-ring",
  "actions-bell-slash",
  "actions-bolt",
  "actions-bolt-alt",
  "actions-book",
  "actions-bookmark",
  "actions-bookmark-add",
  "actions-bookmark-remove",
  "actions-bookmarks",
  "actions-brand-apple",
  "actions-brand-bluesky",
  "actions-brand-discord",
  "actions-brand-facebook",
  "actions-brand-git",
  "actions-brand-github",
  "actions-brand-gitlab",
  "actions-brand-google",
  "actions-brand-instagram",
  "actions-brand-linkedin",
  "actions-brand-linux",
  "actions-brand-mastodon",
  "actions-brand-php",
  "actions-brand-slack",
  "actions-brand-threads",
  "actions-brand-typo3",
  "actions-brand-windows",
  "actions-brand-x",
  "actions-brand-xing",
  "actions-brand-youtube",
  "actions-briefcase",
  "actions-brightness-high",
  "actions-brightness-low",
  "actions-browser",
  "actions-brush",
  "actions-building",
  "actions-bullhorn",
  "actions-bullhorn-slash",
  "actions-calendar",
  "actions-calendar-alternative",
  "actions-canvas",
  "actions-capslock",
  "actions-caret-bar-bottom",
  "actions-caret-bar-end",
  "actions-caret-bar-start",
  "actions-caret-bar-top",
  "actions-caret-down",
  "actions-caret-end",
  "actions-caret-start",
  "actions-caret-up",
  "actions-cart",
  "actions-category",
  "actions-certificate",
  "actions-certificate-alternative",
  "actions-chat",
  "actions-check",
  "actions-check-badge",
  "actions-check-badge-alt",
  "actions-check-circle",
  "actions-check-circle-alt",
  "actions-check-square",
  "actions-check-square-alt",
  "actions-chevron-bar-down",
  "actions-chevron-bar-end",
  "actions-chevron-bar-start",
  "actions-chevron-bar-up",
  "actions-chevron-contract",
  "actions-chevron-double-end",
  "actions-chevron-double-start",
  "actions-chevron-down",
  "actions-chevron-end",
  "actions-chevron-expand",
  "actions-chevron-start",
  "actions-chevron-up",
  "actions-circle",
  "actions-circle-full",
  "actions-circle-half",
  "actions-clipboard",
  "actions-clipboard-close",
  "actions-clipboard-paste",
  "actions-clock",
  "actions-close",
  "actions-cloud",
  "actions-cloud-download",
  "actions-cloud-slash",
  "actions-cloud-upload",
  "actions-code",
  "actions-code-commit",
  "actions-code-compare",
  "actions-code-fork",
  "actions-code-merge",
  "actions-code-merge-localization",
  "actions-code-pull-request",
  "actions-code-pull-request-close",
  "actions-code-pull-request-draft",
  "actions-coffee",
  "actions-cog",
  "actions-cog-alt",
  "actions-comment",
  "actions-container",
  "actions-cookie",
  "actions-cookie-bite",
  "actions-copyright",
  "actions-cpu",
  "actions-credit-card",
  "actions-crop",
  "actions-cut",
  "actions-cut-release",
  "actions-database",
  "actions-database-export",
  "actions-database-import",
  "actions-database-reload",
  "actions-debug",
  "actions-delete",
  "actions-delete-edit",
  "actions-delete-restore",
  "actions-device-desktop",
  "actions-device-desktop-star",
  "actions-device-desktop-user",
  "actions-device-mobile",
  "actions-device-orientation-change",
  "actions-device-tablet",
  "actions-device-unidentified",
  "actions-dice",
  "actions-dice-1",
  "actions-dice-2",
  "actions-dice-3",
  "actions-dice-4",
  "actions-dice-5",
  "actions-dice-6",
  "actions-document",
  "actions-document-add",
  "actions-document-edit",
  "actions-document-edit-access",
  "actions-document-localize",
  "actions-document-move",
  "actions-document-readonly",
  "actions-document-select",
  "actions-document-share",
  "actions-document-synchronize",
  "actions-document-view",
  "actions-dot",
  "actions-download",
  "actions-drag",
  "actions-duplicate",
  "actions-duplicates",
  "actions-envelope",
  "actions-envelope-open",
  "actions-envelope-open-text",
  "actions-exchange",
  "actions-exclamation",
  "actions-exclamation-circle",
  "actions-exclamation-circle-alt",
  "actions-exclamation-triangle",
  "actions-exclamation-triangle-alt",
  "actions-expand",
  "actions-extension",
  "actions-extension-add",
  "actions-extension-import",
  "actions-extension-refresh",
  "actions-extension-remove",
  "actions-eye",
  "actions-eye-link",
  "actions-file",
  "actions-file-add",
  "actions-file-audio",
  "actions-file-certificate",
  "actions-file-csv",
  "actions-file-csv-download",
  "actions-file-edit",
  "actions-file-html",
  "actions-file-image",
  "actions-file-move",
  "actions-file-openoffice",
  "actions-file-pdf",
  "actions-file-search",
  "actions-file-shield",
  "actions-file-t3d",
  "actions-file-t3d-download",
  "actions-file-t3d-upload",
  "actions-file-text",
  "actions-file-video",
  "actions-file-view",
  "actions-filter",
  "actions-folder",
  "actions-folder-add",
  "actions-form-insert-after",
  "actions-form-insert-before",
  "actions-form-insert-in",
  "actions-fullscreen",
  "actions-gift",
  "actions-gift-card",
  "actions-git",
  "actions-globe",
  "actions-globe-alt",
  "actions-graduation-cap",
  "actions-hand-pointer",
  "actions-heart",
  "actions-heart-alt",
  "actions-history",
  "actions-house",
  "actions-hyphen",
  "actions-id-badge",
  "actions-image",
  "actions-infinity",
  "actions-info",
  "actions-info-circle",
  "actions-info-circle-alt",
  "actions-insert",
  "actions-key",
  "actions-lightbulb",
  "actions-lightbulb-on",
  "actions-line-columns",
  "actions-link",
  "actions-list",
  "actions-list-alternative",
  "actions-lock",
  "actions-login",
  "actions-logout",
  "actions-magnet",
  "actions-map",
  "actions-marker",
  "actions-menu",
  "actions-menu-alternative",
  "actions-menu-sidebar-collapsed",
  "actions-menu-sidebar-expanded",
  "actions-message",
  "actions-message-add",
  "actions-message-dots",
  "actions-message-localize",
  "actions-message-remove",
  "actions-microchip",
  "actions-minus",
  "actions-minus-badge",
  "actions-minus-badge-alt",
  "actions-minus-circle",
  "actions-minus-circle-alt",
  "actions-minus-square",
  "actions-minus-square-alt",
  "actions-moon",
  "actions-move",
  "actions-music",
  "actions-music-alt",
  "actions-newspaper",
  "actions-note",
  "actions-notebook",
  "actions-notebook-typoscript",
  "actions-open",
  "actions-options",
  "actions-package",
  "actions-pagetree",
  "actions-pagetree-mount",
  "actions-panel-collapse-end",
  "actions-panel-collapse-start",
  "actions-panel-expand-end",
  "actions-panel-expand-start",
  "actions-paperplane",
  "actions-paste-after",
  "actions-paste-before",
  "actions-pause",
  "actions-percent",
  "actions-percent-badge",
  "actions-phone",
  "actions-placeholder",
  "actions-placeholder-add",
  "actions-play",
  "actions-plus",
  "actions-plus-badge",
  "actions-plus-badge-alt",
  "actions-plus-circle",
  "actions-plus-circle-alt",
  "actions-plus-square",
  "actions-plus-square-alt",
  "actions-preview",
  "actions-qrcode",
  "actions-question",
  "actions-question-circle",
  "actions-question-circle-alt",
  "actions-random",
  "actions-receipt",
  "actions-redo",
  "actions-refresh",
  "actions-rename",
  "actions-replace",
  "actions-rocket",
  "actions-rss",
  "actions-save",
  "actions-save-add",
  "actions-save-close",
  "actions-save-translation",
  "actions-save-translation-clearcache",
  "actions-save-view",
  "actions-search",
  "actions-selection",
  "actions-selection-elements-all",
  "actions-selection-elements-invert",
  "actions-selection-elements-none",
  "actions-server",
  "actions-share",
  "actions-share-alt",
  "actions-shield",
  "actions-shield-star",
  "actions-shield-typo3",
  "actions-soft-hyphen",
  "actions-sort-amount",
  "actions-sort-amount-down",
  "actions-sort-amount-up",
  "actions-square",
  "actions-star",
  "actions-star-alt",
  "actions-store",
  "actions-surfboard",
  "actions-swap",
  "actions-synchronize",
  "actions-table",
  "actions-tag",
  "actions-template",
  "actions-template-new",
  "actions-terminal",
  "actions-text-indent",
  "actions-thumbtack",
  "actions-ticket",
  "actions-toggle-off",
  "actions-toggle-on",
  "actions-translate",
  "actions-triangle",
  "actions-trophy",
  "actions-undo",
  "actions-university",
  "actions-unlink",
  "actions-unlock",
  "actions-upload",
  "actions-user",
  "actions-user-emulate",
  "actions-user-switch",
  "actions-users",
  "actions-variable",
  "actions-variable-add",
  "actions-variable-remove",
  "actions-video",
  "actions-viewmode-compare",
  "actions-viewmode-layout",
  "actions-viewmode-list",
  "actions-viewmode-photos",
  "actions-viewmode-tiles",
  "actions-wallet",
  "actions-wand",
  "actions-wand-sparkles",
  "actions-wave",
  "actions-webhook",
  "actions-window",
  "actions-window-cog",
  "actions-window-open",
  "actions-window-restore",
  "actions-workspace"
];

// packages/frontend/src/components/icon.ts
var DEFAULT_SIZE = "em";
var INTRINSIC = 16;
function bundledBeside() {
  try {
    return new URL("./assets/icons/sprites/actions.svg", import.meta.url).href;
  } catch {
    return "assets/icons/sprites/actions.svg";
  }
}
var spriteUrl = bundledBeside();
var setIconSprite = (url) => {
  spriteUrl = url;
};
var SdsIcon = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      size: { type: Number, reflect: true },
      /** Only for an icon that stands without a label. SKILL.md lists the four
          that may: answered, version-bound, not bootable, a stated boundary.
          Everything else sits beside its own text and is hidden from assistive
          tech rather than read out twice. */
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.size = DEFAULT_SIZE;
  }
  render() {
    if (!ICON_IDS.includes(this.name)) {
      throw new Error(`unknown icon "${this.name}" \u2014 add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
    }
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    const cls = this.className || "sds-icon";
    const sized = this.size === "em" ? "" : ` style="width:${this.size}px;height:${this.size}px"`;
    return html`${unsafeHTML(
      `<svg width="${INTRINSIC}" height="${INTRINSIC}"${sized} class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}"><use href="${spriteUrl}#${this.name}"></use></svg>`
    )}`;
  }
};
define("sds-icon", SdsIcon);
var iconIds = ICON_IDS;

// packages/frontend/src/components/search.ts
import { html as html6, nothing as nothing2 } from "lit";

// packages/frontend/src/components/search-hits.ts
import { html as html5 } from "lit";

// packages/frontend/src/components/search-result.ts
import { html as html4, nothing } from "lit";

// packages/frontend/src/components/badge.ts
import { html as html2 } from "lit";
var SdsBadge = class _SdsBadge extends SdsElement {
  static {
    /** The glyph each result tone carries. */
    this.TONE_ICON = {
      ok: "actions-check-circle",
      warn: "actions-exclamation-triangle",
      error: "actions-exclamation-circle"
    };
  }
  static {
    this.properties = {
      label: { type: String },
      tone: { type: String, reflect: true },
      icon: { type: String }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.tone = "default";
  }
  render() {
    const glyph = this.icon ?? _SdsBadge.TONE_ICON[this.tone];
    const cls = this.tone === "default" ? "sds-badge" : `sds-badge sds-badge--${this.tone}`;
    return glyph ? html2`<span class="${cls}"><sds-icon name="${glyph}"></sds-icon>${this.label}</span>` : html2`<span class="${cls}">${this.label}</span>`;
  }
};
define("sds-badge", SdsBadge);

// packages/frontend/src/lib/art.ts
import { html as html3 } from "lit";
import { unsafeHTML as unsafeHTML2 } from "lit/directives/unsafe-html.js";
var DRAWING = /\.svg(?:[?#].*)?$/i;
var ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
var attr = (name, value) => value === void 0 || value === "" ? "" : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c])}"`;
var exported = (src) => DRAWING.test(src);
function art(src, alt, options = {}) {
  const { cls = "sds-art", width, height } = options;
  const size = attr("width", width) + attr("height", height);
  const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c]);
  return html3`${unsafeHTML2(`<img${attr("class", cls)} src="${src}" alt="${escaped}"${size}>`)}`;
}

// packages/frontend/src/components/search-result.ts
var SdsSearchResult = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      href: { type: String },
      path: { type: String },
      snippet: { type: String },
      match: { type: String },
      kind: { type: String },
      meta: { type: String },
      src: { type: String },
      alt: { type: String }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.href = "#";
    this.path = "";
    this.snippet = "";
    this.match = "";
    this.kind = "";
    this.meta = "";
    this.src = "";
    this.alt = "";
  }
  /** The text with every occurrence of the query in a `<mark>`.
  
        Split rather than replaced, so nothing is ever inserted as markup: what
        comes back is text nodes and elements, and a query containing `<` is a
        query and not a tag. */
  marked(text) {
    const needle = this.match.trim();
    if (!needle || !text) return text;
    const out = [];
    const hay = text.toLowerCase();
    const find = needle.toLowerCase();
    let at = 0;
    for (let i = hay.indexOf(find, 0); i !== -1; i = hay.indexOf(find, at)) {
      if (i > at) out.push(text.slice(at, i));
      out.push(html4`<mark class="sds-mark">${text.slice(i, i + needle.length)}</mark>`);
      at = i + needle.length;
    }
    out.push(text.slice(at));
    return out;
  }
  /* Beside the text rather than over it: a hit is read as a line, and a
     picture on top of one would make a list of them a grid of cards. Empty
     `alt` where the caller wrote none — the title names the target already,
     and a second name for it is the same page announced twice. */
  thumb() {
    if (!this.src) return nothing;
    const kind = exported(this.src) ? " sds-result__thumb--exported" : "";
    return html4`<div class="sds-result__thumb${kind}">${art(this.src, this.alt)}</div>`;
  }
  /* What kind of thing it is, where it is and what it holds for, on one line.
     The line is dropped rather than left empty: a source that reports none of
     the three is a source with no structure to report, and a blank first row
     is a hole above every title in the list. */
  above() {
    if (!this.kind && !this.path && !this.meta) return nothing;
    return html4`<span class="sds-row">
      ${this.kind ? html4`<sds-badge label="${this.kind}"></sds-badge>` : nothing}
      ${this.path ? html4`<span class="sds-result__path">${this.path}</span>` : nothing}
      ${this.meta ? html4`<span class="sds-result__meta">${this.meta}</span>` : nothing}
    </span>`;
  }
  /** The whole hit is the link, so the hit *is* an anchor — one element rather
      than a title's anchor stretched over the row by a pseudo-element, which
      is what a card does and what costs a reader the ability to select the
      text. Named by its heading: without that the link's name is everything in
      the row read out at once. Nowhere to go, no anchor. */
  render() {
    const body = html4`${this.thumb()}
  <span class="sds-result__body">
    ${this.above()}
    <h3 class="sds-result__title">${this.marked(this.heading)}</h3>
    ${this.snippet ? html4`<p class="sds-result__text">${this.marked(this.snippet)}</p>` : nothing}
  </span>`;
    return this.href ? html4`<a class="sds-result" href="${this.href}" aria-label="${this.heading}">${body}</a>` : html4`<article class="sds-result">${body}</article>`;
  }
};
define("sds-search-result", SdsSearchResult);

// packages/frontend/src/components/search-hits.ts
var SEARCHED = "Every page of this site was searched \u2014 its titles and its opening lines. What is not indexed is the body of a page, so a word used once deep in one of them will not be found.";
var SdsSearchHits = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      match: { type: String },
      empty: { type: String }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.match = "";
    this.empty = SEARCHED;
  }
  /** An answer of nothing is an answer: which pages were read, and what of
      them is not indexed — so a search that found nothing can be told from one
      that broke. */
  nothing() {
    const asked = this.match.trim();
    return html5`<div class="sds-hits__empty">
    <div class="sds-surface-title">Nothing here matches${asked ? html5` “${asked}”` : ""}</div>
    ${this.empty.trim() ? html5`<p>${this.empty}</p>` : ""}
  </div>`;
  }
  render() {
    return html5`<div class="sds-hits">
  ${this.items.length ? this.items.map(
      (hit) => html5`<sds-search-result
    heading="${hit.heading}"
    href="${hit.href ?? "#"}"
    path="${hit.path ?? ""}"
    snippet="${hit.snippet ?? ""}"
    kind="${hit.kind ?? ""}"
    meta="${hit.meta ?? ""}"
    src="${hit.src ?? ""}"
    alt="${hit.alt ?? ""}"
    match="${this.match}"
  ></sds-search-result>`
    ) : this.nothing()}
</div>`;
  }
};
define("sds-search-hits", SdsSearchHits);

// packages/frontend/src/lib/flyout.ts
var anchored = () => typeof CSS !== "undefined" && CSS.supports?.("anchor-name", "--a") === true;
function place(panel, anchor, side, gapFrom) {
  const put = () => {
    const at = anchor.getBoundingClientRect();
    const room = document.documentElement.clientWidth;
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue(gapFrom)) || 0;
    panel.style.positionArea = "none";
    panel.style.insetBlockStart = `${at.bottom + gap}px`;
    panel.style.insetInlineEnd = "auto";
    panel.style.insetInlineStart = "0px";
    const wide = panel.getBoundingClientRect().width;
    const asked = side === "end" ? at.right - wide : at.left;
    const other = side === "end" ? at.left : at.right - wide;
    const fits = (x) => x >= 0 && x + wide <= room;
    panel.style.insetInlineStart = `${!fits(asked) && fits(other) ? other : asked}px`;
  };
  const stop = new AbortController();
  const { signal } = stop;
  put();
  addEventListener("scroll", put, { capture: true, passive: true, signal });
  addEventListener("resize", put, { passive: true, signal });
  return () => stop.abort();
}

// packages/frontend/src/lib/field-box.ts
function fieldBox({ focused, invalid, filled, disabled, readonly, error, size = "md" }) {
  const cls = ["sds-field"];
  if (size === "sm") cls.push("sds-field--sm");
  else if (size === "lg") cls.push("sds-field--lg");
  if (focused) cls.push("is-focused");
  if (invalid || error) cls.push("is-invalid");
  if (filled) cls.push("is-filled");
  if (disabled) cls.push("is-disabled");
  if (readonly) cls.push("is-readonly");
  return cls.join(" ");
}

// packages/frontend/src/components/search.ts
var seq = 0;
var SdsSearch = class extends SdsElement {
  constructor() {
    super();
    this.panelId = `sds-search-${++seq}`;
    /** The anchor this drop is placed against, named per instance: one name
        shared by every field on a page resolves to whichever the browser met
        last, and a bar can hold a second search in its drawer. */
    this.anchor = `--${this.panelId}`;
    /* A press anywhere else closes it, which is the popover's own light dismiss
       rather than a listener here. Not `blur` either way: a press on a result
       blurs the field before the link is followed, so closing there is a race
       the panel wins about as often as the reader does. */
    this.onToggle = (event) => {
      const open = event.newState === "open";
      if (!open) this.open = false;
      this.following?.();
      this.following = void 0;
      const drop = this.querySelector(".sds-search__panel");
      const field = this.querySelector(".sds-field");
      if (open && !anchored() && drop && field) {
        this.following = place(drop, field, "end", "--sds-search-panel-gap");
      }
    };
    this.index = "";
    this.label = "Search";
    this.size = "md";
    this.query = "";
    this.entries = null;
    this.open = false;
  }
  static {
    this.properties = {
      /** Where the index is. Relative to the page, like every other asset. */
      index: { type: String },
      label: { type: String },
      size: { type: String, reflect: true },
      query: { type: String, state: true },
      entries: { type: Array, state: true },
      open: { type: Boolean, state: true }
    };
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  /* The drop is drawn only while there is something in it, so it is shown the
     moment it exists rather than by an attribute a template could carry. */
  updated() {
    const drop = this.querySelector(".sds-search__panel");
    if (drop && !drop.matches(":popover-open")) drop.showPopover();
  }
  /* Fetched once, on the first keystroke. */
  async load() {
    if (this.entries || !this.index) return;
    try {
      const res = await fetch(this.index);
      this.entries = await res.json();
    } catch {
      this.entries = [];
    }
  }
  /** Where the site's root is, from this page. The index lists every page as
      the build sees them, and a reader is rarely standing in the root — so a
      path out of it is resolved against the index's own address, which *is*
      the root. Left to the browser, a hit one directory down names a page that
      does not exist — and a picture beside it a file that is not there. */
  from(path) {
    return new URL(path, new URL(".", new URL(this.index, location.href))).href;
  }
  get hits() {
    const q = this.query.trim().toLowerCase();
    if (!q || !this.entries) return [];
    return this.entries.filter((e) => `${e.title} ${e.text}`.toLowerCase().includes(q)).slice(0, 8);
  }
  async type(event) {
    this.query = event.target.value;
    this.open = this.query.trim().length > 0;
    await this.load();
  }
  /** The links in the drop, in the order they are read.
  
        Asked of the markup rather than kept as a list, because what is in the
        panel is drawn by `sds-search-result` and the class is the contract between
        them — the same contract the stylesheet works through. */
  links() {
    return [...this.querySelectorAll(".sds-search__panel a")];
  }
  /** In the field: down goes into the list, Escape gives the page back.
  
        Focus moves for real rather than a row being marked as though it had —
        these are links, and a reader who has arrowed to one should be able to
        open it in a new tab like any other. */
  onFieldKey(event) {
    if (event.key === "Escape") {
      this.open = false;
      return;
    }
    if (event.key !== "ArrowDown" || !this.open) return;
    event.preventDefault();
    this.links()[0]?.focus();
  }
  /** In the drop: the arrows walk it, and up from the first goes back to what
      was typed. Escape closes from anywhere in it, which is where a reader who
      changed their mind is standing. */
  onPanelKey(event) {
    const field = this.querySelector(".sds-input");
    if (event.key === "Escape") {
      this.open = false;
      field?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = this.links();
    const here = links.indexOf(document.activeElement);
    const next = here + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0) field?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  }
  /** Left entirely — a press elsewhere, or a tab out of the last hit. */
  onLeave(event) {
    const to = event.relatedTarget;
    if (to && this.contains(to)) return;
    this.open = false;
  }
  /* The field says it is a combobox, because that is the only way it may say
     the rest: `aria-expanded` and `aria-controls` are not attributes a plain
     text input carries, and axe reports the pair without the role as a serious
     violation. It is also what this is — a box you type in that offers a list
     underneath. */
  render() {
    const hits = this.hits;
    const open = this.open && this.query.trim().length > 0;
    return html6`<div class="sds-search" @focusout="${(e) => this.onLeave(e)}">
  <span class="${fieldBox({ size: this.size })}" style="anchor-name: ${this.anchor}">
    <sds-icon name="actions-search" size="16"></sds-icon>
    <input
      class="sds-input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      autocomplete="off"
      spellcheck="false"
      .value="${this.query}"
      placeholder="${this.label}"
      aria-label="${this.label}"
      aria-controls="${this.panelId}"
      aria-expanded="${open ? "true" : "false"}"
      @input="${(e) => void this.type(e)}"
      @keydown="${(e) => this.onFieldKey(e)}"
      @focus="${() => {
      this.open = this.query.trim().length > 0;
    }}"
    />
  </span>
  ${open ? this.panel(hits) : nothing2}
</div>`;
  }
  /** What the index has, as what a result is drawn from. The only place the
        two vocabularies meet: a page has a title and a URL, a hit has a heading
        and an href, and nothing below here knows about an index.
  
        The whole sentence the index kept: how much of it a reader is shown is
        the drop's question and not this one's, and the class layer answers it —
        a hit under a field gives two lines of it, a page of results the lot. */
  hitOf(entry) {
    return {
      heading: entry.title,
      href: this.from(entry.url),
      path: entry.url,
      snippet: entry.text,
      src: entry.image ? this.from(entry.image) : ""
    };
  }
  /** The drop, and what is in it. The box is this element's — where it hangs
        and how far it may grow are questions about the field it belongs to —
        and `sds-search-hits` draws the answer inside it, hits or none.
  
        The query is handed over rather than the marking done here, because what
        is highlighted has to be what was actually searched. */
  panel(hits) {
    return html6`<div
  class="sds-search__panel"
  id="${this.panelId}"
  popover
  style="position-anchor: ${this.anchor}"
  aria-label="${this.label}"
  @toggle="${this.onToggle}"
  @keydown="${(e) => this.onPanelKey(e)}"
>
  <sds-search-hits
    .items="${hits.map((hit) => this.hitOf(hit))}"
    match="${this.query}"
  ></sds-search-hits>
</div>`;
  }
};
define("sds-search", SdsSearch);

// packages/frontend/src/components/theme.ts
import { html as html7, nothing as nothing3 } from "lit";
var GLYPH = {
  light: "actions-brightness-high",
  dark: "actions-moon"
};
var themeBoot = (key = "soul-theme") => `var t=localStorage.getItem(${JSON.stringify(key)});if(t){document.documentElement.dataset.theme=t}`;
function paintFrames(mode) {
  for (const frame of document.querySelectorAll("iframe")) {
    try {
      const inner = frame.contentDocument?.documentElement;
      if (!inner) continue;
      if (mode) inner.dataset["theme"] = mode;
      else delete inner.dataset["theme"];
    } catch {
    }
  }
}
var SdsTheme = class extends SdsElement {
  static {
    this.properties = {
      key: { type: String },
      compact: { type: Boolean, reflect: true },
      current: { type: String, state: true }
    };
  }
  constructor() {
    super();
    this.key = "soul-theme";
    this.compact = false;
    this.current = null;
  }
  /* Watching the attribute, not owning it: `soul-boot.js` writes it before
     the paint and again when the machine's setting changes, and a second tab
     changes it too. Read once on connect and the switch would show the side
     the reader is not looking at. */
  #watch = null;
  connectedCallback() {
    super.connectedCallback();
    if (typeof document === "undefined") return;
    this.#read();
    this.#watch = new MutationObserver(() => this.#read());
    this.#watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("load", this.#frames, true);
  }
  disconnectedCallback() {
    document.removeEventListener("load", this.#frames, true);
    this.#watch?.disconnect();
    this.#watch = null;
    super.disconnectedCallback();
  }
  /* What the document already says. Reading the element's own idea of it
     would disagree with the paint. */
  #read() {
    const written = document.documentElement.dataset["theme"];
    this.current = written === "light" || written === "dark" ? written : null;
    paintFrames(this.current);
  }
  /* A frame that loads after the mode was set has to be told. Captured at the
     document, because `load` on an iframe does not bubble. */
  #frames = () => paintFrames(this.current);
  choose(theme) {
    const next = this.current === theme ? null : theme;
    this.current = next;
    if (next) {
      document.documentElement.dataset["theme"] = next;
      localStorage.setItem(this.key, next);
    } else {
      delete document.documentElement.dataset["theme"];
      localStorage.removeItem(this.key);
    }
    this.dispatchEvent(
      new CustomEvent("sds-theme-change", {
        detail: { theme: next },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const segment = (theme) => html7`<button
      type="button"
      class="sds-mode${this.current === theme ? " is-active" : ""}"
      aria-pressed="${this.current === theme}"
      aria-label="${this.compact ? theme : nothing3}"
      @click="${() => this.choose(theme)}"
    ><sds-icon name="${GLYPH[theme]}"></sds-icon>${this.compact ? "" : html7`<span class="sds-mode__label">${theme}</span>`}</button>`;
    return html7`<div class="sds-modes" role="group" aria-label="Colour mode">
  ${segment("light")}
  ${segment("dark")}
</div>`;
  }
};
define("sds-theme", SdsTheme);

// packages/frontend/src/components/button.ts
import { html as html8 } from "lit";
function buttonClass({ variant = "primary", size = "md", iconOnly = false, disabled = false }) {
  const cls = ["sds-btn", `sds-btn--${variant}`];
  if (size === "sm" || size === "lg") cls.push(`sds-btn--${size}`);
  if (iconOnly) cls.push("sds-btn--icon");
  if (disabled) cls.push("is-disabled");
  return cls.join(" ");
}
var LABEL = "sds-btn__label";
var buttonLabel = (body) => html8`<span class="${LABEL}">${body}</span>`;
function linkMarkup(props, body) {
  const cls = buttonClass({ ...props, disabled: false });
  const href = props.href ?? "";
  if (props.rel) {
    return props.title ? html8`<a class="${cls}" href="${href}" rel="${props.rel}" title="${props.title}">${body}</a>` : html8`<a class="${cls}" href="${href}" rel="${props.rel}">${body}</a>`;
  }
  return props.title ? html8`<a class="${cls}" href="${href}" title="${props.title}">${body}</a>` : html8`<a class="${cls}" href="${href}">${body}</a>`;
}
function buttonMarkup(props, body) {
  const inner = typeof body === "string" && body ? buttonLabel(body) : body;
  if (props.href) return linkMarkup(props, inner);
  const cls = buttonClass(props);
  const type = props.type ?? "button";
  if (props.title) {
    return props.disabled ? html8`<button class="${cls}" type="${type}" title="${props.title}" disabled>${inner}</button>` : html8`<button class="${cls}" type="${type}" title="${props.title}">${inner}</button>`;
  }
  return props.disabled ? html8`<button class="${cls}" type="${type}" disabled>${inner}</button>` : html8`<button class="${cls}" type="${type}">${inner}</button>`;
}
var isGlyph = (node) => {
  const el = node;
  return el.tagName?.toLowerCase() === "sds-icon" || (el.classList?.contains("sds-icon") ?? false);
};
function labelled(nodes) {
  const out = [];
  let run = [];
  const close = () => {
    if (run.some((node) => !isBlank(node))) out.push(buttonLabel(run));
    run = [];
  };
  for (const node of nodes) {
    if (isGlyph(node) || node.classList?.contains(LABEL)) {
      close();
      out.push(node);
    } else run.push(node);
  }
  close();
  return out;
}
var SdsButton = class extends SdsElement {
  constructor() {
    super();
    /* The label, taken before Lit renders over it — the element renders light
       DOM, so `render()` would otherwise replace exactly what it is for. */
    this.taken = [];
    /* The press, sent to whatever the button names. An id and an event, so
       neither end holds the other and a page wires the two in markup. Dispatched
       **on the target**, the way the platform's own invokers do it, so what
       answers listens to itself — and it bubbles, so a page that wants every
       command still hears them. Without `for` the button keeps its own click. */
    this.onPress = () => {
      if (!this.for || this.disabled) return;
      const target = document.getElementById(this.for);
      if (!target) return;
      target.dispatchEvent(
        new CustomEvent("sds-command", {
          detail: { command: this.command || "show", source: this },
          bubbles: true,
          composed: true
        })
      );
    };
    this.variant = "primary";
    this.size = "md";
    this.disabled = false;
    this.type = "button";
    this.href = "";
    this.rel = "";
    this.for = "";
    this.command = "show";
    this.iconOnly = false;
  }
  static {
    this.properties = {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      title: { type: String },
      disabled: { type: Boolean, reflect: true },
      type: { type: String, reflect: true },
      href: { type: String },
      rel: { type: String },
      for: { type: String, reflect: true },
      command: { type: String, reflect: true },
      iconOnly: { type: Boolean, attribute: "icon-only", reflect: true }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.addEventListener("click", this.onPress);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.onPress);
    super.disconnectedCallback();
  }
  render() {
    const iconOnly = this.iconOnly || this.taken.every(
      (node) => node.nodeType === 8 || (node.textContent ?? "").trim() === ""
    ) && this.taken.some((node) => node.tagName?.toLowerCase() === "sds-icon");
    return buttonMarkup(
      {
        variant: this.variant,
        size: this.size,
        iconOnly,
        title: this.title,
        disabled: this.disabled,
        type: this.type,
        href: this.href,
        rel: this.rel
      },
      this.taken.length ? labelled(this.taken) : this.content ?? this.taken
    );
  }
};
define("sds-button", SdsButton);

// packages/frontend/src/components/dropdown.ts
import { html as html9, nothing as nothing4 } from "lit";

// packages/frontend/src/lib/template.ts
function lines(parts, indent = 0) {
  const gap = `
${" ".repeat(indent)}`;
  const out = [];
  parts.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}

// packages/frontend/src/components/dropdown.ts
var seq2 = 0;
var SdsDropdown = class extends SdsElement {
  constructor() {
    super();
    this.panelId = `sds-dropdown-panel-${++seq2}`;
    /** The anchor this panel is placed against, named per instance. One name
        shared by every dropdown on a page resolves to whichever one the browser
        met last, so each states its own and reads only that. */
    this.anchor = `--${this.panelId}`;
    /** What the browser did, read back rather than assumed. Light dismiss and
        Escape are the platform's here, so a press outside or a key this element
        never saw still arrives as a state change — and `aria-expanded`, the
        marker and the placement all follow this one event. */
    this.onToggle = (event) => {
      this.open = event.newState === "open";
      this.following?.();
      this.following = void 0;
      if (this.open && !anchored() && this.panel && this.button) {
        this.following = place(this.panel, this.button, this.align, "--sds-dropdown-panel-gap");
      }
    };
    this.label = "";
    this.name = "";
    this.choices = [];
    this.align = "start";
    this.variant = "secondary";
    this.size = "md";
    this.iconOnly = false;
    this.open = false;
  }
  static {
    this.properties = {
      label: { type: String },
      name: { type: String },
      choices: { type: Array },
      align: { type: String, reflect: true },
      variant: { type: String },
      size: { type: String },
      iconOnly: { type: Boolean, attribute: "icon-only" },
      icon: { type: String },
      open: { type: Boolean, state: true }
    };
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  get panel() {
    return this.querySelector(".sds-dropdown__panel");
  }
  get button() {
    return this.querySelector(".sds-dropdown__button");
  }
  /** The whole name, with the label still in it. Dropping the visible word
      would leave a control nobody can ask for by the name they can see. */
  get called() {
    return this.name && this.label ? `${this.name}: ${this.label}` : this.name || this.label;
  }
  /** Pages or commands. Asked of the entries rather than declared, because a
      caller who has to say which one it is can say the wrong one. */
  get commands() {
    return this.choices.length > 0 && this.choices.every((choice) => !choice.href);
  }
  /** The rows a key can move between: what is drawn and not disabled. */
  rows() {
    return [...this.querySelectorAll('.sds-dropdown__item:not([aria-disabled="true"])')];
  }
  onKey(event) {
    if (event.key === "Escape") {
      if (this.open) event.stopPropagation();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const rows = this.rows();
    if (!rows.length) return;
    event.preventDefault();
    if (!this.open) {
      this.panel?.showPopover();
      const first = event.key === "ArrowUp" || event.key === "End";
      void this.updateComplete.then(() => {
        const now = this.rows();
        (first ? now[now.length - 1] : now[0])?.focus();
      });
      return;
    }
    const from = event.target;
    const at = from ? rows.indexOf(from) : -1;
    const to = event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (
      /* Stops at the ends rather than wrapping: a list that starts over at
         the bottom hides how long it was from whoever cannot see it. */
      Math.min(rows.length - 1, Math.max(0, at + (event.key === "ArrowDown" ? 1 : -1)))
    );
    rows[to]?.focus();
  }
  /** What a press reports, and what it does not do. An entry with a target is
      a link and stays one — the event is said beside the navigation rather than
      instead of it, so a page that never listens still works. Preventing the
      event is how an app takes the navigation over. */
  choose(choice, index, event) {
    if (choice.disabled) {
      event.preventDefault();
      return;
    }
    const told = this.dispatchEvent(
      new CustomEvent("sds-dropdown-choose", {
        detail: { choice, index },
        bubbles: true,
        composed: true,
        cancelable: true
      })
    );
    if (!told) event.preventDefault();
    this.panel?.hidePopover();
  }
  entry(choice, index) {
    const inside = choice.icon ? html9`<sds-icon name="${choice.icon}"></sds-icon>${choice.label}` : html9`${choice.label}`;
    const shared = {
      class: choice.current ? "sds-dropdown__item is-active" : "sds-dropdown__item",
      lang: choice.lang
    };
    if (this.commands) {
      return html9`<button
        type="button"
        role="menuitem"
        class="${shared.class}"
        lang="${shared.lang ?? nothing4}"
        aria-disabled="${choice.disabled ? "true" : nothing4}"
        @click="${(event) => this.choose(choice, index, event)}"
      >${inside}</button>`;
    }
    return html9`<a
      class="${shared.class}"
      href="${choice.href ?? "#"}"
      lang="${shared.lang ?? nothing4}"
      hreflang="${shared.lang ?? nothing4}"
      target="${choice.external ? "_blank" : nothing4}"
      rel="${choice.external ? "noreferrer" : nothing4}"
      aria-current="${choice.current ? "true" : nothing4}"
      aria-disabled="${choice.disabled ? "true" : nothing4}"
      @click="${(event) => this.choose(choice, index, event)}"
    >${inside}</a>`;
  }
  render() {
    const commands = this.commands;
    const cls = `${buttonClass({ variant: this.variant, size: this.size, iconOnly: this.iconOnly })} sds-dropdown__button`;
    const inside = this.iconOnly ? html9`${this.icon ? html9`<sds-icon name="${this.icon}"></sds-icon>` : ""}` : html9`${this.icon ? html9`<sds-icon name="${this.icon}"></sds-icon>` : ""}${buttonLabel(this.label)}<span
        class="sds-dropdown__marker"
      ><sds-icon name="actions-chevron-down"></sds-icon></span>`;
    return html9`<div class="sds-dropdown" @keydown="${(e) => this.onKey(e)}">
  <button
    type="button"
    class="${cls}"
    style="anchor-name: ${this.anchor}"
    title="${this.iconOnly ? this.called : nothing4}"
    aria-label="${this.name && !this.iconOnly ? this.called : nothing4}"
    aria-haspopup="${commands ? "menu" : nothing4}"
    aria-expanded="${this.open ? "true" : "false"}"
    aria-controls="${this.panelId}"
    popovertarget="${this.panelId}"
  >${inside}</button>
  <div
    class="sds-dropdown__panel"
    id="${this.panelId}"
    popover
    style="position-anchor: ${this.anchor}"
    role="${commands ? "menu" : nothing4}"
    aria-label="${commands ? this.called : nothing4}"
    @toggle="${this.onToggle}"
  >
    ${lines(this.choices.map((choice, at) => this.entry(choice, at)), 4)}
  </div>
</div>`;
  }
};
define("sds-dropdown", SdsDropdown);

// packages/frontend/src/components/eyebrow.ts
import { html as html10 } from "lit";
var SdsEyebrow = class extends SdsElement {
  static {
    this.properties = {
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.label = "";
  }
  render() {
    return html10`<div class="sds-eyebrow">${this.label}</div>`;
  }
};
define("sds-eyebrow", SdsEyebrow);

// packages/frontend/src/components/link.ts
import { html as html11 } from "lit";
var SdsLink = class _SdsLink extends SdsElement {
  static {
    this.properties = {
      label: { type: String },
      href: { type: String, reflect: true },
      external: { type: Boolean, reflect: true },
      icon: { type: String },
      bare: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.href = "#";
    this.external = false;
    this.bare = false;
  }
  /** Whether a glyph is about direction rather than about the thing. A glyph
      leads its label and a direction glyph follows it, which is a property of
      the glyph — so the component decides. A boolean here would be a caller's
      chance to put an arrow in front of a word. */
  static leads(icon) {
    return !/^actions-(arrow|chevron|caret)-/.test(icon);
  }
  render() {
    if (this.bare && this.icon) {
      const mark = html11`<sds-icon name="${this.icon}" size="24"></sds-icon>`;
      return this.external ? html11`<a class="sds-link sds-link--bare" href="${this.href}" target="_blank" rel="noreferrer" aria-label="${this.label}" title="${this.label}">${mark}</a>` : html11`<a class="sds-link sds-link--bare" href="${this.href}" aria-label="${this.label}" title="${this.label}">${mark}</a>`;
    }
    const glyph = this.icon ? html11`<sds-icon name="${this.icon}"></sds-icon>` : "";
    const lead = this.icon && _SdsLink.leads(this.icon) ? glyph : "";
    const trail = this.icon && !_SdsLink.leads(this.icon) ? glyph : "";
    return this.external ? html11`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${lead}${this.label} ${trail}<sds-icon name="actions-window-open"></sds-icon></a>` : html11`<a class="sds-link" href="${this.href}">${lead}${this.label}${trail ? html11` ${trail}` : ""}</a>`;
  }
};
define("sds-link", SdsLink);

// packages/frontend/src/components/nav-breadcrumb.ts
import { html as html12 } from "lit";
var SdsNavBreadcrumb = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.label = "Breadcrumb";
  }
  render() {
    return html12`<nav class="sds-crumbs" aria-label="${this.label}">
  ${this.items.map((crumb, i) => {
      const here = i === this.items.length - 1;
      const step = here ? html12`<span class="sds-crumbs__here" aria-current="page">${crumb.label}</span>` : html12`<a href="${crumb.href ?? "#"}">${crumb.label}</a>`;
      return html12`${i > 0 ? html12`<span class="sds-crumbs__sep" aria-hidden="true">/</span>` : ""}${step}`;
    })}
</nav>`;
  }
};
define("sds-nav-breadcrumb", SdsNavBreadcrumb);

// packages/frontend/src/components/field.ts
import { html as html15, nothing as nothing6 } from "lit";

// packages/frontend/src/components/field-error.ts
import { html as html13 } from "lit";
var SdsFieldError = class extends SdsElement {
  static {
    this.properties = { message: { type: String } };
  }
  constructor() {
    super();
    this.message = "";
  }
  render() {
    return html13`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
};
define("sds-field-error", SdsFieldError);

// packages/frontend/src/lib/field-row.ts
import { html as html14, nothing as nothing5 } from "lit";
function fieldRow(row, control) {
  if (!row.caption) return control;
  const id = row.fieldId || void 0;
  return html14`<div class="sds-field-row">
  <label class="sds-field-label" for="${id ?? nothing5}">${row.caption}${row.required ? html14` <span class="sds-field-req">required</span>` : nothing5}</label>
  ${control}
  ${row.hint ? html14`<span class="sds-field-hint">${row.hint}</span>` : nothing5}
  ${row.error ? html14`<sds-field-error message="${row.error}"></sds-field-error>` : nothing5}
</div>`;
}

// packages/frontend/src/lib/form-element.ts
var SdsFormElement = class extends SdsElement {
  constructor() {
    super();
    /** Whether an ancestor `<fieldset disabled>` has turned this off. The
        element's own `disabled` is a property it renders; this is the other half,
        which nothing but the platform can tell it. */
    this.inheritedDisabled = false;
    if (typeof this.attachInternals === "function") this.internals = this.attachInternals();
  }
  static {
    /** What puts the element in `form.elements`, sends it the form's lifecycle
        callbacks and lets it hold a validity of its own. */
    this.formAssociated = true;
  }
  /** The form this control answers to, wherever it stands — including one it
      only reaches through the `form` attribute. */
  get form() {
    return this.internals?.form ?? null;
  }
  /** The `<label>`s pointing at it, so a caller can move focus the way a
      platform control lets one. */
  get labels() {
    return this.internals?.labels;
  }
  get validity() {
    return this.internals?.validity;
  }
  get validationMessage() {
    return this.internals?.validationMessage ?? "";
  }
  get willValidate() {
    return this.internals?.willValidate ?? false;
  }
  checkValidity() {
    return this.internals?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.internals?.reportValidity() ?? true;
  }
  formDisabledCallback(disabled) {
    this.inheritedDisabled = disabled;
    this.requestUpdate();
  }
  /** What the markup said, put back. The browser resets the real control inside
      at the same time and to the same value — this is the element's own copy of
      the state agreeing with it. */
  formResetCallback() {
    this.restore();
  }
  restore() {
  }
  /** A message the browser refuses to submit past, reported on the real
        control inside — so the bubble points at the box and not at the element
        around it. An empty message clears it.
  
        Called after a render and never during one: there is no element to anchor
        to before the first, and in Node there is no `querySelector` at all. */
  setValidity(message, selector = "input, select, textarea", flag = "customError") {
    if (!this.internals) return;
    if (!message) {
      this.internals.setValidity({});
      return;
    }
    const anchor = this.querySelector(selector);
    this.internals.setValidity({ [flag]: true }, message, anchor ?? void 0);
  }
};

// packages/frontend/src/components/field.ts
var SdsField = class extends SdsFormElement {
  static {
    this.properties = {
      size: { type: String, reflect: true },
      value: { type: String },
      icon: { type: String },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
      label: { type: String },
      minWidth: { type: Number, attribute: "min-width" },
      caption: { type: String },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" },
      name: { type: String },
      type: { type: String },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      prefix: { type: String },
      suffix: { type: String },
      autocomplete: { type: String },
      inputmode: { type: String },
      min: { type: String },
      max: { type: String },
      step: { type: String },
      maxlength: { type: Number },
      pattern: { type: String }
    };
  }
  constructor() {
    super();
    this.size = "md";
    this.value = "";
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.minWidth = 220;
    this.caption = "";
    this.hint = "";
    this.error = "";
    this.required = false;
    this.fieldId = "";
    this.name = "";
    this.type = "text";
    this.disabled = false;
    this.readonly = false;
    this.prefix = "";
    this.suffix = "";
    this.autocomplete = "";
    this.inputmode = "";
    this.min = "";
    this.max = "";
    this.step = "";
    this.maxlength = 0;
    this.pattern = "";
  }
  /* The value the markup came with, which is what a reset puts back. Read once,
     before anything is typed. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  /* What the caller said is wrong is what the browser refuses to submit past,
     reported on the box itself. Set from the render rather than from a setter,
     so a page that arrives with the sentence already in it arrives blocked. */
  updated() {
    this.setValidity(this.error, "input");
  }
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  /* Typing is what makes a value the user's. `is-filled` used to be a state
     a caller set and then had to unset, which nothing typing into the field
     could ever do. */
  onInput(event) {
    const control = event.target;
    this.value = control.value;
    this.filled = control.value !== "";
    this.error = "";
    this.dispatchEvent(new CustomEvent("sds-input", { detail: control.value, bubbles: true, composed: true }));
  }
  render() {
    return fieldRow(this, this.control());
  }
  control() {
    const cls = fieldBox(this);
    const box = `width:${this.minWidth}px; max-width:100%`;
    const id = this.fieldId || nothing6;
    const name = this.name || nothing6;
    const invalid = this.invalid || this.error ? "true" : nothing6;
    const disabled = this.disabled || this.inheritedDisabled;
    const caret = this.focused ? html15`<span style="width:2px; height:15px; background:var(--accent);"></span>` : nothing6;
    const affix = (text) => text ? html15`<span class="sds-field__affix">${text}</span>` : nothing6;
    return html15`<span class="${cls}" style="${box}">${this.icon ? html15`<sds-icon name="${this.icon}"></sds-icon>` : nothing6}${affix(this.prefix)}<input
    class="sds-input"
    type="${this.type}"
    id="${id}"
    name="${name}"
    value="${this.filled ? this.value : nothing6}"
    placeholder="${this.filled ? nothing6 : this.value}"
    aria-label="${this.label ?? nothing6}"
    aria-invalid="${invalid}"
    autocomplete="${this.autocomplete || nothing6}"
    inputmode="${this.inputmode || nothing6}"
    min="${this.min || nothing6}"
    max="${this.max || nothing6}"
    step="${this.step || nothing6}"
    maxlength="${this.maxlength || nothing6}"
    pattern="${this.pattern || nothing6}"
    ?required="${this.required}"
    ?disabled="${disabled}"
    ?readonly="${this.readonly}"
    @input="${this.onInput}"
  >${affix(this.suffix)}${caret}</span>`;
  }
};
define("sds-field", SdsField);

// packages/frontend/src/components/select.ts
import { html as html16, nothing as nothing7 } from "lit";
var seq3 = 0;
var SdsSelect = class extends SdsFormElement {
  constructor() {
    super();
    this.listId = `sds-select-list-${++seq3}`;
    /** The anchor the list is placed against, named per instance. One name shared
        by every select on a page resolves to whichever the browser met last. */
    this.anchor = `--${this.listId}`;
    /** What the browser did, read back rather than assumed. Light dismiss and
        Escape are the platform's, so a press outside or a key this element never
        saw still arrives as a state change — and so does a press on the button,
        which opens the popover through `popovertarget` and never comes past
        `show`. */
    this.onToggle = (event) => {
      this.shown = event.newState === "open";
      this.following?.();
      this.following = void 0;
      if (!this.shown) {
        this.active = -1;
        return;
      }
      if (this.active < 0) this.aim();
      if (!anchored() && this.list && this.button) {
        this.following = place(this.list, this.button, "start", "--sds-select-list-gap");
      }
    };
    /** What has been typed at the list in the last second, and what it matched.
        Type-ahead is how a reader who knows the answer gets to it, and the only
        way a long list is usable at all from the keyboard. */
    this.#typed = "";
    this.#typedAt = 0;
    this.caption = "";
    this.name = "";
    this.fieldId = "";
    this.value = "";
    this.options = [];
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.size = "md";
    this.minWidth = 220;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
    this.open = false;
    this.shown = false;
    this.active = -1;
  }
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      fieldId: { type: String, attribute: "field-id" },
      value: { type: String },
      options: { type: Array },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      size: { type: String, reflect: true },
      minWidth: { type: Number, attribute: "min-width" },
      filled: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      open: { type: Boolean, reflect: true },
      /** Whether the popover is showing — read back from the browser, which owns
          that. Kept apart from `open`, which is a still picture's state and takes
          the popover away: one property doing both would re-add the attribute the
          moment the list opened, and close it again. */
      shown: { type: Boolean, state: true },
      /** Which entry the keys are on while the list is open. Not the chosen one:
          a reader walking the list has moved nothing until they say so. */
      active: { type: Number, state: true }
    };
  }
  /* The answer the markup came with, which is what a reset puts back. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  /** The list as entries, each with where it sits: one flat run, because the
      keys walk the answers and never the headings. */
  get entries() {
    return this.options.map((entry) => typeof entry === "string" ? { label: entry } : entry);
  }
  /** Which entries a key may land on. A disabled one is read out and stepped
      over, the way the platform steps over one. */
  get reachable() {
    return this.entries.flatMap((option, at) => option.disabled ? [] : [at]);
  }
  /** What an entry sends. Not `valueOf`, which every object already has. */
  sends(option) {
    return option.value ?? option.label;
  }
  /** What the closed box says. The chosen entry's *label*, which is not always
      its value — and the prompt while nothing is chosen. */
  get says() {
    if (!this.filled) return this.value;
    const chosen = this.entries.find((option) => this.sends(option) === this.value);
    return chosen?.label ?? this.value;
  }
  /** Whether the list is in front of the reader, however it got there: opened
      by them, or drawn open by a card that can press nothing. */
  get listed() {
    return this.open || this.shown;
  }
  get list() {
    return this.querySelector(".sds-select__list");
  }
  get button() {
    return this.querySelector(".sds-select__button");
  }
  updated() {
    const control = this.querySelector("select");
    if (control) {
      if (this.filled) control.value = this.value;
      control.tabIndex = -1;
      control.setAttribute("aria-hidden", "true");
      control.required = false;
    }
    const missing = this.required && !this.filled;
    if (this.error) this.setValidity(this.error, ".sds-select__button");
    else if (missing) this.setValidity("Choose one of the answers on the list", ".sds-select__button", "valueMissing");
    else this.setValidity("");
    if (this.listed && this.active >= 0) {
      this.querySelector(`#${this.listId}-${this.active}`)?.scrollIntoView({ block: "nearest" });
    }
  }
  /** Where the keys start: on whatever is chosen, or on the first answer there
      is. A list that opens at the top every time makes a reader find their own
      answer again before they can move off it. */
  aim() {
    const at = this.entries.findIndex((option) => this.sends(option) === this.value);
    this.active = at >= 0 && !this.entries[at]?.disabled ? at : this.reachable[0] ?? -1;
  }
  /* Open and close move this element's own state first and the popover second.
     `toggle` is queued rather than fired where it is caused, so a key pressed
     straight after another one would arrive while this still believed the list
     was shut — and be read as a second press to open it. */
  show() {
    if (this.disabled || this.inheritedDisabled || this.shown) return;
    this.shown = true;
    this.aim();
    this.list?.showPopover();
  }
  hide() {
    this.shown = false;
    this.active = -1;
    this.list?.hidePopover();
  }
  /** Move the keys `step` entries along, stopping at the ends. A list that
      starts over at the bottom hides how long it was from whoever cannot see
      it. */
  step(step) {
    const rows = this.reachable;
    if (!rows.length) return;
    const at = rows.indexOf(this.active);
    const to = at < 0 ? step > 0 ? 0 : rows.length - 1 : Math.min(rows.length - 1, Math.max(0, at + step));
    this.active = rows[to];
  }
  #typed;
  #typedAt;
  typeahead(key, now) {
    if (key.length !== 1 || key === " ") return false;
    this.#typed = now - this.#typedAt > 1e3 ? key : this.#typed + key;
    this.#typedAt = now;
    const wanted = this.#typed.toLowerCase();
    const rows = this.reachable;
    const from = rows.indexOf(this.active) + 1;
    const order = [...rows.slice(from), ...rows.slice(0, from)];
    const hit = order.find((at) => this.entries[at].label.toLowerCase().startsWith(wanted));
    if (hit === void 0) return false;
    this.active = hit;
    if (!this.shown) this.choose(hit);
    return true;
  }
  onKey(event) {
    if (this.disabled || this.inheritedDisabled) return;
    const now = event.timeStamp;
    if (event.key === "Escape") {
      if (this.shown) event.stopPropagation();
      return;
    }
    if (!this.shown) {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        this.show();
        if (event.key === "Home") this.active = this.reachable[0] ?? -1;
        else if (event.key === "End") this.active = this.reachable.at(-1) ?? -1;
        return;
      }
      if (this.typeahead(event.key, now)) event.preventDefault();
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.step(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        this.step(-1);
        return;
      case "Home":
        event.preventDefault();
        this.active = this.reachable[0] ?? -1;
        return;
      case "End":
        event.preventDefault();
        this.active = this.reachable.at(-1) ?? -1;
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        this.commit();
        return;
      case "Tab":
        this.commit();
        return;
      default:
        if (this.typeahead(event.key, now)) event.preventDefault();
    }
  }
  /** Take whatever the keys are on, and close. */
  commit() {
    if (this.active >= 0) this.choose(this.active);
    this.hide();
  }
  choose(at) {
    const option = this.entries[at];
    if (!option || option.disabled) return;
    this.value = this.sends(option);
    this.filled = true;
    this.active = at;
    this.error = "";
    const control = this.querySelector("select");
    if (control) control.value = this.value;
    this.dispatchEvent(new CustomEvent("sds-change", { detail: this.value, bubbles: true, composed: true }));
  }
  /** The `<select>` the form actually submits, and the whole control on a page
      that runs no script. The stylesheet hides it once this element upgrades. */
  native() {
    const prompt = !this.filled && this.value ? html16`<option value="" selected disabled>${this.value}</option>` : nothing7;
    const runs = [];
    for (const option of this.entries) {
      const last = runs.at(-1);
      if (last && last.group === option.group) last.items.push(option);
      else runs.push({ group: option.group, items: [option] });
    }
    const one = (option) => {
      const value = this.sends(option);
      return html16`<option value="${value}" ?selected="${value === this.value}" ?disabled="${option.disabled ?? false}">${option.label}</option>`;
    };
    return html16`<select
    class="sds-input sds-select__native"
    name="${this.name || nothing7}"
    aria-label="${this.label || this.caption || nothing7}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${(e) => {
      const control = e.target;
      const at = this.entries.findIndex((option) => this.sends(option) === control.value);
      if (at >= 0) this.choose(at);
    }}"
  >${prompt}${runs.map(
      (run) => run.group ? html16`<optgroup label="${run.group}">${run.items.map(one)}</optgroup>` : html16`${run.items.map(one)}`
    )}</select>`;
  }
  /** The drawn list: headings as groups the keys walk past, answers as options
      the keys land on. */
  drawn() {
    const rows = [];
    let group;
    this.entries.forEach((option, at) => {
      if (option.group && option.group !== group) {
        rows.push(html16`<span class="sds-select__group" role="presentation">${option.group}</span>`);
      }
      group = option.group;
      const chosen = this.filled && this.sends(option) === this.value;
      rows.push(html16`<div
      class="sds-select__option${chosen ? " is-chosen" : ""}${at === this.active ? " is-active" : ""}"
      id="${this.listId}-${at}"
      role="option"
      aria-selected="${chosen ? "true" : "false"}"
      aria-disabled="${option.disabled ? "true" : nothing7}"
      @click="${() => {
        if (option.disabled) return;
        this.choose(at);
        this.hide();
      }}"
      @pointermove="${() => {
        if (!option.disabled) this.active = at;
      }}"
    ><span class="sds-select__tick"><sds-icon name="actions-check"></sds-icon></span>${option.label}</div>`);
    });
    return rows;
  }
  render() {
    const cls = `${fieldBox(this)} sds-select${this.open ? " is-open" : ""}`;
    const box = `width:${this.minWidth}px; max-width:100%`;
    const disabled = this.disabled || this.inheritedDisabled;
    const id = this.fieldId || nothing7;
    const control = html16`<span class="${cls}" style="${box}" @keydown="${(e) => this.onKey(e)}">${this.native()}<button
    type="button"
    class="sds-select__button"
    id="${id}"
    style="anchor-name: ${this.anchor}"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="${this.listed ? "true" : "false"}"
    aria-controls="${this.listId}"
    aria-activedescendant="${this.listed && this.active >= 0 ? `${this.listId}-${this.active}` : nothing7}"
    aria-label="${this.label || nothing7}"
    aria-invalid="${this.invalid || this.error ? "true" : nothing7}"
    ?disabled="${disabled}"
    popovertarget="${this.open ? nothing7 : this.listId}"
  ><span class="sds-select__value">${this.says}</span></button><span class="sds-select__mark"><sds-icon name="actions-chevron-down"></sds-icon></span><div
    class="sds-select__list"
    id="${this.listId}"
    style="position-anchor: ${this.anchor}"
    role="listbox"
    aria-label="${this.label || this.caption || nothing7}"
    ?popover="${!this.open}"
    @toggle="${this.onToggle}"
  >${this.drawn()}</div></span>`;
    return fieldRow(this, control);
  }
};
define("sds-select", SdsSelect);

// packages/frontend/src/components/textarea.ts
import { html as html17 } from "lit";
import { unsafeHTML as unsafeHTML3 } from "lit/directives/unsafe-html.js";
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var SdsTextarea = class extends SdsFormElement {
  static {
    this.properties = {
      rows: { type: Number },
      value: { type: String },
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      fieldId: { type: String, attribute: "field-id" },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      maxlength: { type: Number },
      autocomplete: { type: String },
      resize: { type: String, reflect: true },
      size: { type: String, reflect: true },
      minWidth: { type: Number, attribute: "min-width" },
      filled: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.rows = 4;
    this.value = "";
    this.caption = "";
    this.name = "";
    this.fieldId = "";
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.maxlength = 0;
    this.autocomplete = "";
    this.resize = "vertical";
    this.size = "md";
    this.minWidth = 420;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
  }
  /* What the markup came with: what the element is drawn holding, and what a
     reset puts back. Read once, before anything is typed. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  updated() {
    const area = this.querySelector("textarea");
    const written = this.filled ? this.value : "";
    if (area && area.value !== written) area.value = written;
    this.setValidity(this.error, "textarea");
  }
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  onInput(event) {
    const area = event.target;
    this.value = area.value;
    this.filled = area.value !== "";
    this.error = "";
    this.dispatchEvent(new CustomEvent("sds-input", { detail: area.value, bubbles: true, composed: true }));
  }
  render() {
    const cls = `${fieldBox(this)} sds-field--multi`;
    const box = `width:${this.minWidth}px; max-width:100%`;
    const disabled = this.disabled || this.inheritedDisabled;
    const attr2 = (key, value) => value ? ` ${key}="${esc(value)}"` : "";
    const area = `<textarea class="sds-input" rows="${this.rows}"${attr2("id", this.fieldId)}${attr2("name", this.name)}${this.filled ? "" : attr2("placeholder", this.value)}${attr2("aria-label", this.label ?? "")}${attr2("autocomplete", this.autocomplete)}${this.maxlength ? ` maxlength="${this.maxlength}"` : ""}${this.invalid || this.error ? ' aria-invalid="true"' : ""}${this.required ? " required" : ""}${disabled ? " disabled" : ""}${this.readonly ? " readonly" : ""}>${esc(this.#initial ?? "")}</textarea>`;
    const control = html17`<span class="${cls}" style="${box}" @input="${(e) => this.onInput(e)}">${unsafeHTML3(area)}</span>`;
    return fieldRow(this, control);
  }
};
define("sds-textarea", SdsTextarea);

// packages/frontend/src/components/switch.ts
import { html as html18, nothing as nothing9 } from "lit";
var SdsSwitch = class extends SdsFormElement {
  static {
    this.properties = {
      label: { type: String },
      hint: { type: String },
      checked: { type: Boolean, reflect: true },
      name: { type: String },
      value: { type: String },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.hint = "";
    this.checked = false;
    this.name = "";
    this.value = "";
    this.disabled = false;
  }
  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so mirroring the live
     state into it would make a reset restore the last press instead. */
  #initial;
  willUpdate() {
    this.#initial ??= this.checked;
  }
  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    const input = this.querySelector("input");
    if (input) input.checked = this.checked;
  }
  restore() {
    this.checked = this.#initial ?? false;
  }
  onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.checked, bubbles: true, composed: true })
    );
  }
  render() {
    return html18`<label class="sds-switch">
  <input
    class="sds-switch__track"
    type="checkbox"
    role="switch"
    name="${this.name || nothing9}"
    value="${this.value || nothing9}"
    ?checked="${this.#initial ?? this.checked}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-switch__body">
    <span class="sds-switch__label">${this.label}</span>
    ${this.hint ? html18`<span class="sds-switch__hint">${this.hint}</span>` : nothing9}
  </span>
</label>`;
  }
};
define("sds-switch", SdsSwitch);

// packages/frontend/src/components/range.ts
import { html as html19, nothing as nothing10 } from "lit";
var SdsRange = class extends SdsFormElement {
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      min: { type: String },
      max: { type: String },
      step: { type: String },
      value: { type: String },
      unit: { type: String },
      hint: { type: String },
      disabled: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.name = "";
    this.min = "0";
    this.max = "100";
    this.step = "1";
    this.value = "50";
    this.unit = "";
    this.hint = "";
    this.disabled = false;
    this.fieldId = "";
  }
  /* Where the markup put it, which is what a reset puts back. */
  #initial;
  willUpdate() {
    this.#initial ??= this.value;
  }
  updated() {
    const input = this.querySelector("input");
    if (input) input.value = this.value;
  }
  restore() {
    this.value = this.#initial ?? this.value;
  }
  onInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new CustomEvent("sds-input", { detail: this.value, bubbles: true, composed: true }));
  }
  render() {
    const id = this.fieldId || nothing10;
    const slider = html19`<input
    class="sds-range__slider"
    type="range"
    id="${id}"
    name="${this.name || nothing10}"
    min="${this.min}"
    max="${this.max}"
    step="${this.step}"
    value="${this.#initial ?? this.value}"
    aria-label="${this.label ?? nothing10}"
    ?disabled="${this.disabled}"
    @input="${this.onInput}"
  />`;
    if (!this.caption) return html19`<span class="sds-range">${slider}</span>`;
    return html19`<div class="sds-field-row sds-range">
  <span class="sds-range__head">
    <label class="sds-field-label" for="${id}">${this.caption}</label>
    <output class="sds-range__value" for="${id}">${this.value}${this.unit ? ` ${this.unit}` : ""}</output>
  </span>
  ${slider}
  ${this.hint ? html19`<span class="sds-field-hint">${this.hint}</span>` : nothing10}
</div>`;
  }
};
define("sds-range", SdsRange);

// packages/frontend/src/components/file.ts
import { html as html20, nothing as nothing11 } from "lit";
var SdsFile = class extends SdsFormElement {
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      accept: { type: String },
      multiple: { type: Boolean, reflect: true },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.name = "";
    this.accept = "";
    this.multiple = false;
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.fieldId = "";
  }
  /* What the caller said is wrong is what the browser refuses to submit past,
     reported on the control itself rather than on the element around it. */
  updated() {
    this.setValidity(this.error, "input");
  }
  onChange(event) {
    const files = [...event.target.files ?? []];
    this.dispatchEvent(new CustomEvent("sds-change", { detail: files, bubbles: true, composed: true }));
  }
  render() {
    const id = this.fieldId || nothing11;
    const control = html20`<input
    class="sds-file"
    type="file"
    id="${id}"
    name="${this.name || nothing11}"
    accept="${this.accept || nothing11}"
    aria-label="${this.label ?? nothing11}"
    aria-invalid="${this.error ? "true" : nothing11}"
    ?multiple="${this.multiple}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${this.onChange}"
  />`;
    return fieldRow(this, control);
  }
};
define("sds-file", SdsFile);

// packages/frontend/src/components/field-group.ts
import { html as html21 } from "lit";
var SdsFieldGroup = class extends SdsElement {
  constructor() {
    super(...arguments);
    /* What a caller wrote between the tags, taken before Lit renders over it.
       What stands in the group is the caller's business; the group only pays
       the distances. */
    this.taken = null;
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    return html21`<div class="sds-field-group">${this.taken ?? this.content}</div>`;
  }
};
define("sds-field-group", SdsFieldGroup);

// packages/frontend/src/components/checkbox.ts
import { html as html22, nothing as nothing12 } from "lit";
var SdsCheckbox = class extends SdsFormElement {
  static {
    this.properties = {
      label: { type: String },
      hint: { type: String },
      checked: { type: Boolean, reflect: true },
      indeterminate: { type: Boolean, reflect: true },
      name: { type: String },
      value: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.hint = "";
    this.checked = false;
    this.indeterminate = false;
    this.name = "";
    this.value = "";
    this.required = false;
    this.disabled = false;
  }
  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so mirroring the live
     state into it would make a reset restore the last click instead. */
  #initial;
  willUpdate() {
    this.#initial ??= this.checked;
  }
  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    const input = this.querySelector("input");
    if (!input) return;
    input.checked = this.checked;
    input.indeterminate = this.indeterminate;
  }
  restore() {
    this.checked = this.#initial ?? false;
  }
  /* Ticking is what makes it checked. A caller that had to write the state
     back is a caller that will forget once — and a mixed box that is ticked is
     no longer mixed, which the input has already decided by the time this runs. */
  onChange(event) {
    this.checked = event.target.checked;
    this.indeterminate = false;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.checked, bubbles: true, composed: true })
    );
  }
  render() {
    return html22`<label class="sds-check">
  <input
    class="sds-check__mark"
    type="checkbox"
    name="${this.name || nothing12}"
    value="${this.value || nothing12}"
    ?checked="${this.#initial ?? this.checked}"
    ?required="${this.required}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-check__body">
    <span class="sds-check__label">${this.label}</span>
    ${this.hint ? html22`<span class="sds-check__hint">${this.hint}</span>` : nothing12}
  </span>
</label>`;
  }
};
define("sds-checkbox", SdsCheckbox);

// packages/frontend/src/components/checkbox-group.ts
import { html as html23, nothing as nothing13 } from "lit";
var SdsCheckboxGroup = class extends SdsFormElement {
  static {
    this.properties = {
      legend: { type: String },
      name: { type: String },
      choices: { type: Array },
      values: { type: Array },
      hint: { type: String }
    };
  }
  constructor() {
    super();
    this.legend = "";
    this.name = "";
    this.choices = [];
    this.values = [];
    this.hint = "";
  }
  /* What the markup ticked, which is what a reset puts back. `?checked` writes
     the boxes' *defaults*; mirroring the live set into them would make a reset
     restore the last click. */
  #initial;
  willUpdate() {
    this.#initial ??= this.values;
  }
  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    for (const input of this.querySelectorAll("input")) input.checked = this.values.includes(input.value);
  }
  restore() {
    this.values = this.#initial ?? [];
  }
  toggle(value, on) {
    const kept = this.values.filter((held) => held !== value);
    this.values = on ? [...kept, value] : kept;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.values, bubbles: true, composed: true })
    );
  }
  render() {
    return html23`<fieldset class="sds-choices">
  <legend class="sds-field-label">${this.legend}</legend>
  ${this.hint ? html23`<span class="sds-field-hint">${this.hint}</span>` : nothing13}
  ${this.choices.map((choice) => {
      const value = choice.value ?? choice.label;
      return html23`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="checkbox"
      name="${this.name}"
      value="${value}"
      ?checked="${(this.#initial ?? this.values).includes(value)}"
      ?disabled="${choice.disabled ?? false}"
      @change="${(e) => this.toggle(value, e.target.checked)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html23`<span class="sds-check__hint">${choice.hint}</span>` : nothing13}
    </span>
  </label>`;
    })}
</fieldset>`;
  }
};
define("sds-checkbox-group", SdsCheckboxGroup);

// packages/frontend/src/components/radio.ts
import { html as html24, nothing as nothing14 } from "lit";
var SdsRadio = class extends SdsFormElement {
  static {
    this.properties = {
      legend: { type: String },
      name: { type: String },
      choices: { type: Array },
      value: { type: String },
      hint: { type: String },
      required: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.legend = "";
    this.name = "";
    this.choices = [];
    this.value = "";
    this.hint = "";
    this.required = false;
  }
  /* The answer the markup came with, which is what a reset puts back.
     `?checked` writes the `checked` *attribute* — the input's default — so
     mirroring the chosen value into it would make a reset restore the last
     click instead of the answer the page was drawn with. */
  #initial;
  willUpdate() {
    this.#initial ??= this.value;
  }
  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    for (const input of this.querySelectorAll("input")) input.checked = input.value === this.value;
  }
  restore() {
    this.value = this.#initial ?? "";
  }
  choose(choice) {
    this.value = choice.value ?? choice.label;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.value, bubbles: true, composed: true })
    );
  }
  render() {
    return html24`<fieldset class="sds-choices" name="${this.name || nothing14}">
  <legend class="sds-field-label">${this.legend}${this.required ? html24` <span class="sds-field-req">required</span>` : nothing14}</legend>
  ${this.hint ? html24`<span class="sds-field-hint">${this.hint}</span>` : nothing14}
  ${this.choices.map((choice) => {
      const value = choice.value ?? choice.label;
      return html24`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="radio"
      name="${this.name}"
      value="${value}"
      ?checked="${value === (this.#initial ?? this.value)}"
      ?required="${this.required}"
      @change="${() => this.choose(choice)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html24`<span class="sds-check__hint">${choice.hint}</span>` : nothing14}
    </span>
  </label>`;
    })}
</fieldset>`;
  }
};
define("sds-radio", SdsRadio);

// packages/frontend/src/components/form-errors.ts
import { html as html26 } from "lit";

// packages/frontend/src/components/note.ts
import { html as html25, nothing as nothing15 } from "lit";
var SdsNote = class _SdsNote extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it —
       see `SdsElement.lifted()` for why it is asked exactly once. */
    this.taken = null;
    this.tone = "info";
    this.heading = "";
    this.body = "";
    this.label = "";
  }
  static {
    /** The glyph each tone carries. */
    this.TONE_ICON = {
      info: "actions-info-circle",
      ok: "actions-check-circle",
      warn: "actions-exclamation-triangle",
      error: "actions-exclamation-circle"
    };
  }
  static {
    /** And what it says, for a reader who is not looking at the colour. */
    this.TONE_LABEL = {
      info: "Note",
      ok: "Success",
      warn: "Warning",
      error: "Error"
    };
  }
  static {
    this.properties = {
      tone: { type: String, reflect: true },
      heading: { type: String },
      body: { type: String },
      icon: { type: String },
      label: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const said = this.label || _SdsNote.TONE_LABEL[this.tone];
    return html25`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? _SdsNote.TONE_ICON[this.tone]}" label="${said}"></sds-icon></span>
  <div class="sds-note__content">
    ${this.heading ? html25`<div class="sds-note__title">${this.heading}</div>` : nothing15}
    <div class="sds-note__body">${this.taken ?? this.content ?? this.body}</div>
  </div>
</div>`;
  }
};
define("sds-note", SdsNote);

// packages/frontend/src/components/form-errors.ts
var SdsFormErrors = class extends SdsElement {
  static {
    this.properties = {
      errors: { type: Array },
      heading: { type: String },
      announce: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.errors = [];
    this.heading = "";
    this.announce = false;
  }
  /** Move the reader to the summary. A summary nobody is sent to is a summary
      nobody reads. */
  focusSummary() {
    this.querySelector(".sds-form-errors")?.focus();
  }
  updated() {
    if (this.announce && this.errors.length) this.focusSummary();
  }
  render() {
    if (!this.errors.length) return html26``;
    const count = this.errors.length;
    const heading = this.heading || `${count} ${count === 1 ? "answer needs" : "answers need"} changing`;
    return html26`<div class="sds-form-errors" tabindex="-1" role="alert" aria-live="assertive">
  <sds-note
    tone="error"
    heading="${heading}"
    .body="${html26`<span class="sds-form-errors__list">${this.errors.map(
      (error) => html26`<a class="sds-link" href="#${error.for ?? ""}">${error.message}</a>`
    )}</span>`}"
  ></sds-note>
</div>`;
  }
};
define("sds-form-errors", SdsFormErrors);

// packages/frontend/src/components/nav-pills.ts
import { html as html28 } from "lit";

// packages/frontend/src/components/nav-base.ts
import { html as html27, nothing as nothing16 } from "lit";
var asEntry = (item) => typeof item === "string" ? { label: item } : item;
var branch = (entry) => [entry, ...(entry.items ?? []).flatMap(branch)];
var navLabel = (item) => asEntry(item).label;
var navInside = (item) => {
  const { icon, label } = asEntry(item);
  return icon ? html27`<sds-icon name="${icon}"></sds-icon>${label}` : html27`${label}`;
};
var navHref = (item) => asEntry(item).href;
var SdsNav = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      active: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.active = 0;
  }
  /** Make an item current, and say so. Called by the items this renders, and
      by a subclass that has its own reason to move. */
  choose(index) {
    if (index === this.active) return;
    this.active = index;
    this.dispatchEvent(
      new CustomEvent("sds-change", {
        detail: { index, label: navLabel(this.items[index]) },
        bubbles: true,
        composed: true
      })
    );
  }
  /** A glyph before the label, where the item asked for one. */
  inside_(item) {
    return navInside(item);
  }
  /** Which entry is the current one: the entry that says so, and `active`
      where none does. Data wins — a list naming the page it is on is stating a
      fact, while `active` is a position in a set, and believing both at once
      is how two items come out marked. */
  at() {
    const named = this.items.findIndex((item) => asEntry(item).current);
    return named >= 0 ? named : this.active;
  }
  /** The class an item carries, active included. An entry the current one sits
      under is marked too: a section is where the reader is, without being the
      page they are on. */
  class_(index) {
    const here = index === this.at() || Boolean(asEntry(this.items[index]).here);
    return here ? `${this.item} is-active` : this.item;
  }
  items_() {
    const at = this.at();
    return this.items.map((item, i) => {
      const cls = this.class_(i);
      const current = i === at;
      const href = navHref(item);
      const inside = this.inside_(item);
      return href ? html27`<a class="${cls}" href="${href}" aria-current="${current ? "page" : nothing16}">${inside}</a>` : html27`<button type="button" class="${cls}" aria-current="${current ? "true" : nothing16}" @click="${() => this.choose(i)}">${inside}</button>`;
    });
  }
};

// packages/frontend/src/components/nav-pills.ts
var SdsNavPills = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-pills";
    this.item = "sds-pill";
  }
  render() {
    return html28`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
};
define("sds-nav-pills", SdsNavPills);

// packages/frontend/src/components/nav-main.ts
import { html as html34, nothing as nothing17 } from "lit";

// packages/frontend/src/lib/lockup.ts
import { html as html32 } from "lit";

// packages/frontend/src/components/image.ts
import { html as html31 } from "lit";

// packages/frontend/src/lib/zoom.ts
import { html as html30 } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

// packages/frontend/src/components/lightbox.ts
import { html as html29 } from "lit";
var SdsLightbox = class extends SdsElement {
  constructor() {
    super();
    /* What a button pointed at this one asks for. `sds-figure` opens its own
       viewer by calling `show()`, because it owns it; anything else names this
       element by id and sends the command, so opening a drawing is written in
       markup rather than in a script that has to find both ends. */
    this.onCommand = (event) => {
      const command = event.detail?.command ?? "show";
      if (command === "close") this.close();
      else if (command === "toggle") this.open ? this.close() : this.show();
      else this.show();
    };
    this.src = "";
    this.alt = "";
    this.caption = "";
    this.open = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      open: { type: Boolean, reflect: true }
    };
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sds-command", this.onCommand);
  }
  disconnectedCallback() {
    this.removeEventListener("sds-command", this.onCommand);
    super.disconnectedCallback();
  }
  show() {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
    });
  }
  close() {
    this.dialog?.close();
    this.open = false;
  }
  updated() {
    const el = this.dialog;
    if (!el || !this.isConnected) return;
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  render() {
    return html29`<dialog
      class="sds-lightbox"
      aria-label="${this.caption || this.alt}"
      @close="${() => {
      this.open = false;
    }}"
    >
  <div class="sds-modal__head">
    <span>${this.caption || this.alt}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-lightbox__art${exported(this.src) ? " sds-lightbox__art--exported" : ""}">
    ${art(this.src, this.alt)}
  </div>
</dialog>`;
  }
};
define("sds-lightbox", SdsLightbox);

// packages/frontend/src/lib/zoom.ts
var openers = /* @__PURE__ */ new WeakMap();
function opener(host) {
  const known = openers.get(host);
  if (known) return known;
  const open = (event) => {
    const viewer = host.querySelector("sds-lightbox");
    if (!viewer?.show) return;
    event.preventDefault();
    viewer.show();
  };
  openers.set(host, open);
  return open;
}
function zoom(host, picture, options) {
  const { src, alt, caption } = options;
  return {
    trigger: html30`<a class="sds-zoom" href="${src}" title="Open the picture at full size" @click="${opener(host)}">${picture}</a>`,
    viewer: html30`<sds-lightbox src="${src}" alt="${alt}" caption="${ifDefined(caption || void 0)}"></sds-lightbox>`
  };
}

// packages/frontend/src/components/image.ts
var SdsImage = class extends SdsElement {
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      width: { type: Number, reflect: true },
      height: { type: Number, reflect: true },
      zoomable: { type: Boolean, reflect: true },
      /* The class the caller wrote, read as a property rather than off the host:
         `this.className` exists only where there is a DOM, and these render in
         Node too. Declaring the attribute is what carries it through both. */
      cls: { attribute: "class", type: String }
    };
  }
  constructor() {
    super();
    this.src = "";
    this.alt = "";
    this.width = 0;
    this.height = 0;
    this.zoomable = false;
    this.cls = "";
  }
  /** What a server wrote between the tags, dropped. The element takes no
      content — the picture follows from `src` — but it does take a fallback:
      the same picture in the class layer, for a surface rendering before any
      script and for a reader who runs none. The element redraws it and the
      server's copy goes, or light DOM leaves two pictures in one box. */
  connectedCallback() {
    this.lifted();
    super.connectedCallback();
  }
  render() {
    const width = this.width || void 0;
    const height = this.height || void 0;
    const cls = this.cls || (width || height ? "" : "sds-art");
    const picture = art(this.src, this.alt, { cls, width, height });
    if (!this.zoomable) return picture;
    const { trigger, viewer } = zoom(this, picture, { src: this.src, alt: this.alt });
    return html31`${trigger}
${viewer}`;
  }
};
define("sds-image", SdsImage);

// packages/frontend/src/lib/lockup.ts
function lockup({ signet = "", brand = "", product = "", href = "" }) {
  if (!signet && !product) return "";
  const inside = html32`${signet ? html32`<sds-image class="sds-signet" src="${signet}" alt="" width="24" height="24"></sds-image>` : ""}${product ? html32`<span class="sds-wordmark">${brand ? html32`<span class="sds-wordmark__brand">${brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${product}</span>` : html32`${product}`}</span>` : ""}`;
  return href ? html32`<a class="sds-lockup" href="${href}">${inside}</a>` : html32`<span class="sds-lockup">${inside}</span>`;
}

// packages/frontend/src/components/overlay.ts
import { html as html33 } from "lit";
var SdsOverlay = class extends SdsElement {
  render() {
    return html33`<div class="sds-overlay"></div>`;
  }
};
define("sds-overlay", SdsOverlay);

// packages/frontend/src/components/nav-main.ts
var WALL = 8;
var GRACE = 200;
var seq4 = 0;
function boxes(row) {
  const out = [];
  const walk = (parent) => {
    for (const child of parent.children) {
      const el = child;
      const style = getComputedStyle(el);
      if (style.display === "none") continue;
      if (style.display === "contents") {
        walk(el);
        continue;
      }
      if (style.position === "absolute" || style.position === "fixed") continue;
      out.push(el);
    }
  };
  walk(row);
  return out;
}
var widthOf = (el) => el.getBoundingClientRect().width;
var SdsNavMain = class extends SdsNav {
  constructor() {
    super();
    this.block = "sds-bar";
    this.item = "sds-pill";
    this.drawerId = `sds-bar-drawer-${++seq4}`;
    /** What the sections, the field and the mode pair's two words need in the
        row. Zero means "not measured yet", and each can only be measured where
        it is — standing in the row. */
    this.needNav = 0;
    this.needSearch = 0;
    this.needWords = 0;
    /** The mode control with its words and without them. The two are what a word
        costs, and neither can be read in the state that does not have it. */
    this.wordyTheme = 0;
    this.quietTheme = 0;
    this.watched = false;
    /** Which way the drawer has just stepped, and how tall it was before it did.
        Both are read once, by the render that has to show the step. */
    this.stepped = null;
    this.stood = 0;
    /** The links a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before the page is sent, and passing that
        back through `items` would encode and resolve it a second time — so they
        are kept as written, `target`, `rel` and current mark intact. */
    this.taken = [];
    this.onOutside = (event) => {
      if (!this.open && this.opened < 0) return;
      if (event.composedPath().includes(this)) return;
      this.open = false;
      this.opened = -1;
      this.reset();
    };
    /* A drawer opened to get somewhere has done its job when a page is chosen.
       Only a link: everything else in there — a fold, a heading, the field — is
       the reader still looking. */
    this.onFollow = (event) => {
      if (event.target?.closest("a")) this.open = false;
    };
    this.home = "";
    this.signet = "";
    this.brand = "";
    this.product = "";
    this.search = false;
    this.index = "";
    this.menu = { label: "" };
    this.languages = [];
    this.label = "Menu";
    this.themeKey = "";
    this.open = false;
    this.opened = -1;
    this.stack = [];
    this.compactTheme = false;
    this.foldNav = false;
    this.foldSearch = false;
  }
  static {
    this.properties = {
      ...SdsNav.properties,
      home: { type: String },
      signet: { type: String },
      brand: { type: String },
      product: { type: String },
      search: { type: Boolean },
      index: { type: String },
      menu: { type: Object },
      languages: { type: Array },
      label: { type: String },
      themeKey: { type: String, attribute: "theme-key" },
      open: { type: Boolean, state: true },
      opened: { type: Number, state: true },
      stack: { type: Array, state: true },
      compactTheme: { type: Boolean, state: true },
      foldNav: { type: Boolean, state: true },
      foldSearch: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.watch = new ResizeObserver(() => this.decide());
    void document.fonts?.ready.then(() => {
      this.needNav = 0;
      this.needSearch = 0;
      this.needWords = 0;
      this.wordyTheme = 0;
      this.quietTheme = 0;
      this.compactTheme = false;
      this.foldNav = false;
      this.foldSearch = false;
      void this.updateComplete.then(() => this.decide());
    });
    document.addEventListener("pointerdown", this.onOutside);
  }
  disconnectedCallback() {
    clearTimeout(this.leaving);
    this.watch?.disconnect();
    document.removeEventListener("pointerdown", this.onOutside);
    super.disconnectedCallback();
  }
  /** Where the drawer opens: on the level the reader is standing on, which is
      the entry holding the page they are reading. A menu that always opened at
      the top would ask somebody three sections deep to walk back down to where
      they already were — and the way up is one press, which the way down is
      not. */
  path() {
    const walk = (entry, trail) => {
      for (const child of entry.items ?? []) {
        if (child.current) return trail;
        const under = walk(child, [...trail, child]);
        if (under) return under;
      }
      return null;
    };
    return walk(this.menu, []) ?? [];
  }
  /** Back to that level. A reader who stepped somewhere and closed the drawer
      is not still asking about it the next time they open one. */
  reset() {
    const at = this.path();
    if (at.length !== this.stack.length || at.some((entry, i) => entry !== this.stack[i])) {
      this.stack = at;
    }
  }
  onKey(event) {
    if (event.key === "Escape") {
      if (this.opened >= 0) {
        const at = this.opened;
        this.opened = -1;
        void this.updateComplete.then(
          () => this.querySelectorAll(".sds-bar__fold > summary")[at]?.focus()
        );
        return;
      }
      if (!this.open) return;
      this.open = false;
      this.reset();
      this.querySelector(".sds-bar__toggle")?.focus();
      return;
    }
    this.walk(event);
  }
  /** The rows of whichever list the key was pressed in: a panel under one
      section, or the drawer holding the whole menu. */
  list(from) {
    const drawer = from.closest(".sds-bar__drawer");
    const scope = drawer ?? from.closest(".sds-bar__section");
    if (!scope) return [];
    const rows = drawer ? (
      /* The folds count as rows: a tree read with the arrows is read as it
         stands, and a closed section is one line until it is opened. */
      scope.querySelectorAll(".sds-rail__group > summary, .sds-rail__item, .sds-pill, .sds-bar__link")
    ) : scope.querySelectorAll(".sds-bar__panel .sds-bar__link");
    return [...rows].filter((row) => {
      if (!row.getClientRects().length) return false;
      const shut = row.closest("details:not([open])");
      return !shut || row.matches("summary");
    });
  }
  /** Down a list of pages and back up it. The arrow that opens a panel steps
      into it in the same breath, and Tab is left alone: it is how a reader
      leaves. */
  walk(event) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const from = event.target;
    if (!from || !this.contains(from)) return;
    const markers = [...this.querySelectorAll(".sds-bar__fold > summary")];
    const marker = from.closest("summary");
    if (marker && markers.includes(marker) && event.key === "ArrowDown") {
      const at2 = markers.indexOf(marker);
      event.preventDefault();
      this.opened = at2;
      void this.updateComplete.then(() => this.list(marker)[0]?.focus());
      return;
    }
    const rows = this.list(from);
    if (rows.length < 2) return;
    const at = rows.indexOf(from);
    if (at < 0) return;
    event.preventDefault();
    const to = event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (
      /* Stops at the ends rather than wrapping: a list that starts over
         at the bottom hides how long it was from whoever cannot see it. */
      Math.min(rows.length - 1, Math.max(0, at + (event.key === "ArrowDown" ? 1 : -1)))
    );
    rows[to]?.focus();
  }
  choose(index) {
    super.choose(index);
    this.open = false;
  }
  /** What is in the row and what is in the drawer, from the room the row has
      rather than from a width. The order is what the bar can best do without:
      the field first, the sections last. */
  decide() {
    const row = this.querySelector(".sds-bar");
    if (!row) return;
    const style = getComputedStyle(row);
    const gap = parseFloat(style.columnGap) || 0;
    const end = this.querySelector(".sds-bar__end");
    const endGap = end ? parseFloat(getComputedStyle(end).columnGap) || 0 : 0;
    const nav = this.querySelector(".sds-bar__nav");
    if (nav && !this.foldNav && !this.needNav) {
      const items = boxes(nav);
      if (!items.length) return;
      const itemGap = parseFloat(getComputedStyle(nav).columnGap) || 0;
      this.needNav = items.reduce((sum, el) => sum + widthOf(el), 0) + itemGap * (items.length - 1);
    }
    const host = this.querySelector("sds-search");
    const field = this.querySelector(".sds-search");
    if (host && !field) {
      void (host.updateComplete ?? customElements.whenDefined("sds-search")).then(() => this.decide());
      return;
    }
    if (field && !this.foldSearch && !this.needSearch) this.needSearch = widthOf(field);
    const mode = this.querySelector("sds-theme");
    if (mode) {
      if (mode.querySelector(".sds-mode__label")) this.wordyTheme = widthOf(mode);
      else this.quietTheme = widthOf(mode);
      if (this.wordyTheme && this.quietTheme) this.needWords = this.wordyTheme - this.quietTheme;
    }
    const standing = boxes(row);
    let used = standing.reduce((sum, el) => sum + widthOf(el), 0) + gap * (standing.length - 1);
    if (nav && !this.foldNav) used -= widthOf(nav) + gap;
    if (field && !this.foldSearch) used -= widthOf(field) + endGap;
    if (!this.compactTheme) used -= this.needWords;
    const toggle = this.querySelector(".sds-bar__toggle");
    if (toggle) used -= widthOf(toggle) + endGap;
    const room = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - used;
    const button = parseFloat(getComputedStyle(this).getPropertyValue("--control-height")) || 0;
    const wantsSearch = this.search || Boolean(this.index);
    const forNav = this.needNav ? this.needNav + gap : 0;
    const forSearch = wantsSearch ? this.needSearch + endGap : 0;
    const forButton = button + endGap;
    const fits = (need) => need <= room;
    let compactTheme = false;
    let foldSearch = false;
    let foldNav = false;
    if (!fits(this.needWords + forSearch + forNav)) {
      compactTheme = true;
      if (!fits(forSearch + forNav)) {
        foldSearch = wantsSearch;
        if (!fits(forNav + forButton)) foldNav = Boolean(this.needNav);
      }
    }
    if (compactTheme === this.compactTheme && foldSearch === this.foldSearch && foldNav === this.foldNav) return;
    this.compactTheme = compactTheme;
    this.foldSearch = foldSearch;
    this.foldNav = foldNav;
    if (!foldNav && !foldSearch) this.open = false;
  }
  field() {
    return html34`<sds-search index="${this.index}"></sds-search>`;
  }
  /** The languages, as the one control at this end that is not a mode. The
      button says the code the reader is in and nothing else — the row is short
      of width before it is short of anything, and the names are one press
      away, each in its own language. Hung from the end, or a list opened from
      the corner runs off the page. */
  languages_() {
    const current = this.languages.find((entry) => entry.current) ?? this.languages[0];
    return html34`<sds-dropdown
      class="sds-bar__lang"
      variant="ghost"
      align="end"
      name="Language"
      label="${current?.lang ?? current?.label ?? ""}"
      .choices="${this.languages}"
    ></sds-dropdown>`;
  }
  /** The sections of the menu that stand in the row. Which of a site's
      sections are its front doors is the one thing its tree cannot say, so the
      menu says it; with none named, every section is one. */
  doors() {
    const sections = [...this.menu.items ?? []];
    const named = sections.filter((entry) => entry.front);
    return named.length ? named : sections;
  }
  /** One front door: the link, and the fold that opens its pages under the row.
        The link stays a link — pressing a section's name goes to that section,
        and what opens the panel is the marker beside it. A `<details>`, so the
        panel works before any script and the bar only has to say which one is
        open.
  
        A pointer opens it too, and on the whole section rather than the marker
        alone: a menu that only answers a press asks a reader who is already
        moving to stop and aim. Nothing is lost without it — the marker is the
        control, and the pointer is a shortcut to the same state. */
  door(entry, at) {
    const here = Boolean(entry.current || entry.here);
    const pill = html34`<a
      class="${here ? "sds-pill is-active" : "sds-pill"}"
      href="${entry.href ?? "#"}"
      target="${entry.external ? "_blank" : nothing17}"
      rel="${entry.external ? "noreferrer" : nothing17}"
      aria-current="${entry.current ? "page" : here ? "true" : nothing17}"
    >${entry.label}</a>`;
    const under = entry.items ?? [];
    if (!under.length) return html34`<div class="sds-bar__section">${pill}</div>`;
    const wall = under.length > WALL;
    return html34`<div
      class="${wall ? "sds-bar__section" : "sds-bar__section sds-bar__section--drop"}"
      @pointerenter="${(event) => this.hover(at, event)}"
      @pointerleave="${(event) => this.hover(-1, event)}"
    >
      ${pill}
      <details
        class="sds-bar__fold"
        ?open="${this.opened === at}"
        @toggle="${(event) => this.fold(event, at)}"
      >
        <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
        <div class="sds-bar__panel">
          ${lines(under.map((page) => this.page(page)), 10)}
        </div>
      </details>
    </div>`;
  }
  /** A page in a panel. Two levels and no more: the row is the site's own, the
      panel is one section's pages, and a third level under a bar is a sitemap
      hanging off a menu — what the drawer opens is where a whole tree is read.
      Where the rows break into columns is the stylesheet's: a wall is one list,
      and how many columns it takes is a question about the room. */
  page(entry) {
    return html34`<a
      class="${entry.current ? "sds-bar__link is-active" : "sds-bar__link"}"
      href="${entry.href ?? "#"}"
      aria-current="${entry.current ? "page" : nothing17}"
    >${entry.label}</a>`;
  }
  /** A pointer over a section opens it, and leaving closes it — but only while
      the sections are standing in the row. In the drawer they are a list being
      scrolled past, and a panel that opens under a finger on its way somewhere
      is a menu answering a movement nobody made. A mouse only, for the same
      reason: a tap is a press, and the marker beside the link is what a press
      is for. */
  hover(at, event) {
    if (this.foldNav || event.pointerType !== "mouse") return;
    clearTimeout(this.leaving);
    if (at >= 0) {
      this.opened = at;
      return;
    }
    this.leaving = setTimeout(() => {
      this.opened = -1;
    }, GRACE);
  }
  /** Which panel a press left open. The event fires for the bar's own render
      as well as for a reader's press, and saying the same thing twice is what
      keeps the two from arguing. */
  fold(event, at) {
    const open = event.target.open;
    if (open) this.opened = at;
    else if (this.opened === at) this.opened = -1;
  }
  /** One level of the menu: what the drawer shows once the row has given the
        sections up.
  
        A level and not the tree. A phone is a window onto a long list, and the
        whole site unfolded into one column is forty rows a reader scrolls past
        to reach the four that are the site. So the drawer starts at the top
        level and steps *into* a section — the way in is a control of its own,
        beside the link, because a section is both a page to read and a place to
        go through. The way back is the row above the list, naming what it
        returns to rather than saying "back" to a reader who has forgotten. */
  level() {
    const inside = this.stack[this.stack.length - 1];
    const entry = inside ?? this.menu;
    const above = this.stack.length > 1 ? this.stack[this.stack.length - 2] : void 0;
    const rows = entry.items ?? [];
    return html34`<nav class="sds-bar__level" aria-label="${entry.label || "Pages"}">
    ${inside ? html34`<button
      type="button"
      class="sds-bar__back"
      @click="${() => {
      this.stack = this.stack.slice(0, -1);
    }}"
    ><sds-icon name="actions-chevron-start"></sds-icon>${above?.label ?? this.menu.label ?? "Menu"}</button>
    ${/* The section's own page, first and unfolded. */
    ""}
    ${inside.href ? this.step(inside, true) : ""}` : ""}
    ${lines(rows.map((row) => this.step(row)), 4)}
  </nav>`;
  }
  /** One row of a level: where it goes, and — where it holds pages — the way
      into them. Two controls rather than one, for the reason the row above the
      page has two: the label is the page, and the marker is what is under it. */
  step(entry, own = false) {
    const link = html34`<a
      class="${entry.current ? "sds-bar__link is-active" : "sds-bar__link"}"
      href="${entry.href ?? "#"}"
      target="${entry.external ? "_blank" : nothing17}"
      rel="${entry.external ? "noreferrer" : nothing17}"
      aria-current="${entry.current ? "page" : nothing17}"
    >${entry.label}</a>`;
    if (own || !entry.items?.length) return link;
    return html34`<div class="sds-bar__row">
      ${link}
      <button
        type="button"
        class="sds-bar__into"
        aria-label="Pages in ${entry.label}"
        @click="${() => {
      this.stack = [...this.stack, entry];
    }}"
      ><sds-icon name="actions-chevron-end"></sds-icon></button>
    </div>`;
  }
  /** The sections as parts, and which of them the reader is in. Four shapes
      arrive here: as the menu, lifted from the page, handed over as markup, or
      as data. Empty rather than absent where nothing was lifted, so the
      fallback is the length and not a `??` that a `[]` never reaches.
      `lifted()` runs in a browser only. */
  sections() {
    if (this.menu.items?.length) {
      const doors = this.doors();
      return {
        parts: doors.map((entry, at) => this.door(entry, at)),
        at: doors.findIndex((entry) => entry.current || entry.here)
      };
    }
    if (this.taken.length) {
      return {
        parts: [...this.taken],
        at: this.taken.findIndex((el) => el.matches(".is-active, [aria-current]"))
      };
    }
    if (this.content) return { parts: [this.content], at: -1 };
    return { parts: this.items_(), at: this.active < this.items.length ? this.active : -1 };
  }
  /** The sections: a row in the bar, a column in the drawer. */
  nav_() {
    const { parts } = this.sections();
    return html34`<nav class="sds-bar__nav" aria-label="Sections">
    ${lines(parts, 4)}
  </nav>`;
  }
  toggle_() {
    return html34`<button
      type="button"
      class="sds-bar__toggle"
      aria-expanded="${this.open ? "true" : "false"}"
      aria-controls="${this.drawerId}"
      aria-label="${this.label}"
      @click="${() => {
      this.open = !this.open;
      this.reset();
    }}"
    ><sds-icon name="${this.open ? "actions-close" : "actions-list"}"></sds-icon></button>`;
  }
  render() {
    const hasNav = Boolean(this.menu.items?.length || this.taken.length || this.content || this.items.length);
    const wantsSearch = this.search || Boolean(this.index);
    const drawer = this.foldNav || this.foldSearch;
    return html34`<header class="sds-bar" @keydown="${(e) => this.onKey(e)}">
  ${lockup({ signet: this.signet, brand: this.brand, product: this.product, href: this.home || "#" })}
  ${hasNav && !this.foldNav ? this.nav_() : ""}
  <div class="sds-bar__end">
    ${wantsSearch && !this.foldSearch ? this.field() : ""}
    ${this.languages.length ? this.languages_() : ""}
    ${this.themeKey ? html34`<sds-theme key="${this.themeKey}" ?compact="${this.compactTheme}"></sds-theme>` : html34`<sds-theme ?compact="${this.compactTheme}"></sds-theme>`}
    ${drawer ? this.toggle_() : ""}
  </div>
  ${drawer ? html34`${this.open ? html34`<sds-overlay @click="${() => {
      this.open = false;
    }}"></sds-overlay>
  ` : ""}<div class="sds-bar__drawer" id="${this.drawerId}" ?hidden="${!this.open}" @click="${this.onFollow}">
    ${wantsSearch && this.foldSearch ? this.field() : ""}
    ${/* The menu where there is one, and the front doors alone where the bar
        was given nothing but them: the drawer holds every entry of the menu,
        and the row above it none. */
    ""}
    ${hasNav && this.foldNav ? this.menu.items?.length ? this.level() : this.nav_() : ""}
  </div>` : ""}
</header>`;
  }
  willUpdate(changed) {
    if (changed.has("items") || changed.has("menu")) {
      this.needNav = 0;
      this.foldNav = false;
    }
    if (changed.has("menu")) this.stack = this.path();
    if (changed.has("foldNav") && this.foldNav) this.opened = -1;
    if (changed.has("stack") && typeof document !== "undefined") {
      const before = changed.get("stack");
      this.stepped = before && before.length > this.stack.length ? "out" : "in";
      this.stood = this.querySelector(".sds-bar__drawer")?.getBoundingClientRect().height ?? 0;
    }
  }
  updated() {
    if (!this.watched) {
      const row = this.querySelector(".sds-bar");
      if (row && this.watch) {
        this.watched = true;
        this.watch.observe(row);
      }
    }
    this.travel();
    this.decide();
  }
  /** The step, shown as one. The level arrives from the side it was reached
        from and the drawer grows into its new height rather than jumping to it,
        both in the one duration and curve the system moves anything in — read
        from the tokens, so a change there reaches this too.
  
        Held still for a reader who asked for that: what goes is the travel, not
        the answer. */
  travel() {
    const how = this.stepped;
    this.stepped = null;
    if (!how || typeof matchMedia === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const level = this.querySelector(".sds-bar__level");
    const drawer = this.querySelector(".sds-bar__drawer");
    if (!level || !drawer) return;
    const style = getComputedStyle(level);
    const duration = parseFloat(style.getPropertyValue("--duration-fast"));
    const easing = style.getPropertyValue("--ease-out").trim();
    if (!duration || !easing) return;
    const away = parseFloat(style.getPropertyValue("--space-6")) || 24;
    const forwards = style.direction === "rtl" ? -away : away;
    const from = how === "in" ? forwards : -forwards;
    level.animate(
      [{ opacity: 0, transform: `translateX(${from}px)` }, { opacity: 1, transform: "none" }],
      { duration, easing }
    );
    const now = drawer.getBoundingClientRect().height;
    if (this.stood && Math.abs(now - this.stood) > 1) {
      drawer.animate([{ height: `${this.stood}px` }, { height: `${now}px` }], { duration, easing });
    }
    this.stood = 0;
  }
};
define("sds-nav-main", SdsNavMain);

// packages/frontend/src/components/accordion.ts
import { html as html36, nothing as nothing19 } from "lit";

// packages/frontend/src/components/accordion-item.ts
import { html as html35, nothing as nothing18 } from "lit";
var SdsAccordionItem = class extends SdsElement {
  constructor() {
    super();
    this.taken = null;
    this.question = "";
    this.open = false;
    this.name = "";
    this.anchor = "";
  }
  static {
    this.properties = {
      question: { type: String, reflect: true },
      /** Standing open. For the first answer on a page of them, usually, so the
          shape of an answer is visible without pressing anything. */
      open: { type: Boolean, reflect: true },
      /** The set this answer folds in — `<details name>`, which is the platform's
          own exclusivity. Empty where the set was told `multiple`. */
      name: { type: String, reflect: true },
      /** The address of this one answer. It lands on the answer and not on the
          question: a fold whose content is jumped *into* is opened by the
          platform, and one jumped *at* stays shut. */
      anchor: { type: String, reflect: true }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  /* The browser unfolds an answer a fragment points into and scrolls to it,
     before any of this runs — and then the upgrade writes that answer again
     and the arrival is gone with the node it happened to. Made once more here,
     by the element that took it away. */
  firstUpdated() {
    if (!this.anchor || globalThis.location?.hash !== `#${this.anchor}`) return;
    this.open = true;
    void this.updateComplete.then(
      () => requestAnimationFrame(() => this.querySelector(`#${CSS.escape(this.anchor)}`)?.scrollIntoView())
    );
  }
  render() {
    return html35`<details
    class="sds-accordion__item"
    name="${this.name || nothing18}"
    ?open="${this.open}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${this.question}</summary>
    <div class="sds-accordion__body" id="${this.anchor || nothing18}">${this.taken ?? this.content}</div>
  </details>`;
  }
};
define("sds-accordion-item", SdsAccordionItem);

// packages/frontend/src/components/accordion.ts
var SdsAccordion = class extends SdsElement {
  constructor() {
    super();
    /** The questions written between the tags, for answers that are blocks
        rather than a string a property can hold. Taken before Lit renders over
        them, and handed back below. */
    this.taken = null;
    this.entries = [];
    this.multiple = false;
    this.name = "sds-accordion";
  }
  static {
    this.properties = {
      entries: { type: Array },
      multiple: { type: Boolean, reflect: true },
      name: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const held = this.taken ?? this.content;
    return html36`<div class="sds-accordion">
  ${this.entries.length ? this.entries.map(
      (entry) => html36`<sds-accordion-item
    question="${entry.question}"
    name="${this.multiple ? nothing19 : this.name}"
    anchor="${entry.anchor ?? nothing19}"
    ?open="${Boolean(entry.open)}"
    .content="${entry.answer}"
  ></sds-accordion-item>`
    ) : held}
</div>`;
  }
  /* A set is named once and `<details name>` wants that name on every answer in
     it, so the items written between the tags are told rather than a page
     saying it on each. Nothing runs here outside a browser: what a renderer
     writes ahead of one, it writes onto the items itself. */
  updated() {
    const group = this.multiple ? "" : this.name;
    for (const item of this.querySelectorAll(":scope > .sds-accordion > sds-accordion-item")) {
      item.name = group;
    }
  }
};
define("sds-accordion", SdsAccordion);

// packages/frontend/src/components/steps.ts
import { html as html38, nothing as nothing21 } from "lit";

// packages/frontend/src/components/step.ts
import { html as html37, nothing as nothing20 } from "lit";
var SdsStep = class extends SdsElement {
  constructor() {
    super();
    /** What was written between the tags, taken before Lit renders over them. */
    this.taken = null;
    this.heading = "";
    this.optional = false;
    this.anchor = "";
  }
  static {
    this.properties = {
      /** What is done here, in one line. Spelt `heading` because that is what
          every title in this system is called, and not `title`, which is the
          global attribute a browser draws as a tooltip. */
      heading: { type: String, reflect: true },
      /** A stop that may be skipped. The disc is left unfilled and the word
          stands beside the title, because an empty ring says nothing out loud. */
      optional: { type: Boolean, reflect: true },
      /** Where a page links to this one stop. It lands on the stop itself: a step
          is not folded away, so there is nothing to open first. */
      anchor: { type: String, reflect: true }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const title = this.heading ? html37`<p class="sds-steps__title">${this.heading}${this.optional ? html37`<span class="sds-label">Optional</span>` : ""}</p>` : "";
    return html37`<div
    class="sds-steps__step${this.optional ? " sds-steps__step--optional" : ""}"
    role="listitem"
    id="${this.anchor || nothing20}"
  >
    ${title}
    ${this.taken ?? this.content}
  </div>`;
  }
};
define("sds-step", SdsStep);

// packages/frontend/src/components/steps.ts
var SdsSteps = class extends SdsElement {
  constructor() {
    super();
    /** The stops written between the tags, for content that is blocks rather than
        a string a property can hold. Taken before Lit renders over them. */
    this.taken = null;
    this.steps = [];
  }
  static {
    this.properties = {
      steps: { type: Array }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const held = this.taken ?? this.content;
    return html38`<div class="sds-steps" role="list">
  ${this.steps.length ? this.steps.map(
      (step) => html38`<sds-step
    heading="${step.heading}"
    anchor="${step.anchor ?? nothing21}"
    ?optional="${Boolean(step.optional)}"
    .content="${step.body}"
  ></sds-step>`
    ) : held}
</div>`;
  }
};
define("sds-steps", SdsSteps);

// packages/frontend/src/components/tabs.ts
import { html as html40, nothing as nothing22 } from "lit";

// packages/frontend/src/components/tab-item.ts
import { html as html39 } from "lit";
var seq5 = 0;
var SdsTabItem = class extends SdsElement {
  constructor() {
    super();
    /** Whether a set of tabs is deciding which panel is shown. A panel decides
        for itself until one is — which is what a panel is on a page where nothing
        switches it, and hiding every one there leaves content in the document and
        invisible in it. The set claims them the moment it exists. */
    this.managed = false;
    this.taken = null;
    this.label = "";
    this.active = false;
    seq5 += 1;
    this.panelId = `sds-tab-panel-${seq5}`;
    this.tabId = `sds-tab-${seq5}`;
  }
  static {
    this.properties = {
      label: { type: String, reflect: true },
      /** A glyph before the label. For a tab whose subject has one — a file
          type, a tool — never as decoration on a set that reads fine without. */
      icon: { type: String, reflect: true },
      active: { type: Boolean, reflect: true }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    return html39`<div class="sds-tab__panel" role="tabpanel" id="${this.panelId}" aria-labelledby="${this.tabId}" ?hidden="${this.managed && !this.active}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-tab-item", SdsTabItem);

// packages/frontend/src/components/tabs.ts
function tabsBarMarkup(tabs, active, pick, onKey) {
  const buttons = tabs.map((tab, i) => {
    const cls = i === active ? "sds-tab is-active" : "sds-tab";
    const inside = tab.icon ? html40`<sds-icon name="${tab.icon}"></sds-icon>${tab.label}` : html40`${tab.label}`;
    return html40`<button type="button" class="${cls}" role="${tab.panelId ? "tab" : nothing22}" id="${tab.tabId ?? nothing22}" aria-controls="${tab.panelId ?? nothing22}" aria-selected="${tab.panelId ? String(i === active) : nothing22}" tabindex="${tab.panelId ? i === active ? 0 : -1 : nothing22}" @click="${() => pick?.(i)}">${inside}</button>`;
  });
  return html40`<div class="sds-tabs" role="${tabs[0]?.panelId ? "tablist" : nothing22}" @keydown="${(e) => onKey?.(e)}">
  ${lines(buttons, 2)}
</div>`;
}
var SdsTabs = class _SdsTabs extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-tabs";
    this.item = "sds-tab";
    /** The panels written between the tags. */
    this.panels = [];
    /* What was chosen before, applied once there is something to match it
       against — the items arrive with the markup or a frame later, and asking
       before they are there would silently settle on nothing. */
    this.recalled = false;
  }
  static {
    this.properties = {
      /* Lit merges what a subclass declares with what it inherits; the type
         does not, so the base's are named again here. */
      ...SdsNav.properties,
      /** The word that makes sets follow each other. Named for what it does
          rather than for what the set is called: a page showing one setting in
          four places asks the reader to choose a language once, and a set
          writing nothing here is a set nobody else moves. */
      sync: { type: String, reflect: true }
    };
  }
  static {
    /* Every set on the page that follows a word, so one of them can reach the
       others. A registry rather than an event on the document: what agrees is
       these elements, and a page may hold sets that agree about nothing. */
    this.agreeing = /* @__PURE__ */ new Set();
  }
  /** Take the items written between the tags, if any are there yet. */
  lift() {
    const found = [...this.children].filter((c) => c.tagName.toLowerCase() === "sds-tab-item");
    if (!found.length) return false;
    this.panels = found;
    this.items = this.panels.map((panel) => {
      const icon = panel.getAttribute("icon");
      const label = panel.getAttribute("label") ?? "";
      return icon ? { label, icon } : label;
    });
    for (const panel of this.panels) {
      panel.managed = true;
      panel.remove();
    }
    return true;
  }
  connectedCallback() {
    if (!this.panels.length && !this.lift()) {
      this.arriving = new MutationObserver(() => {
        if (!this.lift()) return;
        this.arriving?.disconnect();
        this.requestUpdate();
      });
      this.arriving.observe(this, { childList: true });
    }
    if (this.sync) _SdsTabs.agreeing.add(this);
    super.connectedCallback();
  }
  disconnectedCallback() {
    this.arriving?.disconnect();
    _SdsTabs.agreeing.delete(this);
    super.disconnectedCallback();
  }
  choose(index) {
    super.choose(index);
    this.show();
    this.agree();
  }
  /** Where the choice is kept. One key per group, so two sets that agree
      about nothing on the same origin do not overwrite each other. */
  get store() {
    return `sds-tabs:${this.sync}`;
  }
  get labels() {
    return this.items.map(navLabel);
  }
  /* **A preference is an order, not a word.** A reader who picks bash in the
     one block that offers it has not stopped preferring PHP to YAML
     everywhere else, so what is kept is every word they have chosen, most
     recent first, and a set takes the first of them it has. */
  get preferred() {
    const kept = localStorage.getItem(this.store);
    if (!kept) return [];
    try {
      return JSON.parse(kept);
    } catch {
      return [kept];
    }
  }
  /* Tell the sets that follow the same word, and remember it for the next
     page. A manual is read across ten of them, and choosing the language
     again on each is the same annoyance one level up. */
  agree() {
    if (!this.sync) return;
    const label = this.labels[this.active];
    if (label === void 0) return;
    localStorage.setItem(this.store, JSON.stringify([label, ...this.preferred.filter((w) => w !== label)]));
    for (const other of _SdsTabs.agreeing) {
      if (other !== this && other.sync === this.sync) other.follow(label);
    }
  }
  /* Move because another set did, without saying it back. By the word and not
     by the position: a block offering YAML and TypoScript has no PHP, and one
     that does not have the word keeps the panel it is showing rather than
     falling back to its first. */
  follow(label) {
    const at = this.labels.indexOf(label);
    if (at === -1) return false;
    super.choose(at);
    this.show();
    return true;
  }
  recall() {
    if (this.recalled || !this.sync || !this.items.length) return;
    this.recalled = true;
    for (const label of this.preferred) if (this.follow(label)) return;
  }
  /** Tell each panel whether it is the one. */
  show() {
    this.panels.forEach((panel, i) => {
      panel.active = i === this.active;
    });
  }
  /* The arrow keys, because a tablist that only answers the pointer is a
     tablist in name. Home and End are part of the same expectation. */
  onKey(event) {
    const last = this.panels.length - 1;
    const to = event.key === "ArrowRight" ? this.active === last ? 0 : this.active + 1 : event.key === "ArrowLeft" ? this.active === 0 ? last : this.active - 1 : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (to === -1) return;
    event.preventDefault();
    this.choose(to);
    void this.updateComplete.then(() => {
      this.querySelectorAll("button.sds-tab")[to]?.focus();
    });
  }
  render() {
    const named = (item) => ({
      label: typeof item === "string" ? item : item?.label ?? "",
      icon: typeof item === "string" ? void 0 : item?.icon
    });
    const tabs = this.panels.length ? this.panels.map((panel, i) => ({
      ...named(this.items[i]),
      tabId: panel.tabId,
      panelId: panel.panelId
    })) : this.items.map(named);
    const held = this.panels.length ? this.panels : this.content;
    return html40`${tabsBarMarkup(tabs, this.active, (i) => this.choose(i), (e) => this.onKey(e))}${held}`;
  }
  updated() {
    this.recall();
    this.show();
  }
};
define("sds-tabs", SdsTabs);

// packages/frontend/src/components/nav-rail.ts
import { html as html41, nothing as nothing23 } from "lit";
var SdsNavRail = class extends SdsElement {
  constructor() {
    super();
    /** The rows a server wrote between the tags. A renderer that has resolved
        its own tree writes the classes below, so the two shapes are one shape. */
    this.taken = [];
    this.entry = { label: "" };
    this.picked = -1;
  }
  static {
    this.properties = {
      entry: { type: Object },
      picked: { type: Number, state: true }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  /** Every page in the rail, folds flattened: a rail has one current page
      wherever it sits, and a caller thinking in "third item of the second
      group" is thinking about the markup. */
  flat() {
    return (this.entry.items ?? []).flatMap(branch);
  }
  isCurrent(entry) {
    return this.picked >= 0 ? this.flat()[this.picked] === entry : Boolean(entry.current);
  }
  /** One page, and whatever hangs under it.
  
        A page that holds pages is a row like any other with the marker that
        opens them beside it — the same pair the bar's row draws, so a reader
        meets one shape and not two. What it holds is set in by a step, because
        a list where everything starts on the same edge says nothing about what
        belongs to what. */
  row(entry) {
    const under = entry.items ?? [];
    if (!under.length) return this.one(entry);
    const holds = branch(entry).some((page) => this.isCurrent(page));
    return html41`<div class="sds-rail__group">
    ${entry.href ? this.one(entry) : html41`<span class="sds-rail__item">${this.inside(entry)}</span>`}
    <details class="sds-rail__fold" ?open="${Boolean(entry.open) || holds}">
      <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
      ${lines(under.map((page) => this.row(page)), 6)}
    </details>
  </div>`;
  }
  /** What stands in a row: the glyph where the entry asked for one, and the
      name in a node of its own. The rail is one fixed width and its rows are
      names a machine gave, so the name is the half that gives — and it can
      only be cut in a box of its own. */
  inside(entry) {
    return html41`${entry.icon ? html41`<sds-icon name="${entry.icon}"></sds-icon>` : nothing23}<span class="sds-rail__label">${entry.label}</span>`;
  }
  one(entry) {
    const current = this.isCurrent(entry);
    const cls = current ? "sds-rail__item is-active" : "sds-rail__item";
    const inside = this.inside(entry);
    return entry.href ? html41`<a class="${cls}" href="${entry.href}" aria-current="${current ? "page" : nothing23}">${inside}</a>` : html41`<button type="button" class="${cls}" aria-current="${current ? "true" : nothing23}" @click="${() => this.pick(entry)}">${inside}</button>`;
  }
  render() {
    const label = this.entry.label;
    const written = this.taken.length ? this.taken : this.content;
    const under = this.entry.items ?? [];
    const rows = written ? [written] : [
      ...under.filter((page) => !page.items?.length).map((page) => this.row(page)),
      ...under.filter((page) => page.items?.length).map((page) => this.row(page))
    ];
    const here = this.isCurrent(this.entry);
    const head = !label ? nothing23 : this.entry.href ? html41`<a
    class="${here ? "sds-label sds-rail__heading is-active" : "sds-label sds-rail__heading"}"
    href="${this.entry.href}"
    aria-current="${here ? "page" : nothing23}"
  >${label}</a>` : html41`<div class="sds-label">${label}</div>`;
    return html41`<nav class="sds-rail" aria-label="${label || "Pages"}">
  ${head}
  ${lines(rows, 2)}
</nav>`;
  }
  /** A row with nowhere to go is a choice: pressing it makes it current and
      says so, for whatever is beside it to follow. */
  pick(entry) {
    const index = this.flat().indexOf(entry);
    if (index < 0 || index === this.picked) return;
    this.picked = index;
    this.dispatchEvent(
      new CustomEvent("sds-change", {
        detail: { index, label: entry.label },
        bubbles: true,
        composed: true
      })
    );
  }
};
define("sds-nav-rail", SdsNavRail);

// packages/frontend/src/components/nav-toc.ts
import { html as html42, nothing as nothing24 } from "lit";
var HEADING = "On this page";
var SdsNavToc = class extends SdsElement {
  constructor() {
    super();
    this.queued = 0;
    this.label = HEADING;
    this.entries = [];
    this.at = "";
  }
  static {
    this.properties = {
      label: { type: String },
      entries: { type: Array },
      at: { type: String, state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.watch();
  }
  disconnectedCallback() {
    this.watching?.abort();
    cancelAnimationFrame(this.queued);
    super.disconnectedCallback();
  }
  /** Follow the page. On the document and on the way down, because a scroll
      event does not bubble and the column may be the scroller rather than the
      window; and on resize, which moves every heading at once. One reading a
      frame — a scroll fires far faster than anything can be drawn. */
  watch() {
    this.watching?.abort();
    this.watching = new AbortController();
    const { signal } = this.watching;
    const soon = () => {
      cancelAnimationFrame(this.queued);
      this.queued = requestAnimationFrame(() => this.read());
    };
    document.addEventListener("scroll", soon, { capture: true, passive: true, signal });
    window.addEventListener("resize", soon, { passive: true, signal });
    soon();
  }
  /** The headings this list points at, in the order the page has them. An
      entry pointing anywhere but at this page is a link and not a place in it,
      and is left out of the reading rather than made a target of. */
  marks() {
    const found = [];
    for (const entry of this.entries.flatMap(branch)) {
      const href = entry.href ?? "";
      if (href.length < 2 || !href.startsWith("#")) continue;
      const node = document.getElementById(decodeURIComponent(href.slice(1)));
      if (node) found.push({ href, node });
    }
    return found;
  }
  /** What is moving the headings: the nearest ancestor that scrolls, and the
      page where none does. A pane with a scrollbar of its own is where the
      reading is happening, and the top of the window is not on it. */
  scroller(node) {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }
  /** Where a heading jumped to comes to rest: the top of the scroller, plus
      the offset it keeps for whatever stands over it — `scroll-padding-top`,
      which is how the bar is answered for every target on the page at once.
      Measured against that line, the entry a press marks is the entry the
      scroll marks. */
  line(box) {
    const page = box === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box).scrollPaddingTop);
    const top = page ? 0 : box.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }
  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it, and the list would mark the section above while
      the reader is looking at the last one. Nothing to scroll is no foot to
      arrive at, every section being in view at once. */
  ended(box) {
    const rest = box.scrollHeight - box.clientHeight;
    return rest > 2 && rest - box.scrollTop < 2;
  }
  /** Which section the reader is in: the last heading that has passed the
      line, and none while none has — a page opens above its first heading, and
      a list marking something there answers a question nobody asked. */
  read() {
    const marks = this.marks();
    const first = marks[0];
    if (!first) return;
    const box = this.scroller(first.node);
    const line = this.line(box);
    let at = "";
    for (const mark of marks) {
      if (mark.node.getBoundingClientRect().top > line) break;
      at = mark.href;
    }
    this.at = this.ended(box) ? marks[marks.length - 1].href : at;
  }
  /** The entry the reader is in. The page wins once it has been read, and the
      data is what a card, a story and a server-rendered page have instead. */
  isCurrent(entry) {
    return this.at ? entry.href === this.at : Boolean(entry.current);
  }
  list(entries) {
    return html42`<ul class="sds-toc__list">
  ${lines(entries.map((entry) => this.row(entry)), 2)}
</ul>`;
  }
  /** One section, and whatever hangs under it. `aria-current="location"` and
      not `page`: every entry here is the page, and what is marked is the part
      of it the reader is at. */
  row(entry) {
    const here = this.isCurrent(entry);
    const under = entry.items ?? [];
    return html42`<li>
  <a
    class="${here ? "sds-toc__item is-active" : "sds-toc__item"}"
    href="${entry.href ?? "#"}"
    aria-current="${here ? "location" : nothing24}"
  >${entry.label}</a>
  ${under.length ? this.list(under) : nothing24}
</li>`;
  }
  render() {
    const label = this.label || HEADING;
    return html42`<nav class="sds-toc" aria-label="${label}">
  <p class="sds-label">${label}</p>
  ${this.list(this.entries)}
</nav>`;
  }
};
define("sds-nav-toc", SdsNavToc);

// packages/frontend/src/components/footer.ts
import { html as html43 } from "lit";
var SdsFooter = class _SdsFooter extends SdsElement {
  static {
    this.properties = {
      groups: { type: Array },
      note: { type: String },
      version: { type: String },
      product: { type: String },
      signet: { type: String },
      brand: { type: String },
      copyright: { type: String },
      meta: { type: Array },
      marks: { type: Array }
    };
  }
  constructor() {
    super();
    this.groups = [];
    this.note = "";
    this.version = "";
    this.product = "";
    this.signet = "";
    this.brand = "";
    this.copyright = "";
    this.meta = [];
    this.marks = [];
  }
  static link(item) {
    return item.icon ? html43`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : html43`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}"></sds-link>`;
  }
  /* What a column names, where that is a page. Not `sds-link`: the heading
     keeps the label's register and the label's colour, and at the links' it
     reads as the first entry of the list it names. The trail above a heading
     is written the same way and for the same reason — see `.sds-crumbs a`. */
  static heading(group) {
    return group.href ? html43`<a class="sds-label sds-footer__heading" href="${group.href}">${group.label}</a>` : html43`<div class="sds-label">${group.label}</div>`;
  }
  /* A mark, at the end of the line where marks are looked for: the glyph
     alone, at the size a mark is read at, named for whoever cannot see it.
     One with no glyph in the set is the labelled link it always was — the
     alternative is an account nobody can reach. */
  static mark(item) {
    return item.icon ? html43`<sds-link bare label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : _SdsFooter.link(item);
  }
  /* The mark and the name, in the lockup the bar draws — one construction, so
     the two ends of a site cannot say the name two ways. The mark is hidden
     from a reader who cannot see it rather than announced: the wordmark beside
     it already spells what it says. */
  lockup() {
    if (!this.signet && !this.product) return "";
    return html43`<span class="sds-lockup">
      ${this.signet ? html43`<sds-image class="sds-signet" src="${this.signet}" alt="" width="24" height="24"></sds-image>` : ""}
      ${this.product ? html43`<span class="sds-wordmark">${this.brand ? html43`<span class="sds-wordmark__brand">${this.brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${this.product}</span>` : html43`${this.product}`}</span>` : ""}
    </span>`;
  }
  render() {
    const brand = this.lockup();
    const said = brand || this.note ? html43`<div class="sds-footer__brand">
      ${brand}
      ${this.note ? html43`<p class="sds-footer__note">${this.note}</p>` : ""}
    </div>` : "";
    const closing = this.copyright || this.version || this.meta.length || this.marks.length;
    const top = said || this.groups.length;
    return html43`<footer class="sds-footer">
  ${top ? html43`<div class="sds-footer__top">
    ${said}
    ${this.groups.length ? html43`<div class="sds-footer__groups">
      ${this.groups.map(
      (group) => html43`<div class="sds-footer__group">
        ${_SdsFooter.heading(group)}
        <div class="sds-footer__links">
          ${group.items.map((item) => _SdsFooter.link(item))}
        </div>
      </div>`
    )}
    </div>` : ""}
  </div>` : ""}
  ${closing ? html43`<div class="sds-footer__end">
    ${this.copyright ? html43`<span>${this.copyright}</span>` : ""}
    ${this.version ? html43`<span class="sds-mono">${this.version}</span>` : ""}
    ${this.meta.map((item) => _SdsFooter.link(item))}
    ${this.marks.length ? html43`<span class="sds-footer__marks">${this.marks.map((item) => _SdsFooter.mark(item))}</span>` : ""}
  </div>` : ""}
</footer>`;
  }
};
define("sds-footer", SdsFooter);

// packages/frontend/src/components/surface.ts
import { html as html44, nothing as nothing25 } from "lit";
var PLANE = {
  plain: "sds-plane",
  raised: "sds-panel",
  sunken: "sds-sunken"
};
var SdsSurface = class extends SdsElement {
  constructor() {
    super();
    /* The statement, where it was written between the tags. A plane on a product
       surface holds a sentence somebody composed, which fits in a property; one
       in a document holds whatever the passage was — paragraphs, a list, a block
       of its own — and that is markup or it is nothing. */
    this.taken = null;
    this.plane = "raised";
    this.label = "";
    this.heading = "";
    this.body = "";
    this.boxStyle = "";
  }
  static {
    this.properties = {
      plane: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
      heading: { type: String },
      body: { type: String },
      /* Layout for the plane itself, which is the box that draws the frame — a
         style on the element sizes the block around it instead. */
      boxStyle: { type: String, attribute: "box-style" }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const label = this.label ? html44`<div class="sds-label">${this.label}</div>` : void 0;
    const icon = this.icon ? html44`<div class="sds-surface-icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : void 0;
    return html44`<div class="${PLANE[this.plane] ?? PLANE.raised}" style="${this.boxStyle || nothing25}">
  ${icon}
  ${label}
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.taken ?? this.content ?? this.body}</div>
</div>`;
  }
};
define("sds-surface", SdsSurface);

// packages/frontend/src/components/stat.ts
import { html as html45 } from "lit";
var NNBSP = "\u202F";
var NBSP = "\xA0";
var SdsStat = class extends SdsElement {
  constructor() {
    super();
    /* The bound as a caller wrote it between the tags, taken before Lit renders
       over it. A sentence fits in the property; out of a document the same
       sentence carries a link, and that is what an attribute cannot hold. */
    this.taken = null;
    this.value = "";
    this.unit = "";
    this.label = "";
    this.of = "";
    this.note = "";
  }
  static {
    this.properties = {
      value: { type: String },
      unit: { type: String },
      label: { type: String },
      of: { type: String },
      icon: { type: String },
      note: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const bound = this.taken ?? this.content ?? (this.note || void 0);
    return html45`<div class="sds-stat">
  <div class="sds-stat__value">${this.icon ? html45`<span class="sds-stat__icon"><sds-icon name="${this.icon}" size="24"></sds-icon></span>` : ""}${this.value}${this.unit ? html45`<span class="sds-stat__unit">${NNBSP}${this.unit}</span>` : ""}${this.of ? html45`<span class="sds-stat__unit">${NBSP}of${NBSP}${this.of}</span>` : ""}</div>
  <div class="sds-label">${this.label}</div>
  ${bound ? html45`<div class="sds-stat__note">${bound}</div>` : ""}
</div>`;
  }
};
define("sds-stat", SdsStat);

// packages/frontend/src/components/figure.ts
import { html as html46 } from "lit";
var isCaption = (node) => node.nodeType === 1 && node.matches(".sds-figure__caption");
var isNothing = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
var SdsFigure = class extends SdsElement {
  constructor() {
    super();
    /* The picture a renderer wrote, taken before Lit renders over it. `src` is
       the form a story or a product surface uses; a renderer writing HTML cannot,
       because the picture has to be on the page before any script runs or a
       reader gets a caption under an empty frame. Kept exactly as `sds-code`
       keeps a block that arrived coloured. */
    this.taken = null;
    /* And its caption, where that was written between the tags too: a caption
       from a document carries markup — a literal, a link, an emphasis — and an
       attribute is a string. */
    this.captioned = null;
    this.src = "";
    this.alt = "";
    this.caption = "";
    this.zoomable = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      width: { type: Number },
      height: { type: Number },
      zoomable: { type: Boolean, reflect: true }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isNothing(node));
    const caption = written.filter(isCaption);
    const picture = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (picture.length) this.taken = picture;
    super.connectedCallback();
  }
  render() {
    const given = this.taken ?? this.content;
    const picture = given ? html46`${given}` : art(this.src, this.alt, { width: this.width, height: this.height });
    const press = this.zoomable ? zoom(this, picture, {
      src: this.src,
      alt: this.alt,
      caption: typeof this.caption === "string" ? this.caption : ""
    }) : null;
    const caption = this.captioned ? html46`${this.captioned}` : this.caption ? html46`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : "";
    return html46`<figure class="sds-figure">
  <div class="sds-figure__frame${exported(this.src) ? " sds-figure__frame--exported" : ""}">
    ${press ? press.trigger : picture}
  </div>
  ${caption}
  ${press ? press.viewer : ""}
</figure>`;
  }
};
define("sds-figure", SdsFigure);

// packages/frontend/src/components/embed.ts
import { html as html47, nothing as nothing26 } from "lit";
var isCaption2 = (node) => node.nodeType === 1 && node.matches(".sds-embed__caption");
var isNothing2 = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
var SdsEmbed = class extends SdsElement {
  constructor() {
    super();
    /* The frame a renderer wrote, taken before Lit renders over it. */
    this.taken = null;
    /* And its caption, where that was written between the tags too. Kept apart
       from `taken`, which everything else here reads as the frame itself. */
    this.captioned = null;
    this.src = "";
    this.label = "";
    this.ratio = "";
    this.width = 0;
    this.height = 0;
    this.caption = "";
    this.allow = "";
    this.allowfullscreen = false;
  }
  static {
    this.properties = {
      src: { type: String },
      label: { type: String },
      ratio: { type: String },
      width: { type: Number },
      height: { type: Number },
      caption: { type: String },
      allow: { type: String },
      allowfullscreen: { type: Boolean }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isNothing2(node));
    const caption = written.filter(isCaption2);
    const framed = written.filter((node) => !isCaption2(node));
    if (caption.length) this.captioned = caption;
    if (framed.length) this.taken = framed;
    super.connectedCallback();
  }
  /** Whether the frame is the size it was made for rather than the column's. A
      size alone says fixed; a ratio beside it is the answer that means "fill
      the column", so it wins and the size is what the document is asked for. */
  get fixed() {
    return !this.ratio && this.width > 0 && this.height > 0;
  }
  /** What goes in the frame: the node a renderer wrote, or the iframe this
      writes when nobody did. Not lazy, deliberately — an embed is the evidence
      on the page, and one that loads on scroll is blank in every screenshot. */
  get framed() {
    if (this.taken ?? this.content) return this.taken ?? this.content;
    if (!this.src) return nothing26;
    const size = this.fixed ? `width:${this.width}px;height:${this.height}px` : nothing26;
    return html47`<iframe src="${this.src}" title="${this.label || nothing26}" style="${size}" allow="${this.allow || nothing26}" ?allowfullscreen="${this.allowfullscreen}"></iframe>`;
  }
  render() {
    const shape = this.fixed ? "sds-embed__frame--fixed" : "sds-embed__frame--fluid";
    const style = this.fixed ? nothing26 : `aspect-ratio:${this.ratio || "16 / 9"}`;
    const caption = this.captioned ? html47`${this.captioned}` : this.caption ? html47`<div class="sds-embed__caption">${this.caption}</div>` : void 0;
    return html47`<div class="sds-embed">
  <div class="sds-embed__frame ${shape}" style="${style}" tabindex="${this.fixed ? "0" : nothing26}">${this.framed}</div>
  ${caption}
</div>`;
  }
};
define("sds-embed", SdsEmbed);

// packages/frontend/src/components/modal.ts
import { html as html48 } from "lit";
var SdsModal = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      /** Rendered buttons. Ghost first, primary last — the destructive-free
          order the rest of the system reads in. */
      actions: { type: Array },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
  }
  render() {
    return html48`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <span style="color:var(--text-muted);"><sds-icon name="actions-close"></sds-icon></span>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
};
define("sds-modal", SdsModal);

// packages/frontend/src/components/dialog.ts
import { html as html49 } from "lit";
var SdsDialog = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      actions: { type: Array },
      width: { type: Number, reflect: true },
      open: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
    this.open = false;
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  /** Open it modally: the platform makes the rest of the page inert, moves
      the focus in, and traps it until this closes. */
  show() {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
    });
  }
  close() {
    this.dialog?.close();
    this.open = false;
  }
  updated() {
    const el = this.dialog;
    if (!el) return;
    if (!this.isConnected) return;
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  render() {
    return html49`<dialog
      class="sds-modal"
      style="width:${this.width}px"
      aria-label="${this.heading}"
      @close="${() => {
      this.open = false;
    }}"
    >
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</dialog>`;
  }
};
define("sds-dialog", SdsDialog);

// packages/frontend/src/components/table.ts
import { html as html50, nothing as nothing27 } from "lit";
var SdsTable = class extends SdsElement {
  constructor() {
    super();
    /* The table a document wrote, taken before Lit renders over it. A cell there
       carries a link, a literal, an emphasis — none of which survives a JSON
       attribute — and `colspan`, `rowspan` and a caption have no property at
       all. What is handed over is the table's own children, so the element still
       draws the `<table>` and still decides its density. A `<thead>` outside a
       `<table>` is dropped by the parser, so those children reach here from a
       `<template>` or a property and never from markup typed into a page. */
    this.taken = null;
    this.density = "medium";
    this.scrollable = false;
    this.width = "";
    this.columns = [];
    this.rows = [];
  }
  static {
    this.properties = {
      density: { type: String, reflect: true },
      scrollable: { type: Boolean, reflect: true },
      width: { type: String },
      columns: { type: Array },
      rows: { type: Array }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  cell(value, cls) {
    return cls ? html50`<td class="${cls}">${value}</td>` : html50`<td>${value}</td>`;
  }
  bodyRow(row) {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    return html50`<tr class="${row.selected ? "is-selected" : nothing27}" style="${row.style ?? nothing27}">
      ${cells}
    </tr>`;
  }
  render() {
    const cls = `sds-table sds-table--${this.density}`;
    const style = this.width ? `width: ${this.width}` : nothing27;
    const given = this.taken ?? this.content;
    const table = given ? html50`<table class="${cls}" style="${style}">${given}</table>` : html50`<table class="${cls}" style="${style}">
  <thead><tr>
    ${lines(this.columns.map((c) => html50`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
    return this.scrollable ? html50`<div class="sds-table-scroll">${table}</div>` : table;
  }
};
define("sds-table", SdsTable);

// packages/frontend/src/components/card.ts
import { html as html51 } from "lit";
var SdsCard = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it.
       The one thing about a card an attribute cannot hold: out of a document the
       body is paragraphs, and often a list beside them. */
    this.taken = null;
    this.heading = "";
    this.body = "";
    this.href = "";
    this.src = "";
    this.alt = "";
    this.label = "";
    this.tag = "";
    this.footer = "";
    this.action = "";
  }
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      href: { type: String },
      src: { type: String },
      alt: { type: String },
      label: { type: String },
      tag: { type: String },
      icon: { type: String },
      footer: { type: String },
      action: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const medium = this.src ? html51`<div class="sds-card__media${exported(this.src) ? " sds-card__media--exported" : ""}">
    ${art(this.src, this.alt)}
  </div>` : "";
    const icon = this.icon ? html51`<div class="sds-card__icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : "";
    const label = this.tag || this.label ? html51`<div class="sds-row">
      ${this.tag ? html51`<sds-badge label="${this.tag}"></sds-badge>` : ""}
      ${this.label ? html51`<span class="sds-label">${this.label}</span>` : ""}
    </div>` : "";
    const written = this.taken ?? this.content;
    const blocks = written ?? (typeof this.body === "string" ? void 0 : this.body);
    const text = blocks ? html51`<div class="sds-card__text">${blocks}</div>` : html51`<p class="sds-card__text">${this.body}</p>`;
    const named = this.href ? html51`<a href="${this.href}">${this.heading}</a>` : html51`${this.heading}`;
    const title = this.heading ? html51`<h3 class="sds-card__title">${named}</h3>` : "";
    const action = this.action && this.href ? html51`<span class="sds-card__action">${this.action}<sds-icon name="actions-arrow-right" size="16"></sds-icon></span>` : "";
    const foot = this.footer || action ? html51`<div class="sds-card__foot">
    ${this.footer ? html51`<span class="sds-card__note">${this.footer}</span>` : ""}
    ${action}
  </div>` : "";
    return html51`<article class="sds-card">
  ${medium}
  <div class="sds-card__body">
    ${icon}
    ${label}
    ${title}
    ${text}
  </div>
  ${foot}
</article>`;
  }
};
define("sds-card", SdsCard);

// packages/frontend/src/components/icon-tile.ts
import { html as html52, nothing as nothing28 } from "lit";
var DRAWN = 32;
var SdsIconTile = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      caption: { type: String },
      href: { type: String },
      tag: { type: String }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.href = "";
    this.tag = "";
  }
  render() {
    const glyph = this.name ? html52`<sds-icon name="${this.name}" size="${DRAWN}"></sds-icon>` : nothing28;
    const inside = html52`<span class="sds-icon-tile__art">
    ${glyph}
  </span>
  <span class="sds-icon-tile__name">${this.caption || this.name}</span>
  ${this.tag ? html52`<span class="sds-icon-tile__tag">${this.tag}</span>` : nothing28}`;
    return this.href ? html52`<a class="sds-icon-tile" href="${this.href}">
  ${inside}
</a>` : html52`<div class="sds-icon-tile">
  ${inside}
</div>`;
  }
};
define("sds-icon-tile", SdsIconTile);

// packages/frontend/src/components/swatch.ts
import { html as html53, nothing as nothing29 } from "lit";
var COLOUR = /^(#[0-9a-f]{3,8}|(rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([^;{}]*\)|var\(--[\w-]+(,\s*[^;{}]*)?\)|[a-z]+)$/i;
var SdsSwatch = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      name: { type: String, reflect: true },
      resolved: { type: String },
      kind: { type: String, reflect: true }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.name = "";
    this.resolved = "";
    this.kind = "fill";
  }
  render() {
    const paint = COLOUR.test(this.value.trim()) ? this.value.trim() : "";
    const style = paint ? this.kind === "line" ? `border-color:${paint}` : `background:${paint}` : "";
    return html53`<div class="sds-swatch${this.kind === "line" ? " sds-swatch--line" : ""}">
  <span class="sds-swatch__chip" style="${style}" aria-hidden="true"></span>
  <span class="sds-swatch__body">
    <span class="sds-swatch__name">${this.name}</span>
    ${this.resolved ? html53`<span class="sds-swatch__value">${this.resolved}</span>` : nothing29}
  </span>
</div>`;
  }
};
define("sds-swatch", SdsSwatch);

// packages/frontend/src/components/grid.ts
import { html as html54, nothing as nothing30 } from "lit";
var VARIANT = {
  default: "",
  wide: "sds-grid--wide",
  dense: "sds-grid--dense",
  flush: "sds-grid--flush"
};
function evenColumns(count, fits) {
  for (let columns = Math.min(fits, count); columns > 1; columns--) {
    const rest = count % columns;
    if (rest === 0 || rest >= columns - 1) return columns;
  }
  return 1;
}
var SdsGrid = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it.
       Nothing else about the set is content: what an item is, is its own
       business, and the grid never reaches inside one. */
    this.taken = null;
    this.variant = "default";
    this.columns = 0;
  }
  static {
    this.properties = {
      variant: { type: String },
      /** The columns the last measurement settled on. Zero is "not measured",
          which renders the reflowing grid the stylesheet declares — the state a
          page arrives in and the only one a reader with no script ever sees. */
      columns: { type: Number, state: true }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.watch = new ResizeObserver(() => this.decide());
    if (this.parentElement) this.watch.observe(this.parentElement);
    void this.updateComplete.then(() => this.decide());
  }
  disconnectedCallback() {
    this.watch?.disconnect();
    super.disconnectedCallback();
  }
  /** What the sheet would draw, and what to draw instead.
  
        The minimum is read off the grid rather than repeated here: the three
        widths differ in exactly that number, and a copy of it in TypeScript is
        the copy that goes stale. */
  decide() {
    const grid = this.firstElementChild;
    if (!grid) return;
    const count = grid.childElementCount;
    if (count < 3) {
      this.columns = 0;
      return;
    }
    const style = getComputedStyle(grid);
    const min = parseFloat(style.getPropertyValue("--grid-min"));
    const gap = parseFloat(style.columnGap) || 0;
    const room = grid.getBoundingClientRect().width;
    if (!(min > 0) || !(room > 0)) return;
    const fits = Math.max(1, Math.floor((room + gap) / (min + gap)));
    const wanted = evenColumns(count, fits);
    this.columns = wanted >= fits ? 0 : wanted;
  }
  updated() {
    this.decide();
  }
  render() {
    const modifier = VARIANT[this.variant] ?? "";
    const columns = this.columns > 0 ? `grid-template-columns:repeat(${this.columns},minmax(0,1fr))` : nothing30;
    return html54`<div class="${modifier ? `sds-grid ${modifier}` : "sds-grid"}" style="${columns}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-grid", SdsGrid);

// packages/frontend/src/components/nav-pagination.ts
import { html as html55 } from "lit";
function pageHref(href, page) {
  return href.includes("{n}") ? href.replace(/\{n\}/g, String(page)) : `${href}${page}`;
}
var grouped = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, ",");
function pageCount(count, perPage) {
  return Math.max(1, Math.ceil(count / Math.max(1, perPage)));
}
function pageNumbers(pages, current) {
  const keep = /* @__PURE__ */ new Set();
  for (let i = 1; i <= pages; i++) {
    if (i <= 1 || i >= pages || Math.abs(i - current) <= 1) keep.add(i);
  }
  const out = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (last && n - last > 1) out.push(n - last === 2 ? last + 1 : 0);
    out.push(n);
    last = n;
  }
  return out;
}
var SdsNavPagination = class extends SdsElement {
  static {
    this.properties = {
      count: { type: Number },
      perPage: { type: Number, attribute: "per-page" },
      current: { type: Number, reflect: true },
      href: { type: String },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.count = 0;
    this.perPage = 10;
    this.current = 1;
    this.href = "#page-{n}";
    this.label = "";
  }
  /** What the row is drawn from, and the one place the division happens. */
  get pages() {
    return pageCount(this.count, this.perPage);
  }
  /** Say which page was asked for, and let the answer decide what the press
      does. Cancelable, because stopping the navigation is the only way a
      surface that pages in place can take the press over, and it is the same
      press either way. */
  ask(event, to) {
    const change = new CustomEvent("sds-change", {
      detail: { page: to },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(change);
    if (!change.defaultPrevented) return;
    event.preventDefault();
    this.current = to;
  }
  step(label, to, icon) {
    const off = to < 1 || to > this.pages;
    const cls = `sds-pagination__step${off ? " is-disabled" : ""}`;
    const glyph = html55`<sds-icon name="${icon}"></sds-icon>`;
    const inner = icon === "actions-chevron-start" ? html55`${glyph}${label}` : html55`${label}${glyph}`;
    return off ? html55`<span class="${cls}" aria-disabled="true">${inner}</span>` : html55`<a class="${cls}" href="${pageHref(this.href, to)}" rel="${icon === "actions-chevron-start" ? "prev" : "next"}" @click="${(event) => this.ask(event, to)}">${inner}</a>`;
  }
  render() {
    return html55`<nav class="sds-pagination" aria-label="Pages">
  ${this.step("Previous", this.current - 1, "actions-chevron-start")}
  ${pageNumbers(this.pages, this.current).map(
      (n) => n === 0 ? html55`<span class="sds-pagination__gap" aria-hidden="true">…</span>` : n === this.current ? html55`<span class="sds-pagination__page is-active" aria-current="page">${n}</span>` : html55`<a class="sds-pagination__page" href="${pageHref(this.href, n)}" @click="${(event) => this.ask(event, n)}">${n}</a>`
    )}
  ${this.step("Next", this.current + 1, "actions-chevron-end")}
  ${this.count > 0 ? html55`<span class="sds-pagination__count">${grouped(this.count)}${this.label ? ` ${this.label}` : ""}</span>` : ""}
</nav>`;
  }
};
define("sds-nav-pagination", SdsNavPagination);

// packages/frontend/src/components/nav-pager.ts
import { html as html56 } from "lit";
var SdsNavPager = class _SdsNavPager extends SdsElement {
  static {
    this.properties = {
      previousHref: { type: String, attribute: "previous-href" },
      previousLabel: { type: String, attribute: "previous-label" },
      nextHref: { type: String, attribute: "next-href" },
      nextLabel: { type: String, attribute: "next-label" },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.previousHref = "";
    this.previousLabel = "";
    this.nextHref = "";
    this.nextLabel = "";
    this.label = "Pages either side of this one";
  }
  /* `buttonMarkup` rather than `<sds-button>`, the way `sds-nav-pagination` draws
     its own steps: an element given children draws none of them outside a
     browser, and a link that goes somewhere has nothing to upgrade for. The
     markup is the button's own, exported from the button. */
  static step(href, body, rel) {
    return buttonMarkup({ variant: "secondary", href, rel }, body);
  }
  render() {
    const back = this.previousHref && this.previousLabel ? _SdsNavPager.step(
      this.previousHref,
      html56`<sds-icon name="actions-arrow-left" size="16" label="Previous page"></sds-icon>${buttonLabel(this.previousLabel)}`,
      "prev"
    ) : "";
    const on = this.nextHref && this.nextLabel ? _SdsNavPager.step(
      this.nextHref,
      html56`${buttonLabel(this.nextLabel)}<sds-icon name="actions-arrow-right" size="16" label="Next page"></sds-icon>`,
      "next"
    ) : "";
    return html56`<nav class="sds-pager" aria-label="${this.label}">
  ${back}
  ${on ? html56`<span class="sds-pager__next">${on}</span>` : ""}
</nav>`;
  }
};
define("sds-nav-pager", SdsNavPager);

// packages/frontend/src/components/code.ts
import { html as html57 } from "lit";
import { unsafeHTML as unsafeHTML4 } from "lit/directives/unsafe-html.js";

// node_modules/highlight.js/es/core.js
var import_core = __toESM(require_core(), 1);
var core_default = import_core.default;

// node_modules/highlight.js/es/languages/bash.js
function bash(hljs) {
  const regex = hljs.regex;
  const VAR = {};
  const BRACED_VAR = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [VAR]
      }
      // default values
    ]
  };
  Object.assign(VAR, {
    className: "variable",
    variants: [
      { begin: regex.concat(
        /\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        `(?![\\w\\d])(?![$])`
      ) },
      BRACED_VAR
    ]
  });
  const SUBST = {
    className: "subst",
    begin: /\$\(/,
    end: /\)/,
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  const COMMENT = hljs.inherit(
    hljs.COMMENT(),
    {
      match: [
        /(^|\s)/,
        /#.*$/
      ],
      scope: {
        2: "comment"
      }
    }
  );
  const HERE_DOC = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      hljs.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  };
  const QUOTE_STRING = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      SUBST
    ]
  };
  SUBST.contains.push(QUOTE_STRING);
  const ESCAPED_QUOTE = {
    match: /\\"/
  };
  const APOS_STRING = {
    className: "string",
    begin: /'/,
    end: /'/
  };
  const ESCAPED_APOS = {
    match: /\\'/
  };
  const ARITHMETIC = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      hljs.NUMBER_MODE,
      VAR
    ]
  };
  const SH_LIKE_SHELLS = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ];
  const KNOWN_SHEBANG = hljs.SHEBANG({
    binary: `(${SH_LIKE_SHELLS.join("|")})`,
    relevance: 10
  });
  const FUNCTION = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: true,
    contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  };
  const KEYWORDS3 = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "time",
    "for",
    "while",
    "until",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "coproc",
    "function",
    "select"
  ];
  const LITERALS3 = [
    "true",
    "false"
  ];
  const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
  const SHELL_BUILT_INS = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ];
  const BASH_BUILT_INS = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "sudo",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ];
  const ZSH_BUILT_INS = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ];
  const GNU_CORE_UTILS = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];
  return {
    name: "Bash",
    aliases: [
      "sh",
      "zsh"
    ],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: KEYWORDS3,
      literal: LITERALS3,
      built_in: [
        ...SHELL_BUILT_INS,
        ...BASH_BUILT_INS,
        // Shell modifiers
        "set",
        "shopt",
        ...ZSH_BUILT_INS,
        ...GNU_CORE_UTILS
      ]
    },
    contains: [
      KNOWN_SHEBANG,
      // to catch known shells and boost relevancy
      hljs.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      FUNCTION,
      ARITHMETIC,
      COMMENT,
      HERE_DOC,
      PATH_MODE,
      QUOTE_STRING,
      ESCAPED_QUOTE,
      APOS_STRING,
      ESCAPED_APOS,
      VAR
    ]
  };
}

// node_modules/highlight.js/es/languages/css.js
var MODES = (hljs) => {
  return {
    IMPORTANT: {
      scope: "meta",
      begin: "!important"
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z_][A-Za-z0-9_-]*/
    }
  };
};
var HTML_TAGS = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "optgroup",
  "option",
  "p",
  "picture",
  "q",
  "quote",
  "samp",
  "section",
  "select",
  "source",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
];
var SVG_TAGS = [
  "defs",
  "g",
  "marker",
  "mask",
  "pattern",
  "svg",
  "switch",
  "symbol",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feFlood",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMorphology",
  "feOffset",
  "feSpecularLighting",
  "feTile",
  "feTurbulence",
  "linearGradient",
  "radialGradient",
  "stop",
  "circle",
  "ellipse",
  "image",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "text",
  "use",
  "textPath",
  "tspan",
  "foreignObject",
  "clipPath"
];
var TAGS = [
  ...HTML_TAGS,
  ...SVG_TAGS
];
var MEDIA_FEATURES = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  // TODO: find a better solution?
  "min-width",
  "max-width",
  "min-height",
  "max-height"
].sort().reverse();
var PSEUDO_CLASSES = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  // dir()
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  // has()
  "host",
  // host or host()
  "host-context",
  // host-context()
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  // is()
  "lang",
  // lang()
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  // not()
  "nth-child",
  // nth-child()
  "nth-col",
  // nth-col()
  "nth-last-child",
  // nth-last-child()
  "nth-last-col",
  // nth-last-col()
  "nth-last-of-type",
  //nth-last-of-type()
  "nth-of-type",
  //nth-of-type()
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
  // where()
].sort().reverse();
var PSEUDO_ELEMENTS = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
].sort().reverse();
var ATTRIBUTES = [
  "accent-color",
  "align-content",
  "align-items",
  "align-self",
  "alignment-baseline",
  "all",
  "anchor-name",
  "animation",
  "animation-composition",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-range",
  "animation-range-end",
  "animation-range-start",
  "animation-timeline",
  "animation-timing-function",
  "appearance",
  "aspect-ratio",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "baseline-shift",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-align",
  "box-decoration-break",
  "box-direction",
  "box-flex",
  "box-flex-group",
  "box-lines",
  "box-ordinal-group",
  "box-orient",
  "box-pack",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "contain-intrinsic-block-size",
  "contain-intrinsic-height",
  "contain-intrinsic-inline-size",
  "contain-intrinsic-size",
  "contain-intrinsic-width",
  "container",
  "container-name",
  "container-type",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "counter-set",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "cx",
  "cy",
  "direction",
  "display",
  "dominant-baseline",
  "empty-cells",
  "enable-background",
  "field-sizing",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flood-color",
  "flood-opacity",
  "flow",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-optical-sizing",
  "font-palette",
  "font-size",
  "font-size-adjust",
  "font-smooth",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-synthesis-position",
  "font-synthesis-small-caps",
  "font-synthesis-style",
  "font-synthesis-weight",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-emoji",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "forced-color-adjust",
  "gap",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphenate-character",
  "hyphenate-limit-chars",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "initial-letter",
  "initial-letter-align",
  "inline-size",
  "inset",
  "inset-area",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "kerning",
  "left",
  "letter-spacing",
  "lighting-color",
  "line-break",
  "line-height",
  "line-height-step",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-trim",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "masonry-auto-flow",
  "math-depth",
  "math-shift",
  "math-style",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-margin",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overlay",
  "overscroll-behavior",
  "overscroll-behavior-block",
  "overscroll-behavior-inline",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "paint-order",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  "pointer-events",
  "position",
  "position-anchor",
  "position-visibility",
  "print-color-adjust",
  "quotes",
  "r",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "rotate",
  "row-gap",
  "ruby-align",
  "ruby-position",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scroll-timeline",
  "scroll-timeline-axis",
  "scroll-timeline-name",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "shape-rendering",
  "speak",
  "speak-as",
  "src",
  // @font-face
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-anchor",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "text-wrap",
  "text-wrap-mode",
  "text-wrap-style",
  "timeline-scope",
  "top",
  "touch-action",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-behavior",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-modify",
  "user-select",
  "vector-effect",
  "vertical-align",
  "view-timeline",
  "view-timeline-axis",
  "view-timeline-inset",
  "view-timeline-name",
  "view-transition-name",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "white-space-collapse",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "x",
  "y",
  "z-index",
  "zoom"
].sort().reverse();
function css(hljs) {
  const regex = hljs.regex;
  const modes = MODES(hljs);
  const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
  const AT_MODIFIERS = "and or not only";
  const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const STRINGS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ];
  return {
    name: "CSS",
    case_insensitive: true,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      // for visual continuity with `tag {}` and because we
      // don't have a great class for this?
      keyframePosition: "selector-tag"
    },
    contains: [
      modes.BLOCK_COMMENT,
      VENDOR_PREFIX,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + IDENT_RE3,
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
          { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          modes.BLOCK_COMMENT,
          modes.HEXCOLOR,
          modes.IMPORTANT,
          modes.CSS_NUMBER_MODE,
          ...STRINGS,
          // needed to highlight these as strings and to avoid issues with
          // illegal characters that might be inside urls that would tigger the
          // languages illegal stack
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            // from keywords
            keywords: { built_in: "url data-uri" },
            contains: [
              ...STRINGS,
              {
                className: "string",
                // any character other than `)` as in `url()` will be the start
                // of a string, which ends with `)` (from the parent mode)
                begin: /[^)]/,
                endsWithParent: true,
                excludeEnd: true
              }
            ]
          },
          modes.FUNCTION_DISPATCH
        ]
      },
      {
        begin: regex.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        // break on Less variables @var: ...
        contains: [
          {
            className: "keyword",
            begin: AT_PROPERTY_RE
          },
          {
            begin: /\s/,
            endsWithParent: true,
            excludeEnd: true,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: AT_MODIFIERS,
              attribute: MEDIA_FEATURES.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...STRINGS,
              modes.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS.join("|") + ")\\b"
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/diff.js
function diff(hljs) {
  const regex = hljs.regex;
  return {
    name: "Diff",
    aliases: ["patch"],
    contains: [
      {
        className: "meta",
        relevance: 10,
        match: regex.either(
          /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
          /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
          /^--- +\d+,\d+ +----$/
        )
      },
      {
        className: "comment",
        variants: [
          {
            begin: regex.either(
              /Index: /,
              /^index/,
              /={3,}/,
              /^-{3}/,
              /^\*{3} /,
              /^\+{3}/,
              /^diff --git/
            ),
            end: /$/
          },
          { match: /^\*{15}$/ }
        ]
      },
      {
        className: "addition",
        begin: /^\+/,
        end: /$/
      },
      {
        className: "deletion",
        begin: /^-/,
        end: /$/
      },
      {
        className: "addition",
        begin: /^!/,
        end: /$/
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/javascript.js
var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
var KEYWORDS = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends",
  // It's reached stage 3, which is "recommended for implementation":
  "using"
];
var LITERALS = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var TYPES = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];
var ERROR_TYPES = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var BUILT_IN_GLOBALS = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var BUILT_IN_VARIABLES = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
];
var BUILT_INS = [].concat(
  BUILT_IN_GLOBALS,
  TYPES,
  ERROR_TYPES
);
function javascript(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      IDENT_RE$1,
      regex.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        scope: "attr",
        match: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/json.js
function json(hljs) {
  const ATTRIBUTE = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS3 = [
    "true",
    "false",
    "null"
  ];
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS3.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: LITERALS3
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}

// node_modules/highlight.js/es/languages/markdown.js
function markdown(hljs) {
  const regex = hljs.regex;
  const INLINE_HTML = {
    begin: /<\/?[A-Za-z_]/,
    end: ">",
    subLanguage: "xml",
    relevance: 0
  };
  const HORIZONTAL_RULE = {
    begin: "^[-\\*]{3,}",
    end: "$"
  };
  const CODE = {
    className: "code",
    variants: [
      // TODO: fix to allow these to work with sublanguage also
      { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
      { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
      // needed to allow markdown as a sublanguage to work
      {
        begin: "```",
        end: "```+[ ]*$"
      },
      {
        begin: "~~~",
        end: "~~~+[ ]*$"
      },
      { begin: "`.+?`" },
      {
        begin: "(?=^( {4}|\\t))",
        // use contains to gobble up multiple lines to allow the block to be whatever size
        // but only have a single open/close tag vs one per line
        contains: [
          {
            begin: "^( {4}|\\t)",
            end: "(\\n)$"
          }
        ],
        relevance: 0
      }
    ]
  };
  const LIST = {
    className: "bullet",
    begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
    end: "\\s+",
    excludeEnd: true
  };
  const LINK_REFERENCE = {
    begin: /^\[[^\n]+\]:/,
    returnBegin: true,
    contains: [
      {
        className: "symbol",
        begin: /\[/,
        end: /\]/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "link",
        begin: /:\s*/,
        end: /$/,
        excludeBegin: true
      }
    ]
  };
  const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
  const LINK = {
    variants: [
      // too much like nested array access in so many languages
      // to have any real relevance
      {
        begin: /\[.+?\]\[.*?\]/,
        relevance: 0
      },
      // popular internet URLs
      {
        begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
        relevance: 2
      },
      {
        begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
        relevance: 2
      },
      // relative urls
      {
        begin: /\[.+?\]\([./?&#].*?\)/,
        relevance: 1
      },
      // whatever else, lower relevance (might not be a link at all)
      {
        begin: /\[.*?\]\(.*?\)/,
        relevance: 0
      }
    ],
    returnBegin: true,
    contains: [
      {
        // empty strings for alt or link text
        match: /\[(?=\])/
      },
      {
        className: "string",
        relevance: 0,
        begin: "\\[",
        end: "\\]",
        excludeBegin: true,
        returnEnd: true
      },
      {
        className: "link",
        relevance: 0,
        begin: "\\]\\(",
        end: "\\)",
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "symbol",
        relevance: 0,
        begin: "\\]\\[",
        end: "\\]",
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
  const BOLD = {
    className: "strong",
    contains: [],
    // defined later
    variants: [
      {
        begin: /_{2}(?!\s)/,
        end: /_{2}/
      },
      {
        begin: /\*{2}(?!\s)/,
        end: /\*{2}/
      }
    ]
  };
  const ITALIC = {
    className: "emphasis",
    contains: [],
    // defined later
    variants: [
      {
        begin: /\*(?![*\s])/,
        end: /\*/
      },
      {
        begin: /_(?![_\s])/,
        end: /_/,
        relevance: 0
      }
    ]
  };
  const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
  const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
  BOLD.contains.push(ITALIC_WITHOUT_BOLD);
  ITALIC.contains.push(BOLD_WITHOUT_ITALIC);
  let CONTAINABLE = [
    INLINE_HTML,
    LINK
  ];
  [
    BOLD,
    ITALIC,
    BOLD_WITHOUT_ITALIC,
    ITALIC_WITHOUT_BOLD
  ].forEach((m) => {
    m.contains = m.contains.concat(CONTAINABLE);
  });
  CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
  const HEADER = {
    className: "section",
    variants: [
      {
        begin: "^#{1,6}",
        end: "$",
        contains: CONTAINABLE
      },
      {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [
          { begin: "^[=-]*$" },
          {
            begin: "^",
            end: "\\n",
            contains: CONTAINABLE
          }
        ]
      }
    ]
  };
  const BLOCKQUOTE = {
    className: "quote",
    begin: "^>\\s+",
    contains: CONTAINABLE,
    end: "$"
  };
  const ENTITY = {
    //https://spec.commonmark.org/0.31.2/#entity-references
    scope: "literal",
    match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
  };
  return {
    name: "Markdown",
    aliases: [
      "md",
      "mkdown",
      "mkd"
    ],
    contains: [
      HEADER,
      INLINE_HTML,
      LIST,
      BOLD,
      ITALIC,
      BLOCKQUOTE,
      CODE,
      HORIZONTAL_RULE,
      LINK,
      LINK_REFERENCE,
      ENTITY
    ]
  };
}

// node_modules/highlight.js/es/languages/php.js
function php(hljs) {
  const regex = hljs.regex;
  const NOT_PERL_ETC = /(?![A-Za-z0-9])(?![$])/;
  const IDENT_RE3 = regex.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    NOT_PERL_ETC
  );
  const PASCAL_CASE_CLASS_NAME_RE = regex.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    NOT_PERL_ETC
  );
  const UPCASE_NAME_RE = regex.concat(
    /[A-Z]+/,
    NOT_PERL_ETC
  );
  const VARIABLE = {
    scope: "variable",
    match: "\\$+" + IDENT_RE3
  };
  const PREPROCESSOR = {
    scope: "meta",
    variants: [
      { begin: /<\?php/, relevance: 10 },
      // boost for obvious PHP
      { begin: /<\?=/ },
      // less relevant per PSR-1 which says not to use short-tags
      { begin: /<\?/, relevance: 0.1 },
      { begin: /\?>/ }
      // end php tag
    ]
  };
  const SUBST = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  };
  const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null });
  const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
    illegal: null,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
  });
  const HEREDOC = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
    "on:begin": (m, resp) => {
      resp.data._beginMatch = m[1] || m[2];
    },
    "on:end": (m, resp) => {
      if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
    }
  };
  const NOWDOC = hljs.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  });
  const WHITESPACE = "[ 	\n]";
  const STRING = {
    scope: "string",
    variants: [
      DOUBLE_QUOTED,
      SINGLE_QUOTED,
      HEREDOC,
      NOWDOC
    ]
  };
  const NUMBER = {
    scope: "number",
    variants: [
      { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
      // Binary w/ underscore support
      { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
      // Octals w/ underscore support
      { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
      // Hex w/ underscore support
      // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
      { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
    ],
    relevance: 0
  };
  const LITERALS3 = [
    "false",
    "null",
    "true"
  ];
  const KWS = [
    // Magic constants:
    // <https://www.php.net/manual/en/language.constants.predefined.php>
    "__CLASS__",
    "__DIR__",
    "__FILE__",
    "__FUNCTION__",
    "__COMPILER_HALT_OFFSET__",
    "__LINE__",
    "__METHOD__",
    "__NAMESPACE__",
    "__TRAIT__",
    // Function that look like language construct or language construct that look like function:
    // List of keywords that may not require parenthesis
    "die",
    "echo",
    "exit",
    "include",
    "include_once",
    "print",
    "require",
    "require_once",
    // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
    // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
    // Other keywords:
    // <https://www.php.net/manual/en/reserved.php>
    // <https://www.php.net/manual/en/language.types.type-juggling.php>
    "array",
    "abstract",
    "and",
    "as",
    "binary",
    "bool",
    "boolean",
    "break",
    "callable",
    "case",
    "catch",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "double",
    "else",
    "elseif",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "enum",
    "eval",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "foreach",
    "from",
    "global",
    "goto",
    "if",
    "implements",
    "instanceof",
    "insteadof",
    "int",
    "integer",
    "interface",
    "isset",
    "iterable",
    "list",
    "match|0",
    "mixed",
    "new",
    "never",
    "object",
    "or",
    "private",
    "protected",
    "public",
    "readonly",
    "real",
    "return",
    "string",
    "switch",
    "throw",
    "trait",
    "try",
    "unset",
    "use",
    "var",
    "void",
    "while",
    "xor",
    "yield"
  ];
  const BUILT_INS3 = [
    // Standard PHP library:
    // <https://www.php.net/manual/en/book.spl.php>
    "Error|0",
    "AppendIterator",
    "ArgumentCountError",
    "ArithmeticError",
    "ArrayIterator",
    "ArrayObject",
    "AssertionError",
    "BadFunctionCallException",
    "BadMethodCallException",
    "CachingIterator",
    "CallbackFilterIterator",
    "CompileError",
    "Countable",
    "DirectoryIterator",
    "DivisionByZeroError",
    "DomainException",
    "EmptyIterator",
    "ErrorException",
    "Exception",
    "FilesystemIterator",
    "FilterIterator",
    "GlobIterator",
    "InfiniteIterator",
    "InvalidArgumentException",
    "IteratorIterator",
    "LengthException",
    "LimitIterator",
    "LogicException",
    "MultipleIterator",
    "NoRewindIterator",
    "OutOfBoundsException",
    "OutOfRangeException",
    "OuterIterator",
    "OverflowException",
    "ParentIterator",
    "ParseError",
    "RangeException",
    "RecursiveArrayIterator",
    "RecursiveCachingIterator",
    "RecursiveCallbackFilterIterator",
    "RecursiveDirectoryIterator",
    "RecursiveFilterIterator",
    "RecursiveIterator",
    "RecursiveIteratorIterator",
    "RecursiveRegexIterator",
    "RecursiveTreeIterator",
    "RegexIterator",
    "RuntimeException",
    "SeekableIterator",
    "SplDoublyLinkedList",
    "SplFileInfo",
    "SplFileObject",
    "SplFixedArray",
    "SplHeap",
    "SplMaxHeap",
    "SplMinHeap",
    "SplObjectStorage",
    "SplObserver",
    "SplPriorityQueue",
    "SplQueue",
    "SplStack",
    "SplSubject",
    "SplTempFileObject",
    "TypeError",
    "UnderflowException",
    "UnexpectedValueException",
    "UnhandledMatchError",
    // Reserved interfaces:
    // <https://www.php.net/manual/en/reserved.interfaces.php>
    "ArrayAccess",
    "BackedEnum",
    "Closure",
    "Fiber",
    "Generator",
    "Iterator",
    "IteratorAggregate",
    "Serializable",
    "Stringable",
    "Throwable",
    "Traversable",
    "UnitEnum",
    "WeakReference",
    "WeakMap",
    // Reserved classes:
    // <https://www.php.net/manual/en/reserved.classes.php>
    "Directory",
    "__PHP_Incomplete_Class",
    "parent",
    "php_user_filter",
    "self",
    "static",
    "stdClass"
  ];
  const dualCase = (items) => {
    const result = [];
    items.forEach((item) => {
      result.push(item);
      if (item.toLowerCase() === item) {
        result.push(item.toUpperCase());
      } else {
        result.push(item.toLowerCase());
      }
    });
    return result;
  };
  const KEYWORDS3 = {
    keyword: KWS,
    literal: dualCase(LITERALS3),
    built_in: BUILT_INS3
  };
  const normalizeKeywords = (items) => {
    return items.map((item) => {
      return item.replace(/\|\d+$/, "");
    });
  };
  const CONSTRUCTOR_CALL = { variants: [
    {
      match: [
        /new/,
        regex.concat(WHITESPACE, "+"),
        // to prevent built ins from being confused as the class constructor call
        regex.concat("(?!", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
        PASCAL_CASE_CLASS_NAME_RE
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] };
  const CONSTANT_REFERENCE = regex.concat(IDENT_RE3, "\\b(?!\\()");
  const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = { variants: [
    {
      match: [
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: { 2: "variable.constant" }
    },
    {
      match: [
        /::/,
        /class/
      ],
      scope: { 2: "variable.language" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: {
        1: "title.class",
        3: "variable.constant"
      }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          "::",
          regex.lookahead(/(?!class\b)/)
        )
      ],
      scope: { 1: "title.class" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        /::/,
        /class/
      ],
      scope: {
        1: "title.class",
        3: "variable.language"
      }
    }
  ] };
  const NAMED_ARGUMENT = {
    scope: "attr",
    match: regex.concat(IDENT_RE3, regex.lookahead(":"), regex.lookahead(/(?!::)/))
  };
  const PARAMS_MODE = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: KEYWORDS3,
    contains: [
      NAMED_ARGUMENT,
      VARIABLE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING,
      NUMBER,
      CONSTRUCTOR_CALL
    ]
  };
  const FUNCTION_INVOKE = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
      IDENT_RE3,
      regex.concat(WHITESPACE, "*"),
      regex.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [PARAMS_MODE]
  };
  PARAMS_MODE.contains.push(FUNCTION_INVOKE);
  const ATTRIBUTE_CONTAINS = [
    NAMED_ARGUMENT,
    LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
    hljs.C_BLOCK_COMMENT_MODE,
    STRING,
    NUMBER,
    CONSTRUCTOR_CALL
  ];
  const ATTRIBUTES3 = {
    begin: regex.concat(
      /#\[\s*\\?/,
      regex.either(
        PASCAL_CASE_CLASS_NAME_RE,
        UPCASE_NAME_RE
      )
    ),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: LITERALS3,
      keyword: [
        "new",
        "array"
      ]
    },
    contains: [
      {
        begin: /\[/,
        end: /]/,
        keywords: {
          literal: LITERALS3,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...ATTRIBUTE_CONTAINS
        ]
      },
      ...ATTRIBUTE_CONTAINS,
      {
        scope: "meta",
        variants: [
          { match: PASCAL_CASE_CLASS_NAME_RE },
          { match: UPCASE_NAME_RE }
        ]
      }
    ]
  };
  return {
    case_insensitive: false,
    keywords: KEYWORDS3,
    contains: [
      ATTRIBUTES3,
      hljs.HASH_COMMENT_MODE,
      hljs.COMMENT("//", "$"),
      hljs.COMMENT(
        "/\\*",
        "\\*/",
        { contains: [
          {
            scope: "doctag",
            match: "@[A-Za-z]+"
          }
        ] }
      ),
      {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: hljs.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: true
            }
          ]
        }
      },
      PREPROCESSOR,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      VARIABLE,
      FUNCTION_INVOKE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      {
        match: [
          /const/,
          /\s/,
          IDENT_RE3
        ],
        scope: {
          1: "keyword",
          3: "variable.constant"
        }
      },
      CONSTRUCTOR_CALL,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: true,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          hljs.UNDERSCORE_TITLE_MODE,
          {
            begin: "=>",
            // No markup, just a relevance booster
            endsParent: true
          },
          {
            scope: "params",
            begin: "\\(",
            end: "\\)",
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS3,
            contains: [
              "self",
              ATTRIBUTES3,
              VARIABLE,
              LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
              hljs.C_BLOCK_COMMENT_MODE,
              STRING,
              NUMBER
            ]
          }
        ]
      },
      {
        scope: "class",
        variants: [
          {
            beginKeywords: "enum",
            illegal: /[($"]/
          },
          {
            beginKeywords: "class interface trait",
            illegal: /[:($"]/
          }
        ],
        relevance: 0,
        end: /\{/,
        excludeEnd: true,
        contains: [
          { beginKeywords: "extends implements" },
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      // both use and namespace still use "old style" rules (vs multi-match)
      // because the namespace name can include `\` and we still want each
      // element to be treated as its own *individual* title
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
      },
      {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [
          // TODO: title.function vs title.class
          {
            match: /\b(as|const|function)\b/,
            scope: "keyword"
          },
          // TODO: could be title.class or title.function
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      STRING,
      NUMBER
    ]
  };
}

// node_modules/highlight.js/es/languages/plaintext.js
function plaintext(hljs) {
  return {
    name: "Plain text",
    aliases: [
      "text",
      "txt"
    ],
    disableAutodetect: true
  };
}

// node_modules/highlight.js/es/languages/scss.js
var MODES2 = (hljs) => {
  return {
    IMPORTANT: {
      scope: "meta",
      begin: "!important"
    },
    BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
    },
    FUNCTION_DISPATCH: {
      className: "built_in",
      begin: /[\w-]+(?=\()/
    },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    CSS_VARIABLE: {
      className: "attr",
      begin: /--[A-Za-z_][A-Za-z0-9_-]*/
    }
  };
};
var HTML_TAGS2 = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "optgroup",
  "option",
  "p",
  "picture",
  "q",
  "quote",
  "samp",
  "section",
  "select",
  "source",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
];
var SVG_TAGS2 = [
  "defs",
  "g",
  "marker",
  "mask",
  "pattern",
  "svg",
  "switch",
  "symbol",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feFlood",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMorphology",
  "feOffset",
  "feSpecularLighting",
  "feTile",
  "feTurbulence",
  "linearGradient",
  "radialGradient",
  "stop",
  "circle",
  "ellipse",
  "image",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "text",
  "use",
  "textPath",
  "tspan",
  "foreignObject",
  "clipPath"
];
var TAGS2 = [
  ...HTML_TAGS2,
  ...SVG_TAGS2
];
var MEDIA_FEATURES2 = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  // TODO: find a better solution?
  "min-width",
  "max-width",
  "min-height",
  "max-height"
].sort().reverse();
var PSEUDO_CLASSES2 = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  // dir()
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  // has()
  "host",
  // host or host()
  "host-context",
  // host-context()
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  // is()
  "lang",
  // lang()
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  // not()
  "nth-child",
  // nth-child()
  "nth-col",
  // nth-col()
  "nth-last-child",
  // nth-last-child()
  "nth-last-col",
  // nth-last-col()
  "nth-last-of-type",
  //nth-last-of-type()
  "nth-of-type",
  //nth-of-type()
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
  // where()
].sort().reverse();
var PSEUDO_ELEMENTS2 = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
].sort().reverse();
var ATTRIBUTES2 = [
  "accent-color",
  "align-content",
  "align-items",
  "align-self",
  "alignment-baseline",
  "all",
  "anchor-name",
  "animation",
  "animation-composition",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-range",
  "animation-range-end",
  "animation-range-start",
  "animation-timeline",
  "animation-timing-function",
  "appearance",
  "aspect-ratio",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "baseline-shift",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-align",
  "box-decoration-break",
  "box-direction",
  "box-flex",
  "box-flex-group",
  "box-lines",
  "box-ordinal-group",
  "box-orient",
  "box-pack",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "contain-intrinsic-block-size",
  "contain-intrinsic-height",
  "contain-intrinsic-inline-size",
  "contain-intrinsic-size",
  "contain-intrinsic-width",
  "container",
  "container-name",
  "container-type",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "counter-set",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "cx",
  "cy",
  "direction",
  "display",
  "dominant-baseline",
  "empty-cells",
  "enable-background",
  "field-sizing",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flood-color",
  "flood-opacity",
  "flow",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-optical-sizing",
  "font-palette",
  "font-size",
  "font-size-adjust",
  "font-smooth",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-synthesis-position",
  "font-synthesis-small-caps",
  "font-synthesis-style",
  "font-synthesis-weight",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-emoji",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "forced-color-adjust",
  "gap",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphenate-character",
  "hyphenate-limit-chars",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "initial-letter",
  "initial-letter-align",
  "inline-size",
  "inset",
  "inset-area",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "kerning",
  "left",
  "letter-spacing",
  "lighting-color",
  "line-break",
  "line-height",
  "line-height-step",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-trim",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "masonry-auto-flow",
  "math-depth",
  "math-shift",
  "math-style",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-margin",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overlay",
  "overscroll-behavior",
  "overscroll-behavior-block",
  "overscroll-behavior-inline",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "paint-order",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  "pointer-events",
  "position",
  "position-anchor",
  "position-visibility",
  "print-color-adjust",
  "quotes",
  "r",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "rotate",
  "row-gap",
  "ruby-align",
  "ruby-position",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scroll-timeline",
  "scroll-timeline-axis",
  "scroll-timeline-name",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "shape-rendering",
  "speak",
  "speak-as",
  "src",
  // @font-face
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-anchor",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "text-wrap",
  "text-wrap-mode",
  "text-wrap-style",
  "timeline-scope",
  "top",
  "touch-action",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-behavior",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-modify",
  "user-select",
  "vector-effect",
  "vertical-align",
  "view-timeline",
  "view-timeline-axis",
  "view-timeline-inset",
  "view-timeline-name",
  "view-transition-name",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "white-space-collapse",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "x",
  "y",
  "z-index",
  "zoom"
].sort().reverse();
function scss(hljs) {
  const modes = MODES2(hljs);
  const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS2;
  const PSEUDO_CLASSES$1 = PSEUDO_CLASSES2;
  const AT_IDENTIFIER = "@[a-z-]+";
  const AT_MODIFIERS = "and or not only";
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const VARIABLE = {
    className: "variable",
    begin: "(\\$" + IDENT_RE3 + ")\\b",
    relevance: 0
  };
  return {
    name: "SCSS",
    case_insensitive: true,
    illegal: "[=/|']",
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: "#[A-Za-z0-9_-]+",
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\.[A-Za-z0-9_-]+",
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS2.join("|") + ")\\b",
        // was there, before, but why?
        relevance: 0
      },
      {
        className: "selector-pseudo",
        begin: ":(" + PSEUDO_CLASSES$1.join("|") + ")"
      },
      {
        className: "selector-pseudo",
        begin: ":(:)?(" + PSEUDO_ELEMENTS$1.join("|") + ")"
      },
      VARIABLE,
      {
        // pseudo-selector params
        begin: /\(/,
        end: /\)/,
        contains: [modes.CSS_NUMBER_MODE]
      },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES2.join("|") + ")\\b"
      },
      { begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
      {
        begin: /:/,
        end: /[;}{]/,
        relevance: 0,
        contains: [
          modes.BLOCK_COMMENT,
          VARIABLE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.IMPORTANT,
          modes.FUNCTION_DISPATCH
        ]
      },
      // matching these here allows us to treat them more like regular CSS
      // rules so everything between the {} gets regular rule highlighting,
      // which is what we want for page and font-face
      {
        begin: "@(page|font-face)",
        keywords: {
          $pattern: AT_IDENTIFIER,
          keyword: "@page @font-face"
        }
      },
      {
        begin: "@",
        end: "[{;]",
        returnBegin: true,
        keywords: {
          $pattern: /[a-z-]+/,
          keyword: AT_MODIFIERS,
          attribute: MEDIA_FEATURES2.join(" ")
        },
        contains: [
          {
            begin: AT_IDENTIFIER,
            className: "keyword"
          },
          {
            begin: /[a-z-]+(?=:)/,
            className: "attribute"
          },
          VARIABLE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE
        ]
      },
      modes.FUNCTION_DISPATCH
    ]
  };
}

// node_modules/highlight.js/es/languages/sql.js
function sql(hljs) {
  const regex = hljs.regex;
  const COMMENT_MODE = hljs.COMMENT("--", "$");
  const STRING = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  };
  const QUOTED_IDENTIFIER = {
    begin: /"/,
    end: /"/,
    contains: [{ match: /""/ }]
  };
  const LITERALS3 = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ];
  const MULTI_WORD_TYPES = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ];
  const TYPES3 = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "time",
    "timestamp",
    "varchar",
    "varying",
    // modifier (character varying)
    "varbinary"
  ];
  const NON_RESERVED_WORDS = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ];
  const RESERVED_WORDS = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year"
  ];
  const RESERVED_FUNCTIONS = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket"
  ];
  const POSSIBLE_WITHOUT_PARENS = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ];
  const COMBOS = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ];
  const FUNCTIONS = RESERVED_FUNCTIONS;
  const KEYWORDS3 = [
    ...RESERVED_WORDS,
    ...NON_RESERVED_WORDS
  ].filter((keyword) => {
    return !RESERVED_FUNCTIONS.includes(keyword);
  });
  const VARIABLE = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  };
  const OPERATOR2 = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  };
  const FUNCTION_CALL = {
    match: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
    relevance: 0,
    keywords: { built_in: FUNCTIONS }
  };
  function kws_to_regex(list) {
    return regex.concat(
      /\b/,
      regex.either(...list.map((kw) => {
        return kw.replace(/\s+/, "\\s+");
      })),
      /\b/
    );
  }
  const MULTI_WORD_KEYWORDS = {
    scope: "keyword",
    match: kws_to_regex(COMBOS),
    relevance: 0
  };
  function reduceRelevancy(list, {
    exceptions,
    when
  } = {}) {
    const qualifyFn = when;
    exceptions = exceptions || [];
    return list.map((item) => {
      if (item.match(/\|\d+$/) || exceptions.includes(item)) {
        return item;
      } else if (qualifyFn(item)) {
        return `${item}|0`;
      } else {
        return item;
      }
    });
  }
  return {
    name: "SQL",
    case_insensitive: true,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: reduceRelevancy(KEYWORDS3, { when: (x) => x.length < 3 }),
      literal: LITERALS3,
      type: TYPES3,
      built_in: POSSIBLE_WITHOUT_PARENS
    },
    contains: [
      {
        scope: "type",
        match: kws_to_regex(MULTI_WORD_TYPES)
      },
      MULTI_WORD_KEYWORDS,
      FUNCTION_CALL,
      VARIABLE,
      STRING,
      QUOTED_IDENTIFIER,
      hljs.C_NUMBER_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      OPERATOR2
    ]
  };
}

// node_modules/highlight.js/es/languages/twig.js
function twig(hljs) {
  const regex = hljs.regex;
  const FUNCTION_NAMES = [
    "absolute_url",
    "asset|0",
    "asset_version",
    "attribute",
    "block",
    "constant",
    "controller|0",
    "country_timezones",
    "csrf_token",
    "cycle",
    "date",
    "dump",
    "expression",
    "form|0",
    "form_end",
    "form_errors",
    "form_help",
    "form_label",
    "form_rest",
    "form_row",
    "form_start",
    "form_widget",
    "html_classes",
    "include",
    "is_granted",
    "logout_path",
    "logout_url",
    "max",
    "min",
    "parent",
    "path|0",
    "random",
    "range",
    "relative_path",
    "render",
    "render_esi",
    "source",
    "template_from_string",
    "url|0"
  ];
  const FILTERS = [
    "abs",
    "abbr_class",
    "abbr_method",
    "batch",
    "capitalize",
    "column",
    "convert_encoding",
    "country_name",
    "currency_name",
    "currency_symbol",
    "data_uri",
    "date",
    "date_modify",
    "default",
    "escape",
    "file_excerpt",
    "file_link",
    "file_relative",
    "filter",
    "first",
    "format",
    "format_args",
    "format_args_as_text",
    "format_currency",
    "format_date",
    "format_datetime",
    "format_file",
    "format_file_from_text",
    "format_number",
    "format_time",
    "html_to_markdown",
    "humanize",
    "inky_to_html",
    "inline_css",
    "join",
    "json_encode",
    "keys",
    "language_name",
    "last",
    "length",
    "locale_name",
    "lower",
    "map",
    "markdown",
    "markdown_to_html",
    "merge",
    "nl2br",
    "number_format",
    "raw",
    "reduce",
    "replace",
    "reverse",
    "round",
    "slice",
    "slug",
    "sort",
    "spaceless",
    "split",
    "striptags",
    "timezone_name",
    "title",
    "trans",
    "transchoice",
    "trim",
    "u|0",
    "upper",
    "url_encode",
    "yaml_dump",
    "yaml_encode"
  ];
  let TAG_NAMES = [
    "apply",
    "autoescape",
    "block",
    "cache",
    "deprecated",
    "do",
    "embed",
    "extends",
    "filter",
    "flush",
    "for",
    "form_theme",
    "from",
    "if",
    "import",
    "include",
    "macro",
    "sandbox",
    "set",
    "stopwatch",
    "trans",
    "trans_default_domain",
    "transchoice",
    "use",
    "verbatim",
    "with"
  ];
  TAG_NAMES = TAG_NAMES.concat(TAG_NAMES.map((t) => `end${t}`));
  const STRING = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      }
    ]
  };
  const NUMBER = {
    scope: "number",
    match: /\d+/
  };
  const PARAMS = {
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    contains: [
      STRING,
      NUMBER
    ]
  };
  const FUNCTIONS = {
    beginKeywords: FUNCTION_NAMES.join(" "),
    keywords: { name: FUNCTION_NAMES },
    relevance: 0,
    contains: [PARAMS]
  };
  const FILTER = {
    match: /\|(?=[A-Za-z_]+:?)/,
    beginScope: "punctuation",
    relevance: 0,
    contains: [
      {
        match: /[A-Za-z_]+:?/,
        keywords: FILTERS
      }
    ]
  };
  const tagNamed = (tagnames, { relevance }) => {
    return {
      beginScope: {
        1: "template-tag",
        3: "name"
      },
      relevance: relevance || 2,
      endScope: "template-tag",
      begin: [
        /\{%/,
        /\s*/,
        regex.either(...tagnames)
      ],
      end: /%\}/,
      keywords: "in",
      contains: [
        FILTER,
        FUNCTIONS,
        STRING,
        NUMBER
      ]
    };
  };
  const CUSTOM_TAG_RE = /[a-z_]+/;
  const TAG = tagNamed(TAG_NAMES, { relevance: 2 });
  const CUSTOM_TAG = tagNamed([CUSTOM_TAG_RE], { relevance: 1 });
  return {
    name: "Twig",
    aliases: ["craftcms"],
    case_insensitive: true,
    subLanguage: "xml",
    contains: [
      hljs.COMMENT(/\{#/, /#\}/),
      TAG,
      CUSTOM_TAG,
      {
        className: "template-variable",
        begin: /\{\{/,
        end: /\}\}/,
        contains: [
          "self",
          FILTER,
          FUNCTIONS,
          STRING,
          NUMBER
        ]
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/typescript.js
var IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
var KEYWORDS2 = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends",
  // It's reached stage 3, which is "recommended for implementation":
  "using"
];
var LITERALS2 = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
];
var TYPES2 = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
];
var ERROR_TYPES2 = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
];
var BUILT_IN_GLOBALS2 = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
];
var BUILT_IN_VARIABLES2 = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
];
var BUILT_INS2 = [].concat(
  BUILT_IN_GLOBALS2,
  TYPES2,
  ERROR_TYPES2
);
function javascript2(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE2;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2,
    literal: LITERALS2,
    built_in: BUILT_INS2,
    "variable.language": BUILT_IN_VARIABLES2
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES2,
        ...ERROR_TYPES2
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS2,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      IDENT_RE$1,
      regex.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        scope: "attr",
        match: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function typescript(hljs) {
  const regex = hljs.regex;
  const tsLanguage = javascript2(hljs);
  const IDENT_RE$1 = IDENT_RE2;
  const TYPES3 = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ];
  const NAMESPACE = {
    begin: [
      /namespace/,
      /\s+/,
      hljs.IDENT_RE
    ],
    beginScope: {
      1: "keyword",
      3: "title.class"
    }
  };
  const INTERFACE = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: "interface extends",
      built_in: TYPES3
    },
    contains: [tsLanguage.exports.CLASS_REFERENCE]
  };
  const USE_STRICT = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  };
  const TS_SPECIFIC_KEYWORDS = [
    "type",
    // "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override",
    "satisfies"
  ];
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
    literal: LITERALS2,
    built_in: BUILT_INS2.concat(TYPES3),
    "variable.language": BUILT_IN_VARIABLES2
  };
  const DECORATOR = {
    className: "meta",
    begin: "@" + IDENT_RE$1
  };
  const swapMode = (mode, label, replacement) => {
    const indx = mode.contains.findIndex((m) => m.label === label);
    if (indx === -1) {
      throw new Error("can not find mode to replace");
    }
    mode.contains.splice(indx, 1, replacement);
  };
  Object.assign(tsLanguage.keywords, KEYWORDS$1);
  tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
  const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c) => c.scope === "attr");
  const OPTIONAL_KEY_OR_ARGUMENT = Object.assign(
    {},
    ATTRIBUTE_HIGHLIGHT,
    { match: regex.concat(IDENT_RE$1, regex.lookahead(/\s*\?:/)) }
  );
  tsLanguage.exports.PARAMS_CONTAINS.push([
    tsLanguage.exports.CLASS_REFERENCE,
    // class reference for highlighting the params types
    ATTRIBUTE_HIGHLIGHT,
    // highlight the params key
    OPTIONAL_KEY_OR_ARGUMENT
    // Added for optional property assignment highlighting
  ]);
  tsLanguage.contains = tsLanguage.contains.concat([
    DECORATOR,
    NAMESPACE,
    INTERFACE,
    OPTIONAL_KEY_OR_ARGUMENT
    // Added for optional property assignment highlighting
  ]);
  swapMode(tsLanguage, "shebang", hljs.SHEBANG());
  swapMode(tsLanguage, "use_strict", USE_STRICT);
  const functionDeclaration = tsLanguage.contains.find((m) => m.label === "func.def");
  functionDeclaration.relevance = 0;
  Object.assign(tsLanguage, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  });
  return tsLanguage;
}

// node_modules/highlight.js/es/languages/xml.js
function xml(hljs) {
  const regex = hljs.regex;
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const XML_META_KEYWORDS = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  };
  const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
    begin: /\(/,
    end: /\)/
  });
  const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
  const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [XML_ENTITIES]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [XML_ENTITIES]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          XML_META_KEYWORDS,
          QUOTE_META_STRING_MODE,
          APOS_META_STRING_MODE,
          XML_META_PAR_KEYWORDS,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  XML_META_KEYWORDS,
                  XML_META_PAR_KEYWORDS,
                  QUOTE_META_STRING_MODE,
                  APOS_META_STRING_MODE
                ]
              }
            ]
          }
        ]
      },
      hljs.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      XML_ENTITIES,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              QUOTE_META_STRING_MODE
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      // we need this for now for jSX
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: "tag",
        begin: regex.concat(
          /</,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            // <tag/>
            // <tag>
            // <tag ...
            regex.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0,
            starts: TAG_INTERNALS
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: regex.concat(
          /<\//,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
}

// node_modules/highlight.js/es/languages/yaml.js
function yaml(hljs) {
  const LITERALS3 = "true false yes no null";
  const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
  const KEY = {
    className: "attr",
    variants: [
      // added brackets support and special char support
      { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
      {
        // double quoted keys - with brackets and special char support
        begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
      },
      {
        // single quoted keys - with brackets and special char support
        begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
      }
    ]
  };
  const TEMPLATE_VARIABLES = {
    className: "template-variable",
    variants: [
      {
        // jinja templates Ansible
        begin: /\{\{/,
        end: /\}\}/
      },
      {
        // Ruby i18n
        begin: /%\{/,
        end: /\}/
      }
    ]
  };
  const SINGLE_QUOTE_STRING = {
    className: "string",
    relevance: 0,
    begin: /'/,
    end: /'/,
    contains: [
      {
        match: /''/,
        scope: "char.escape",
        relevance: 0
      }
    ]
  };
  const STRING = {
    className: "string",
    relevance: 0,
    variants: [
      {
        begin: /"/,
        end: /"/
      },
      { begin: /\S+/ }
    ],
    contains: [
      hljs.BACKSLASH_ESCAPE,
      TEMPLATE_VARIABLES
    ]
  };
  const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
    {
      begin: /'/,
      end: /'/,
      contains: [
        {
          begin: /''/,
          relevance: 0
        }
      ]
    },
    {
      begin: /"/,
      end: /"/
    },
    { begin: /[^\s,{}[\]]+/ }
  ] });
  const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
  const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
  const FRACTION_RE = "(\\.[0-9]*)?";
  const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
  const TIMESTAMP = {
    className: "number",
    begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
  };
  const VALUE_CONTAINER = {
    end: ",",
    endsWithParent: true,
    excludeEnd: true,
    keywords: LITERALS3,
    relevance: 0
  };
  const OBJECT = {
    begin: /\{/,
    end: /\}/,
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const ARRAY = {
    begin: "\\[",
    end: "\\]",
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const MODES3 = [
    KEY,
    {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    },
    {
      // multi line string
      // Blocks start with a | or > followed by a newline
      //
      // Indentation of subsequent lines must be the same to
      // be considered part of the block
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    },
    {
      // Ruby/Rails erb
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    },
    {
      // named tags
      className: "type",
      begin: "!\\w+!" + URI_CHARACTERS
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + URI_CHARACTERS + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + URI_CHARACTERS
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + URI_CHARACTERS
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    hljs.HASH_COMMENT_MODE,
    {
      beginKeywords: LITERALS3,
      keywords: { literal: LITERALS3 }
    },
    TIMESTAMP,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: hljs.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    OBJECT,
    ARRAY,
    SINGLE_QUOTE_STRING,
    STRING
  ];
  const VALUE_MODES = [...MODES3];
  VALUE_MODES.pop();
  VALUE_MODES.push(CONTAINER_STRING);
  VALUE_CONTAINER.contains = VALUE_MODES;
  return {
    name: "YAML",
    case_insensitive: true,
    aliases: ["yml"],
    contains: MODES3
  };
}

// packages/frontend/src/lib/grammars/typoscript.ts
var CONSTANT = { className: "variable", begin: "\\{\\$[^}\\n]*\\}" };
var OPERATOR = "(?::=|=<|=|<|>)(?=[ \\t]*\\S)";
var TYPOSCRIPT = {
  /* TSconfig is TypoScript — the same operators, paths and conditions, read
     by the backend rather than the frontend. TYPO3's own documentation
     grammar aliases it the same way. */
  aliases: ["tsconfig"],
  case_insensitive: false,
  contains: [
    { className: "comment", begin: "/\\*", end: "\\*/" },
    /* Only at the start of a line: TypoScript has no trailing comment, and a
       `#` in the middle of one is a colour in a value. */
    { className: "comment", begin: "^[ \\t]*(?:#|//).*$" },
    /* A condition, and the `[END]`, `[ELSE]` and `[GLOBAL]` that close one.
       Before the operator below, because a condition is full of them. */
    { className: "meta", begin: "^[ \\t]*\\[", end: "\\]" },
    { className: "meta", begin: "^[ \\t]*@import\\b.*$" },
    /* Ahead of the copy operator, which begins on the same character. */
    { className: "meta", begin: "<INCLUDE_TYPOSCRIPT:", end: ">" },
    /* The object path being assigned to — the whole of it, up to whichever
       operator or brace follows. */
    { className: "attr", begin: "^[ \\t]*[\\w.-]+(?=[ \\t]*(?::?=<?|<|>|\\{|\\())" },
    /* An object type, which is what an all-caps word standing alone on the
       right of an assignment is: `= PAGE`, `= FLUIDTEMPLATE`. Read from the
       shape rather than from a list of them, because the list is TYPO3's and
       grows a name every release. */
    {
      className: "built_in",
      begin: "(?::?=)[ \\t]*(?=[A-Z][A-Z0-9_]*[ \\t]*$)",
      excludeBegin: true,
      end: "$"
    },
    {
      className: "string",
      begin: OPERATOR,
      excludeBegin: true,
      end: "$",
      contains: [CONSTANT]
    },
    /* A value written over several lines, which is the one place a newline is
       part of what was said rather than the end of it. */
    { className: "string", begin: "\\([ \\t]*$", end: "^[ \\t]*\\)", contains: [CONSTANT] },
    CONSTANT
  ]
};

// packages/frontend/src/lib/grammars/index.ts
var WRITTEN = { typoscript: TYPOSCRIPT };

// packages/frontend/src/lib/highlight.ts
var GRAMMARS = {
  bash,
  css,
  diff,
  html: xml,
  javascript,
  json,
  markdown,
  php,
  scss,
  sql,
  text: plaintext,
  twig,
  typescript,
  xml,
  yaml,
  /* A written grammar is the mode tree itself, and highlight.js takes a
     function returning one. Its aliases are entries of their own rather than
     left to the library: `highlights` answers from this map, and a name the
     highlighter knew and this did not would print a block uncoloured. The
     cast is the whole of what `Mode` gives up — the library types a
     definition against helpers no grammar here uses. */
  ...Object.fromEntries(Object.entries(WRITTEN).flatMap(
    ([name, mode]) => [name, ...mode.aliases ?? []].map(
      (as) => [as, (() => mode)]
    )
  ))
};
for (const [name, grammar] of Object.entries(GRAMMARS)) core_default.registerLanguage(name, grammar);
function highlights(lang) {
  return lang in GRAMMARS;
}
function highlight(lang, source) {
  if (!highlights(lang)) return null;
  return core_default.highlight(source, { language: lang, ignoreIllegals: true }).value;
}

// packages/frontend/src/components/code.ts
var isCaption3 = (node) => node.nodeType === 1 && node.matches(".sds-code__caption");
var SdsCode = class extends SdsElement {
  constructor() {
    super();
    /* Content written between the tags, taken before Lit renders over it: light
       DOM means `render()` replaces the children, and the children are the whole
       point where a renderer wrote the block. Lifted on connect and handed back
       as nodes — Lit renders a node as a child value, and re-rendering moves the
       same nodes rather than copying them. */
    this.taken = null;
    /* The caption, where it too was written between the tags — as nodes, because
       it carries a literal, a link or an emphasis and an attribute would flatten
       all three. Inside the element, so the block places it; drawn beside it,
       nothing keeps the two together. Kept apart from `taken`, which everything
       else here reads as the block itself. */
    this.captioned = null;
    /* A button that cannot do its one job is worse than none, so a browser
       without a clipboard gets none. Decided on connect rather than at render:
       `renderStatic` runs in Node, where a guard on `navigator` itself would drop
       the button from every specimen card. */
    this.clipboard = true;
    this.lang = "";
    this.caption = "";
    this.source = "";
    this.body = [];
    this.copy = false;
    this.copied = false;
  }
  static {
    this.properties = {
      lang: { type: String, reflect: true, attribute: "code-lang" },
      caption: { type: String },
      source: { type: String },
      /* Styled lines, which no attribute can carry — a shell prompt, a comment
         and a result are three different spans, and flattening them to a string
         would throw away the only thing the component does. */
      body: { type: Array },
      action: { type: Object },
      copy: { type: Boolean, reflect: true },
      copied: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    if (typeof navigator !== "undefined") this.clipboard = Boolean(navigator.clipboard);
    const written = this.lifted();
    const caption = written.filter(isCaption3);
    const said = written.filter((node) => !isCaption3(node));
    if (caption.length) this.captioned = caption;
    if (said.length) this.taken = said;
    super.connectedCallback();
  }
  /** Whatever the block would put on the clipboard: what it says, and none of
      what frames it. Read from the content, not the rendering — light DOM means
      the element's own text is the head too, so a paste would begin with the
      language and the word on the button. The `$` goes for the same reason it
      is a span of its own: it is the prompt, and in a shell it is an error. */
  get text() {
    const said = this.taken ? this.written : this.source || this.body.map(({ text, code }) => code ? `${text} ${code}` : text).join("\n");
    return said.replace(/^\n+/, "").replace(/\n+$/, "");
  }
  /** The text between the tags. Comments are skipped, and they are not the
      author's: a template that interpolates its content leaves Lit's own
      markers among the children, and `textContent` reads a comment's body
      like any other. */
  get written() {
    return (this.taken ?? []).filter((node) => node.nodeType !== 8).map((node) => node.textContent ?? "").join("");
  }
  async toClipboard() {
    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      return;
    }
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 1600);
  }
  get copyButton() {
    if (!this.copy || !this.clipboard) return void 0;
    return html57`<button type="button" class="sds-code__copy${this.copied ? " is-copied" : ""}" aria-label="Copy this block" @click="${() => void this.toClipboard()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? "copied" : "copy"}</span></button>`;
  }
  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in — which made the component's own output something any
     caller could half-write. A line is data now, and only this file turns it
     into spans. */
  line({ kind, text, code }) {
    const tail = code ? html57` <span class="sds-code__cmd">${code}</span>` : void 0;
    switch (kind) {
      case "shell":
        return html57`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text}</span>${tail}`;
      case "comment":
        return html57`<span class="sds-code__comment">${text}</span>${tail}`;
      case "ok":
        return html57`<span class="sds-code__ok">✓</span> ${text}${tail}`;
      default:
        return html57`${text}${tail}`;
    }
  }
  /* Whether the block arrived already coloured. A build that highlights on its
     own hands in finished markup, and colouring it again would flatten the
     spans back to text and rebuild them from fewer grammars. `hljs-` is the
     signal because `components.css` maps those classes and nothing else. Kept
     wrapper and all: the `<code>` holds which lines are numbered. */
  get given() {
    if (this.content) return true;
    return (this.taken ?? []).some((node) => {
      if (node.nodeType !== 1) return false;
      const el = node;
      return el.matches('[class*="hljs-"]') || el.querySelector('[class*="hljs-"]') !== null;
    });
  }
  /* Content written between the tags, in the `<code>` a code block is supposed
     to have. The element renders that wrapper and its `language-` class from
     `lang`, so a caller cannot say the language twice and have the two
     disagree — one paints the head, the other decides the highlighting. It
     colours the block too, unless the colour arrived with it; see `given`. */
  get wrapped() {
    const written = this.taken ?? this.content ?? this.text;
    if (this.given) return html57`${written}`;
    if (!this.lang) return html57`<code>${written}</code>`;
    const coloured = highlight(this.lang, this.text);
    return coloured === null ? html57`<code class="language-${this.lang}">${written}</code>` : html57`<code class="language-${this.lang}">${unsafeHTML4(coloured)}</code>`;
  }
  render() {
    const affordance = this.action ?? this.copyButton;
    const head = this.lang || affordance ? html57`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>` : void 0;
    const caption = this.captioned ? html57`${this.captioned}` : this.caption ? html57`<div class="sds-code__caption">${this.caption}</div>` : void 0;
    return html57`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken || this.content || this.source ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
};
define("sds-code", SdsCode);

// packages/frontend/src/components/diff.ts
import { html as html58 } from "lit";
var SdsDiff = class extends SdsElement {
  static {
    this.properties = {
      path: { type: String, reflect: true },
      icon: { type: String },
      body: { type: Array }
    };
  }
  constructor() {
    super();
    this.path = "";
    this.body = [];
  }
  /* Diff rows carry no newline between them: each `sds-diff__line` is a
     block, so a newline inside the `<pre>` would add an empty line between
     every pair of rows. */
  line({ kind, text }) {
    if (kind === "context") return html58`<span class="sds-diff__line">   ${text}</span>`;
    const mark = kind === "add" ? "+" : "-";
    return html58`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text}</span>`;
  }
  render() {
    return html58`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? "actions-code-compare"}"></sds-icon><span class="sds-code__path">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
};
define("sds-diff", SdsDiff);

// packages/frontend/src/components/quote.ts
import { html as html60 } from "lit";

// packages/frontend/src/components/byline.ts
import { html as html59 } from "lit";
var SdsByline = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String },
      as: { type: String },
      meta: { type: String },
      initials: { type: String },
      href: { type: String },
      unmarked: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.name = "";
    this.as = "";
    this.meta = "";
    this.initials = "";
    this.href = "";
    this.unmarked = false;
  }
  /** First letters of the first and last word — two at most. Three initials
      in a 32px circle is a monogram nobody can read. */
  get mark() {
    if (this.initials) return this.initials;
    const words = this.name.trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] ?? "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }
  render() {
    const who = this.href ? html59`<a class="sds-link" href="${this.href}">${this.name}</a>` : html59`${this.name}`;
    return html59`<div class="sds-byline">
  ${this.unmarked ? "" : html59`<span class="sds-byline__mark" aria-hidden="true">${this.mark}</span>`}
  <div class="sds-byline__who">
    <span class="sds-byline__name">${who}${this.as ? html59` <span class="sds-byline__role">· ${this.as}</span>` : ""}</span>
    ${this.meta ? html59`<span class="sds-label">${this.meta}</span>` : ""}
  </div>
</div>`;
  }
};
define("sds-byline", SdsByline);

// packages/frontend/src/components/quote.ts
var SdsQuote = class extends SdsElement {
  constructor() {
    super();
    /* The sentence, where it was written between the tags. A product surface
       quotes a line somebody composed and a property carries it; a document
       quotes the passage it found, and out of a document that carries links and
       emphasis — which is markup or it is nothing. */
    this.taken = null;
    this.body = "";
    this.by = "";
    this.as = "";
    this.href = "";
    this.meta = "";
    this.initials = "";
  }
  static {
    this.properties = {
      body: { type: String },
      by: { type: String },
      as: { type: String },
      href: { type: String },
      meta: { type: String },
      initials: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    return html60`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.taken ?? this.content ?? this.body}</blockquote>
  <figcaption class="sds-quote__by"><sds-byline
    name="${this.by}"
    as="${this.as}"
    meta="${this.meta}"
    href="${this.href}"
    initials="${this.initials}"
    ?unmarked="${!this.initials}"
  ></sds-byline></figcaption>
</figure>`;
  }
};
define("sds-quote", SdsQuote);

// packages/frontend/src/components/confval.ts
import { html as html61, nothing as nothing31 } from "lit";
var SdsConfval = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags — see `SdsElement.lifted()`. */
    this.taken = null;
    this.name = "";
    this.anchor = "";
    this.required = false;
    this.type = "";
    this.default = "";
    this.facts = [];
    this.body = "";
  }
  static {
    this.properties = {
      name: { type: String },
      anchor: { type: String },
      required: { type: Boolean, reflect: true },
      type: { type: String },
      default: { type: String },
      facts: { type: Array },
      body: { type: String }
    };
  }
  connectedCallback() {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  /** The two the directive names first, then whatever else the source set.
      Order is fixed rather than alphabetical: a reader comparing two entries
      compares them line by line. */
  get stated() {
    return [
      ...this.type ? [{ label: "type", value: this.type }] : [],
      ...this.default ? [{ label: "default", value: this.default }] : [],
      ...this.facts
    ];
  }
  fact({ label, value }) {
    return html61`<dt class="sds-label">${label}</dt>
      <dd class="sds-mono">${value}</dd>`;
  }
  render() {
    const facts = this.stated;
    const mark = this.anchor ? html61`<a class="sds-confval__mark" href="#${this.anchor}" aria-label="Link to ${this.name}">#</a>` : nothing31;
    return html61`<dl class="sds-confval">
  <dt class="sds-confval__term" id="${this.anchor || nothing31}">
    <code class="sds-confval__name">${this.name}</code>
    ${this.required ? html61`<sds-badge label="required"></sds-badge>` : nothing31}
    ${mark}
  </dt>
  <dd class="sds-confval__detail">
    ${facts.length ? html61`<dl class="sds-confval__facts">
      ${lines(facts.map((f) => this.fact(f)), 6)}
    </dl>` : nothing31}
    <div class="sds-confval__body">${this.taken ?? this.content ?? this.body}</div>
  </dd>
</dl>`;
  }
};
define("sds-confval", SdsConfval);

// packages/frontend/src/index.ts
var TAGS3 = [
  "sds-icon",
  "sds-theme",
  "sds-button",
  "sds-dropdown",
  "sds-badge",
  "sds-eyebrow",
  "sds-link",
  "sds-nav-breadcrumb",
  "sds-field",
  "sds-select",
  "sds-textarea",
  "sds-field-group",
  "sds-search",
  "sds-field-error",
  "sds-checkbox",
  "sds-checkbox-group",
  "sds-radio",
  "sds-switch",
  "sds-range",
  "sds-file",
  "sds-form-errors",
  "sds-nav-pills",
  "sds-nav-main",
  "sds-accordion",
  "sds-accordion-item",
  "sds-steps",
  "sds-step",
  "sds-tabs",
  "sds-tab-item",
  "sds-nav-rail",
  "sds-nav-toc",
  "sds-footer",
  "sds-surface",
  "sds-stat",
  "sds-figure",
  "sds-image",
  "sds-embed",
  "sds-lightbox",
  "sds-overlay",
  "sds-modal",
  "sds-dialog",
  "sds-table",
  "sds-card",
  "sds-icon-tile",
  "sds-swatch",
  "sds-grid",
  "sds-search-result",
  "sds-search-hits",
  "sds-nav-pagination",
  "sds-nav-pager",
  "sds-code",
  "sds-diff",
  "sds-quote",
  "sds-byline",
  "sds-note",
  "sds-confval"
];
export {
  SdsAccordion,
  SdsAccordionItem,
  SdsBadge,
  SdsButton,
  SdsByline,
  SdsCard,
  SdsCheckbox,
  SdsCheckboxGroup,
  SdsCode,
  SdsConfval,
  SdsDialog,
  SdsDiff,
  SdsDropdown,
  SdsElement,
  SdsEmbed,
  SdsEyebrow,
  SdsField,
  SdsFieldError,
  SdsFieldGroup,
  SdsFigure,
  SdsFile,
  SdsFooter,
  SdsFormElement,
  SdsFormErrors,
  SdsGrid,
  SdsIcon,
  SdsIconTile,
  SdsImage,
  SdsLightbox,
  SdsLink,
  SdsModal,
  SdsNavBreadcrumb,
  SdsNavMain,
  SdsNavPager,
  SdsNavPagination,
  SdsNavPills,
  SdsNavRail,
  SdsNavToc,
  SdsNote,
  SdsOverlay,
  SdsQuote,
  SdsRadio,
  SdsRange,
  SdsSearchHits,
  SdsSearchResult,
  SdsSelect,
  SdsStat,
  SdsStep,
  SdsSteps,
  SdsSurface,
  SdsSwatch,
  SdsSwitch,
  SdsTabItem,
  SdsTable,
  SdsTabs,
  SdsTextarea,
  SdsTheme,
  TAGS3 as TAGS,
  buttonClass,
  define,
  fieldBox,
  fieldRow,
  iconIds,
  pageNumbers,
  setIconSprite,
  themeBoot
};
//# sourceMappingURL=index.js.map
