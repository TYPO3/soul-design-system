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
    var MODES2 = /* @__PURE__ */ Object.freeze({
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
      constructor(reason, html46) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html46;
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
      for (const key in MODES2) {
        if (typeof MODES2[key] === "object") {
          deepFreeze(MODES2[key]);
        }
      }
      Object.assign(hljs, MODES2);
      return hljs;
    };
    var highlight2 = HLJS({});
    highlight2.newInstance = () => HLJS({});
    module.exports = highlight2;
    highlight2.HighlightJS = highlight2;
    highlight2.default = highlight2;
  }
});

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
  #reset;
  /** Run `fn` once the form around this element has been reset, for a control
      that keeps state of its own. The listener has to sit on the form: `reset`
      is fired there and bubbles up, never down. A microtask, because the
      handler runs before the controls are put back. */
  whenFormReset(fn) {
    this.#reset?.abort();
    const form = this.closest("form");
    if (!form) return;
    this.#reset = new AbortController();
    form.addEventListener("reset", () => queueMicrotask(fn), { signal: this.#reset.signal });
  }
  disconnectedCallback() {
    this.#reset?.abort();
    super.disconnectedCallback();
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
var registered = /* @__PURE__ */ new Set();
function writeHostRule(doc) {
  if (!registered.size) return;
  const id = "sds-host-rule";
  const style = doc.getElementById(id) ?? doc.createElement("style");
  style.id = id;
  style.textContent = `${[...registered].join(",")}{display:contents}`;
  if (!style.isConnected) doc.head.append(style);
}
function installHostRule(doc = document) {
  writeHostRule(doc);
}
function define(tag, ctor) {
  if (typeof customElements === "undefined") return;
  registered.add(tag);
  if (typeof document !== "undefined") writeHostRule(document);
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// packages/frontend/src/components/icon.ts
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

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
import { html as html4, nothing as nothing2 } from "lit";

// packages/frontend/src/components/result.ts
import { html as html3, nothing } from "lit";

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

// packages/frontend/src/components/result.ts
var SdsResult = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      href: { type: String },
      path: { type: String },
      snippet: { type: String },
      match: { type: String },
      kind: { type: String },
      meta: { type: String }
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
      out.push(html3`<mark class="sds-mark">${text.slice(i, i + needle.length)}</mark>`);
      at = i + needle.length;
    }
    out.push(text.slice(at));
    return out;
  }
  render() {
    return html3`<article class="sds-result">
  <div class="sds-row">
    ${this.kind ? html3`<sds-badge label="${this.kind}"></sds-badge>` : nothing}
    ${this.path ? html3`<span class="sds-result__path">${this.path}</span>` : nothing}
    ${this.meta ? html3`<span class="sds-label sds-row__end">${this.meta}</span>` : nothing}
  </div>
  <h3 class="sds-result__title"><a href="${this.href}">${this.marked(this.heading)}</a></h3>
  ${this.snippet ? html3`<p class="sds-result__text">${this.marked(this.snippet)}</p>` : nothing}
</article>`;
  }
};
define("sds-result", SdsResult);

// packages/frontend/src/components/search.ts
var seq = 0;
var SdsSearch = class extends SdsElement {
  constructor() {
    super();
    this.panelId = `sds-search-${++seq}`;
    this.onOutside = (event) => {
      if (!this.open || event.composedPath().includes(this)) return;
      this.open = false;
    };
    this.index = "";
    this.label = "Search";
    this.query = "";
    this.entries = null;
    this.open = false;
  }
  static {
    this.properties = {
      /** Where the index is. Relative to the page, like every other asset. */
      index: { type: String },
      label: { type: String },
      query: { type: String, state: true },
      entries: { type: Array, state: true },
      open: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this.onOutside);
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.onOutside);
    super.disconnectedCallback();
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
      the build sees them, and a reader is rarely standing in the root — so it
      is resolved against the index's own address, which *is* the root. Left to
      the browser, a hit one directory down names a page that does not exist. */
  hrefOf(entry) {
    return new URL(entry.url, new URL(".", new URL(this.index, location.href))).href;
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
        panel is drawn by `sds-result` and the class is the contract between
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
    return html4`<div class="sds-search" @focusout="${(e) => this.onLeave(e)}">
  <span class="sds-field">
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
  /** The drop, and what is in it. `sds-result` draws a hit, marks what was
        searched for and says where the page is — the query is handed over rather
        than the marking done here, because what is highlighted has to be what was
        actually searched.
  
        An answer of nothing is a sentence in the same drop: which pages were
        read and what of them is not indexed, so it can be told from a search
        that broke. */
  panel(hits) {
    return html4`<div
  class="sds-search__panel"
  id="${this.panelId}"
  aria-label="${this.label}"
  @keydown="${(e) => this.onPanelKey(e)}"
>
  ${hits.length ? hits.map(
      (hit) => html4`<sds-result
    heading="${hit.title}"
    href="${this.hrefOf(hit)}"
    path="${hit.url}"
    snippet="${hit.text}"
    match="${this.query}"
  ></sds-result>`
    ) : html4`<div class="sds-search__empty">
    <div class="sds-surface-title">Nothing here matches “${this.query}”</div>
    <p>Every page of this site was searched — its titles and its opening lines. What is not indexed is the body of a page, so a word used once deep in one of them will not be found.</p>
  </div>`}
</div>`;
  }
};
define("sds-search", SdsSearch);

// packages/frontend/src/components/theme.ts
import { html as html5, nothing as nothing3 } from "lit";
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
    const segment = (theme) => html5`<button
      type="button"
      class="sds-mode${this.current === theme ? " is-active" : ""}"
      aria-pressed="${this.current === theme}"
      aria-label="${this.compact ? theme : nothing3}"
      @click="${() => this.choose(theme)}"
    ><sds-icon name="${GLYPH[theme]}"></sds-icon>${this.compact ? "" : html5`<span class="sds-mode__label">${theme}</span>`}</button>`;
    return html5`<div class="sds-modes" role="group" aria-label="Colour mode">
  ${segment("light")}
  ${segment("dark")}
</div>`;
  }
};
define("sds-theme", SdsTheme);

// packages/frontend/src/components/button.ts
import { html as html6 } from "lit";
function buttonClass({ variant = "primary", size = "md", iconOnly = false, disabled = false }) {
  const cls = ["sds-btn", `sds-btn--${variant}`];
  if (size === "sm") cls.push("sds-btn--sm");
  if (iconOnly) cls.push("sds-btn--icon");
  if (disabled) cls.push("is-disabled");
  return cls.join(" ");
}
var LABEL = "sds-btn__label";
var buttonLabel = (body) => html6`<span class="${LABEL}">${body}</span>`;
function linkMarkup(props, body) {
  const cls = buttonClass({ ...props, disabled: false });
  const href = props.href ?? "";
  if (props.rel) {
    return props.title ? html6`<a class="${cls}" href="${href}" rel="${props.rel}" title="${props.title}">${body}</a>` : html6`<a class="${cls}" href="${href}" rel="${props.rel}">${body}</a>`;
  }
  return props.title ? html6`<a class="${cls}" href="${href}" title="${props.title}">${body}</a>` : html6`<a class="${cls}" href="${href}">${body}</a>`;
}
function buttonMarkup(props, body) {
  const inner = typeof body === "string" && body ? buttonLabel(body) : body;
  if (props.href) return linkMarkup(props, inner);
  const cls = buttonClass(props);
  const type = props.type ?? "button";
  if (props.title) {
    return props.disabled ? html6`<button class="${cls}" type="${type}" title="${props.title}" disabled>${inner}</button>` : html6`<button class="${cls}" type="${type}" title="${props.title}">${inner}</button>`;
  }
  return props.disabled ? html6`<button class="${cls}" type="${type}" disabled>${inner}</button>` : html6`<button class="${cls}" type="${type}">${inner}</button>`;
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

// packages/frontend/src/components/link.ts
import { html as html7 } from "lit";
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
      const mark = html7`<sds-icon name="${this.icon}" size="24"></sds-icon>`;
      return this.external ? html7`<a class="sds-link sds-link--bare" href="${this.href}" target="_blank" rel="noreferrer" aria-label="${this.label}" title="${this.label}">${mark}</a>` : html7`<a class="sds-link sds-link--bare" href="${this.href}" aria-label="${this.label}" title="${this.label}">${mark}</a>`;
    }
    const glyph = this.icon ? html7`<sds-icon name="${this.icon}"></sds-icon>` : "";
    const lead = this.icon && _SdsLink.leads(this.icon) ? glyph : "";
    const trail = this.icon && !_SdsLink.leads(this.icon) ? glyph : "";
    return this.external ? html7`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${lead}${this.label} ${trail}<sds-icon name="actions-window-open"></sds-icon></a>` : html7`<a class="sds-link" href="${this.href}">${lead}${this.label}${trail ? html7` ${trail}` : ""}</a>`;
  }
};
define("sds-link", SdsLink);

// packages/frontend/src/components/crumbs.ts
import { html as html8 } from "lit";
var SdsCrumbs = class extends SdsElement {
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
    return html8`<nav class="sds-crumbs" aria-label="${this.label}">
  ${this.items.map((crumb, i) => {
      const here = i === this.items.length - 1;
      const step = here ? html8`<span class="sds-crumbs__here" aria-current="page">${crumb.label}</span>` : html8`<a href="${crumb.href ?? "#"}">${crumb.label}</a>`;
      return html8`${i > 0 ? html8`<span class="sds-crumbs__sep" aria-hidden="true">/</span>` : ""}${step}`;
    })}
</nav>`;
  }
};
define("sds-crumbs", SdsCrumbs);

// packages/frontend/src/components/field.ts
import { html as html10, nothing as nothing4 } from "lit";
import { unsafeHTML as unsafeHTML2 } from "lit/directives/unsafe-html.js";

// packages/frontend/src/components/field-error.ts
import { html as html9 } from "lit";
var SdsFieldError = class extends SdsElement {
  static {
    this.properties = { message: { type: String } };
  }
  constructor() {
    super();
    this.message = "";
  }
  render() {
    return html9`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
};
define("sds-field-error", SdsFieldError);

// packages/frontend/src/components/field.ts
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function fieldClass({ focused, invalid, filled, select, rows, error }) {
  const cls = ["sds-field"];
  if (select) cls.push("sds-select");
  if (rows && rows > 1) cls.push("sds-field--multi");
  if (focused) cls.push("is-focused");
  if (invalid || error) cls.push("is-invalid");
  if (filled) cls.push("is-filled");
  return cls.join(" ");
}
var SdsField = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      icon: { type: String },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
      select: { type: Boolean, reflect: true },
      options: { type: Array },
      label: { type: String },
      minWidth: { type: Number, attribute: "min-width" },
      caption: { type: String },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" },
      name: { type: String },
      type: { type: String },
      rows: { type: Number }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.options = [];
    this.minWidth = 220;
    this.caption = "";
    this.hint = "";
    this.error = "";
    this.required = false;
    this.fieldId = "";
    this.name = "";
    this.type = "text";
    this.rows = 0;
  }
  /* Typing is what makes a value the user's. `is-filled` used to be a state
     a caller set and then had to unset, which nothing typing into the field
     could ever do. */
  onInput(event) {
    const control = event.target;
    this.value = control.value;
    this.filled = control.value !== "";
    this.dispatchEvent(new CustomEvent("sds-input", { detail: control.value, bubbles: true, composed: true }));
  }
  render() {
    const control = this.control();
    if (!this.caption) return control;
    const id = this.fieldId || void 0;
    return html10`<div class="sds-field-row">
  <label class="sds-field-label" for="${id ?? nothing4}">${this.caption}${this.required ? html10` <span class="sds-field-req">required</span>` : nothing4}</label>
  ${control}
  ${this.hint ? html10`<span class="sds-field-hint">${this.hint}</span>` : nothing4}
  ${this.error ? html10`<sds-field-error message="${this.error}"></sds-field-error>` : nothing4}
</div>`;
  }
  control() {
    const cls = fieldClass(this);
    const box = `width:${this.minWidth}px; max-width:100%`;
    const id = this.fieldId || nothing4;
    const name = this.name || nothing4;
    const invalid = this.invalid || this.error ? "true" : nothing4;
    if (this.select) {
      return html10`<span class="${cls}" style="${box}"><select class="sds-input" id="${id}" name="${name}" aria-label="${this.label ?? nothing4}" aria-invalid="${invalid}" ?required="${this.required}" @change="${(e) => this.onInput(e)}">${this.options.length ? this.options.map((option) => html10`<option ?selected="${option === this.value}">${option}</option>`) : html10`<option>${this.value}</option>`}</select><span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }
    if (this.rows > 1) {
      const attr2 = (name2, value) => value ? ` ${name2}="${esc(value)}"` : "";
      const area = `<textarea class="sds-input" rows="${this.rows}"${attr2("id", this.fieldId)}${attr2("name", this.name)}${this.filled ? "" : attr2("placeholder", this.value)}${attr2("aria-label", this.label ?? "")}${this.invalid || this.error ? ' aria-invalid="true"' : ""}${this.required ? " required" : ""}>${this.filled ? esc(this.value) : ""}</textarea>`;
      return html10`<span class="${cls}" style="${box}" @input="${(e) => this.onInput(e)}">${unsafeHTML2(area)}</span>`;
    }
    const caret = this.focused ? html10`<span style="width:2px; height:15px; background:var(--accent);"></span>` : nothing4;
    return html10`<span class="${cls}" style="${box}">${this.icon ? html10`<sds-icon name="${this.icon}"></sds-icon>` : nothing4}<input class="sds-input" type="${this.type}" id="${id}" name="${name}" value="${this.filled ? this.value : nothing4}" placeholder="${this.filled ? nothing4 : this.value}" aria-label="${this.label ?? nothing4}" aria-invalid="${invalid}" ?required="${this.required}" @input="${(e) => this.onInput(e)}">${caret}</span>`;
  }
};
define("sds-field", SdsField);

// packages/frontend/src/components/checkbox.ts
import { html as html11, nothing as nothing5 } from "lit";
var SdsCheckbox = class extends SdsElement {
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
  connectedCallback() {
    super.connectedCallback();
    this.whenFormReset(() => {
      this.checked = this.#initial ?? false;
    });
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
    return html11`<label class="sds-check">
  <input
    class="sds-check__mark"
    type="checkbox"
    name="${this.name || nothing5}"
    value="${this.value || nothing5}"
    ?checked="${this.#initial ?? this.checked}"
    .checked="${this.checked}"
    .indeterminate="${this.indeterminate}"
    ?required="${this.required}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-check__body">
    <span class="sds-check__label">${this.label}</span>
    ${this.hint ? html11`<span class="sds-check__hint">${this.hint}</span>` : nothing5}
  </span>
</label>`;
  }
};
define("sds-checkbox", SdsCheckbox);

// packages/frontend/src/components/radio.ts
import { html as html12, nothing as nothing6 } from "lit";
var SdsRadio = class extends SdsElement {
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
  connectedCallback() {
    super.connectedCallback();
    this.whenFormReset(() => {
      this.value = this.#initial ?? "";
    });
  }
  choose(choice) {
    this.value = choice.value ?? choice.label;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.value, bubbles: true, composed: true })
    );
  }
  render() {
    return html12`<fieldset class="sds-choices" name="${this.name || nothing6}">
  <legend class="sds-field-label">${this.legend}${this.required ? html12` <span class="sds-field-req">required</span>` : nothing6}</legend>
  ${this.hint ? html12`<span class="sds-field-hint">${this.hint}</span>` : nothing6}
  ${this.choices.map((choice) => {
      const value = choice.value ?? choice.label;
      return html12`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="radio"
      name="${this.name}"
      value="${value}"
      ?checked="${value === (this.#initial ?? this.value)}"
      .checked="${value === this.value}"
      ?required="${this.required}"
      @change="${() => this.choose(choice)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html12`<span class="sds-check__hint">${choice.hint}</span>` : nothing6}
    </span>
  </label>`;
    })}
</fieldset>`;
  }
};
define("sds-radio", SdsRadio);

// packages/frontend/src/components/form-errors.ts
import { html as html14 } from "lit";

// packages/frontend/src/components/note.ts
import { html as html13, nothing as nothing7 } from "lit";
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
    return html13`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? _SdsNote.TONE_ICON[this.tone]}" label="${said}"></sds-icon></span>
  <div class="sds-note__content">
    ${this.heading ? html13`<div class="sds-note__title">${this.heading}</div>` : nothing7}
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
    if (!this.errors.length) return html14``;
    const count = this.errors.length;
    const heading = this.heading || `${count} ${count === 1 ? "answer needs" : "answers need"} changing`;
    return html14`<div class="sds-form-errors" tabindex="-1" role="alert" aria-live="assertive">
  <sds-note
    tone="error"
    heading="${heading}"
    .body="${html14`<span class="sds-form-errors__list">${this.errors.map(
      (error) => html14`<a class="sds-link" href="#${error.for ?? ""}">${error.message}</a>`
    )}</span>`}"
  ></sds-note>
</div>`;
  }
};
define("sds-form-errors", SdsFormErrors);

// packages/frontend/src/components/pills.ts
import { html as html16 } from "lit";

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

// packages/frontend/src/components/nav-base.ts
import { html as html15, nothing as nothing8 } from "lit";
var navLabel = (item) => typeof item === "string" ? item : item.label;
var navHref = (item) => typeof item === "string" ? void 0 : item.href;
var navIcon = (item) => typeof item === "string" ? void 0 : item.icon;
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
    const icon = navIcon(item);
    return icon ? html15`<sds-icon name="${icon}"></sds-icon>${navLabel(item)}` : html15`${navLabel(item)}`;
  }
  /** The class an item carries, active included. */
  class_(index) {
    return index === this.active ? `${this.item} is-active` : this.item;
  }
  items_() {
    return this.items.map((item, i) => {
      const cls = this.class_(i);
      const current = i === this.active;
      const href = navHref(item);
      const inside = this.inside_(item);
      return href ? html15`<a class="${cls}" href="${href}" aria-current="${current ? "page" : nothing8}">${inside}</a>` : html15`<button type="button" class="${cls}" aria-current="${current ? "true" : nothing8}" @click="${() => this.choose(i)}">${inside}</button>`;
    });
  }
};

// packages/frontend/src/components/pills.ts
var SdsPills = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-pills";
    this.item = "sds-pill";
  }
  render() {
    return html16`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
};
define("sds-pills", SdsPills);

// packages/frontend/src/components/header.ts
import { html as html23 } from "lit";

// packages/frontend/src/lib/lockup.ts
import { html as html21 } from "lit";

// packages/frontend/src/components/image.ts
import { html as html20 } from "lit";

// packages/frontend/src/lib/art.ts
import { html as html17 } from "lit";
import { unsafeHTML as unsafeHTML3 } from "lit/directives/unsafe-html.js";

// packages/frontend/src/components/diagrams.generated.ts
var DIAGRAM_VIEWBOX = {
  "answer-sources": "0 0 1200 750",
  "installation-fallback": "0 0 1200 786",
  "system-overview": "0 0 1200 726"
};

// packages/frontend/src/lib/art.ts
var GROUP = "art";
var DRAWING = /\.svg(?:[?#].*)?$/i;
var ELSEWHERE = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;
var ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
var attr = (name, value) => value === void 0 || value === "" ? "" : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c])}"`;
function art(src, alt, options = {}) {
  const { cls = "sds-art", width, height, linked = false } = options;
  const name = alt ? attr("role", "img") + attr("aria-label", alt) : attr("aria-hidden", "true");
  const size = attr("width", width) + attr("height", height);
  if (linked || !DRAWING.test(src) || ELSEWHERE.test(src)) {
    const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c]);
    return html17`${unsafeHTML3(`<img${attr("class", cls)} src="${src}" alt="${escaped}"${size}>`)}`;
  }
  const viewBox = DIAGRAM_VIEWBOX[src.split("/").pop()?.replace(DRAWING, "") ?? ""];
  return html17`${unsafeHTML3(
    `<svg${attr("class", cls)}${attr("viewBox", viewBox)}${size}${name}><use href="${src}#${GROUP}"></use></svg>`
  )}`;
}

// packages/frontend/src/lib/zoom.ts
import { html as html19 } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

// packages/frontend/src/components/lightbox.ts
import { html as html18 } from "lit";
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
    this.linked = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      open: { type: Boolean, reflect: true },
      linked: { type: Boolean }
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
    return html18`<dialog
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
  <div class="sds-lightbox__art${this.linked ? " sds-lightbox__art--exported" : ""}">
    ${art(this.src, this.alt, { linked: this.linked })}
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
  const { src, alt, caption, linked = false } = options;
  return {
    trigger: html19`<a class="sds-zoom" href="${src}" title="Open the picture at full size" @click="${opener(host)}">${picture}</a>`,
    viewer: html19`<sds-lightbox src="${src}" alt="${alt}" ?linked="${linked}" caption="${ifDefined(caption || void 0)}"></sds-lightbox>`
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
      linked: { type: Boolean },
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
    this.linked = false;
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
    const picture = art(this.src, this.alt, { cls, width, height, linked: this.linked });
    if (!this.zoomable) return picture;
    const { trigger, viewer } = zoom(this, picture, { src: this.src, alt: this.alt, linked: this.linked });
    return html20`${trigger}
${viewer}`;
  }
};
define("sds-image", SdsImage);

// packages/frontend/src/lib/lockup.ts
function lockup({ signet = "", brand = "", product = "", href = "" }) {
  if (!signet && !product) return "";
  const inside = html21`${signet ? html21`<sds-image class="sds-signet" src="${signet}" alt="" width="24" height="24"></sds-image>` : ""}${product ? html21`<span class="sds-wordmark">${brand ? html21`${brand}<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${product}</span>` : html21`${product}`}</span>` : ""}`;
  return href ? html21`<a class="sds-lockup" href="${href}">${inside}</a>` : html21`<span class="sds-lockup">${inside}</span>`;
}

// packages/frontend/src/components/overlay.ts
import { html as html22 } from "lit";
var SdsOverlay = class extends SdsElement {
  render() {
    return html22`<div class="sds-overlay"></div>`;
  }
};
define("sds-overlay", SdsOverlay);

// packages/frontend/src/components/header.ts
var seq2 = 0;
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
var SdsHeader = class extends SdsNav {
  constructor() {
    super();
    this.block = "sds-bar";
    this.item = "sds-pill";
    this.drawerId = `sds-bar-drawer-${++seq2}`;
    /** What the sections, the field and the mode pair's two words need in the
        row. Zero means "not measured yet", and each can only be measured where
        it is — standing in the row. */
    this.needNav = 0;
    this.needSearch = 0;
    this.needWords = 0;
    this.watched = false;
    /** The links a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before the page is sent, and passing that
        back through `items` would encode and resolve it a second time — so they
        are kept as written, `target`, `rel` and current mark intact. */
    this.taken = [];
    this.onOutside = (event) => {
      if (!this.open) return;
      if (event.composedPath().includes(this)) return;
      this.open = false;
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
    this.version = "";
    this.tone = "accent";
    this.search = false;
    this.index = "";
    this.rail = "";
    this.label = "Menu";
    this.themeKey = "";
    this.open = false;
    this.compactTheme = false;
    this.foldNav = false;
    this.foldSearch = false;
    this.foldRail = false;
  }
  static {
    this.properties = {
      ...SdsNav.properties,
      home: { type: String },
      signet: { type: String },
      brand: { type: String },
      product: { type: String },
      version: { type: String },
      tone: { type: String },
      search: { type: Boolean },
      index: { type: String },
      rail: { type: String },
      label: { type: String },
      themeKey: { type: String, attribute: "theme-key" },
      open: { type: Boolean, state: true },
      compactTheme: { type: Boolean, state: true },
      foldNav: { type: Boolean, state: true },
      foldSearch: { type: Boolean, state: true },
      foldRail: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
    this.watch = new ResizeObserver(() => {
      this.place();
      this.decide();
    });
    void document.fonts?.ready.then(() => {
      this.needNav = 0;
      this.needSearch = 0;
      this.needWords = 0;
      this.compactTheme = false;
      this.foldNav = false;
      this.foldSearch = false;
      void this.updateComplete.then(() => this.decide());
    });
    document.addEventListener("pointerdown", this.onOutside);
  }
  disconnectedCallback() {
    this.watch?.disconnect();
    document.removeEventListener("pointerdown", this.onOutside);
    this.release();
    super.disconnectedCallback();
  }
  onKey(event) {
    if (event.key !== "Escape" || !this.open) return;
    this.open = false;
    this.querySelector(".sds-bar__toggle")?.focus();
  }
  choose(index) {
    super.choose(index);
    this.open = false;
  }
  /** Whether the layout has taken the rail's column away. Read back from the
      layout rather than decided a second time here: the same rule that stacks
      the body says so, so the two cannot disagree about which width it is. */
  railFolds(home) {
    if (!home) return false;
    return getComputedStyle(home).getPropertyValue("--rail-folded").trim() === "1";
  }
  /** Asked only where it can be answered: in Node there is no document to look
      in, and the bar is rendered there before any page has a rail. */
  get railEl() {
    if (!this.rail || typeof document === "undefined") return null;
    return document.getElementById(this.rail);
  }
  /** The rail, back where the page put it. */
  release() {
    const rail = this.railEl;
    if (!rail || !this.anchor) return;
    this.anchor.replaceWith(rail);
    this.anchor = void 0;
  }
  /** Where the rail belongs at this width, and whether it is there yet. */
  place() {
    const rail = this.railEl;
    if (!rail) {
      this.foldRail = false;
      return;
    }
    this.foldRail = this.railFolds(this.anchor?.parentElement ?? rail.parentElement);
    if (!this.foldRail) return;
    const slot = this.querySelector(".sds-bar__rail");
    if (!slot || rail.parentElement === slot) return;
    this.anchor ??= document.createComment("page rail");
    rail.before(this.anchor);
    slot.append(rail);
  }
  /** What is in the row and what is in the drawer, from the room the row has
      rather than from a width. The order is what the bar can best do without:
      the field first, the sections last, and the rail whenever it has no
      column of its own. */
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
    const field = this.querySelector(".sds-search");
    if (field && !this.foldSearch && !this.needSearch) this.needSearch = widthOf(field);
    if (!this.compactTheme && !this.needWords) {
      const words = [...this.querySelectorAll(".sds-mode__label")];
      this.needWords = words.reduce((sum, el) => {
        const air = el.parentElement ? parseFloat(getComputedStyle(el.parentElement).columnGap) || 0 : 0;
        return sum + widthOf(el) + air;
      }, 0);
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
    if (!foldNav && !foldSearch && !this.foldRail) this.open = false;
  }
  field() {
    return html23`<sds-search index="${this.index}"></sds-search>`;
  }
  /** The sections as parts, and which of them the reader is in. Three shapes
      arrive here: lifted from the page, handed over as markup, or as data.
      Empty rather than absent where nothing was lifted, so the fallback is the
      length and not a `??` that a `[]` never reaches — which is how a
      prerendered bar came to hold an empty `<nav>` and a page with no script
      lost its sections. `lifted()` runs in a browser only. */
  sections() {
    if (this.taken.length) {
      return {
        parts: [...this.taken],
        at: this.taken.findIndex((el) => el.matches(".is-active, [aria-current]"))
      };
    }
    if (this.content) return { parts: [this.content], at: -1 };
    return { parts: this.items_(), at: this.active < this.items.length ? this.active : -1 };
  }
  /** The sections: a row in the bar, a column in the drawer. Given `rail`, the
      box the page's own rail is moved into hangs under the section whose pages
      it holds — so the drawer is one tree, and not two lists a reader has to
      tell apart by guessing which is the level they are on. */
  nav_(rail) {
    const { parts, at } = this.sections();
    const inside = !rail ? parts : at < 0 ? [...parts, rail] : [...parts.slice(0, at + 1), rail, ...parts.slice(at + 1)];
    return html23`<nav class="sds-bar__nav" aria-label="Sections">
    ${lines(inside, 4)}
  </nav>`;
  }
  toggle_() {
    return html23`<button
      type="button"
      class="sds-bar__toggle"
      aria-expanded="${this.open ? "true" : "false"}"
      aria-controls="${this.drawerId}"
      aria-label="${this.label}"
      @click="${() => {
      this.open = !this.open;
    }}"
    ><sds-icon name="${this.open ? "actions-close" : "actions-list"}"></sds-icon></button>`;
  }
  render() {
    const hasNav = Boolean(this.taken.length || this.content || this.items.length);
    const wantsSearch = this.search || Boolean(this.index);
    const drawer = this.foldNav || this.foldSearch || this.foldRail;
    const slot = html23`<div class="sds-bar__rail"></div>`;
    return html23`<header class="sds-bar" @keydown="${(e) => this.onKey(e)}">
  ${lockup({ signet: this.signet, brand: this.brand, product: this.product, href: this.home || "#" })}
  ${hasNav && !this.foldNav ? this.nav_() : ""}
  <div class="sds-bar__end">
    ${this.version ? html23`<sds-badge label="${this.version}" tone="${this.tone}"></sds-badge>` : ""}
    ${wantsSearch && !this.foldSearch ? this.field() : ""}
    ${this.themeKey ? html23`<sds-theme key="${this.themeKey}" ?compact="${this.compactTheme}"></sds-theme>` : html23`<sds-theme ?compact="${this.compactTheme}"></sds-theme>`}
    ${drawer ? this.toggle_() : ""}
  </div>
  ${drawer ? html23`${this.open ? html23`<sds-overlay @click="${() => {
      this.open = false;
    }}"></sds-overlay>
  ` : ""}<div class="sds-bar__drawer" id="${this.drawerId}" ?hidden="${!this.open}" @click="${this.onFollow}">
    ${wantsSearch && this.foldSearch ? this.field() : ""}
    ${hasNav && this.foldNav ? this.nav_(slot) : slot}
  </div>` : ""}
</header>`;
  }
  willUpdate(changed) {
    if (changed.has("items")) {
      this.needNav = 0;
      this.foldNav = false;
    }
    if (changed.has("foldRail") && !this.foldRail) this.release();
    if (changed.has("foldNav")) this.release();
  }
  updated() {
    if (!this.watched) {
      const row = this.querySelector(".sds-bar");
      if (row && this.watch) {
        this.watched = true;
        this.watch.observe(row);
      }
    }
    this.place();
    this.decide();
  }
};
define("sds-header", SdsHeader);

// packages/frontend/src/components/accordion.ts
import { html as html25, nothing as nothing10 } from "lit";

// packages/frontend/src/components/accordion-item.ts
import { html as html24, nothing as nothing9 } from "lit";
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
    return html24`<details
    class="sds-accordion__item"
    name="${this.name || nothing9}"
    ?open="${this.open}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${this.question}</summary>
    <div class="sds-accordion__body" id="${this.anchor || nothing9}">${this.taken ?? this.content}</div>
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
    return html25`<div class="sds-accordion">
  ${this.entries.length ? this.entries.map(
      (entry) => html25`<sds-accordion-item
    question="${entry.question}"
    name="${this.multiple ? nothing10 : this.name}"
    anchor="${entry.anchor ?? nothing10}"
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

// packages/frontend/src/components/tabs.ts
import { html as html27, nothing as nothing11 } from "lit";

// packages/frontend/src/components/tab-item.ts
import { html as html26 } from "lit";
var seq3 = 0;
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
    seq3 += 1;
    this.panelId = `sds-tab-panel-${seq3}`;
    this.tabId = `sds-tab-${seq3}`;
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
    return html26`<div class="sds-tab__panel" role="tabpanel" id="${this.panelId}" aria-labelledby="${this.tabId}" ?hidden="${this.managed && !this.active}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-tab-item", SdsTabItem);

// packages/frontend/src/components/tabs.ts
function tabsBarMarkup(tabs, active, pick, onKey) {
  const buttons = tabs.map((tab, i) => {
    const cls = i === active ? "sds-tab is-active" : "sds-tab";
    const inside = tab.icon ? html27`<sds-icon name="${tab.icon}"></sds-icon>${tab.label}` : html27`${tab.label}`;
    return html27`<button type="button" class="${cls}" role="${tab.panelId ? "tab" : nothing11}" id="${tab.tabId ?? nothing11}" aria-controls="${tab.panelId ?? nothing11}" aria-selected="${tab.panelId ? String(i === active) : nothing11}" tabindex="${tab.panelId ? i === active ? 0 : -1 : nothing11}" @click="${() => pick?.(i)}">${inside}</button>`;
  });
  return html27`<div class="sds-tabs" role="${tabs[0]?.panelId ? "tablist" : nothing11}" @keydown="${(e) => onKey?.(e)}">
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
    return html27`${tabsBarMarkup(tabs, this.active, (i) => this.choose(i), (e) => this.onKey(e))}${held}`;
  }
  updated() {
    this.recall();
    this.show();
  }
};
define("sds-tabs", SdsTabs);

// packages/frontend/src/components/rail.ts
import { html as html28, nothing as nothing12 } from "lit";
var isGroup = (entry) => typeof entry !== "string" && Array.isArray(entry.items);
var SdsRail = class extends SdsNav {
  constructor() {
    super();
    this.block = "sds-rail";
    this.item = "sds-rail__item";
    /** The items a server wrote between the tags. Same reason as `sds-header`: a
        renderer resolves its own tree, and every one of those answers would have
        to be encoded and worked out again to arrive as `items`. What it writes
        are the classes below, so the two shapes are one shape. */
    this.taken = [];
    this.label = "";
  }
  static {
    this.properties = {
      ...SdsNav.properties,
      label: { type: String }
    };
  }
  /* `active` counts across the whole rail, groups flattened, because a rail
     has one current item wherever it sits. A caller that thinks in
     "third item of the second group" is thinking about the markup. */
  flat() {
    return this.items.flatMap(
      (entry) => isGroup(entry) ? [...entry.items] : [entry]
    );
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  /** The heading, where there is one. */
  heading() {
    return this.label ? html28`<div class="sds-label">${this.label}</div>` : nothing12;
  }
  render() {
    const written = this.taken.length ? this.taken : this.content;
    if (written) {
      return html28`<nav class="${this.block}" aria-label="${this.label || "Pages"}">
  ${this.heading()}
  ${written}
</nav>`;
    }
    const entries = this.items;
    if (!entries.some(isGroup)) {
      return html28`<nav class="${this.block}" aria-label="${this.label || "Pages"}">
  ${this.heading()}
  ${lines(this.items_(), 2)}
</nav>`;
    }
    let at = 0;
    const rendered = entries.map((entry) => {
      if (!isGroup(entry)) return this.one(entry, at++);
      const from = at;
      const items = entry.items.map((item) => this.one(item, at++));
      const holdsCurrent = this.active >= from && this.active < at;
      return html28`<details class="sds-rail__group" ?open="${Boolean(entry.open) || holdsCurrent}">
    <summary>${entry.label}<sds-icon name="actions-chevron-down"></sds-icon></summary>
    ${lines(items, 4)}
  </details>`;
    });
    return html28`<nav class="${this.block}" aria-label="${this.label || "Pages"}">
  ${this.heading()}
  ${lines(rendered, 2)}
</nav>`;
  }
  /** One item, at its position in the flattened rail. */
  one(item, index) {
    const cls = index === this.active ? `${this.item} is-active` : this.item;
    const href = typeof item === "string" ? void 0 : item.href;
    const inside = this.inside_(item);
    return href ? html28`<a class="${cls}" href="${href}" aria-current="${index === this.active ? "page" : nothing12}">${inside}</a>` : html28`<button type="button" class="${cls}" aria-current="${index === this.active ? "true" : nothing12}" @click="${() => this.pick(index)}">${inside}</button>`;
  }
  /* `choose` is the base's, and it reads the label out of `items` — which for
     a grouped rail is the entries and not the items. Flattened first, so the
     event says the name of the thing that was pressed. */
  pick(index) {
    const flat = this.flat();
    if (index === this.active) return;
    this.active = index;
    this.dispatchEvent(
      new CustomEvent("sds-change", {
        detail: { index, label: navLabel(flat[index]) },
        bubbles: true,
        composed: true
      })
    );
  }
};
define("sds-rail", SdsRail);

// packages/frontend/src/components/footer.ts
import { html as html29 } from "lit";
var SdsFooter = class _SdsFooter extends SdsElement {
  static {
    this.properties = {
      groups: { type: Array },
      note: { type: String },
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
    this.product = "";
    this.signet = "";
    this.brand = "";
    this.copyright = "";
    this.meta = [];
    this.marks = [];
  }
  static link(item) {
    return item.icon ? html29`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : html29`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}"></sds-link>`;
  }
  /* What a column names, where that is a page. Not `sds-link`: the heading
     keeps the label's register and the label's colour, and at the links' it
     reads as the first entry of the list it names. The trail above a heading
     is written the same way and for the same reason — see `.sds-crumbs a`. */
  static heading(group) {
    return group.href ? html29`<a class="sds-label sds-footer__heading" href="${group.href}">${group.label}</a>` : html29`<div class="sds-label">${group.label}</div>`;
  }
  /* A mark, at the end of the line where marks are looked for: the glyph
     alone, at the size a mark is read at, named for whoever cannot see it.
     One with no glyph in the set is the labelled link it always was — the
     alternative is an account nobody can reach. */
  static mark(item) {
    return item.icon ? html29`<sds-link bare label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : _SdsFooter.link(item);
  }
  /* The mark and the name, in the lockup the bar draws — one construction, so
     the two ends of a site cannot say the name two ways. The mark is hidden
     from a reader who cannot see it rather than announced: the wordmark beside
     it already spells what it says. */
  lockup() {
    if (!this.signet && !this.product) return "";
    return html29`<span class="sds-lockup">
      ${this.signet ? html29`<sds-image class="sds-signet" src="${this.signet}" alt="" width="24" height="24"></sds-image>` : ""}
      ${this.product ? html29`<span class="sds-wordmark">${this.brand ? html29`${this.brand}<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${this.product}</span>` : html29`${this.product}`}</span>` : ""}
    </span>`;
  }
  render() {
    const brand = this.lockup();
    const said = brand || this.note ? html29`<div class="sds-footer__brand">
      ${brand}
      ${this.note ? html29`<p class="sds-footer__note">${this.note}</p>` : ""}
    </div>` : "";
    const closing = this.copyright || this.meta.length || this.marks.length;
    const top = said || this.groups.length;
    return html29`<footer class="sds-footer">
  ${top ? html29`<div class="sds-footer__top">
    ${said}
    ${this.groups.length ? html29`<div class="sds-footer__groups">
      ${this.groups.map(
      (group) => html29`<div class="sds-footer__group">
        ${_SdsFooter.heading(group)}
        <div class="sds-footer__links">
          ${group.items.map((item) => _SdsFooter.link(item))}
        </div>
      </div>`
    )}
    </div>` : ""}
  </div>` : ""}
  ${closing ? html29`<div class="sds-footer__end">
    ${this.copyright ? html29`<span>${this.copyright}</span>` : ""}
    ${this.meta.map((item) => _SdsFooter.link(item))}
    ${this.marks.length ? html29`<span class="sds-footer__marks">${this.marks.map((item) => _SdsFooter.mark(item))}</span>` : ""}
  </div>` : ""}
</footer>`;
  }
};
define("sds-footer", SdsFooter);

// packages/frontend/src/components/surface.ts
import { html as html30 } from "lit";
var PLANE = {
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
    this.boxStyle = "flex:1; min-width:200px";
  }
  static {
    this.properties = {
      plane: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
      heading: { type: String },
      body: { type: String },
      /* The host is `display: contents`, so it is not in the box tree and
         cannot be sized from outside. Layout for the plane goes here and lands
         on the element that is actually laid out. */
      boxStyle: { type: String, attribute: "box-style" }
    };
  }
  connectedCallback() {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }
  render() {
    const label = this.label ? html30`<div class="sds-label">${this.label}</div>` : void 0;
    const icon = this.icon ? html30`<div class="sds-surface-icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : void 0;
    return html30`<div class="${PLANE[this.plane] ?? PLANE.raised}" style="${this.boxStyle}">
  ${icon}
  ${label}
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.taken ?? this.content ?? this.body}</div>
</div>`;
  }
};
define("sds-surface", SdsSurface);

// packages/frontend/src/components/stat.ts
import { html as html31 } from "lit";
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
    return html31`<div class="sds-stat">
  <div class="sds-stat__value">${this.icon ? html31`<span class="sds-stat__icon"><sds-icon name="${this.icon}" size="24"></sds-icon></span>` : ""}${this.value}${this.unit ? html31`<span class="sds-stat__unit">${NNBSP}${this.unit}</span>` : ""}${this.of ? html31`<span class="sds-stat__unit">${NBSP}of${NBSP}${this.of}</span>` : ""}</div>
  <div class="sds-label">${this.label}</div>
  ${bound ? html31`<div class="sds-stat__note">${bound}</div>` : ""}
</div>`;
  }
};
define("sds-stat", SdsStat);

// packages/frontend/src/components/figure.ts
import { html as html32 } from "lit";
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
    this.linked = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      width: { type: Number },
      height: { type: Number },
      zoomable: { type: Boolean, reflect: true },
      linked: { type: Boolean }
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
    const picture = given ? html32`${given}` : art(this.src, this.alt, { width: this.width, height: this.height, linked: this.linked });
    const press = this.zoomable ? zoom(this, picture, {
      src: this.src,
      alt: this.alt,
      linked: this.linked,
      caption: typeof this.caption === "string" ? this.caption : ""
    }) : null;
    const caption = this.captioned ? html32`${this.captioned}` : this.caption ? html32`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : "";
    return html32`<figure class="sds-figure">
  <div class="sds-figure__frame${this.linked ? " sds-figure__frame--exported" : ""}">
    ${press ? press.trigger : picture}
  </div>
  ${caption}
  ${press ? press.viewer : ""}
</figure>`;
  }
};
define("sds-figure", SdsFigure);

// packages/frontend/src/components/embed.ts
import { html as html33, nothing as nothing13 } from "lit";
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
    if (!this.src) return nothing13;
    const size = this.fixed ? `width:${this.width}px;height:${this.height}px` : nothing13;
    return html33`<iframe src="${this.src}" title="${this.label || nothing13}" style="${size}" allow="${this.allow || nothing13}" ?allowfullscreen="${this.allowfullscreen}"></iframe>`;
  }
  render() {
    const shape = this.fixed ? "sds-embed__frame--fixed" : "sds-embed__frame--fluid";
    const style = this.fixed ? nothing13 : `aspect-ratio:${this.ratio || "16 / 9"}`;
    const caption = this.captioned ? html33`${this.captioned}` : this.caption ? html33`<div class="sds-embed__caption">${this.caption}</div>` : void 0;
    return html33`<div class="sds-embed">
  <div class="sds-embed__frame ${shape}" style="${style}" tabindex="${this.fixed ? "0" : nothing13}">${this.framed}</div>
  ${caption}
</div>`;
  }
};
define("sds-embed", SdsEmbed);

// packages/frontend/src/components/modal.ts
import { html as html34 } from "lit";
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
    return html34`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
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
import { html as html35 } from "lit";
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
    return html35`<dialog
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
import { html as html36, nothing as nothing14 } from "lit";
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
    return cls ? html36`<td class="${cls}">${value}</td>` : html36`<td>${value}</td>`;
  }
  bodyRow(row) {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    return html36`<tr class="${row.selected ? "is-selected" : nothing14}" style="${row.style ?? nothing14}">
      ${cells}
    </tr>`;
  }
  render() {
    const cls = `sds-table sds-table--${this.density}`;
    const style = this.width ? `width: ${this.width}` : nothing14;
    const given = this.taken ?? this.content;
    const table = given ? html36`<table class="${cls}" style="${style}">${given}</table>` : html36`<table class="${cls}" style="${style}">
  <thead><tr>
    ${lines(this.columns.map((c) => html36`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
    return this.scrollable ? html36`<div class="sds-table-scroll">${table}</div>` : table;
  }
};
define("sds-table", SdsTable);

// packages/frontend/src/components/card.ts
import { html as html37 } from "lit";
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
    this.linked = false;
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
      linked: { type: Boolean },
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
    const medium = this.src ? html37`<div class="sds-card__media${this.linked ? " sds-card__media--exported" : ""}">
    ${art(this.src, this.alt, { linked: this.linked })}
  </div>` : "";
    const icon = this.icon ? html37`<div class="sds-card__icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : "";
    const label = this.tag || this.label ? html37`<div class="sds-row">
      ${this.tag ? html37`<sds-badge label="${this.tag}"></sds-badge>` : ""}
      ${this.label ? html37`<span class="sds-label">${this.label}</span>` : ""}
    </div>` : "";
    const written = this.taken ?? this.content;
    const blocks = written ?? (typeof this.body === "string" ? void 0 : this.body);
    const text = blocks ? html37`<div class="sds-card__text">${blocks}</div>` : html37`<p class="sds-card__text">${this.body}</p>`;
    const named = this.href ? html37`<a href="${this.href}">${this.heading}</a>` : html37`${this.heading}`;
    const title = this.heading ? html37`<h3 class="sds-card__title">${named}</h3>` : "";
    const action = this.action && this.href ? html37`<span class="sds-card__action">${this.action}<sds-icon name="actions-arrow-right" size="16"></sds-icon></span>` : "";
    const foot = this.footer || action ? html37`<div class="sds-card__foot">
    ${this.footer ? html37`<span class="sds-card__note">${this.footer}</span>` : ""}
    ${action}
  </div>` : "";
    return html37`<article class="sds-card">
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

// packages/frontend/src/components/grid.ts
import { html as html38, nothing as nothing15 } from "lit";
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
    const columns = this.columns > 0 ? `grid-template-columns:repeat(${this.columns},minmax(0,1fr))` : nothing15;
    return html38`<div class="${modifier ? `sds-grid ${modifier}` : "sds-grid"}" style="${columns}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-grid", SdsGrid);

// packages/frontend/src/components/pagination.ts
import { html as html39 } from "lit";
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
var SdsPagination = class extends SdsElement {
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
    const glyph = html39`<sds-icon name="${icon}"></sds-icon>`;
    const inner = icon === "actions-chevron-start" ? html39`${glyph}${label}` : html39`${label}${glyph}`;
    return off ? html39`<span class="${cls}" aria-disabled="true">${inner}</span>` : html39`<a class="${cls}" href="${pageHref(this.href, to)}" rel="${icon === "actions-chevron-start" ? "prev" : "next"}" @click="${(event) => this.ask(event, to)}">${inner}</a>`;
  }
  render() {
    return html39`<nav class="sds-pagination" aria-label="Pages">
  ${this.step("Previous", this.current - 1, "actions-chevron-start")}
  ${pageNumbers(this.pages, this.current).map(
      (n) => n === 0 ? html39`<span class="sds-pagination__gap" aria-hidden="true">…</span>` : n === this.current ? html39`<span class="sds-pagination__page is-active" aria-current="page">${n}</span>` : html39`<a class="sds-pagination__page" href="${pageHref(this.href, n)}" @click="${(event) => this.ask(event, n)}">${n}</a>`
    )}
  ${this.step("Next", this.current + 1, "actions-chevron-end")}
  ${this.count > 0 ? html39`<span class="sds-pagination__count">${grouped(this.count)}${this.label ? ` ${this.label}` : ""}</span>` : ""}
</nav>`;
  }
};
define("sds-pagination", SdsPagination);

// packages/frontend/src/components/pager.ts
import { html as html40 } from "lit";
var SdsPager = class _SdsPager extends SdsElement {
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
  /* `buttonMarkup` rather than `<sds-button>`, the way `sds-pagination` draws
     its own steps: an element given children draws none of them outside a
     browser, and a link that goes somewhere has nothing to upgrade for. The
     markup is the button's own, exported from the button. */
  static step(href, body, rel) {
    return buttonMarkup({ variant: "secondary", href, rel }, body);
  }
  render() {
    const back = this.previousHref && this.previousLabel ? _SdsPager.step(
      this.previousHref,
      html40`<sds-icon name="actions-arrow-left" size="16" label="Previous page"></sds-icon>${buttonLabel(this.previousLabel)}`,
      "prev"
    ) : "";
    const on = this.nextHref && this.nextLabel ? _SdsPager.step(
      this.nextHref,
      html40`${buttonLabel(this.nextLabel)}<sds-icon name="actions-arrow-right" size="16" label="Next page"></sds-icon>`,
      "next"
    ) : "";
    return html40`<nav class="sds-foot sds-pager" aria-label="${this.label}">
  ${back}
  ${on ? html40`<span class="sds-pager__next">${on}</span>` : ""}
</nav>`;
  }
};
define("sds-pager", SdsPager);

// packages/frontend/src/components/code.ts
import { html as html41 } from "lit";
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
  const ATTRIBUTES2 = {
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
      ATTRIBUTES2,
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
              ATTRIBUTES2,
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
  const OPERATOR = {
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
      OPERATOR
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
  const MODES2 = [
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
  const VALUE_MODES = [...MODES2];
  VALUE_MODES.pop();
  VALUE_MODES.push(CONTAINER_STRING);
  VALUE_CONTAINER.contains = VALUE_MODES;
  return {
    name: "YAML",
    case_insensitive: true,
    aliases: ["yml"],
    contains: MODES2
  };
}

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
  sql,
  text: plaintext,
  twig,
  typescript,
  xml,
  yaml
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
    return html41`<button type="button" class="sds-code__copy${this.copied ? " is-copied" : ""}" aria-label="Copy this block" @click="${() => void this.toClipboard()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? "copied" : "copy"}</span></button>`;
  }
  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in — which made the component's own output something any
     caller could half-write. A line is data now, and only this file turns it
     into spans. */
  line({ kind, text, code }) {
    const tail = code ? html41` <span class="sds-code__cmd">${code}</span>` : void 0;
    switch (kind) {
      case "shell":
        return html41`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text}</span>${tail}`;
      case "comment":
        return html41`<span class="sds-code__comment">${text}</span>${tail}`;
      case "ok":
        return html41`<span class="sds-code__ok">✓</span> ${text}${tail}`;
      default:
        return html41`${text}${tail}`;
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
    if (this.given) return html41`${written}`;
    if (!this.lang) return html41`<code>${written}</code>`;
    const coloured = highlight(this.lang, this.text);
    return coloured === null ? html41`<code class="language-${this.lang}">${written}</code>` : html41`<code class="language-${this.lang}">${unsafeHTML4(coloured)}</code>`;
  }
  render() {
    const affordance = this.action ?? this.copyButton;
    const head = this.lang || affordance ? html41`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>` : void 0;
    const caption = this.captioned ? html41`${this.captioned}` : this.caption ? html41`<div class="sds-code__caption">${this.caption}</div>` : void 0;
    return html41`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken || this.content || this.source ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
};
define("sds-code", SdsCode);

// packages/frontend/src/components/diff.ts
import { html as html42 } from "lit";
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
    if (kind === "context") return html42`<span class="sds-diff__line">   ${text}</span>`;
    const mark = kind === "add" ? "+" : "-";
    return html42`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text}</span>`;
  }
  render() {
    return html42`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? "actions-code-compare"}"></sds-icon><span class="sds-code__path">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
};
define("sds-diff", SdsDiff);

// packages/frontend/src/components/quote.ts
import { html as html44 } from "lit";

// packages/frontend/src/components/byline.ts
import { html as html43 } from "lit";
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
    const who = this.href ? html43`<a class="sds-link" href="${this.href}">${this.name}</a>` : html43`${this.name}`;
    return html43`<div class="sds-byline">
  ${this.unmarked ? "" : html43`<span class="sds-byline__mark" aria-hidden="true">${this.mark}</span>`}
  <div class="sds-byline__who">
    <span class="sds-byline__name">${who}${this.as ? html43` <span class="sds-byline__role">· ${this.as}</span>` : ""}</span>
    ${this.meta ? html43`<span class="sds-label">${this.meta}</span>` : ""}
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
    return html44`<figure class="sds-quote">
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
import { html as html45, nothing as nothing16 } from "lit";
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
    return html45`<dt class="sds-label">${label}</dt>
      <dd class="sds-mono">${value}</dd>`;
  }
  render() {
    const facts = this.stated;
    const mark = this.anchor ? html45`<a class="sds-confval__mark" href="#${this.anchor}" aria-label="Link to ${this.name}">#</a>` : nothing16;
    return html45`<dl class="sds-confval">
  <dt class="sds-confval__term" id="${this.anchor || nothing16}">
    <code class="sds-confval__name">${this.name}</code>
    ${this.required ? html45`<sds-badge label="required"></sds-badge>` : nothing16}
    ${mark}
  </dt>
  <dd class="sds-confval__detail">
    ${facts.length ? html45`<dl class="sds-confval__facts">
      ${lines(facts.map((f) => this.fact(f)), 6)}
    </dl>` : nothing16}
    <div class="sds-confval__body">${this.taken ?? this.content ?? this.body}</div>
  </dd>
</dl>`;
  }
};
define("sds-confval", SdsConfval);

// packages/frontend/src/index.ts
if (typeof document !== "undefined") installHostRule();
var TAGS2 = [
  "sds-icon",
  "sds-theme",
  "sds-button",
  "sds-badge",
  "sds-link",
  "sds-crumbs",
  "sds-field",
  "sds-search",
  "sds-field-error",
  "sds-checkbox",
  "sds-radio",
  "sds-form-errors",
  "sds-pills",
  "sds-header",
  "sds-accordion",
  "sds-accordion-item",
  "sds-tabs",
  "sds-tab-item",
  "sds-rail",
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
  "sds-grid",
  "sds-result",
  "sds-pagination",
  "sds-pager",
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
  SdsCode,
  SdsConfval,
  SdsCrumbs,
  SdsDialog,
  SdsDiff,
  SdsElement,
  SdsEmbed,
  SdsField,
  SdsFieldError,
  SdsFigure,
  SdsFooter,
  SdsFormErrors,
  SdsGrid,
  SdsHeader,
  SdsIcon,
  SdsImage,
  SdsLightbox,
  SdsLink,
  SdsModal,
  SdsNote,
  SdsOverlay,
  SdsPager,
  SdsPagination,
  SdsPills,
  SdsQuote,
  SdsRadio,
  SdsRail,
  SdsResult,
  SdsStat,
  SdsSurface,
  SdsTabItem,
  SdsTable,
  SdsTabs,
  SdsTheme,
  TAGS2 as TAGS,
  buttonClass,
  define,
  fieldClass,
  iconIds,
  installHostRule,
  pageNumbers,
  setIconSprite,
  themeBoot
};
//# sourceMappingURL=index.js.map
