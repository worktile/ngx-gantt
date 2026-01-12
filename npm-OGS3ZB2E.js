import {
  __commonJS,
  __require
} from "./chunk-7GOANPIK.js";

// node_modules/to-factory/to-factory.js
var require_to_factory = __commonJS({
  "node_modules/to-factory/to-factory.js"(exports, module) {
    "use strict";
    var _bind = Function.prototype.bind;
    function toFactory(Class) {
      var Factory = function Factory2() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return new (_bind.apply(Class, [null].concat(args)))();
      };
      Factory.__proto__ = Class;
      Factory.prototype = Class.prototype;
      return Factory;
    }
    module.exports = toFactory;
  }
});

// node_modules/hogan.js/lib/compiler.js
var require_compiler = __commonJS({
  "node_modules/hogan.js/lib/compiler.js"(exports) {
    (function(Hogan2) {
      var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
      Hogan2.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        "$": 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        "_v": 9,
        "{": 10,
        "&": 11,
        "_t": 12
      };
      Hogan2.scan = function scan(text, delimiters) {
        var len = text.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state = IN_TEXT, tagType = null, tag = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
        function addBuf() {
          if (buf.length > 0) {
            tokens.push({ tag: "_t", text: new String(buf) });
            buf = "";
          }
        }
        function lineIsWhitespace() {
          var isAllWhitespace = true;
          for (var j = lineStart; j < tokens.length; j++) {
            isAllWhitespace = Hogan2.tags[tokens[j].tag] < Hogan2.tags["_v"] || tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null;
            if (!isAllWhitespace) {
              return false;
            }
          }
          return isAllWhitespace;
        }
        function filterLine(haveSeenTag, noNewLine) {
          addBuf();
          if (haveSeenTag && lineIsWhitespace()) {
            for (var j = lineStart, next; j < tokens.length; j++) {
              if (tokens[j].text) {
                if ((next = tokens[j + 1]) && next.tag == ">") {
                  next.indent = tokens[j].text.toString();
                }
                tokens.splice(j, 1);
              }
            }
          } else if (!noNewLine) {
            tokens.push({ tag: "\n" });
          }
          seenTag = false;
          lineStart = tokens.length;
        }
        function changeDelimiters(text2, index) {
          var close = "=" + ctag, closeIndex = text2.indexOf(close, index), delimiters2 = trim(
            text2.substring(text2.indexOf("=", index) + 1, closeIndex)
          ).split(" ");
          otag = delimiters2[0];
          ctag = delimiters2[delimiters2.length - 1];
          return closeIndex + close.length - 1;
        }
        if (delimiters) {
          delimiters = delimiters.split(" ");
          otag = delimiters[0];
          ctag = delimiters[1];
        }
        for (i = 0; i < len; i++) {
          if (state == IN_TEXT) {
            if (tagChange(otag, text, i)) {
              --i;
              addBuf();
              state = IN_TAG_TYPE;
            } else {
              if (text.charAt(i) == "\n") {
                filterLine(seenTag);
              } else {
                buf += text.charAt(i);
              }
            }
          } else if (state == IN_TAG_TYPE) {
            i += otag.length - 1;
            tag = Hogan2.tags[text.charAt(i + 1)];
            tagType = tag ? text.charAt(i + 1) : "_v";
            if (tagType == "=") {
              i = changeDelimiters(text, i);
              state = IN_TEXT;
            } else {
              if (tag) {
                i++;
              }
              state = IN_TAG;
            }
            seenTag = i;
          } else {
            if (tagChange(ctag, text, i)) {
              tokens.push({
                tag: tagType,
                n: trim(buf),
                otag,
                ctag,
                i: tagType == "/" ? seenTag - otag.length : i + ctag.length
              });
              buf = "";
              i += ctag.length - 1;
              state = IN_TEXT;
              if (tagType == "{") {
                if (ctag == "}}") {
                  i++;
                } else {
                  cleanTripleStache(tokens[tokens.length - 1]);
                }
              }
            } else {
              buf += text.charAt(i);
            }
          }
        }
        filterLine(seenTag, true);
        return tokens;
      };
      function cleanTripleStache(token) {
        if (token.n.substr(token.n.length - 1) === "}") {
          token.n = token.n.substring(0, token.n.length - 1);
        }
      }
      function trim(s) {
        if (s.trim) {
          return s.trim();
        }
        return s.replace(/^\s*|\s*$/g, "");
      }
      function tagChange(tag, text, index) {
        if (text.charAt(index) != tag.charAt(0)) {
          return false;
        }
        for (var i = 1, l = tag.length; i < l; i++) {
          if (text.charAt(index + i) != tag.charAt(i)) {
            return false;
          }
        }
        return true;
      }
      var allowedInSuper = { "_t": true, "\n": true, "$": true, "/": true };
      function buildTree(tokens, kind, stack, customTags) {
        var instructions = [], opener = null, tail = null, token = null;
        tail = stack[stack.length - 1];
        while (tokens.length > 0) {
          token = tokens.shift();
          if (tail && tail.tag == "<" && !(token.tag in allowedInSuper)) {
            throw new Error("Illegal content in < super tag.");
          }
          if (Hogan2.tags[token.tag] <= Hogan2.tags["$"] || isOpener(token, customTags)) {
            stack.push(token);
            token.nodes = buildTree(tokens, token.tag, stack, customTags);
          } else if (token.tag == "/") {
            if (stack.length === 0) {
              throw new Error("Closing tag without opener: /" + token.n);
            }
            opener = stack.pop();
            if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
              throw new Error("Nesting error: " + opener.n + " vs. " + token.n);
            }
            opener.end = token.i;
            return instructions;
          } else if (token.tag == "\n") {
            token.last = tokens.length == 0 || tokens[0].tag == "\n";
          }
          instructions.push(token);
        }
        if (stack.length > 0) {
          throw new Error("missing closing tag: " + stack.pop().n);
        }
        return instructions;
      }
      function isOpener(token, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].o == token.n) {
            token.tag = "#";
            return true;
          }
        }
      }
      function isCloser(close, open, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].c == close && tags[i].o == open) {
            return true;
          }
        }
      }
      function stringifySubstitutions(obj) {
        var items = [];
        for (var key2 in obj) {
          items.push('"' + esc(key2) + '": function(c,p,t,i) {' + obj[key2] + "}");
        }
        return "{ " + items.join(",") + " }";
      }
      function stringifyPartials(codeObj) {
        var partials = [];
        for (var key2 in codeObj.partials) {
          partials.push('"' + esc(key2) + '":{name:"' + esc(codeObj.partials[key2].name) + '", ' + stringifyPartials(codeObj.partials[key2]) + "}");
        }
        return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
      }
      Hogan2.stringify = function(codeObj, text, options) {
        return "{code: function (c,p,i) { " + Hogan2.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
      };
      var serialNo = 0;
      Hogan2.generate = function(tree, text, options) {
        serialNo = 0;
        var context = { code: "", subs: {}, partials: {} };
        Hogan2.walk(tree, context);
        if (options.asString) {
          return this.stringify(context, text, options);
        }
        return this.makeTemplate(context, text, options);
      };
      Hogan2.wrapMain = function(code) {
        return 'var t=this;t.b(i=i||"");' + code + "return t.fl();";
      };
      Hogan2.template = Hogan2.Template;
      Hogan2.makeTemplate = function(codeObj, text, options) {
        var template = this.makePartials(codeObj);
        template.code = new Function("c", "p", "i", this.wrapMain(codeObj.code));
        return new this.template(template, text, this, options);
      };
      Hogan2.makePartials = function(codeObj) {
        var key2, template = { subs: {}, partials: codeObj.partials, name: codeObj.name };
        for (key2 in template.partials) {
          template.partials[key2] = this.makePartials(template.partials[key2]);
        }
        for (key2 in codeObj.subs) {
          template.subs[key2] = new Function("c", "p", "t", "i", codeObj.subs[key2]);
        }
        return template;
      };
      function esc(s) {
        return s.replace(rSlash, "\\\\").replace(rQuot, '\\"').replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029");
      }
      function chooseMethod(s) {
        return ~s.indexOf(".") ? "d" : "f";
      }
      function createPartial(node, context) {
        var prefix = "<" + (context.prefix || "");
        var sym = prefix + node.n + serialNo++;
        context.partials[sym] = { name: node.n, partials: {} };
        context.code += 't.b(t.rp("' + esc(sym) + '",c,p,"' + (node.indent || "") + '"));';
        return sym;
      }
      Hogan2.codegen = {
        "#": function(node, context) {
          context.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){';
          Hogan2.walk(node.nodes, context);
          context.code += "});c.pop();}";
        },
        "^": function(node, context) {
          context.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
          Hogan2.walk(node.nodes, context);
          context.code += "};";
        },
        ">": createPartial,
        "<": function(node, context) {
          var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
          Hogan2.walk(node.nodes, ctx);
          var template = context.partials[createPartial(node, context)];
          template.subs = ctx.subs;
          template.partials = ctx.partials;
        },
        "$": function(node, context) {
          var ctx = { subs: {}, code: "", partials: context.partials, prefix: node.n };
          Hogan2.walk(node.nodes, ctx);
          context.subs[node.n] = ctx.code;
          if (!context.inPartial) {
            context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
          }
        },
        "\n": function(node, context) {
          context.code += write('"\\n"' + (node.last ? "" : " + i"));
        },
        "_v": function(node, context) {
          context.code += "t.b(t.v(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
        },
        "_t": function(node, context) {
          context.code += write('"' + esc(node.text) + '"');
        },
        "{": tripleStache,
        "&": tripleStache
      };
      function tripleStache(node, context) {
        context.code += "t.b(t.t(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
      }
      function write(s) {
        return "t.b(" + s + ");";
      }
      Hogan2.walk = function(nodelist, context) {
        var func;
        for (var i = 0, l = nodelist.length; i < l; i++) {
          func = Hogan2.codegen[nodelist[i].tag];
          func && func(nodelist[i], context);
        }
        return context;
      };
      Hogan2.parse = function(tokens, text, options) {
        options = options || {};
        return buildTree(tokens, "", [], options.sectionTags || []);
      };
      Hogan2.cache = {};
      Hogan2.cacheKey = function(text, options) {
        return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||");
      };
      Hogan2.compile = function(text, options) {
        options = options || {};
        var key2 = Hogan2.cacheKey(text, options);
        var template = this.cache[key2];
        if (template) {
          var partials = template.partials;
          for (var name in partials) {
            delete partials[name].instance;
          }
          return template;
        }
        template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
        return this.cache[key2] = template;
      };
    })(typeof exports !== "undefined" ? exports : Hogan);
  }
});

// node_modules/hogan.js/lib/template.js
var require_template = __commonJS({
  "node_modules/hogan.js/lib/template.js"(exports) {
    var Hogan2 = {};
    (function(Hogan3) {
      Hogan3.Template = function(codeObj, text, compiler, options) {
        codeObj = codeObj || {};
        this.r = codeObj.code || this.r;
        this.c = compiler;
        this.options = options || {};
        this.text = text || "";
        this.partials = codeObj.partials || {};
        this.subs = codeObj.subs || {};
        this.buf = "";
      };
      Hogan3.Template.prototype = {
        // render: replaced by generated code.
        r: function(context, partials, indent) {
          return "";
        },
        // variable escaping
        v: hoganEscape,
        // triple stache
        t: coerceToString,
        render: function render(context, partials, indent) {
          return this.ri([context], partials || {}, indent);
        },
        // render internal -- a hook for overrides that catches partials too
        ri: function(context, partials, indent) {
          return this.r(context, partials, indent);
        },
        // ensurePartial
        ep: function(symbol, partials) {
          var partial = this.partials[symbol];
          var template = partials[partial.name];
          if (partial.instance && partial.base == template) {
            return partial.instance;
          }
          if (typeof template == "string") {
            if (!this.c) {
              throw new Error("No compiler available.");
            }
            template = this.c.compile(template, this.options);
          }
          if (!template) {
            return null;
          }
          this.partials[symbol].base = template;
          if (partial.subs) {
            if (!partials.stackText) partials.stackText = {};
            for (key in partial.subs) {
              if (!partials.stackText[key]) {
                partials.stackText[key] = this.activeSub !== void 0 && partials.stackText[this.activeSub] ? partials.stackText[this.activeSub] : this.text;
              }
            }
            template = createSpecializedPartial(
              template,
              partial.subs,
              partial.partials,
              this.stackSubs,
              this.stackPartials,
              partials.stackText
            );
          }
          this.partials[symbol].instance = template;
          return template;
        },
        // tries to find a partial in the current scope and render it
        rp: function(symbol, context, partials, indent) {
          var partial = this.ep(symbol, partials);
          if (!partial) {
            return "";
          }
          return partial.ri(context, partials, indent);
        },
        // render a section
        rs: function(context, partials, section) {
          var tail = context[context.length - 1];
          if (!isArray(tail)) {
            section(context, partials, this);
            return;
          }
          for (var i = 0; i < tail.length; i++) {
            context.push(tail[i]);
            section(context, partials, this);
            context.pop();
          }
        },
        // maybe start a section
        s: function(val, ctx, partials, inverted, start, end, tags) {
          var pass;
          if (isArray(val) && val.length === 0) {
            return false;
          }
          if (typeof val == "function") {
            val = this.ms(val, ctx, partials, inverted, start, end, tags);
          }
          pass = !!val;
          if (!inverted && pass && ctx) {
            ctx.push(typeof val == "object" ? val : ctx[ctx.length - 1]);
          }
          return pass;
        },
        // find values with dotted names
        d: function(key2, ctx, partials, returnFound) {
          var found, names = key2.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
          if (key2 === "." && isArray(ctx[ctx.length - 2])) {
            val = ctx[ctx.length - 1];
          } else {
            for (var i = 1; i < names.length; i++) {
              found = findInScope(names[i], val, doModelGet);
              if (found !== void 0) {
                cx = val;
                val = found;
              } else {
                val = "";
              }
            }
          }
          if (returnFound && !val) {
            return false;
          }
          if (!returnFound && typeof val == "function") {
            ctx.push(cx);
            val = this.mv(val, ctx, partials);
            ctx.pop();
          }
          return val;
        },
        // find values with normal names
        f: function(key2, ctx, partials, returnFound) {
          var val = false, v = null, found = false, doModelGet = this.options.modelGet;
          for (var i = ctx.length - 1; i >= 0; i--) {
            v = ctx[i];
            val = findInScope(key2, v, doModelGet);
            if (val !== void 0) {
              found = true;
              break;
            }
          }
          if (!found) {
            return returnFound ? false : "";
          }
          if (!returnFound && typeof val == "function") {
            val = this.mv(val, ctx, partials);
          }
          return val;
        },
        // higher order templates
        ls: function(func, cx, partials, text, tags) {
          var oldTags = this.options.delimiters;
          this.options.delimiters = tags;
          this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
          this.options.delimiters = oldTags;
          return false;
        },
        // compile text
        ct: function(text, cx, partials) {
          if (this.options.disableLambda) {
            throw new Error("Lambda features disabled.");
          }
          return this.c.compile(text, this.options).render(cx, partials);
        },
        // template result buffering
        b: function(s) {
          this.buf += s;
        },
        fl: function() {
          var r = this.buf;
          this.buf = "";
          return r;
        },
        // method replace section
        ms: function(func, ctx, partials, inverted, start, end, tags) {
          var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
          if (typeof result == "function") {
            if (inverted) {
              return true;
            } else {
              textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text;
              return this.ls(result, cx, partials, textSource.substring(start, end), tags);
            }
          }
          return result;
        },
        // method replace variable
        mv: function(func, ctx, partials) {
          var cx = ctx[ctx.length - 1];
          var result = func.call(cx);
          if (typeof result == "function") {
            return this.ct(coerceToString(result.call(cx)), cx, partials);
          }
          return result;
        },
        sub: function(name, context, partials, indent) {
          var f = this.subs[name];
          if (f) {
            this.activeSub = name;
            f(context, partials, this, indent);
            this.activeSub = false;
          }
        }
      };
      function findInScope(key2, scope, doModelGet) {
        var val;
        if (scope && typeof scope == "object") {
          if (scope[key2] !== void 0) {
            val = scope[key2];
          } else if (doModelGet && scope.get && typeof scope.get == "function") {
            val = scope.get(key2);
          }
        }
        return val;
      }
      function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
        function PartialTemplate() {
        }
        ;
        PartialTemplate.prototype = instance;
        function Substitutions() {
        }
        ;
        Substitutions.prototype = instance.subs;
        var key2;
        var partial = new PartialTemplate();
        partial.subs = new Substitutions();
        partial.subsText = {};
        partial.buf = "";
        stackSubs = stackSubs || {};
        partial.stackSubs = stackSubs;
        partial.subsText = stackText;
        for (key2 in subs) {
          if (!stackSubs[key2]) stackSubs[key2] = subs[key2];
        }
        for (key2 in stackSubs) {
          partial.subs[key2] = stackSubs[key2];
        }
        stackPartials = stackPartials || {};
        partial.stackPartials = stackPartials;
        for (key2 in partials) {
          if (!stackPartials[key2]) stackPartials[key2] = partials[key2];
        }
        for (key2 in stackPartials) {
          partial.partials[key2] = stackPartials[key2];
        }
        return partial;
      }
      var rAmp = /&/g, rLt = /</g, rGt = />/g, rApos = /\'/g, rQuot = /\"/g, hChars = /[&<>\"\']/;
      function coerceToString(val) {
        return String(val === null || val === void 0 ? "" : val);
      }
      function hoganEscape(str) {
        str = coerceToString(str);
        return hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str;
      }
      var isArray = Array.isArray || function(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
      };
    })(typeof exports !== "undefined" ? exports : Hogan2);
  }
});

// node_modules/hogan.js/lib/hogan.js
var require_hogan = __commonJS({
  "node_modules/hogan.js/lib/hogan.js"(exports, module) {
    var Hogan2 = require_compiler();
    Hogan2.Template = require_template().Template;
    Hogan2.template = Hogan2.Template;
    module.exports = Hogan2;
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/foreach/index.js
var require_foreach = __commonJS({
  "node_modules/foreach/index.js"(exports, module) {
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    module.exports = function forEach(obj, fn, ctx) {
      if (toString.call(fn) !== "[object Function]") {
        throw new TypeError("iterator must be a function");
      }
      var l = obj.length;
      if (l === +l) {
        for (var i = 0; i < l; i++) {
          fn.call(ctx, obj[i], i, obj);
        }
      } else {
        for (var k in obj) {
          if (hasOwn.call(obj, k)) {
            fn.call(ctx, obj[k], k, obj);
          }
        }
      }
    };
  }
});

// node_modules/algoliasearch/src/errors.js
var require_errors = __commonJS({
  "node_modules/algoliasearch/src/errors.js"(exports, module) {
    "use strict";
    var inherits = require_inherits_browser();
    function AlgoliaSearchError(message, extraProperties) {
      var forEach = require_foreach();
      var error = this;
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      } else {
        error.stack = new Error().stack || "Cannot get a stacktrace, browser is too old";
      }
      this.name = "AlgoliaSearchError";
      this.message = message || "Unknown error";
      if (extraProperties) {
        forEach(extraProperties, function addToErrorObject(value, key2) {
          error[key2] = value;
        });
      }
    }
    inherits(AlgoliaSearchError, Error);
    function createCustomError(name, message) {
      function AlgoliaSearchCustomError() {
        var args = Array.prototype.slice.call(arguments, 0);
        if (typeof args[0] !== "string") {
          args.unshift(message);
        }
        AlgoliaSearchError.apply(this, args);
        this.name = "AlgoliaSearch" + name + "Error";
      }
      inherits(AlgoliaSearchCustomError, AlgoliaSearchError);
      return AlgoliaSearchCustomError;
    }
    module.exports = {
      AlgoliaSearchError,
      UnparsableJSON: createCustomError(
        "UnparsableJSON",
        "Could not parse the incoming response as JSON, see err.more for details"
      ),
      RequestTimeout: createCustomError(
        "RequestTimeout",
        "Request timed out before getting a response"
      ),
      Network: createCustomError(
        "Network",
        "Network issue, see err.more for details"
      ),
      JSONPScriptFail: createCustomError(
        "JSONPScriptFail",
        "<script> was loaded but did not call our provided callback"
      ),
      ValidUntilNotFound: createCustomError(
        "ValidUntilNotFound",
        "The SecuredAPIKey does not have a validUntil parameter."
      ),
      JSONPScriptError: createCustomError(
        "JSONPScriptError",
        "<script> unable to load due to an `error` event on it"
      ),
      ObjectNotFound: createCustomError(
        "ObjectNotFound",
        "Object not found"
      ),
      Unknown: createCustomError(
        "Unknown",
        "Unknown error occured"
      )
    };
  }
});

// node_modules/algoliasearch/src/exitPromise.js
var require_exitPromise = __commonJS({
  "node_modules/algoliasearch/src/exitPromise.js"(exports, module) {
    module.exports = function exitPromise(fn, _setTimeout) {
      _setTimeout(fn, 0);
    };
  }
});

// node_modules/algoliasearch/src/buildSearchMethod.js
var require_buildSearchMethod = __commonJS({
  "node_modules/algoliasearch/src/buildSearchMethod.js"(exports, module) {
    module.exports = buildSearchMethod;
    var errors = require_errors();
    function buildSearchMethod(queryParam, url) {
      return function search(query, args, callback) {
        if (typeof query === "function" && typeof args === "object" || typeof callback === "object") {
          throw new errors.AlgoliaSearchError("index.search usage is index.search(query, params, cb)");
        }
        if (arguments.length === 0 || typeof query === "function") {
          callback = query;
          query = "";
        } else if (arguments.length === 1 || typeof args === "function") {
          callback = args;
          args = void 0;
        }
        if (typeof query === "object" && query !== null) {
          args = query;
          query = void 0;
        } else if (query === void 0 || query === null) {
          query = "";
        }
        var params = "";
        if (query !== void 0) {
          params += queryParam + "=" + encodeURIComponent(query);
        }
        var additionalUA;
        if (args !== void 0) {
          if (args.additionalUA) {
            additionalUA = args.additionalUA;
            delete args.additionalUA;
          }
          params = this.as._getSearchParams(args, params);
        }
        return this._search(params, url, callback, additionalUA);
      };
    }
  }
});

// node_modules/algoliasearch/src/deprecate.js
var require_deprecate = __commonJS({
  "node_modules/algoliasearch/src/deprecate.js"(exports, module) {
    module.exports = function deprecate(fn, message) {
      var warned = false;
      function deprecated() {
        if (!warned) {
          console.warn(message);
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    };
  }
});

// node_modules/algoliasearch/src/deprecatedMessage.js
var require_deprecatedMessage = __commonJS({
  "node_modules/algoliasearch/src/deprecatedMessage.js"(exports, module) {
    module.exports = function deprecatedMessage(previousUsage, newUsage) {
      var githubAnchorLink = previousUsage.toLowerCase().replace(/[\.\(\)]/g, "");
      return "algoliasearch: `" + previousUsage + "` was replaced by `" + newUsage + "`. Please see https://github.com/algolia/algoliasearch-client-javascript/wiki/Deprecated#" + githubAnchorLink;
    };
  }
});

// node_modules/algoliasearch/src/merge.js
var require_merge = __commonJS({
  "node_modules/algoliasearch/src/merge.js"(exports, module) {
    var foreach = require_foreach();
    module.exports = function merge(destination) {
      var sources = Array.prototype.slice.call(arguments);
      foreach(sources, function(source) {
        for (var keyName in source) {
          if (source.hasOwnProperty(keyName)) {
            if (typeof destination[keyName] === "object" && typeof source[keyName] === "object") {
              destination[keyName] = merge({}, destination[keyName], source[keyName]);
            } else if (source[keyName] !== void 0) {
              destination[keyName] = source[keyName];
            }
          }
        }
      });
      return destination;
    };
  }
});

// node_modules/algoliasearch/src/clone.js
var require_clone = __commonJS({
  "node_modules/algoliasearch/src/clone.js"(exports, module) {
    module.exports = function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  }
});

// node_modules/object-keys/isArguments.js
var require_isArguments = __commonJS({
  "node_modules/object-keys/isArguments.js"(exports, module) {
    "use strict";
    var toStr = Object.prototype.toString;
    module.exports = function isArguments(value) {
      var str = toStr.call(value);
      var isArgs = str === "[object Arguments]";
      if (!isArgs) {
        isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
      }
      return isArgs;
    };
  }
});

// node_modules/object-keys/implementation.js
var require_implementation = __commonJS({
  "node_modules/object-keys/implementation.js"(exports, module) {
    "use strict";
    var keysShim;
    if (!Object.keys) {
      has = Object.prototype.hasOwnProperty;
      toStr = Object.prototype.toString;
      isArgs = require_isArguments();
      isEnumerable = Object.prototype.propertyIsEnumerable;
      hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
      hasProtoEnumBug = isEnumerable.call(function() {
      }, "prototype");
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor"
      ];
      equalsConstructorPrototype = function(o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
      };
      excludedKeys = {
        $applicationCache: true,
        $console: true,
        $external: true,
        $frame: true,
        $frameElement: true,
        $frames: true,
        $innerHeight: true,
        $innerWidth: true,
        $onmozfullscreenchange: true,
        $onmozfullscreenerror: true,
        $outerHeight: true,
        $outerWidth: true,
        $pageXOffset: true,
        $pageYOffset: true,
        $parent: true,
        $scrollLeft: true,
        $scrollTop: true,
        $scrollX: true,
        $scrollY: true,
        $self: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $window: true
      };
      hasAutomationEqualityBug = (function() {
        if (typeof window === "undefined") {
          return false;
        }
        for (var k in window) {
          try {
            if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
              try {
                equalsConstructorPrototype(window[k]);
              } catch (e) {
                return true;
              }
            }
          } catch (e) {
            return true;
          }
        }
        return false;
      })();
      equalsConstructorPrototypeIfNotBuggy = function(o) {
        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
          return equalsConstructorPrototype(o);
        }
        try {
          return equalsConstructorPrototype(o);
        } catch (e) {
          return false;
        }
      };
      keysShim = function keys(object) {
        var isObject = object !== null && typeof object === "object";
        var isFunction = toStr.call(object) === "[object Function]";
        var isArguments = isArgs(object);
        var isString = isObject && toStr.call(object) === "[object String]";
        var theKeys = [];
        if (!isObject && !isFunction && !isArguments) {
          throw new TypeError("Object.keys called on a non-object");
        }
        var skipProto = hasProtoEnumBug && isFunction;
        if (isString && object.length > 0 && !has.call(object, 0)) {
          for (var i = 0; i < object.length; ++i) {
            theKeys.push(String(i));
          }
        }
        if (isArguments && object.length > 0) {
          for (var j = 0; j < object.length; ++j) {
            theKeys.push(String(j));
          }
        } else {
          for (var name in object) {
            if (!(skipProto && name === "prototype") && has.call(object, name)) {
              theKeys.push(String(name));
            }
          }
        }
        if (hasDontEnumBug) {
          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
          for (var k = 0; k < dontEnums.length; ++k) {
            if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
              theKeys.push(dontEnums[k]);
            }
          }
        }
        return theKeys;
      };
    }
    var has;
    var toStr;
    var isArgs;
    var isEnumerable;
    var hasDontEnumBug;
    var hasProtoEnumBug;
    var dontEnums;
    var equalsConstructorPrototype;
    var excludedKeys;
    var hasAutomationEqualityBug;
    var equalsConstructorPrototypeIfNotBuggy;
    module.exports = keysShim;
  }
});

// node_modules/object-keys/index.js
var require_object_keys = __commonJS({
  "node_modules/object-keys/index.js"(exports, module) {
    "use strict";
    var slice = Array.prototype.slice;
    var isArgs = require_isArguments();
    var origKeys = Object.keys;
    var keysShim = origKeys ? function keys(o) {
      return origKeys(o);
    } : require_implementation();
    var originalKeys = Object.keys;
    keysShim.shim = function shimObjectKeys() {
      if (Object.keys) {
        var keysWorksWithArguments = (function() {
          var args = Object.keys(arguments);
          return args && args.length === arguments.length;
        })(1, 2);
        if (!keysWorksWithArguments) {
          Object.keys = function keys(object) {
            if (isArgs(object)) {
              return originalKeys(slice.call(object));
            }
            return originalKeys(object);
          };
        }
      } else {
        Object.keys = keysShim;
      }
      return Object.keys || keysShim;
    };
    module.exports = keysShim;
  }
});

// node_modules/algoliasearch/src/omit.js
var require_omit = __commonJS({
  "node_modules/algoliasearch/src/omit.js"(exports, module) {
    module.exports = function omit(obj, test) {
      var keys = require_object_keys();
      var foreach = require_foreach();
      var filtered = {};
      foreach(keys(obj), function doFilter(keyName) {
        if (test(keyName) !== true) {
          filtered[keyName] = obj[keyName];
        }
      });
      return filtered;
    };
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports, module) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/algoliasearch/src/map.js
var require_map = __commonJS({
  "node_modules/algoliasearch/src/map.js"(exports, module) {
    var foreach = require_foreach();
    module.exports = function map(arr, fn) {
      var newArr = [];
      foreach(arr, function(item, itemIndex) {
        newArr.push(fn(item, itemIndex, arr));
      });
      return newArr;
    };
  }
});

// node_modules/algoliasearch/src/IndexCore.js
var require_IndexCore = __commonJS({
  "node_modules/algoliasearch/src/IndexCore.js"(exports, module) {
    var buildSearchMethod = require_buildSearchMethod();
    var deprecate = require_deprecate();
    var deprecatedMessage = require_deprecatedMessage();
    module.exports = IndexCore;
    function IndexCore(algoliasearch, indexName) {
      this.indexName = indexName;
      this.as = algoliasearch;
      this.typeAheadArgs = null;
      this.typeAheadValueOption = null;
      this.cache = {};
    }
    IndexCore.prototype.clearCache = function() {
      this.cache = {};
    };
    IndexCore.prototype.search = buildSearchMethod("query");
    IndexCore.prototype.similarSearch = deprecate(
      buildSearchMethod("similarQuery"),
      deprecatedMessage(
        "index.similarSearch(query[, callback])",
        "index.search({ similarQuery: query }[, callback])"
      )
    );
    IndexCore.prototype.browse = function(query, queryParameters, callback) {
      var merge = require_merge();
      var indexObj = this;
      var page;
      var hitsPerPage;
      if (arguments.length === 0 || arguments.length === 1 && typeof arguments[0] === "function") {
        page = 0;
        callback = arguments[0];
        query = void 0;
      } else if (typeof arguments[0] === "number") {
        page = arguments[0];
        if (typeof arguments[1] === "number") {
          hitsPerPage = arguments[1];
        } else if (typeof arguments[1] === "function") {
          callback = arguments[1];
          hitsPerPage = void 0;
        }
        query = void 0;
        queryParameters = void 0;
      } else if (typeof arguments[0] === "object") {
        if (typeof arguments[1] === "function") {
          callback = arguments[1];
        }
        queryParameters = arguments[0];
        query = void 0;
      } else if (typeof arguments[0] === "string" && typeof arguments[1] === "function") {
        callback = arguments[1];
        queryParameters = void 0;
      }
      queryParameters = merge({}, queryParameters || {}, {
        page,
        hitsPerPage,
        query
      });
      var params = this.as._getSearchParams(queryParameters, "");
      return this.as._jsonRequest({
        method: "POST",
        url: "/1/indexes/" + encodeURIComponent(indexObj.indexName) + "/browse",
        body: { params },
        hostType: "read",
        callback
      });
    };
    IndexCore.prototype.browseFrom = function(cursor, callback) {
      return this.as._jsonRequest({
        method: "POST",
        url: "/1/indexes/" + encodeURIComponent(this.indexName) + "/browse",
        body: { cursor },
        hostType: "read",
        callback
      });
    };
    IndexCore.prototype.searchForFacetValues = function(params, callback) {
      var clone = require_clone();
      var omit = require_omit();
      var usage = "Usage: index.searchForFacetValues({facetName, facetQuery, ...params}[, callback])";
      if (params.facetName === void 0 || params.facetQuery === void 0) {
        throw new Error(usage);
      }
      var facetName = params.facetName;
      var filteredParams = omit(clone(params), function(keyName) {
        return keyName === "facetName";
      });
      var searchParameters = this.as._getSearchParams(filteredParams, "");
      return this.as._jsonRequest({
        method: "POST",
        url: "/1/indexes/" + encodeURIComponent(this.indexName) + "/facets/" + encodeURIComponent(facetName) + "/query",
        hostType: "read",
        body: { params: searchParameters },
        callback
      });
    };
    IndexCore.prototype.searchFacet = deprecate(function(params, callback) {
      return this.searchForFacetValues(params, callback);
    }, deprecatedMessage(
      "index.searchFacet(params[, callback])",
      "index.searchForFacetValues(params[, callback])"
    ));
    IndexCore.prototype._search = function(params, url, callback, additionalUA) {
      return this.as._jsonRequest({
        cache: this.cache,
        method: "POST",
        url: url || "/1/indexes/" + encodeURIComponent(this.indexName) + "/query",
        body: { params },
        hostType: "read",
        fallback: {
          method: "GET",
          url: "/1/indexes/" + encodeURIComponent(this.indexName),
          body: { params }
        },
        callback,
        additionalUA
      });
    };
    IndexCore.prototype.getObject = function(objectID, attrs, callback) {
      var indexObj = this;
      if (arguments.length === 1 || typeof attrs === "function") {
        callback = attrs;
        attrs = void 0;
      }
      var params = "";
      if (attrs !== void 0) {
        params = "?attributes=";
        for (var i = 0; i < attrs.length; ++i) {
          if (i !== 0) {
            params += ",";
          }
          params += attrs[i];
        }
      }
      return this.as._jsonRequest({
        method: "GET",
        url: "/1/indexes/" + encodeURIComponent(indexObj.indexName) + "/" + encodeURIComponent(objectID) + params,
        hostType: "read",
        callback
      });
    };
    IndexCore.prototype.getObjects = function(objectIDs, attributesToRetrieve, callback) {
      var isArray = require_isarray();
      var map = require_map();
      var usage = "Usage: index.getObjects(arrayOfObjectIDs[, callback])";
      if (!isArray(objectIDs)) {
        throw new Error(usage);
      }
      var indexObj = this;
      if (arguments.length === 1 || typeof attributesToRetrieve === "function") {
        callback = attributesToRetrieve;
        attributesToRetrieve = void 0;
      }
      var body = {
        requests: map(objectIDs, function prepareRequest(objectID) {
          var request = {
            indexName: indexObj.indexName,
            objectID
          };
          if (attributesToRetrieve) {
            request.attributesToRetrieve = attributesToRetrieve.join(",");
          }
          return request;
        })
      };
      return this.as._jsonRequest({
        method: "POST",
        url: "/1/indexes/*/objects",
        hostType: "read",
        body,
        callback
      });
    };
    IndexCore.prototype.as = null;
    IndexCore.prototype.indexName = null;
    IndexCore.prototype.typeAheadArgs = null;
    IndexCore.prototype.typeAheadValueOption = null;
  }
});

// node_modules/algoliasearch/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/algoliasearch/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
  }
});

// node_modules/algoliasearch/node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/algoliasearch/node_modules/debug/src/debug.js"(exports, module) {
    exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    function createDebug(namespace) {
      function debug() {
        if (!debug.enabled) return;
        var self2 = debug;
        var curr = +/* @__PURE__ */ new Date();
        var ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self2, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug);
      }
      return debug;
    }
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    function disable() {
      exports.enable("");
    }
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
  }
});

// node_modules/algoliasearch/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/algoliasearch/node_modules/debug/src/browser.js"(exports, module) {
    exports = module.exports = require_debug();
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    function log() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
  }
});

// node_modules/algoliasearch/src/store.js
var require_store = __commonJS({
  "node_modules/algoliasearch/src/store.js"(exports, module) {
    var debug = require_browser()("algoliasearch:src/hostIndexState.js");
    var localStorageNamespace = "algoliasearch-client-js";
    var store;
    var moduleStore = {
      state: {},
      set: function(key2, data) {
        this.state[key2] = data;
        return this.state[key2];
      },
      get: function(key2) {
        return this.state[key2] || null;
      }
    };
    var localStorageStore = {
      set: function(key2, data) {
        moduleStore.set(key2, data);
        try {
          var namespace = JSON.parse(global.localStorage[localStorageNamespace]);
          namespace[key2] = data;
          global.localStorage[localStorageNamespace] = JSON.stringify(namespace);
          return namespace[key2];
        } catch (e) {
          return localStorageFailure(key2, e);
        }
      },
      get: function(key2) {
        try {
          return JSON.parse(global.localStorage[localStorageNamespace])[key2] || null;
        } catch (e) {
          return localStorageFailure(key2, e);
        }
      }
    };
    function localStorageFailure(key2, e) {
      debug("localStorage failed with", e);
      cleanup();
      store = moduleStore;
      return store.get(key2);
    }
    store = supportsLocalStorage() ? localStorageStore : moduleStore;
    module.exports = {
      get: getOrSet,
      set: getOrSet,
      supportsLocalStorage
    };
    function getOrSet(key2, data) {
      if (arguments.length === 1) {
        return store.get(key2);
      }
      return store.set(key2, data);
    }
    function supportsLocalStorage() {
      try {
        if ("localStorage" in global && global.localStorage !== null) {
          if (!global.localStorage[localStorageNamespace]) {
            global.localStorage.setItem(localStorageNamespace, JSON.stringify({}));
          }
          return true;
        }
        return false;
      } catch (_) {
        return false;
      }
    }
    function cleanup() {
      try {
        global.localStorage.removeItem(localStorageNamespace);
      } catch (_) {
      }
    }
  }
});

// node_modules/algoliasearch/src/AlgoliaSearchCore.js
var require_AlgoliaSearchCore = __commonJS({
  "node_modules/algoliasearch/src/AlgoliaSearchCore.js"(exports, module) {
    module.exports = AlgoliaSearchCore;
    var errors = require_errors();
    var exitPromise = require_exitPromise();
    var IndexCore = require_IndexCore();
    var store = require_store();
    var MAX_API_KEY_LENGTH = 500;
    var RESET_APP_DATA_TIMER = process.env.RESET_APP_DATA_TIMER && parseInt(process.env.RESET_APP_DATA_TIMER, 10) || 60 * 2 * 1e3;
    function AlgoliaSearchCore(applicationID, apiKey, opts) {
      var debug = require_browser()("algoliasearch");
      var clone = require_clone();
      var isArray = require_isarray();
      var map = require_map();
      var usage = "Usage: algoliasearch(applicationID, apiKey, opts)";
      if (opts._allowEmptyCredentials !== true && !applicationID) {
        throw new errors.AlgoliaSearchError("Please provide an application ID. " + usage);
      }
      if (opts._allowEmptyCredentials !== true && !apiKey) {
        throw new errors.AlgoliaSearchError("Please provide an API key. " + usage);
      }
      this.applicationID = applicationID;
      this.apiKey = apiKey;
      this.hosts = {
        read: [],
        write: []
      };
      opts = opts || {};
      this._timeouts = opts.timeouts || {
        connect: 1 * 1e3,
        // 500ms connect is GPRS latency
        read: 2 * 1e3,
        write: 30 * 1e3
      };
      if (opts.timeout) {
        this._timeouts.connect = this._timeouts.read = this._timeouts.write = opts.timeout;
      }
      var protocol = opts.protocol || "https:";
      if (!/:$/.test(protocol)) {
        protocol = protocol + ":";
      }
      if (protocol !== "http:" && protocol !== "https:") {
        throw new errors.AlgoliaSearchError("protocol must be `http:` or `https:` (was `" + opts.protocol + "`)");
      }
      this._checkAppIdData();
      if (!opts.hosts) {
        var defaultHosts = map(this._shuffleResult, function(hostNumber) {
          return applicationID + "-" + hostNumber + ".algolianet.com";
        });
        var mainSuffix = (opts.dsn === false ? "" : "-dsn") + ".algolia.net";
        this.hosts.read = [this.applicationID + mainSuffix].concat(defaultHosts);
        this.hosts.write = [this.applicationID + ".algolia.net"].concat(defaultHosts);
      } else if (isArray(opts.hosts)) {
        this.hosts.read = clone(opts.hosts);
        this.hosts.write = clone(opts.hosts);
      } else {
        this.hosts.read = clone(opts.hosts.read);
        this.hosts.write = clone(opts.hosts.write);
      }
      this.hosts.read = map(this.hosts.read, prepareHost(protocol));
      this.hosts.write = map(this.hosts.write, prepareHost(protocol));
      this.extraHeaders = {};
      this.cache = opts._cache || {};
      this._ua = opts._ua;
      this._useCache = opts._useCache === void 0 || opts._cache ? true : opts._useCache;
      this._useRequestCache = this._useCache && opts._useRequestCache;
      this._useFallback = opts.useFallback === void 0 ? true : opts.useFallback;
      this._setTimeout = opts._setTimeout;
      debug("init done, %j", this);
    }
    AlgoliaSearchCore.prototype.initIndex = function(indexName) {
      return new IndexCore(this, indexName);
    };
    AlgoliaSearchCore.prototype.setExtraHeader = function(name, value) {
      this.extraHeaders[name.toLowerCase()] = value;
    };
    AlgoliaSearchCore.prototype.getExtraHeader = function(name) {
      return this.extraHeaders[name.toLowerCase()];
    };
    AlgoliaSearchCore.prototype.unsetExtraHeader = function(name) {
      delete this.extraHeaders[name.toLowerCase()];
    };
    AlgoliaSearchCore.prototype.addAlgoliaAgent = function(algoliaAgent) {
      var algoliaAgentWithDelimiter = "; " + algoliaAgent;
      if (this._ua.indexOf(algoliaAgentWithDelimiter) === -1) {
        this._ua += algoliaAgentWithDelimiter;
      }
    };
    AlgoliaSearchCore.prototype._jsonRequest = function(initialOpts) {
      this._checkAppIdData();
      var requestDebug = require_browser()("algoliasearch:" + initialOpts.url);
      var body;
      var cacheID;
      var additionalUA = initialOpts.additionalUA || "";
      var cache = initialOpts.cache;
      var client = this;
      var tries = 0;
      var usingFallback = false;
      var hasFallback = client._useFallback && client._request.fallback && initialOpts.fallback;
      var headers;
      if (this.apiKey.length > MAX_API_KEY_LENGTH && initialOpts.body !== void 0 && (initialOpts.body.params !== void 0 || // index.search()
      initialOpts.body.requests !== void 0)) {
        initialOpts.body.apiKey = this.apiKey;
        headers = this._computeRequestHeaders({
          additionalUA,
          withApiKey: false,
          headers: initialOpts.headers
        });
      } else {
        headers = this._computeRequestHeaders({
          additionalUA,
          headers: initialOpts.headers
        });
      }
      if (initialOpts.body !== void 0) {
        body = safeJSONStringify(initialOpts.body);
      }
      requestDebug("request start");
      var debugData = [];
      function doRequest(requester, reqOpts) {
        client._checkAppIdData();
        var startTime = /* @__PURE__ */ new Date();
        if (client._useCache && !client._useRequestCache) {
          cacheID = initialOpts.url;
        }
        if (client._useCache && !client._useRequestCache && body) {
          cacheID += "_body_" + reqOpts.body;
        }
        if (isCacheValidWithCurrentID(!client._useRequestCache, cache, cacheID)) {
          requestDebug("serving response from cache");
          var responseText = cache[cacheID];
          return client._promise.resolve({
            body: JSON.parse(responseText),
            responseText
          });
        }
        if (tries >= client.hosts[initialOpts.hostType].length) {
          if (!hasFallback || usingFallback) {
            requestDebug("could not get any response");
            return client._promise.reject(new errors.AlgoliaSearchError(
              "Cannot connect to the AlgoliaSearch API. Send an email to support@algolia.com to report and resolve the issue. Application id was: " + client.applicationID,
              { debugData }
            ));
          }
          requestDebug("switching to fallback");
          tries = 0;
          reqOpts.method = initialOpts.fallback.method;
          reqOpts.url = initialOpts.fallback.url;
          reqOpts.jsonBody = initialOpts.fallback.body;
          if (reqOpts.jsonBody) {
            reqOpts.body = safeJSONStringify(reqOpts.jsonBody);
          }
          headers = client._computeRequestHeaders({
            additionalUA,
            headers: initialOpts.headers
          });
          reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
          client._setHostIndexByType(0, initialOpts.hostType);
          usingFallback = true;
          return doRequest(client._request.fallback, reqOpts);
        }
        var currentHost = client._getHostByType(initialOpts.hostType);
        var url = currentHost + reqOpts.url;
        var options = {
          body: reqOpts.body,
          jsonBody: reqOpts.jsonBody,
          method: reqOpts.method,
          headers,
          timeouts: reqOpts.timeouts,
          debug: requestDebug,
          forceAuthHeaders: reqOpts.forceAuthHeaders
        };
        requestDebug(
          "method: %s, url: %s, headers: %j, timeouts: %d",
          options.method,
          url,
          options.headers,
          options.timeouts
        );
        if (requester === client._request.fallback) {
          requestDebug("using fallback");
        }
        return requester.call(client, url, options).then(success, tryFallback);
        function success(httpResponse) {
          var status = httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status || // this is important to check the request statusCode AFTER the body eventual
          // statusCode because some implementations (jQuery XDomainRequest transport) may
          // send statusCode 200 while we had an error
          httpResponse.statusCode || // When in browser mode, using XDR or JSONP
          // we default to success when no error (no response.status && response.message)
          // If there was a JSON.parse() error then body is null and it fails
          httpResponse && httpResponse.body && 200;
          requestDebug(
            "received response: statusCode: %s, computed statusCode: %d, headers: %j",
            httpResponse.statusCode,
            status,
            httpResponse.headers
          );
          var httpResponseOk = Math.floor(status / 100) === 2;
          var endTime = /* @__PURE__ */ new Date();
          debugData.push({
            currentHost,
            headers: removeCredentials(headers),
            content: body || null,
            contentLength: body !== void 0 ? body.length : null,
            method: reqOpts.method,
            timeouts: reqOpts.timeouts,
            url: reqOpts.url,
            startTime,
            endTime,
            duration: endTime - startTime,
            statusCode: status
          });
          if (httpResponseOk) {
            if (client._useCache && !client._useRequestCache && cache) {
              cache[cacheID] = httpResponse.responseText;
            }
            return {
              responseText: httpResponse.responseText,
              body: httpResponse.body
            };
          }
          var shouldRetry = Math.floor(status / 100) !== 4;
          if (shouldRetry) {
            tries += 1;
            return retryRequest();
          }
          requestDebug("unrecoverable error");
          var unrecoverableError = new errors.AlgoliaSearchError(
            httpResponse.body && httpResponse.body.message,
            { debugData, statusCode: status }
          );
          return client._promise.reject(unrecoverableError);
        }
        function tryFallback(err) {
          requestDebug("error: %s, stack: %s", err.message, err.stack);
          var endTime = /* @__PURE__ */ new Date();
          debugData.push({
            currentHost,
            headers: removeCredentials(headers),
            content: body || null,
            contentLength: body !== void 0 ? body.length : null,
            method: reqOpts.method,
            timeouts: reqOpts.timeouts,
            url: reqOpts.url,
            startTime,
            endTime,
            duration: endTime - startTime
          });
          if (!(err instanceof errors.AlgoliaSearchError)) {
            err = new errors.Unknown(err && err.message, err);
          }
          tries += 1;
          if (
            // we did not generate this error,
            // it comes from a throw in some other piece of code
            err instanceof errors.Unknown || // server sent unparsable JSON
            err instanceof errors.UnparsableJSON || // max tries and already using fallback or no fallback
            tries >= client.hosts[initialOpts.hostType].length && (usingFallback || !hasFallback)
          ) {
            err.debugData = debugData;
            return client._promise.reject(err);
          }
          if (err instanceof errors.RequestTimeout) {
            return retryRequestWithHigherTimeout();
          }
          return retryRequest();
        }
        function retryRequest() {
          requestDebug("retrying request");
          client._incrementHostIndex(initialOpts.hostType);
          return doRequest(requester, reqOpts);
        }
        function retryRequestWithHigherTimeout() {
          requestDebug("retrying request with higher timeout");
          client._incrementHostIndex(initialOpts.hostType);
          client._incrementTimeoutMultipler();
          reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
          return doRequest(requester, reqOpts);
        }
      }
      function isCacheValidWithCurrentID(useRequestCache, currentCache, currentCacheID) {
        return client._useCache && useRequestCache && currentCache && currentCache[currentCacheID] !== void 0;
      }
      function interopCallbackReturn(request2, callback) {
        if (isCacheValidWithCurrentID(client._useRequestCache, cache, cacheID)) {
          request2.catch(function() {
            delete cache[cacheID];
          });
        }
        if (typeof initialOpts.callback === "function") {
          request2.then(function okCb(content) {
            exitPromise(function() {
              initialOpts.callback(null, callback(content));
            }, client._setTimeout || setTimeout);
          }, function nookCb(err) {
            exitPromise(function() {
              initialOpts.callback(err);
            }, client._setTimeout || setTimeout);
          });
        } else {
          return request2.then(callback);
        }
      }
      if (client._useCache && client._useRequestCache) {
        cacheID = initialOpts.url;
      }
      if (client._useCache && client._useRequestCache && body) {
        cacheID += "_body_" + body;
      }
      if (isCacheValidWithCurrentID(client._useRequestCache, cache, cacheID)) {
        requestDebug("serving request from cache");
        var maybePromiseForCache = cache[cacheID];
        var promiseForCache = typeof maybePromiseForCache.then !== "function" ? client._promise.resolve({ responseText: maybePromiseForCache }) : maybePromiseForCache;
        return interopCallbackReturn(promiseForCache, function(content) {
          return JSON.parse(content.responseText);
        });
      }
      var request = doRequest(
        client._request,
        {
          url: initialOpts.url,
          method: initialOpts.method,
          body,
          jsonBody: initialOpts.body,
          timeouts: client._getTimeoutsForRequest(initialOpts.hostType),
          forceAuthHeaders: initialOpts.forceAuthHeaders
        }
      );
      if (client._useCache && client._useRequestCache && cache) {
        cache[cacheID] = request;
      }
      return interopCallbackReturn(request, function(content) {
        return content.body;
      });
    };
    AlgoliaSearchCore.prototype._getSearchParams = function(args, params) {
      if (args === void 0 || args === null) {
        return params;
      }
      for (var key2 in args) {
        if (key2 !== null && args[key2] !== void 0 && args.hasOwnProperty(key2)) {
          params += params === "" ? "" : "&";
          params += key2 + "=" + encodeURIComponent(Object.prototype.toString.call(args[key2]) === "[object Array]" ? safeJSONStringify(args[key2]) : args[key2]);
        }
      }
      return params;
    };
    AlgoliaSearchCore.prototype._computeRequestHeaders = function(options) {
      var forEach = require_foreach();
      var ua = options.additionalUA ? this._ua + "; " + options.additionalUA : this._ua;
      var requestHeaders = {
        "x-algolia-agent": ua,
        "x-algolia-application-id": this.applicationID
      };
      if (options.withApiKey !== false) {
        requestHeaders["x-algolia-api-key"] = this.apiKey;
      }
      if (this.userToken) {
        requestHeaders["x-algolia-usertoken"] = this.userToken;
      }
      if (this.securityTags) {
        requestHeaders["x-algolia-tagfilters"] = this.securityTags;
      }
      forEach(this.extraHeaders, function addToRequestHeaders(value, key2) {
        requestHeaders[key2] = value;
      });
      if (options.headers) {
        forEach(options.headers, function addToRequestHeaders(value, key2) {
          requestHeaders[key2] = value;
        });
      }
      return requestHeaders;
    };
    AlgoliaSearchCore.prototype.search = function(queries, opts, callback) {
      var isArray = require_isarray();
      var map = require_map();
      var usage = "Usage: client.search(arrayOfQueries[, callback])";
      if (!isArray(queries)) {
        throw new Error(usage);
      }
      if (typeof opts === "function") {
        callback = opts;
        opts = {};
      } else if (opts === void 0) {
        opts = {};
      }
      var client = this;
      var postObj = {
        requests: map(queries, function prepareRequest(query) {
          var params = "";
          if (query.query !== void 0) {
            params += "query=" + encodeURIComponent(query.query);
          }
          return {
            indexName: query.indexName,
            params: client._getSearchParams(query.params, params)
          };
        })
      };
      var JSONPParams = map(postObj.requests, function prepareJSONPParams(request, requestId) {
        return requestId + "=" + encodeURIComponent(
          "/1/indexes/" + encodeURIComponent(request.indexName) + "?" + request.params
        );
      }).join("&");
      var url = "/1/indexes/*/queries";
      if (opts.strategy !== void 0) {
        postObj.strategy = opts.strategy;
      }
      return this._jsonRequest({
        cache: this.cache,
        method: "POST",
        url,
        body: postObj,
        hostType: "read",
        fallback: {
          method: "GET",
          url: "/1/indexes/*",
          body: {
            params: JSONPParams
          }
        },
        callback
      });
    };
    AlgoliaSearchCore.prototype.searchForFacetValues = function(queries) {
      var isArray = require_isarray();
      var map = require_map();
      var usage = "Usage: client.searchForFacetValues([{indexName, params: {facetName, facetQuery, ...params}}, ...queries])";
      if (!isArray(queries)) {
        throw new Error(usage);
      }
      var client = this;
      return client._promise.all(map(queries, function performQuery(query) {
        if (!query || query.indexName === void 0 || query.params.facetName === void 0 || query.params.facetQuery === void 0) {
          throw new Error(usage);
        }
        var clone = require_clone();
        var omit = require_omit();
        var indexName = query.indexName;
        var params = query.params;
        var facetName = params.facetName;
        var filteredParams = omit(clone(params), function(keyName) {
          return keyName === "facetName";
        });
        var searchParameters = client._getSearchParams(filteredParams, "");
        return client._jsonRequest({
          cache: client.cache,
          method: "POST",
          url: "/1/indexes/" + encodeURIComponent(indexName) + "/facets/" + encodeURIComponent(facetName) + "/query",
          hostType: "read",
          body: { params: searchParameters }
        });
      }));
    };
    AlgoliaSearchCore.prototype.setSecurityTags = function(tags) {
      if (Object.prototype.toString.call(tags) === "[object Array]") {
        var strTags = [];
        for (var i = 0; i < tags.length; ++i) {
          if (Object.prototype.toString.call(tags[i]) === "[object Array]") {
            var oredTags = [];
            for (var j = 0; j < tags[i].length; ++j) {
              oredTags.push(tags[i][j]);
            }
            strTags.push("(" + oredTags.join(",") + ")");
          } else {
            strTags.push(tags[i]);
          }
        }
        tags = strTags.join(",");
      }
      this.securityTags = tags;
    };
    AlgoliaSearchCore.prototype.setUserToken = function(userToken) {
      this.userToken = userToken;
    };
    AlgoliaSearchCore.prototype.clearCache = function() {
      this.cache = {};
    };
    AlgoliaSearchCore.prototype.setRequestTimeout = function(milliseconds) {
      if (milliseconds) {
        this._timeouts.connect = this._timeouts.read = this._timeouts.write = milliseconds;
      }
    };
    AlgoliaSearchCore.prototype.setTimeouts = function(timeouts) {
      this._timeouts = timeouts;
    };
    AlgoliaSearchCore.prototype.getTimeouts = function() {
      return this._timeouts;
    };
    AlgoliaSearchCore.prototype._getAppIdData = function() {
      var data = store.get(this.applicationID);
      if (data !== null) this._cacheAppIdData(data);
      return data;
    };
    AlgoliaSearchCore.prototype._setAppIdData = function(data) {
      data.lastChange = (/* @__PURE__ */ new Date()).getTime();
      this._cacheAppIdData(data);
      return store.set(this.applicationID, data);
    };
    AlgoliaSearchCore.prototype._checkAppIdData = function() {
      var data = this._getAppIdData();
      var now = (/* @__PURE__ */ new Date()).getTime();
      if (data === null || now - data.lastChange > RESET_APP_DATA_TIMER) {
        return this._resetInitialAppIdData(data);
      }
      return data;
    };
    AlgoliaSearchCore.prototype._resetInitialAppIdData = function(data) {
      var newData = data || {};
      newData.hostIndexes = { read: 0, write: 0 };
      newData.timeoutMultiplier = 1;
      newData.shuffleResult = newData.shuffleResult || shuffle([1, 2, 3]);
      return this._setAppIdData(newData);
    };
    AlgoliaSearchCore.prototype._cacheAppIdData = function(data) {
      this._hostIndexes = data.hostIndexes;
      this._timeoutMultiplier = data.timeoutMultiplier;
      this._shuffleResult = data.shuffleResult;
    };
    AlgoliaSearchCore.prototype._partialAppIdDataUpdate = function(newData) {
      var foreach = require_foreach();
      var currentData = this._getAppIdData();
      foreach(newData, function(value, key2) {
        currentData[key2] = value;
      });
      return this._setAppIdData(currentData);
    };
    AlgoliaSearchCore.prototype._getHostByType = function(hostType) {
      return this.hosts[hostType][this._getHostIndexByType(hostType)];
    };
    AlgoliaSearchCore.prototype._getTimeoutMultiplier = function() {
      return this._timeoutMultiplier;
    };
    AlgoliaSearchCore.prototype._getHostIndexByType = function(hostType) {
      return this._hostIndexes[hostType];
    };
    AlgoliaSearchCore.prototype._setHostIndexByType = function(hostIndex, hostType) {
      var clone = require_clone();
      var newHostIndexes = clone(this._hostIndexes);
      newHostIndexes[hostType] = hostIndex;
      this._partialAppIdDataUpdate({ hostIndexes: newHostIndexes });
      return hostIndex;
    };
    AlgoliaSearchCore.prototype._incrementHostIndex = function(hostType) {
      return this._setHostIndexByType(
        (this._getHostIndexByType(hostType) + 1) % this.hosts[hostType].length,
        hostType
      );
    };
    AlgoliaSearchCore.prototype._incrementTimeoutMultipler = function() {
      var timeoutMultiplier = Math.max(this._timeoutMultiplier + 1, 4);
      return this._partialAppIdDataUpdate({ timeoutMultiplier });
    };
    AlgoliaSearchCore.prototype._getTimeoutsForRequest = function(hostType) {
      return {
        connect: this._timeouts.connect * this._timeoutMultiplier,
        complete: this._timeouts[hostType] * this._timeoutMultiplier
      };
    };
    function prepareHost(protocol) {
      return function prepare(host) {
        return protocol + "//" + host.toLowerCase();
      };
    }
    function safeJSONStringify(obj) {
      if (Array.prototype.toJSON === void 0) {
        return JSON.stringify(obj);
      }
      var toJSON = Array.prototype.toJSON;
      delete Array.prototype.toJSON;
      var out = JSON.stringify(obj);
      Array.prototype.toJSON = toJSON;
      return out;
    }
    function shuffle(array) {
      var currentIndex = array.length;
      var temporaryValue;
      var randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    function removeCredentials(headers) {
      var newHeaders = {};
      for (var headerName in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
          var value;
          if (headerName === "x-algolia-api-key" || headerName === "x-algolia-application-id") {
            value = "**hidden for security purposes**";
          } else {
            value = headers[headerName];
          }
          newHeaders[headerName] = value;
        }
      }
      return newHeaders;
    }
  }
});

// node_modules/global/window.js
var require_window = __commonJS({
  "node_modules/global/window.js"(exports, module) {
    var win;
    if (typeof window !== "undefined") {
      win = window;
    } else if (typeof global !== "undefined") {
      win = global;
    } else if (typeof self !== "undefined") {
      win = self;
    } else {
      win = {};
    }
    module.exports = win;
  }
});

// node_modules/es6-promise/dist/es6-promise.js
var require_es6_promise = __commonJS({
  "node_modules/es6-promise/dist/es6-promise.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.ES6Promise = factory();
    })(exports, (function() {
      "use strict";
      function objectOrFunction(x) {
        var type = typeof x;
        return x !== null && (type === "object" || type === "function");
      }
      function isFunction(x) {
        return typeof x === "function";
      }
      var _isArray = void 0;
      if (Array.isArray) {
        _isArray = Array.isArray;
      } else {
        _isArray = function(x) {
          return Object.prototype.toString.call(x) === "[object Array]";
        };
      }
      var isArray = _isArray;
      var len = 0;
      var vertxNext = void 0;
      var customSchedulerFn = void 0;
      var asap = function asap2(callback, arg) {
        queue[len] = callback;
        queue[len + 1] = arg;
        len += 2;
        if (len === 2) {
          if (customSchedulerFn) {
            customSchedulerFn(flush);
          } else {
            scheduleFlush();
          }
        }
      };
      function setScheduler(scheduleFn) {
        customSchedulerFn = scheduleFn;
      }
      function setAsap(asapFn) {
        asap = asapFn;
      }
      var browserWindow = typeof window !== "undefined" ? window : void 0;
      var browserGlobal = browserWindow || {};
      var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
      var isNode = typeof self === "undefined" && typeof process !== "undefined" && {}.toString.call(process) === "[object process]";
      var isWorker = typeof Uint8ClampedArray !== "undefined" && typeof importScripts !== "undefined" && typeof MessageChannel !== "undefined";
      function useNextTick() {
        return function() {
          return process.nextTick(flush);
        };
      }
      function useVertxTimer() {
        if (typeof vertxNext !== "undefined") {
          return function() {
            vertxNext(flush);
          };
        }
        return useSetTimeout();
      }
      function useMutationObserver() {
        var iterations = 0;
        var observer = new BrowserMutationObserver(flush);
        var node = document.createTextNode("");
        observer.observe(node, { characterData: true });
        return function() {
          node.data = iterations = ++iterations % 2;
        };
      }
      function useMessageChannel() {
        var channel = new MessageChannel();
        channel.port1.onmessage = flush;
        return function() {
          return channel.port2.postMessage(0);
        };
      }
      function useSetTimeout() {
        var globalSetTimeout = setTimeout;
        return function() {
          return globalSetTimeout(flush, 1);
        };
      }
      var queue = new Array(1e3);
      function flush() {
        for (var i = 0; i < len; i += 2) {
          var callback = queue[i];
          var arg = queue[i + 1];
          callback(arg);
          queue[i] = void 0;
          queue[i + 1] = void 0;
        }
        len = 0;
      }
      function attemptVertx() {
        try {
          var vertx = Function("return this")().require("vertx");
          vertxNext = vertx.runOnLoop || vertx.runOnContext;
          return useVertxTimer();
        } catch (e) {
          return useSetTimeout();
        }
      }
      var scheduleFlush = void 0;
      if (isNode) {
        scheduleFlush = useNextTick();
      } else if (BrowserMutationObserver) {
        scheduleFlush = useMutationObserver();
      } else if (isWorker) {
        scheduleFlush = useMessageChannel();
      } else if (browserWindow === void 0 && typeof __require === "function") {
        scheduleFlush = attemptVertx();
      } else {
        scheduleFlush = useSetTimeout();
      }
      function then(onFulfillment, onRejection) {
        var parent = this;
        var child = new this.constructor(noop);
        if (child[PROMISE_ID] === void 0) {
          makePromise(child);
        }
        var _state = parent._state;
        if (_state) {
          var callback = arguments[_state - 1];
          asap(function() {
            return invokeCallback(_state, child, callback, parent._result);
          });
        } else {
          subscribe(parent, child, onFulfillment, onRejection);
        }
        return child;
      }
      function resolve$1(object) {
        var Constructor = this;
        if (object && typeof object === "object" && object.constructor === Constructor) {
          return object;
        }
        var promise = new Constructor(noop);
        resolve(promise, object);
        return promise;
      }
      var PROMISE_ID = Math.random().toString(36).substring(2);
      function noop() {
      }
      var PENDING = void 0;
      var FULFILLED = 1;
      var REJECTED = 2;
      function selfFulfillment() {
        return new TypeError("You cannot resolve a promise with itself");
      }
      function cannotReturnOwn() {
        return new TypeError("A promises callback cannot return that same promise.");
      }
      function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
        try {
          then$$1.call(value, fulfillmentHandler, rejectionHandler);
        } catch (e) {
          return e;
        }
      }
      function handleForeignThenable(promise, thenable, then$$1) {
        asap(function(promise2) {
          var sealed = false;
          var error = tryThen(then$$1, thenable, function(value) {
            if (sealed) {
              return;
            }
            sealed = true;
            if (thenable !== value) {
              resolve(promise2, value);
            } else {
              fulfill(promise2, value);
            }
          }, function(reason) {
            if (sealed) {
              return;
            }
            sealed = true;
            reject(promise2, reason);
          }, "Settle: " + (promise2._label || " unknown promise"));
          if (!sealed && error) {
            sealed = true;
            reject(promise2, error);
          }
        }, promise);
      }
      function handleOwnThenable(promise, thenable) {
        if (thenable._state === FULFILLED) {
          fulfill(promise, thenable._result);
        } else if (thenable._state === REJECTED) {
          reject(promise, thenable._result);
        } else {
          subscribe(thenable, void 0, function(value) {
            return resolve(promise, value);
          }, function(reason) {
            return reject(promise, reason);
          });
        }
      }
      function handleMaybeThenable(promise, maybeThenable, then$$1) {
        if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
          handleOwnThenable(promise, maybeThenable);
        } else {
          if (then$$1 === void 0) {
            fulfill(promise, maybeThenable);
          } else if (isFunction(then$$1)) {
            handleForeignThenable(promise, maybeThenable, then$$1);
          } else {
            fulfill(promise, maybeThenable);
          }
        }
      }
      function resolve(promise, value) {
        if (promise === value) {
          reject(promise, selfFulfillment());
        } else if (objectOrFunction(value)) {
          var then$$1 = void 0;
          try {
            then$$1 = value.then;
          } catch (error) {
            reject(promise, error);
            return;
          }
          handleMaybeThenable(promise, value, then$$1);
        } else {
          fulfill(promise, value);
        }
      }
      function publishRejection(promise) {
        if (promise._onerror) {
          promise._onerror(promise._result);
        }
        publish(promise);
      }
      function fulfill(promise, value) {
        if (promise._state !== PENDING) {
          return;
        }
        promise._result = value;
        promise._state = FULFILLED;
        if (promise._subscribers.length !== 0) {
          asap(publish, promise);
        }
      }
      function reject(promise, reason) {
        if (promise._state !== PENDING) {
          return;
        }
        promise._state = REJECTED;
        promise._result = reason;
        asap(publishRejection, promise);
      }
      function subscribe(parent, child, onFulfillment, onRejection) {
        var _subscribers = parent._subscribers;
        var length = _subscribers.length;
        parent._onerror = null;
        _subscribers[length] = child;
        _subscribers[length + FULFILLED] = onFulfillment;
        _subscribers[length + REJECTED] = onRejection;
        if (length === 0 && parent._state) {
          asap(publish, parent);
        }
      }
      function publish(promise) {
        var subscribers = promise._subscribers;
        var settled = promise._state;
        if (subscribers.length === 0) {
          return;
        }
        var child = void 0, callback = void 0, detail = promise._result;
        for (var i = 0; i < subscribers.length; i += 3) {
          child = subscribers[i];
          callback = subscribers[i + settled];
          if (child) {
            invokeCallback(settled, child, callback, detail);
          } else {
            callback(detail);
          }
        }
        promise._subscribers.length = 0;
      }
      function invokeCallback(settled, promise, callback, detail) {
        var hasCallback = isFunction(callback), value = void 0, error = void 0, succeeded = true;
        if (hasCallback) {
          try {
            value = callback(detail);
          } catch (e) {
            succeeded = false;
            error = e;
          }
          if (promise === value) {
            reject(promise, cannotReturnOwn());
            return;
          }
        } else {
          value = detail;
        }
        if (promise._state !== PENDING) {
        } else if (hasCallback && succeeded) {
          resolve(promise, value);
        } else if (succeeded === false) {
          reject(promise, error);
        } else if (settled === FULFILLED) {
          fulfill(promise, value);
        } else if (settled === REJECTED) {
          reject(promise, value);
        }
      }
      function initializePromise(promise, resolver) {
        try {
          resolver(function resolvePromise(value) {
            resolve(promise, value);
          }, function rejectPromise(reason) {
            reject(promise, reason);
          });
        } catch (e) {
          reject(promise, e);
        }
      }
      var id = 0;
      function nextId() {
        return id++;
      }
      function makePromise(promise) {
        promise[PROMISE_ID] = id++;
        promise._state = void 0;
        promise._result = void 0;
        promise._subscribers = [];
      }
      function validationError() {
        return new Error("Array Methods must be provided an Array");
      }
      var Enumerator = (function() {
        function Enumerator2(Constructor, input) {
          this._instanceConstructor = Constructor;
          this.promise = new Constructor(noop);
          if (!this.promise[PROMISE_ID]) {
            makePromise(this.promise);
          }
          if (isArray(input)) {
            this.length = input.length;
            this._remaining = input.length;
            this._result = new Array(this.length);
            if (this.length === 0) {
              fulfill(this.promise, this._result);
            } else {
              this.length = this.length || 0;
              this._enumerate(input);
              if (this._remaining === 0) {
                fulfill(this.promise, this._result);
              }
            }
          } else {
            reject(this.promise, validationError());
          }
        }
        Enumerator2.prototype._enumerate = function _enumerate(input) {
          for (var i = 0; this._state === PENDING && i < input.length; i++) {
            this._eachEntry(input[i], i);
          }
        };
        Enumerator2.prototype._eachEntry = function _eachEntry(entry, i) {
          var c = this._instanceConstructor;
          var resolve$$1 = c.resolve;
          if (resolve$$1 === resolve$1) {
            var _then = void 0;
            var error = void 0;
            var didError = false;
            try {
              _then = entry.then;
            } catch (e) {
              didError = true;
              error = e;
            }
            if (_then === then && entry._state !== PENDING) {
              this._settledAt(entry._state, i, entry._result);
            } else if (typeof _then !== "function") {
              this._remaining--;
              this._result[i] = entry;
            } else if (c === Promise$1) {
              var promise = new c(noop);
              if (didError) {
                reject(promise, error);
              } else {
                handleMaybeThenable(promise, entry, _then);
              }
              this._willSettleAt(promise, i);
            } else {
              this._willSettleAt(new c(function(resolve$$12) {
                return resolve$$12(entry);
              }), i);
            }
          } else {
            this._willSettleAt(resolve$$1(entry), i);
          }
        };
        Enumerator2.prototype._settledAt = function _settledAt(state, i, value) {
          var promise = this.promise;
          if (promise._state === PENDING) {
            this._remaining--;
            if (state === REJECTED) {
              reject(promise, value);
            } else {
              this._result[i] = value;
            }
          }
          if (this._remaining === 0) {
            fulfill(promise, this._result);
          }
        };
        Enumerator2.prototype._willSettleAt = function _willSettleAt(promise, i) {
          var enumerator = this;
          subscribe(promise, void 0, function(value) {
            return enumerator._settledAt(FULFILLED, i, value);
          }, function(reason) {
            return enumerator._settledAt(REJECTED, i, reason);
          });
        };
        return Enumerator2;
      })();
      function all(entries) {
        return new Enumerator(this, entries).promise;
      }
      function race(entries) {
        var Constructor = this;
        if (!isArray(entries)) {
          return new Constructor(function(_, reject2) {
            return reject2(new TypeError("You must pass an array to race."));
          });
        } else {
          return new Constructor(function(resolve2, reject2) {
            var length = entries.length;
            for (var i = 0; i < length; i++) {
              Constructor.resolve(entries[i]).then(resolve2, reject2);
            }
          });
        }
      }
      function reject$1(reason) {
        var Constructor = this;
        var promise = new Constructor(noop);
        reject(promise, reason);
        return promise;
      }
      function needsResolver() {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
      }
      function needsNew() {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }
      var Promise$1 = (function() {
        function Promise2(resolver) {
          this[PROMISE_ID] = nextId();
          this._result = this._state = void 0;
          this._subscribers = [];
          if (noop !== resolver) {
            typeof resolver !== "function" && needsResolver();
            this instanceof Promise2 ? initializePromise(this, resolver) : needsNew();
          }
        }
        Promise2.prototype.catch = function _catch(onRejection) {
          return this.then(null, onRejection);
        };
        Promise2.prototype.finally = function _finally(callback) {
          var promise = this;
          var constructor = promise.constructor;
          if (isFunction(callback)) {
            return promise.then(function(value) {
              return constructor.resolve(callback()).then(function() {
                return value;
              });
            }, function(reason) {
              return constructor.resolve(callback()).then(function() {
                throw reason;
              });
            });
          }
          return promise.then(callback, callback);
        };
        return Promise2;
      })();
      Promise$1.prototype.then = then;
      Promise$1.all = all;
      Promise$1.race = race;
      Promise$1.resolve = resolve$1;
      Promise$1.reject = reject$1;
      Promise$1._setScheduler = setScheduler;
      Promise$1._setAsap = setAsap;
      Promise$1._asap = asap;
      function polyfill() {
        var local = void 0;
        if (typeof global !== "undefined") {
          local = global;
        } else if (typeof self !== "undefined") {
          local = self;
        } else {
          try {
            local = Function("return this")();
          } catch (e) {
            throw new Error("polyfill failed because global object is unavailable in this environment");
          }
        }
        var P = local.Promise;
        if (P) {
          var promiseToString = null;
          try {
            promiseToString = Object.prototype.toString.call(P.resolve());
          } catch (e) {
          }
          if (promiseToString === "[object Promise]" && !P.cast) {
            return;
          }
        }
        local.Promise = Promise$1;
      }
      Promise$1.polyfill = polyfill;
      Promise$1.Promise = Promise$1;
      return Promise$1;
    }));
  }
});

// node_modules/querystring-es3/encode.js
var require_encode = __commonJS({
  "node_modules/querystring-es3/encode.js"(exports, module) {
    "use strict";
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    };
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return map(objectKeys(obj), function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (isArray(obj[k])) {
            return map(obj[k], function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name) return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
    function map(xs, f) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
      }
      return res;
    }
    var objectKeys = Object.keys || function(obj) {
      var res = [];
      for (var key2 in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key2)) res.push(key2);
      }
      return res;
    };
  }
});

// node_modules/algoliasearch/src/browser/inline-headers.js
var require_inline_headers = __commonJS({
  "node_modules/algoliasearch/src/browser/inline-headers.js"(exports, module) {
    "use strict";
    module.exports = inlineHeaders;
    var encode = require_encode();
    function inlineHeaders(url, headers) {
      if (/\?/.test(url)) {
        url += "&";
      } else {
        url += "?";
      }
      return url + encode(headers);
    }
  }
});

// node_modules/algoliasearch/src/browser/jsonp-request.js
var require_jsonp_request = __commonJS({
  "node_modules/algoliasearch/src/browser/jsonp-request.js"(exports, module) {
    "use strict";
    module.exports = jsonpRequest;
    var errors = require_errors();
    var JSONPCounter = 0;
    function jsonpRequest(url, opts, cb) {
      if (opts.method !== "GET") {
        cb(new Error("Method " + opts.method + " " + url + " is not supported by JSONP."));
        return;
      }
      opts.debug("JSONP: start");
      var cbCalled = false;
      var timedOut = false;
      JSONPCounter += 1;
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      var cbName = "algoliaJSONP_" + JSONPCounter;
      var done = false;
      window[cbName] = function(data) {
        removeGlobals();
        if (timedOut) {
          opts.debug("JSONP: Late answer, ignoring");
          return;
        }
        cbCalled = true;
        clean();
        cb(null, {
          body: data,
          responseText: JSON.stringify(data)
          /* ,
          // We do not send the statusCode, there's no statusCode in JSONP, it will be
          // computed using data.status && data.message like with XDR
          statusCode*/
        });
      };
      url += "&callback=" + cbName;
      if (opts.jsonBody && opts.jsonBody.params) {
        url += "&" + opts.jsonBody.params;
      }
      var ontimeout = setTimeout(timeout, opts.timeouts.complete);
      script.onreadystatechange = readystatechange;
      script.onload = success;
      script.onerror = error;
      script.async = true;
      script.defer = true;
      script.src = url;
      head.appendChild(script);
      function success() {
        opts.debug("JSONP: success");
        if (done || timedOut) {
          return;
        }
        done = true;
        if (!cbCalled) {
          opts.debug("JSONP: Fail. Script loaded but did not call the callback");
          clean();
          cb(new errors.JSONPScriptFail());
        }
      }
      function readystatechange() {
        if (this.readyState === "loaded" || this.readyState === "complete") {
          success();
        }
      }
      function clean() {
        clearTimeout(ontimeout);
        script.onload = null;
        script.onreadystatechange = null;
        script.onerror = null;
        head.removeChild(script);
      }
      function removeGlobals() {
        try {
          delete window[cbName];
          delete window[cbName + "_loaded"];
        } catch (e) {
          window[cbName] = window[cbName + "_loaded"] = void 0;
        }
      }
      function timeout() {
        opts.debug("JSONP: Script timeout");
        timedOut = true;
        clean();
        cb(new errors.RequestTimeout());
      }
      function error() {
        opts.debug("JSONP: Script error");
        if (done || timedOut) {
          return;
        }
        clean();
        cb(new errors.JSONPScriptError());
      }
    }
  }
});

// node_modules/querystring-es3/decode.js
var require_decode = __commonJS({
  "node_modules/querystring-es3/decode.js"(exports, module) {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/querystring-es3/index.js
var require_querystring_es3 = __commonJS({
  "node_modules/querystring-es3/index.js"(exports) {
    "use strict";
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  }
});

// node_modules/algoliasearch/src/places.js
var require_places = __commonJS({
  "node_modules/algoliasearch/src/places.js"(exports, module) {
    module.exports = createPlacesClient;
    var qs3 = require_querystring_es3();
    var buildSearchMethod = require_buildSearchMethod();
    function createPlacesClient(algoliasearch) {
      return function places(appID, apiKey, opts) {
        var cloneDeep = require_clone();
        opts = opts && cloneDeep(opts) || {};
        opts.hosts = opts.hosts || [
          "places-dsn.algolia.net",
          "places-1.algolianet.com",
          "places-2.algolianet.com",
          "places-3.algolianet.com"
        ];
        if (arguments.length === 0 || typeof appID === "object" || appID === void 0) {
          appID = "";
          apiKey = "";
          opts._allowEmptyCredentials = true;
        }
        var client = algoliasearch(appID, apiKey, opts);
        var index = client.initIndex("places");
        index.search = buildSearchMethod("query", "/1/places/query");
        index.reverse = function(options, callback) {
          var encoded = qs3.encode(options);
          return this.as._jsonRequest({
            method: "GET",
            url: "/1/places/reverse?" + encoded,
            hostType: "read",
            callback
          });
        };
        index.getObject = function(objectID, callback) {
          return this.as._jsonRequest({
            method: "GET",
            url: "/1/places/" + encodeURIComponent(objectID),
            hostType: "read",
            callback
          });
        };
        return index;
      };
    }
  }
});

// node_modules/algoliasearch/src/version.js
var require_version = __commonJS({
  "node_modules/algoliasearch/src/version.js"(exports, module) {
    "use strict";
    module.exports = "3.35.1";
  }
});

// node_modules/algoliasearch/src/browser/createAlgoliasearch.js
var require_createAlgoliasearch = __commonJS({
  "node_modules/algoliasearch/src/browser/createAlgoliasearch.js"(exports, module) {
    "use strict";
    var global2 = require_window();
    var Promise2 = global2.Promise || require_es6_promise().Promise;
    module.exports = function createAlgoliasearch(AlgoliaSearch, uaSuffix) {
      var inherits = require_inherits_browser();
      var errors = require_errors();
      var inlineHeaders = require_inline_headers();
      var jsonpRequest = require_jsonp_request();
      var places = require_places();
      uaSuffix = uaSuffix || "";
      if (false) {
        null.enable("algoliasearch*");
      }
      function algoliasearch(applicationID, apiKey, opts) {
        var cloneDeep = require_clone();
        opts = cloneDeep(opts || {});
        opts._ua = opts._ua || algoliasearch.ua;
        return new AlgoliaSearchBrowser(applicationID, apiKey, opts);
      }
      algoliasearch.version = require_version();
      algoliasearch.ua = "Algolia for JavaScript (" + algoliasearch.version + "); " + uaSuffix;
      algoliasearch.initPlaces = places(algoliasearch);
      global2.__algolia = {
        debug: require_browser(),
        algoliasearch
      };
      var support = {
        hasXMLHttpRequest: "XMLHttpRequest" in global2,
        hasXDomainRequest: "XDomainRequest" in global2
      };
      if (support.hasXMLHttpRequest) {
        support.cors = "withCredentials" in new XMLHttpRequest();
      }
      function AlgoliaSearchBrowser() {
        AlgoliaSearch.apply(this, arguments);
      }
      inherits(AlgoliaSearchBrowser, AlgoliaSearch);
      AlgoliaSearchBrowser.prototype._request = function request(url, opts) {
        return new Promise2(function wrapRequest(resolve, reject) {
          if (!support.cors && !support.hasXDomainRequest) {
            reject(new errors.Network("CORS not supported"));
            return;
          }
          url = inlineHeaders(url, opts.headers);
          var body = opts.body;
          var req = support.cors ? new XMLHttpRequest() : new XDomainRequest();
          var reqTimeout;
          var timedOut;
          var connected = false;
          reqTimeout = setTimeout(onTimeout, opts.timeouts.connect);
          req.onprogress = onProgress;
          if ("onreadystatechange" in req) req.onreadystatechange = onReadyStateChange;
          req.onload = onLoad;
          req.onerror = onError;
          if (req instanceof XMLHttpRequest) {
            req.open(opts.method, url, true);
            if (opts.forceAuthHeaders) {
              req.setRequestHeader(
                "x-algolia-application-id",
                opts.headers["x-algolia-application-id"]
              );
              req.setRequestHeader(
                "x-algolia-api-key",
                opts.headers["x-algolia-api-key"]
              );
            }
          } else {
            req.open(opts.method, url);
          }
          if (support.cors) {
            if (body) {
              if (opts.method === "POST") {
                req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
              } else {
                req.setRequestHeader("content-type", "application/json");
              }
            }
            req.setRequestHeader("accept", "application/json");
          }
          if (body) {
            req.send(body);
          } else {
            req.send();
          }
          function onLoad() {
            if (timedOut) {
              return;
            }
            clearTimeout(reqTimeout);
            var out;
            try {
              out = {
                body: JSON.parse(req.responseText),
                responseText: req.responseText,
                statusCode: req.status,
                // XDomainRequest does not have any response headers
                headers: req.getAllResponseHeaders && req.getAllResponseHeaders() || {}
              };
            } catch (e) {
              out = new errors.UnparsableJSON({
                more: req.responseText
              });
            }
            if (out instanceof errors.UnparsableJSON) {
              reject(out);
            } else {
              resolve(out);
            }
          }
          function onError(event) {
            if (timedOut) {
              return;
            }
            clearTimeout(reqTimeout);
            reject(
              new errors.Network({
                more: event
              })
            );
          }
          function onTimeout() {
            timedOut = true;
            req.abort();
            reject(new errors.RequestTimeout());
          }
          function onConnect() {
            connected = true;
            clearTimeout(reqTimeout);
            reqTimeout = setTimeout(onTimeout, opts.timeouts.complete);
          }
          function onProgress() {
            if (!connected) onConnect();
          }
          function onReadyStateChange() {
            if (!connected && req.readyState > 1) onConnect();
          }
        });
      };
      AlgoliaSearchBrowser.prototype._request.fallback = function requestFallback(url, opts) {
        url = inlineHeaders(url, opts.headers);
        return new Promise2(function wrapJsonpRequest(resolve, reject) {
          jsonpRequest(url, opts, function jsonpRequestDone(err, content) {
            if (err) {
              reject(err);
              return;
            }
            resolve(content);
          });
        });
      };
      AlgoliaSearchBrowser.prototype._promise = {
        reject: function rejectPromise(val) {
          return Promise2.reject(val);
        },
        resolve: function resolvePromise(val) {
          return Promise2.resolve(val);
        },
        delay: function delayPromise(ms) {
          return new Promise2(function resolveOnTimeout(resolve) {
            setTimeout(resolve, ms);
          });
        },
        all: function all(promises) {
          return Promise2.all(promises);
        }
      };
      return algoliasearch;
    };
  }
});

// node_modules/algoliasearch/src/browser/builds/algoliasearchLite.js
var require_algoliasearchLite = __commonJS({
  "node_modules/algoliasearch/src/browser/builds/algoliasearchLite.js"(exports, module) {
    "use strict";
    var AlgoliaSearchCore = require_AlgoliaSearchCore();
    var createAlgoliasearch = require_createAlgoliasearch();
    module.exports = createAlgoliasearch(AlgoliaSearchCore, "Browser (lite)");
  }
});

// node_modules/autocomplete.js/zepto.js
var require_zepto = __commonJS({
  "node_modules/autocomplete.js/zepto.js"(exports, module) {
    (function(global2, factory) {
      module.exports = factory(global2);
    })(
      /* this ##### UPDATED: here we want to use window/global instead of this which is the current file context ##### */
      window,
      function(window2) {
        var Zepto = (function() {
          var undefined2, key2, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice, document2 = window2.document, elementDisplay = {}, classCache = {}, cssNumber = { "column-count": 1, "columns": 1, "font-weight": 1, "line-height": 1, "opacity": 1, "z-index": 1, "zoom": 1 }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g, methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"], adjacencyOperators = ["after", "prepend", "before", "append"], table = document2.createElement("table"), tableRow = document2.createElement("tr"), containers = {
            "tr": document2.createElement("tbody"),
            "tbody": table,
            "thead": table,
            "tfoot": table,
            "td": tableRow,
            "th": tableRow,
            "*": document2.createElement("div")
          }, readyRE = /complete|loaded|interactive/, simpleSelectorRE = /^[\w-]*$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document2.createElement("div"), propMap = {
            "tabindex": "tabIndex",
            "readonly": "readOnly",
            "for": "htmlFor",
            "class": "className",
            "maxlength": "maxLength",
            "cellspacing": "cellSpacing",
            "cellpadding": "cellPadding",
            "rowspan": "rowSpan",
            "colspan": "colSpan",
            "usemap": "useMap",
            "frameborder": "frameBorder",
            "contenteditable": "contentEditable"
          }, isArray = Array.isArray || function(object) {
            return object instanceof Array;
          };
          zepto.matches = function(element, selector) {
            if (!selector || !element || element.nodeType !== 1) return false;
            var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) return matchesSelector.call(element, selector);
            var match, parent = element.parentNode, temp = !parent;
            if (temp) (parent = tempParent).appendChild(element);
            match = ~zepto.qsa(parent, selector).indexOf(element);
            temp && tempParent.removeChild(element);
            return match;
          };
          function type(obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
          }
          function isFunction(value) {
            return type(value) == "function";
          }
          function isWindow(obj) {
            return obj != null && obj == obj.window;
          }
          function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
          }
          function isObject(obj) {
            return type(obj) == "object";
          }
          function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
          }
          function likeArray(obj) {
            var length = !!obj && "length" in obj && obj.length, type2 = $.type(obj);
            return "function" != type2 && !isWindow(obj) && ("array" == type2 || length === 0 || typeof length == "number" && length > 0 && length - 1 in obj);
          }
          function compact(array) {
            return filter.call(array, function(item) {
              return item != null;
            });
          }
          function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array;
          }
          camelize = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
              return chr ? chr.toUpperCase() : "";
            });
          };
          function dasherize(str) {
            return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
          }
          uniq = function(array) {
            return filter.call(array, function(item, idx) {
              return array.indexOf(item) == idx;
            });
          };
          function classRE(name) {
            return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
          }
          function maybeAddPx(name, value) {
            return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
          }
          function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
              element = document2.createElement(nodeName);
              document2.body.appendChild(element);
              display = getComputedStyle(element, "").getPropertyValue("display");
              element.parentNode.removeChild(element);
              display == "none" && (display = "block");
              elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
          }
          function children(element) {
            return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
              if (node.nodeType == 1) return node;
            });
          }
          function Z(dom, selector) {
            var i, len = dom ? dom.length : 0;
            for (i = 0; i < len; i++) this[i] = dom[i];
            this.length = len;
            this.selector = selector || "";
          }
          zepto.fragment = function(html, name, properties) {
            var dom, nodes, container;
            if (singleTagRE.test(html)) dom = $(document2.createElement(RegExp.$1));
            if (!dom) {
              if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
              if (name === undefined2) name = fragmentRE.test(html) && RegExp.$1;
              if (!(name in containers)) name = "*";
              container = containers[name];
              container.innerHTML = "" + html;
              dom = $.each(slice.call(container.childNodes), function() {
                container.removeChild(this);
              });
            }
            if (isPlainObject(properties)) {
              nodes = $(dom);
              $.each(properties, function(key3, value) {
                if (methodAttributes.indexOf(key3) > -1) nodes[key3](value);
                else nodes.attr(key3, value);
              });
            }
            return dom;
          };
          zepto.Z = function(dom, selector) {
            return new Z(dom, selector);
          };
          zepto.isZ = function(object) {
            return object instanceof zepto.Z;
          };
          zepto.init = function(selector, context) {
            var dom;
            if (!selector) return zepto.Z();
            else if (typeof selector == "string") {
              selector = selector.trim();
              if (selector[0] == "<" && fragmentRE.test(selector))
                dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
              else if (context !== undefined2) return $(context).find(selector);
              else dom = zepto.qsa(document2, selector);
            } else if (isFunction(selector)) return $(document2).ready(selector);
            else if (zepto.isZ(selector)) return selector;
            else {
              if (isArray(selector)) dom = compact(selector);
              else if (isObject(selector))
                dom = [selector], selector = null;
              else if (fragmentRE.test(selector))
                dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
              else if (context !== undefined2) return $(context).find(selector);
              else dom = zepto.qsa(document2, selector);
            }
            return zepto.Z(dom, selector);
          };
          $ = function(selector, context) {
            return zepto.init(selector, context);
          };
          function extend(target, source, deep) {
            for (key2 in source)
              if (deep && (isPlainObject(source[key2]) || isArray(source[key2]))) {
                if (isPlainObject(source[key2]) && !isPlainObject(target[key2]))
                  target[key2] = {};
                if (isArray(source[key2]) && !isArray(target[key2]))
                  target[key2] = [];
                extend(target[key2], source[key2], deep);
              } else if (source[key2] !== undefined2) target[key2] = source[key2];
          }
          $.extend = function(target) {
            var deep, args = slice.call(arguments, 1);
            if (typeof target == "boolean") {
              deep = target;
              target = args.shift();
            }
            args.forEach(function(arg) {
              extend(target, arg, deep);
            });
            return target;
          };
          zepto.qsa = function(element, selector) {
            var found, maybeID = selector[0] == "#", maybeClass = !maybeID && selector[0] == ".", nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
            return element.getElementById && isSimple && maybeID ? (
              // Safari DocumentFragment doesn't have getElementById
              (found = element.getElementById(nameOnly)) ? [found] : []
            ) : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(
              isSimple && !maybeID && element.getElementsByClassName ? (
                // DocumentFragment doesn't have getElementsByClassName/TagName
                maybeClass ? element.getElementsByClassName(nameOnly) : (
                  // If it's simple, it could be a class
                  element.getElementsByTagName(selector)
                )
              ) : (
                // Or a tag
                element.querySelectorAll(selector)
              )
              // Or it's not simple, and we need to query all
            );
          };
          function filtered(nodes, selector) {
            return selector == null ? $(nodes) : $(nodes).filter(selector);
          }
          $.contains = document2.documentElement.contains ? function(parent, node) {
            return parent !== node && parent.contains(node);
          } : function(parent, node) {
            while (node && (node = node.parentNode))
              if (node === parent) return true;
            return false;
          };
          function funcArg(context, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context, idx, payload) : arg;
          }
          function setAttribute(node, name, value) {
            value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
          }
          function className(node, value) {
            var klass = node.className || "", svg = klass && klass.baseVal !== undefined2;
            if (value === undefined2) return svg ? klass.baseVal : klass;
            svg ? klass.baseVal = value : node.className = value;
          }
          function deserializeValue(value) {
            try {
              return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
            } catch (e) {
              return value;
            }
          }
          $.type = type;
          $.isFunction = isFunction;
          $.isWindow = isWindow;
          $.isArray = isArray;
          $.isPlainObject = isPlainObject;
          $.isEmptyObject = function(obj) {
            var name;
            for (name in obj) return false;
            return true;
          };
          $.isNumeric = function(val) {
            var num = Number(val), type2 = typeof val;
            return val != null && type2 != "boolean" && (type2 != "string" || val.length) && !isNaN(num) && isFinite(num) || false;
          };
          $.inArray = function(elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i);
          };
          $.camelCase = camelize;
          $.trim = function(str) {
            return str == null ? "" : String.prototype.trim.call(str);
          };
          $.uuid = 0;
          $.support = {};
          $.expr = {};
          $.noop = function() {
          };
          $.map = function(elements, callback) {
            var value, values = [], i, key3;
            if (likeArray(elements))
              for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i);
                if (value != null) values.push(value);
              }
            else
              for (key3 in elements) {
                value = callback(elements[key3], key3);
                if (value != null) values.push(value);
              }
            return flatten(values);
          };
          $.each = function(elements, callback) {
            var i, key3;
            if (likeArray(elements)) {
              for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements;
            } else {
              for (key3 in elements)
                if (callback.call(elements[key3], key3, elements[key3]) === false) return elements;
            }
            return elements;
          };
          $.grep = function(elements, callback) {
            return filter.call(elements, callback);
          };
          if (window2.JSON) $.parseJSON = JSON.parse;
          $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
          });
          $.fn = {
            constructor: zepto.Z,
            length: 0,
            // Because a collection acts like an array
            // copy over these useful array functions.
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            concat: function() {
              var i, value, args = [];
              for (i = 0; i < arguments.length; i++) {
                value = arguments[i];
                args[i] = zepto.isZ(value) ? value.toArray() : value;
              }
              return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
            },
            // `map` and `slice` in the jQuery API work differently
            // from their array counterparts
            map: function(fn) {
              return $($.map(this, function(el, i) {
                return fn.call(el, i, el);
              }));
            },
            slice: function() {
              return $(slice.apply(this, arguments));
            },
            ready: function(callback) {
              if (readyRE.test(document2.readyState) && document2.body) callback($);
              else document2.addEventListener("DOMContentLoaded", function() {
                callback($);
              }, false);
              return this;
            },
            get: function(idx) {
              return idx === undefined2 ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
            },
            toArray: function() {
              return this.get();
            },
            size: function() {
              return this.length;
            },
            remove: function() {
              return this.each(function() {
                if (this.parentNode != null)
                  this.parentNode.removeChild(this);
              });
            },
            each: function(callback) {
              emptyArray.every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
              });
              return this;
            },
            filter: function(selector) {
              if (isFunction(selector)) return this.not(this.not(selector));
              return $(filter.call(this, function(element) {
                return zepto.matches(element, selector);
              }));
            },
            add: function(selector, context) {
              return $(uniq(this.concat($(selector, context))));
            },
            is: function(selector) {
              return this.length > 0 && zepto.matches(this[0], selector);
            },
            not: function(selector) {
              var nodes = [];
              if (isFunction(selector) && selector.call !== undefined2)
                this.each(function(idx) {
                  if (!selector.call(this, idx)) nodes.push(this);
                });
              else {
                var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                this.forEach(function(el) {
                  if (excludes.indexOf(el) < 0) nodes.push(el);
                });
              }
              return $(nodes);
            },
            has: function(selector) {
              return this.filter(function() {
                return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
              });
            },
            eq: function(idx) {
              return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
            },
            first: function() {
              var el = this[0];
              return el && !isObject(el) ? el : $(el);
            },
            last: function() {
              var el = this[this.length - 1];
              return el && !isObject(el) ? el : $(el);
            },
            find: function(selector) {
              var result, $this = this;
              if (!selector) result = $();
              else if (typeof selector == "object")
                result = $(selector).filter(function() {
                  var node = this;
                  return emptyArray.some.call($this, function(parent) {
                    return $.contains(parent, node);
                  });
                });
              else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
              else result = this.map(function() {
                return zepto.qsa(this, selector);
              });
              return result;
            },
            closest: function(selector, context) {
              var nodes = [], collection = typeof selector == "object" && $(selector);
              this.each(function(_, node) {
                while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
                  node = node !== context && !isDocument(node) && node.parentNode;
                if (node && nodes.indexOf(node) < 0) nodes.push(node);
              });
              return $(nodes);
            },
            parents: function(selector) {
              var ancestors = [], nodes = this;
              while (nodes.length > 0)
                nodes = $.map(nodes, function(node) {
                  if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                    ancestors.push(node);
                    return node;
                  }
                });
              return filtered(ancestors, selector);
            },
            parent: function(selector) {
              return filtered(uniq(this.pluck("parentNode")), selector);
            },
            children: function(selector) {
              return filtered(this.map(function() {
                return children(this);
              }), selector);
            },
            contents: function() {
              return this.map(function() {
                return this.contentDocument || slice.call(this.childNodes);
              });
            },
            siblings: function(selector) {
              return filtered(this.map(function(i, el) {
                return filter.call(children(el.parentNode), function(child) {
                  return child !== el;
                });
              }), selector);
            },
            empty: function() {
              return this.each(function() {
                this.innerHTML = "";
              });
            },
            // `pluck` is borrowed from Prototype.js
            pluck: function(property) {
              return $.map(this, function(el) {
                return el[property];
              });
            },
            show: function() {
              return this.each(function() {
                this.style.display == "none" && (this.style.display = "");
                if (getComputedStyle(this, "").getPropertyValue("display") == "none")
                  this.style.display = defaultDisplay(this.nodeName);
              });
            },
            replaceWith: function(newContent) {
              return this.before(newContent).remove();
            },
            wrap: function(structure) {
              var func = isFunction(structure);
              if (this[0] && !func)
                var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
              return this.each(function(index) {
                $(this).wrapAll(
                  func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom
                );
              });
            },
            wrapAll: function(structure) {
              if (this[0]) {
                $(this[0]).before(structure = $(structure));
                var children2;
                while ((children2 = structure.children()).length) structure = children2.first();
                $(structure).append(this);
              }
              return this;
            },
            wrapInner: function(structure) {
              var func = isFunction(structure);
              return this.each(function(index) {
                var self2 = $(this), contents = self2.contents(), dom = func ? structure.call(this, index) : structure;
                contents.length ? contents.wrapAll(dom) : self2.append(dom);
              });
            },
            unwrap: function() {
              this.parent().each(function() {
                $(this).replaceWith($(this).children());
              });
              return this;
            },
            clone: function() {
              return this.map(function() {
                return this.cloneNode(true);
              });
            },
            hide: function() {
              return this.css("display", "none");
            },
            toggle: function(setting) {
              return this.each(function() {
                var el = $(this);
                (setting === undefined2 ? el.css("display") == "none" : setting) ? el.show() : el.hide();
              });
            },
            prev: function(selector) {
              return $(this.pluck("previousElementSibling")).filter(selector || "*");
            },
            next: function(selector) {
              return $(this.pluck("nextElementSibling")).filter(selector || "*");
            },
            html: function(html) {
              return 0 in arguments ? this.each(function(idx) {
                var originHtml = this.innerHTML;
                $(this).empty().append(funcArg(this, html, idx, originHtml));
              }) : 0 in this ? this[0].innerHTML : null;
            },
            text: function(text) {
              return 0 in arguments ? this.each(function(idx) {
                var newText = funcArg(this, text, idx, this.textContent);
                this.textContent = newText == null ? "" : "" + newText;
              }) : 0 in this ? this.pluck("textContent").join("") : null;
            },
            attr: function(name, value) {
              var result;
              return typeof name == "string" && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined2 : this.each(function(idx) {
                if (this.nodeType !== 1) return;
                if (isObject(name)) for (key2 in name) setAttribute(this, key2, name[key2]);
                else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
              });
            },
            removeAttr: function(name) {
              return this.each(function() {
                this.nodeType === 1 && name.split(" ").forEach(function(attribute) {
                  setAttribute(this, attribute);
                }, this);
              });
            },
            prop: function(name, value) {
              name = propMap[name] || name;
              return 1 in arguments ? this.each(function(idx) {
                this[name] = funcArg(this, value, idx, this[name]);
              }) : this[0] && this[0][name];
            },
            removeProp: function(name) {
              name = propMap[name] || name;
              return this.each(function() {
                delete this[name];
              });
            },
            data: function(name, value) {
              var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();
              var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
              return data !== null ? deserializeValue(data) : undefined2;
            },
            val: function(value) {
              if (0 in arguments) {
                if (value == null) value = "";
                return this.each(function(idx) {
                  this.value = funcArg(this, value, idx, this.value);
                });
              } else {
                return this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
                  return this.selected;
                }).pluck("value") : this[0].value);
              }
            },
            offset: function(coordinates) {
              if (coordinates) return this.each(function(index) {
                var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                  top: coords.top - parentOffset.top,
                  left: coords.left - parentOffset.left
                };
                if ($this.css("position") == "static") props["position"] = "relative";
                $this.css(props);
              });
              if (!this.length) return null;
              if (document2.documentElement !== this[0] && !$.contains(document2.documentElement, this[0]))
                return { top: 0, left: 0 };
              var obj = this[0].getBoundingClientRect();
              return {
                left: obj.left + window2.pageXOffset,
                top: obj.top + window2.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
              };
            },
            css: function(property, value) {
              if (arguments.length < 2) {
                var element = this[0];
                if (typeof property == "string") {
                  if (!element) return;
                  return element.style[camelize(property)] || getComputedStyle(element, "").getPropertyValue(property);
                } else if (isArray(property)) {
                  if (!element) return;
                  var props = {};
                  var computedStyle = getComputedStyle(element, "");
                  $.each(property, function(_, prop) {
                    props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
                  });
                  return props;
                }
              }
              var css = "";
              if (type(property) == "string") {
                if (!value && value !== 0)
                  this.each(function() {
                    this.style.removeProperty(dasherize(property));
                  });
                else
                  css = dasherize(property) + ":" + maybeAddPx(property, value);
              } else {
                for (key2 in property)
                  if (!property[key2] && property[key2] !== 0)
                    this.each(function() {
                      this.style.removeProperty(dasherize(key2));
                    });
                  else
                    css += dasherize(key2) + ":" + maybeAddPx(key2, property[key2]) + ";";
              }
              return this.each(function() {
                this.style.cssText += ";" + css;
              });
            },
            index: function(element) {
              return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
            },
            hasClass: function(name) {
              if (!name) return false;
              return emptyArray.some.call(this, function(el) {
                return this.test(className(el));
              }, classRE(name));
            },
            addClass: function(name) {
              if (!name) return this;
              return this.each(function(idx) {
                if (!("className" in this)) return;
                classList = [];
                var cls = className(this), newName = funcArg(this, name, idx, cls);
                newName.split(/\s+/g).forEach(function(klass) {
                  if (!$(this).hasClass(klass)) classList.push(klass);
                }, this);
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
              });
            },
            removeClass: function(name) {
              return this.each(function(idx) {
                if (!("className" in this)) return;
                if (name === undefined2) return className(this, "");
                classList = className(this);
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                  classList = classList.replace(classRE(klass), " ");
                });
                className(this, classList.trim());
              });
            },
            toggleClass: function(name, when) {
              if (!name) return this;
              return this.each(function(idx) {
                var $this = $(this), names = funcArg(this, name, idx, className(this));
                names.split(/\s+/g).forEach(function(klass) {
                  (when === undefined2 ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
                });
              });
            },
            scrollTop: function(value) {
              if (!this.length) return;
              var hasScrollTop = "scrollTop" in this[0];
              if (value === undefined2) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
              return this.each(hasScrollTop ? function() {
                this.scrollTop = value;
              } : function() {
                this.scrollTo(this.scrollX, value);
              });
            },
            scrollLeft: function(value) {
              if (!this.length) return;
              var hasScrollLeft = "scrollLeft" in this[0];
              if (value === undefined2) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
              return this.each(hasScrollLeft ? function() {
                this.scrollLeft = value;
              } : function() {
                this.scrollTo(value, this.scrollY);
              });
            },
            position: function() {
              if (!this.length) return;
              var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();
              offset.top -= parseFloat($(elem).css("margin-top")) || 0;
              offset.left -= parseFloat($(elem).css("margin-left")) || 0;
              parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
              parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
              return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
              };
            },
            offsetParent: function() {
              return this.map(function() {
                var parent = this.offsetParent || document2.body;
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                  parent = parent.offsetParent;
                return parent;
              });
            }
          };
          $.fn.detach = $.fn.remove;
          ["width", "height"].forEach(function(dimension) {
            var dimensionProperty = dimension.replace(/./, function(m) {
              return m[0].toUpperCase();
            });
            $.fn[dimension] = function(value) {
              var offset, el = this[0];
              if (value === undefined2) return isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension];
              else return this.each(function(idx) {
                el = $(this);
                el.css(dimension, funcArg(this, value, idx, el[dimension]()));
              });
            };
          });
          function traverseNode(node, fun) {
            fun(node);
            for (var i = 0, len = node.childNodes.length; i < len; i++)
              traverseNode(node.childNodes[i], fun);
          }
          adjacencyOperators.forEach(function(operator, operatorIndex) {
            var inside = operatorIndex % 2;
            $.fn[operator] = function() {
              var argType, nodes = $.map(arguments, function(arg) {
                var arr = [];
                argType = type(arg);
                if (argType == "array") {
                  arg.forEach(function(el) {
                    if (el.nodeType !== undefined2) return arr.push(el);
                    else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
                    arr = arr.concat(zepto.fragment(el));
                  });
                  return arr;
                }
                return argType == "object" || arg == null ? arg : zepto.fragment(arg);
              }), parent, copyByClone = this.length > 1;
              if (nodes.length < 1) return this;
              return this.each(function(_, target) {
                parent = inside ? target : target.parentNode;
                target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                var parentInDocument = $.contains(document2.documentElement, parent);
                nodes.forEach(function(node) {
                  if (copyByClone) node = node.cloneNode(true);
                  else if (!parent) return $(node).remove();
                  parent.insertBefore(node, target);
                  if (parentInDocument) traverseNode(node, function(el) {
                    if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) {
                      var target2 = el.ownerDocument ? el.ownerDocument.defaultView : window2;
                      target2["eval"].call(target2, el.innerHTML);
                    }
                  });
                });
              });
            };
            $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
              $(html)[operator](this);
              return this;
            };
          });
          zepto.Z.prototype = Z.prototype = $.fn;
          zepto.uniq = uniq;
          zepto.deserializeValue = deserializeValue;
          $.zepto = zepto;
          return $;
        })();
        (function($) {
          var _zid = 1, undefined2, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function(obj) {
            return typeof obj == "string";
          }, handlers = {}, specialEvents = {}, focusinSupported = "onfocusin" in window2, focus = { focus: "focusin", blur: "focusout" }, hover = { mouseenter: "mouseover", mouseleave: "mouseout" };
          specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
          function zid(element) {
            return element._zid || (element._zid = _zid++);
          }
          function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns) var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
              return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
            });
          }
          function parse(event) {
            var parts = ("" + event).split(".");
            return { e: parts[0], ns: parts.slice(1).sort().join(" ") };
          }
          function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
          }
          function eventCapture(handler, captureSetting) {
            return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting;
          }
          function realEvent(type) {
            return hover[type] || focusinSupported && focus[type] || type;
          }
          function add(element, events, fn, data, selector, delegator, capture) {
            var id = zid(element), set = handlers[id] || (handlers[id] = []);
            events.split(/\s/).forEach(function(event) {
              if (event == "ready") return $(document).ready(fn);
              var handler = parse(event);
              handler.fn = fn;
              handler.sel = selector;
              if (handler.e in hover) fn = function(e) {
                var related = e.relatedTarget;
                if (!related || related !== this && !$.contains(this, related))
                  return handler.fn.apply(this, arguments);
              };
              handler.del = delegator;
              var callback = delegator || fn;
              handler.proxy = function(e) {
                e = compatible(e);
                if (e.isImmediatePropagationStopped()) return;
                try {
                  var dataPropDescriptor = Object.getOwnPropertyDescriptor(e, "data");
                  if (!dataPropDescriptor || dataPropDescriptor.writable)
                    e.data = data;
                } catch (e2) {
                }
                var result = callback.apply(element, e._args == undefined2 ? [e] : [e].concat(e._args));
                if (result === false) e.preventDefault(), e.stopPropagation();
                return result;
              };
              handler.i = set.length;
              set.push(handler);
              if ("addEventListener" in element)
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
            });
          }
          function remove(element, events, fn, selector, capture) {
            var id = zid(element);
            (events || "").split(/\s/).forEach(function(event) {
              findHandlers(element, event, fn, selector).forEach(function(handler) {
                delete handlers[id][handler.i];
                if ("removeEventListener" in element)
                  element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
              });
            });
          }
          $.event = { add, remove };
          $.proxy = function(fn, context) {
            var args = 2 in arguments && slice.call(arguments, 2);
            if (isFunction(fn)) {
              var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
              };
              proxyFn._zid = zid(fn);
              return proxyFn;
            } else if (isString(context)) {
              if (args) {
                args.unshift(fn[context], fn);
                return $.proxy.apply(null, args);
              } else {
                return $.proxy(fn[context], fn);
              }
            } else {
              throw new TypeError("expected function");
            }
          };
          $.fn.bind = function(event, data, callback) {
            return this.on(event, data, callback);
          };
          $.fn.unbind = function(event, callback) {
            return this.off(event, callback);
          };
          $.fn.one = function(event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1);
          };
          var returnTrue = function() {
            return true;
          }, returnFalse = function() {
            return false;
          }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/, eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
          };
          function compatible(event, source) {
            if (source || !event.isDefaultPrevented) {
              source || (source = event);
              $.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                  this[predicate] = returnTrue;
                  return sourceMethod && sourceMethod.apply(source, arguments);
                };
                event[predicate] = returnFalse;
              });
              event.timeStamp || (event.timeStamp = Date.now());
              if (source.defaultPrevented !== undefined2 ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
                event.isDefaultPrevented = returnTrue;
            }
            return event;
          }
          function createProxy(event) {
            var key2, proxy = { originalEvent: event };
            for (key2 in event)
              if (!ignoreProperties.test(key2) && event[key2] !== undefined2) proxy[key2] = event[key2];
            return compatible(proxy, event);
          }
          $.fn.delegate = function(selector, event, callback) {
            return this.on(event, selector, callback);
          };
          $.fn.undelegate = function(selector, event, callback) {
            return this.off(event, selector, callback);
          };
          $.fn.live = function(event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this;
          };
          $.fn.die = function(event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this;
          };
          $.fn.on = function(event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this;
            if (event && !isString(event)) {
              $.each(event, function(type, fn) {
                $this.on(type, selector, data, fn, one);
              });
              return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
              callback = data, data = selector, selector = undefined2;
            if (callback === undefined2 || data === false)
              callback = data, data = undefined2;
            if (callback === false) callback = returnFalse;
            return $this.each(function(_, element) {
              if (one) autoRemove = function(e) {
                remove(element, e.type, callback);
                return callback.apply(this, arguments);
              };
              if (selector) delegator = function(e) {
                var evt, match = $(e.target).closest(selector, element).get(0);
                if (match && match !== element) {
                  evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element });
                  return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
                }
              };
              add(element, event, callback, data, selector, delegator || autoRemove);
            });
          };
          $.fn.off = function(event, selector, callback) {
            var $this = this;
            if (event && !isString(event)) {
              $.each(event, function(type, fn) {
                $this.off(type, selector, fn);
              });
              return $this;
            }
            if (!isString(selector) && !isFunction(callback) && callback !== false)
              callback = selector, selector = undefined2;
            if (callback === false) callback = returnFalse;
            return $this.each(function() {
              remove(this, event, callback, selector);
            });
          };
          $.fn.trigger = function(event, args) {
            event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
            event._args = args;
            return this.each(function() {
              if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
              else if ("dispatchEvent" in this) this.dispatchEvent(event);
              else $(this).triggerHandler(event, args);
            });
          };
          $.fn.triggerHandler = function(event, args) {
            var e, result;
            this.each(function(i, element) {
              e = createProxy(isString(event) ? $.Event(event) : event);
              e._args = args;
              e.target = element;
              $.each(findHandlers(element, event.type || event), function(i2, handler) {
                result = handler.proxy(e);
                if (e.isImmediatePropagationStopped()) return false;
              });
            });
            return result;
          };
          "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
              return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
            };
          });
          $.Event = function(type, props) {
            if (!isString(type)) props = type, type = props.type;
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
            if (props) for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true);
            return compatible(event);
          };
        })(Zepto);
        (function($) {
          var cache = [], timeout;
          $.fn.remove = function() {
            return this.each(function() {
              if (this.parentNode) {
                if (this.tagName === "IMG") {
                  cache.push(this);
                  this.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(function() {
                    cache = [];
                  }, 6e4);
                }
                this.parentNode.removeChild(this);
              }
            });
          };
        })(Zepto);
        (function($) {
          var data = {}, dataAttr = $.fn.data, camelize = $.camelCase, exp = $.expando = "Zepto" + +/* @__PURE__ */ new Date(), emptyArray = [];
          function getData(node, name) {
            var id = node[exp], store = id && data[id];
            if (name === void 0) return store || setData(node);
            else {
              if (store) {
                if (name in store) return store[name];
                var camelName = camelize(name);
                if (camelName in store) return store[camelName];
              }
              return dataAttr.call($(node), name);
            }
          }
          function setData(node, name, value) {
            var id = node[exp] || (node[exp] = ++$.uuid), store = data[id] || (data[id] = attributeData(node));
            if (name !== void 0) store[camelize(name)] = value;
            return store;
          }
          function attributeData(node) {
            var store = {};
            $.each(node.attributes || emptyArray, function(i, attr) {
              if (attr.name.indexOf("data-") == 0)
                store[camelize(attr.name.replace("data-", ""))] = $.zepto.deserializeValue(attr.value);
            });
            return store;
          }
          $.fn.data = function(name, value) {
            return value === void 0 ? (
              // set multiple values via object
              $.isPlainObject(name) ? this.each(function(i, node) {
                $.each(name, function(key2, value2) {
                  setData(node, key2, value2);
                });
              }) : (
                // get value from first element
                0 in this ? getData(this[0], name) : void 0
              )
            ) : (
              // set value on all elements
              this.each(function() {
                setData(this, name, value);
              })
            );
          };
          $.data = function(elem, name, value) {
            return $(elem).data(name, value);
          };
          $.hasData = function(elem) {
            var id = elem[exp], store = id && data[id];
            return store ? !$.isEmptyObject(store) : false;
          };
          $.fn.removeData = function(names) {
            if (typeof names == "string") names = names.split(/\s+/);
            return this.each(function() {
              var id = this[exp], store = id && data[id];
              if (store) $.each(names || store, function(key2) {
                delete store[names ? camelize(this) : key2];
              });
            });
          };
          ["remove", "empty"].forEach(function(methodName) {
            var origFn = $.fn[methodName];
            $.fn[methodName] = function() {
              var elements = this.find("*");
              if (methodName === "remove") elements = elements.add(this);
              elements.removeData();
              return origFn.call(this);
            };
          });
        })(Zepto);
        return Zepto;
      }
    );
  }
});

// node_modules/autocomplete.js/src/common/dom.js
var require_dom = __commonJS({
  "node_modules/autocomplete.js/src/common/dom.js"(exports, module) {
    "use strict";
    module.exports = {
      element: null
    };
  }
});

// node_modules/autocomplete.js/src/common/utils.js
var require_utils = __commonJS({
  "node_modules/autocomplete.js/src/common/utils.js"(exports, module) {
    "use strict";
    var DOM = require_dom();
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    module.exports = {
      // those methods are implemented differently
      // depending on which build it is, using
      // $... or angular... or Zepto... or require(...)
      isArray: null,
      isFunction: null,
      isObject: null,
      bind: null,
      each: null,
      map: null,
      mixin: null,
      isMsie: function(agentString) {
        if (agentString === void 0) {
          agentString = navigator.userAgent;
        }
        if (/(msie|trident)/i.test(agentString)) {
          var match = agentString.match(/(msie |rv:)(\d+(.\d+)?)/i);
          if (match) {
            return match[2];
          }
        }
        return false;
      },
      // http://stackoverflow.com/a/6969486
      escapeRegExChars: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      },
      isNumber: function(obj) {
        return typeof obj === "number";
      },
      toStr: function toStr(s) {
        return s === void 0 || s === null ? "" : s + "";
      },
      cloneDeep: function cloneDeep(obj) {
        var clone = this.mixin({}, obj);
        var self2 = this;
        this.each(clone, function(value, key2) {
          if (value) {
            if (self2.isArray(value)) {
              clone[key2] = [].concat(value);
            } else if (self2.isObject(value)) {
              clone[key2] = self2.cloneDeep(value);
            }
          }
        });
        return clone;
      },
      error: function(msg) {
        throw new Error(msg);
      },
      every: function(obj, test) {
        var result = true;
        if (!obj) {
          return result;
        }
        this.each(obj, function(val, key2) {
          if (result) {
            result = test.call(null, val, key2, obj) && result;
          }
        });
        return !!result;
      },
      any: function(obj, test) {
        var found = false;
        if (!obj) {
          return found;
        }
        this.each(obj, function(val, key2) {
          if (test.call(null, val, key2, obj)) {
            found = true;
            return false;
          }
        });
        return found;
      },
      getUniqueId: /* @__PURE__ */ (function() {
        var counter = 0;
        return function() {
          return counter++;
        };
      })(),
      templatify: function templatify(obj) {
        if (this.isFunction(obj)) {
          return obj;
        }
        var $template = DOM.element(obj);
        if ($template.prop("tagName") === "SCRIPT") {
          return function template() {
            return $template.text();
          };
        }
        return function template() {
          return String(obj);
        };
      },
      defer: function(fn) {
        setTimeout(fn, 0);
      },
      noop: function() {
      },
      formatPrefix: function(prefix, noPrefix) {
        return noPrefix ? "" : prefix + "-";
      },
      className: function(prefix, clazz, skipDot) {
        return (skipDot ? "" : ".") + prefix + clazz;
      },
      escapeHighlightedString: function(str, highlightPreTag, highlightPostTag) {
        highlightPreTag = highlightPreTag || "<em>";
        var pre = document.createElement("div");
        pre.appendChild(document.createTextNode(highlightPreTag));
        highlightPostTag = highlightPostTag || "</em>";
        var post = document.createElement("div");
        post.appendChild(document.createTextNode(highlightPostTag));
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML.replace(RegExp(escapeRegExp(pre.innerHTML), "g"), highlightPreTag).replace(RegExp(escapeRegExp(post.innerHTML), "g"), highlightPostTag);
      }
    };
  }
});

// node_modules/autocomplete.js/src/autocomplete/event_bus.js
var require_event_bus = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/event_bus.js"(exports, module) {
    "use strict";
    var namespace = "autocomplete:";
    var _ = require_utils();
    var DOM = require_dom();
    function EventBus(o) {
      if (!o || !o.el) {
        _.error("EventBus initialized without el");
      }
      this.$el = DOM.element(o.el);
    }
    _.mixin(EventBus.prototype, {
      // ### public
      trigger: function(type, suggestion, dataset, context) {
        var event = _.Event(namespace + type);
        this.$el.trigger(event, [suggestion, dataset, context]);
        return event;
      }
    });
    module.exports = EventBus;
  }
});

// (disabled):node_modules/immediate/lib/nextTick
var require_nextTick = __commonJS({
  "(disabled):node_modules/immediate/lib/nextTick"() {
  }
});

// node_modules/immediate/lib/queueMicrotask.js
var require_queueMicrotask = __commonJS({
  "node_modules/immediate/lib/queueMicrotask.js"(exports) {
    "use strict";
    exports.test = function() {
      return typeof global.queueMicrotask === "function";
    };
    exports.install = function(func) {
      return function() {
        global.queueMicrotask(func);
      };
    };
  }
});

// node_modules/immediate/lib/mutation.js
var require_mutation = __commonJS({
  "node_modules/immediate/lib/mutation.js"(exports) {
    "use strict";
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;
    exports.test = function() {
      return Mutation;
    };
    exports.install = function(handle) {
      var called = 0;
      var observer = new Mutation(handle);
      var element = global.document.createTextNode("");
      observer.observe(element, {
        characterData: true
      });
      return function() {
        element.data = called = ++called % 2;
      };
    };
  }
});

// node_modules/immediate/lib/messageChannel.js
var require_messageChannel = __commonJS({
  "node_modules/immediate/lib/messageChannel.js"(exports) {
    "use strict";
    exports.test = function() {
      if (global.setImmediate) {
        return false;
      }
      return typeof global.MessageChannel !== "undefined";
    };
    exports.install = function(func) {
      var channel = new global.MessageChannel();
      channel.port1.onmessage = func;
      return function() {
        channel.port2.postMessage(0);
      };
    };
  }
});

// node_modules/immediate/lib/stateChange.js
var require_stateChange = __commonJS({
  "node_modules/immediate/lib/stateChange.js"(exports) {
    "use strict";
    exports.test = function() {
      return "document" in global && "onreadystatechange" in global.document.createElement("script");
    };
    exports.install = function(handle) {
      return function() {
        var scriptEl = global.document.createElement("script");
        scriptEl.onreadystatechange = function() {
          handle();
          scriptEl.onreadystatechange = null;
          scriptEl.parentNode.removeChild(scriptEl);
          scriptEl = null;
        };
        global.document.documentElement.appendChild(scriptEl);
        return handle;
      };
    };
  }
});

// node_modules/immediate/lib/timeout.js
var require_timeout = __commonJS({
  "node_modules/immediate/lib/timeout.js"(exports) {
    "use strict";
    exports.test = function() {
      return true;
    };
    exports.install = function(t) {
      return function() {
        setTimeout(t, 0);
      };
    };
  }
});

// node_modules/immediate/lib/index.js
var require_lib = __commonJS({
  "node_modules/immediate/lib/index.js"(exports, module) {
    "use strict";
    var types = [
      require_nextTick(),
      require_queueMicrotask(),
      require_mutation(),
      require_messageChannel(),
      require_stateChange(),
      require_timeout()
    ];
    var draining;
    var currentQueue;
    var queueIndex = -1;
    var queue = [];
    var scheduled = false;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        nextTick();
      }
    }
    function nextTick() {
      if (draining) {
        return;
      }
      scheduled = false;
      draining = true;
      var len2 = queue.length;
      var timeout = setTimeout(cleanUpNextTick);
      while (len2) {
        currentQueue = queue;
        queue = [];
        while (currentQueue && ++queueIndex < len2) {
          currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len2 = queue.length;
      }
      currentQueue = null;
      queueIndex = -1;
      draining = false;
      clearTimeout(timeout);
    }
    var scheduleDrain;
    var i = -1;
    var len = types.length;
    while (++i < len) {
      if (types[i] && types[i].test && types[i].test()) {
        scheduleDrain = types[i].install(nextTick);
        break;
      }
    }
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      var fun = this.fun;
      var array = this.array;
      switch (array.length) {
        case 0:
          return fun();
        case 1:
          return fun(array[0]);
        case 2:
          return fun(array[0], array[1]);
        case 3:
          return fun(array[0], array[1], array[2]);
        default:
          return fun.apply(null, array);
      }
    };
    module.exports = immediate;
    function immediate(task) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          args[i2 - 1] = arguments[i2];
        }
      }
      queue.push(new Item(task, args));
      if (!scheduled && !draining) {
        scheduled = true;
        scheduleDrain();
      }
    }
  }
});

// node_modules/autocomplete.js/src/autocomplete/event_emitter.js
var require_event_emitter = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/event_emitter.js"(exports, module) {
    "use strict";
    var immediate = require_lib();
    var splitter = /\s+/;
    module.exports = {
      onSync,
      onAsync,
      off,
      trigger
    };
    function on(method, types, cb, context) {
      var type;
      if (!cb) {
        return this;
      }
      types = types.split(splitter);
      cb = context ? bindContext(cb, context) : cb;
      this._callbacks = this._callbacks || {};
      while (type = types.shift()) {
        this._callbacks[type] = this._callbacks[type] || { sync: [], async: [] };
        this._callbacks[type][method].push(cb);
      }
      return this;
    }
    function onAsync(types, cb, context) {
      return on.call(this, "async", types, cb, context);
    }
    function onSync(types, cb, context) {
      return on.call(this, "sync", types, cb, context);
    }
    function off(types) {
      var type;
      if (!this._callbacks) {
        return this;
      }
      types = types.split(splitter);
      while (type = types.shift()) {
        delete this._callbacks[type];
      }
      return this;
    }
    function trigger(types) {
      var type;
      var callbacks;
      var args;
      var syncFlush;
      var asyncFlush;
      if (!this._callbacks) {
        return this;
      }
      types = types.split(splitter);
      args = [].slice.call(arguments, 1);
      while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
        syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
        asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
        if (syncFlush()) {
          immediate(asyncFlush);
        }
      }
      return this;
    }
    function getFlush(callbacks, context, args) {
      return flush;
      function flush() {
        var cancelled;
        for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
          cancelled = callbacks[i].apply(context, args) === false;
        }
        return !cancelled;
      }
    }
    function bindContext(fn, context) {
      return fn.bind ? fn.bind(context) : function() {
        fn.apply(context, [].slice.call(arguments, 0));
      };
    }
  }
});

// node_modules/autocomplete.js/src/autocomplete/input.js
var require_input = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/input.js"(exports, module) {
    "use strict";
    var specialKeyCodeMap;
    specialKeyCodeMap = {
      9: "tab",
      27: "esc",
      37: "left",
      39: "right",
      13: "enter",
      38: "up",
      40: "down"
    };
    var _ = require_utils();
    var DOM = require_dom();
    var EventEmitter = require_event_emitter();
    function Input(o) {
      var that = this;
      var onBlur;
      var onFocus;
      var onKeydown;
      var onInput;
      o = o || {};
      if (!o.input) {
        _.error("input is missing");
      }
      onBlur = _.bind(this._onBlur, this);
      onFocus = _.bind(this._onFocus, this);
      onKeydown = _.bind(this._onKeydown, this);
      onInput = _.bind(this._onInput, this);
      this.$hint = DOM.element(o.hint);
      this.$input = DOM.element(o.input).on("blur.aa", onBlur).on("focus.aa", onFocus).on("keydown.aa", onKeydown);
      if (this.$hint.length === 0) {
        this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
      }
      if (!_.isMsie()) {
        this.$input.on("input.aa", onInput);
      } else {
        this.$input.on("keydown.aa keypress.aa cut.aa paste.aa", function($e) {
          if (specialKeyCodeMap[$e.which || $e.keyCode]) {
            return;
          }
          _.defer(_.bind(that._onInput, that, $e));
        });
      }
      this.query = this.$input.val();
      this.$overflowHelper = buildOverflowHelper(this.$input);
    }
    Input.normalizeQuery = function(str) {
      return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
    };
    _.mixin(Input.prototype, EventEmitter, {
      // ### private
      _onBlur: function onBlur() {
        this.resetInputValue();
        this.$input.removeAttr("aria-activedescendant");
        this.trigger("blurred");
      },
      _onFocus: function onFocus() {
        this.trigger("focused");
      },
      _onKeydown: function onKeydown($e) {
        var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
        this._managePreventDefault(keyName, $e);
        if (keyName && this._shouldTrigger(keyName, $e)) {
          this.trigger(keyName + "Keyed", $e);
        }
      },
      _onInput: function onInput() {
        this._checkInputValue();
      },
      _managePreventDefault: function managePreventDefault(keyName, $e) {
        var preventDefault;
        var hintValue;
        var inputValue;
        switch (keyName) {
          case "tab":
            hintValue = this.getHint();
            inputValue = this.getInputValue();
            preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
            break;
          case "up":
          case "down":
            preventDefault = !withModifier($e);
            break;
          default:
            preventDefault = false;
        }
        if (preventDefault) {
          $e.preventDefault();
        }
      },
      _shouldTrigger: function shouldTrigger(keyName, $e) {
        var trigger;
        switch (keyName) {
          case "tab":
            trigger = !withModifier($e);
            break;
          default:
            trigger = true;
        }
        return trigger;
      },
      _checkInputValue: function checkInputValue() {
        var inputValue;
        var areEquivalent;
        var hasDifferentWhitespace;
        inputValue = this.getInputValue();
        areEquivalent = areQueriesEquivalent(inputValue, this.query);
        hasDifferentWhitespace = areEquivalent && this.query ? this.query.length !== inputValue.length : false;
        this.query = inputValue;
        if (!areEquivalent) {
          this.trigger("queryChanged", this.query);
        } else if (hasDifferentWhitespace) {
          this.trigger("whitespaceChanged", this.query);
        }
      },
      // ### public
      focus: function focus() {
        this.$input.focus();
      },
      blur: function blur() {
        this.$input.blur();
      },
      getQuery: function getQuery() {
        return this.query;
      },
      setQuery: function setQuery(query) {
        this.query = query;
      },
      getInputValue: function getInputValue() {
        return this.$input.val();
      },
      setInputValue: function setInputValue(value, silent) {
        if (typeof value === "undefined") {
          value = this.query;
        }
        this.$input.val(value);
        if (silent) {
          this.clearHint();
        } else {
          this._checkInputValue();
        }
      },
      expand: function expand() {
        this.$input.attr("aria-expanded", "true");
      },
      collapse: function collapse() {
        this.$input.attr("aria-expanded", "false");
      },
      setActiveDescendant: function setActiveDescendant(activedescendantId) {
        this.$input.attr("aria-activedescendant", activedescendantId);
      },
      removeActiveDescendant: function removeActiveDescendant() {
        this.$input.removeAttr("aria-activedescendant");
      },
      resetInputValue: function resetInputValue() {
        this.setInputValue(this.query, true);
      },
      getHint: function getHint() {
        return this.$hint.val();
      },
      setHint: function setHint(value) {
        this.$hint.val(value);
      },
      clearHint: function clearHint() {
        this.setHint("");
      },
      clearHintIfInvalid: function clearHintIfInvalid() {
        var val;
        var hint;
        var valIsPrefixOfHint;
        var isValid;
        val = this.getInputValue();
        hint = this.getHint();
        valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
        isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
        if (!isValid) {
          this.clearHint();
        }
      },
      getLanguageDirection: function getLanguageDirection() {
        return (this.$input.css("direction") || "ltr").toLowerCase();
      },
      hasOverflow: function hasOverflow() {
        var constraint = this.$input.width() - 2;
        this.$overflowHelper.text(this.getInputValue());
        return this.$overflowHelper.width() >= constraint;
      },
      isCursorAtEnd: function() {
        var valueLength;
        var selectionStart;
        var range;
        valueLength = this.$input.val().length;
        selectionStart = this.$input[0].selectionStart;
        if (_.isNumber(selectionStart)) {
          return selectionStart === valueLength;
        } else if (document.selection) {
          range = document.selection.createRange();
          range.moveStart("character", -valueLength);
          return valueLength === range.text.length;
        }
        return true;
      },
      destroy: function destroy() {
        this.$hint.off(".aa");
        this.$input.off(".aa");
        this.$hint = this.$input = this.$overflowHelper = null;
      }
    });
    function buildOverflowHelper($input) {
      return DOM.element('<pre aria-hidden="true"></pre>').css({
        // position helper off-screen
        position: "absolute",
        visibility: "hidden",
        // avoid line breaks and whitespace collapsing
        whiteSpace: "pre",
        // use same font css as input to calculate accurate width
        fontFamily: $input.css("font-family"),
        fontSize: $input.css("font-size"),
        fontStyle: $input.css("font-style"),
        fontVariant: $input.css("font-variant"),
        fontWeight: $input.css("font-weight"),
        wordSpacing: $input.css("word-spacing"),
        letterSpacing: $input.css("letter-spacing"),
        textIndent: $input.css("text-indent"),
        textRendering: $input.css("text-rendering"),
        textTransform: $input.css("text-transform")
      }).insertAfter($input);
    }
    function areQueriesEquivalent(a, b) {
      return Input.normalizeQuery(a) === Input.normalizeQuery(b);
    }
    function withModifier($e) {
      return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
    }
    module.exports = Input;
  }
});

// node_modules/autocomplete.js/src/autocomplete/html.js
var require_html = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/html.js"(exports, module) {
    "use strict";
    module.exports = {
      wrapper: '<span class="%ROOT%"></span>',
      dropdown: '<span class="%PREFIX%%DROPDOWN_MENU%"></span>',
      dataset: '<div class="%PREFIX%%DATASET%-%CLASS%"></div>',
      suggestions: '<span class="%PREFIX%%SUGGESTIONS%"></span>',
      suggestion: '<div class="%PREFIX%%SUGGESTION%"></div>'
    };
  }
});

// node_modules/autocomplete.js/src/autocomplete/css.js
var require_css = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/css.js"(exports, module) {
    "use strict";
    var _ = require_utils();
    var css = {
      wrapper: {
        position: "relative",
        display: "inline-block"
      },
      hint: {
        position: "absolute",
        top: "0",
        left: "0",
        borderColor: "transparent",
        boxShadow: "none",
        // #741: fix hint opacity issue on iOS
        opacity: "1"
      },
      input: {
        position: "relative",
        verticalAlign: "top",
        backgroundColor: "transparent"
      },
      inputWithNoHint: {
        position: "relative",
        verticalAlign: "top"
      },
      dropdown: {
        position: "absolute",
        top: "100%",
        left: "0",
        zIndex: "100",
        display: "none"
      },
      suggestions: {
        display: "block"
      },
      suggestion: {
        whiteSpace: "nowrap",
        cursor: "pointer"
      },
      suggestionChild: {
        whiteSpace: "normal"
      },
      ltr: {
        left: "0",
        right: "auto"
      },
      rtl: {
        left: "auto",
        right: "0"
      },
      defaultClasses: {
        root: "algolia-autocomplete",
        prefix: "aa",
        noPrefix: false,
        dropdownMenu: "dropdown-menu",
        input: "input",
        hint: "hint",
        suggestions: "suggestions",
        suggestion: "suggestion",
        cursor: "cursor",
        dataset: "dataset",
        empty: "empty"
      },
      // will be merged with the default ones if appendTo is used
      appendTo: {
        wrapper: {
          position: "absolute",
          zIndex: "100",
          display: "none"
        },
        input: {},
        inputWithNoHint: {},
        dropdown: {
          display: "block"
        }
      }
    };
    if (_.isMsie()) {
      _.mixin(css.input, {
        backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
      });
    }
    if (_.isMsie() && _.isMsie() <= 7) {
      _.mixin(css.input, { marginTop: "-1px" });
    }
    module.exports = css;
  }
});

// node_modules/autocomplete.js/src/autocomplete/dataset.js
var require_dataset = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/dataset.js"(exports, module) {
    "use strict";
    var datasetKey = "aaDataset";
    var valueKey = "aaValue";
    var datumKey = "aaDatum";
    var _ = require_utils();
    var DOM = require_dom();
    var html = require_html();
    var css = require_css();
    var EventEmitter = require_event_emitter();
    function Dataset(o) {
      o = o || {};
      o.templates = o.templates || {};
      if (!o.source) {
        _.error("missing source");
      }
      if (o.name && !isValidName(o.name)) {
        _.error("invalid dataset name: " + o.name);
      }
      this.query = null;
      this._isEmpty = true;
      this.highlight = !!o.highlight;
      this.name = typeof o.name === "undefined" || o.name === null ? _.getUniqueId() : o.name;
      this.source = o.source;
      this.displayFn = getDisplayFn(o.display || o.displayKey);
      this.debounce = o.debounce;
      this.cache = o.cache !== false;
      this.templates = getTemplates(o.templates, this.displayFn);
      this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
      this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
      this.cssClasses.prefix = o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
      var clazz = _.className(this.cssClasses.prefix, this.cssClasses.dataset);
      this.$el = o.$menu && o.$menu.find(clazz + "-" + this.name).length > 0 ? DOM.element(o.$menu.find(clazz + "-" + this.name)[0]) : DOM.element(
        html.dataset.replace("%CLASS%", this.name).replace("%PREFIX%", this.cssClasses.prefix).replace("%DATASET%", this.cssClasses.dataset)
      );
      this.$menu = o.$menu;
      this.clearCachedSuggestions();
    }
    Dataset.extractDatasetName = function extractDatasetName(el) {
      return DOM.element(el).data(datasetKey);
    };
    Dataset.extractValue = function extractValue(el) {
      return DOM.element(el).data(valueKey);
    };
    Dataset.extractDatum = function extractDatum(el) {
      var datum = DOM.element(el).data(datumKey);
      if (typeof datum === "string") {
        datum = JSON.parse(datum);
      }
      return datum;
    };
    _.mixin(Dataset.prototype, EventEmitter, {
      // ### private
      _render: function render(query, suggestions) {
        if (!this.$el) {
          return;
        }
        var that = this;
        var hasSuggestions;
        var renderArgs = [].slice.call(arguments, 2);
        this.$el.empty();
        hasSuggestions = suggestions && suggestions.length;
        this._isEmpty = !hasSuggestions;
        if (!hasSuggestions && this.templates.empty) {
          this.$el.html(getEmptyHtml.apply(this, renderArgs)).prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null).append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
        } else if (hasSuggestions) {
          this.$el.html(getSuggestionsHtml.apply(this, renderArgs)).prepend(that.templates.header ? getHeaderHtml.apply(this, renderArgs) : null).append(that.templates.footer ? getFooterHtml.apply(this, renderArgs) : null);
        } else if (suggestions && !Array.isArray(suggestions)) {
          throw new TypeError("suggestions must be an array");
        }
        if (this.$menu) {
          this.$menu.addClass(
            this.cssClasses.prefix + (hasSuggestions ? "with" : "without") + "-" + this.name
          ).removeClass(
            this.cssClasses.prefix + (hasSuggestions ? "without" : "with") + "-" + this.name
          );
        }
        this.trigger("rendered", query);
        function getEmptyHtml() {
          var args = [].slice.call(arguments, 0);
          args = [{ query, isEmpty: true }].concat(args);
          return that.templates.empty.apply(this, args);
        }
        function getSuggestionsHtml() {
          var args = [].slice.call(arguments, 0);
          var $suggestions;
          var nodes;
          var self2 = this;
          var suggestionsHtml = html.suggestions.replace("%PREFIX%", this.cssClasses.prefix).replace("%SUGGESTIONS%", this.cssClasses.suggestions);
          $suggestions = DOM.element(suggestionsHtml).css(this.css.suggestions);
          nodes = _.map(suggestions, getSuggestionNode);
          $suggestions.append.apply($suggestions, nodes);
          return $suggestions;
          function getSuggestionNode(suggestion) {
            var $el;
            var suggestionHtml = html.suggestion.replace("%PREFIX%", self2.cssClasses.prefix).replace("%SUGGESTION%", self2.cssClasses.suggestion);
            $el = DOM.element(suggestionHtml).attr({
              role: "option",
              id: ["option", Math.floor(Math.random() * 1e8)].join("-")
            }).append(that.templates.suggestion.apply(this, [suggestion].concat(args)));
            $el.data(datasetKey, that.name);
            $el.data(valueKey, that.displayFn(suggestion) || void 0);
            $el.data(datumKey, JSON.stringify(suggestion));
            $el.children().each(function() {
              DOM.element(this).css(self2.css.suggestionChild);
            });
            return $el;
          }
        }
        function getHeaderHtml() {
          var args = [].slice.call(arguments, 0);
          args = [{ query, isEmpty: !hasSuggestions }].concat(args);
          return that.templates.header.apply(this, args);
        }
        function getFooterHtml() {
          var args = [].slice.call(arguments, 0);
          args = [{ query, isEmpty: !hasSuggestions }].concat(args);
          return that.templates.footer.apply(this, args);
        }
      },
      // ### public
      getRoot: function getRoot() {
        return this.$el;
      },
      update: function update(query) {
        function handleSuggestions(suggestions) {
          if (!this.canceled && query === this.query) {
            var extraArgs = [].slice.call(arguments, 1);
            this.cacheSuggestions(query, suggestions, extraArgs);
            this._render.apply(this, [query, suggestions].concat(extraArgs));
          }
        }
        this.query = query;
        this.canceled = false;
        if (this.shouldFetchFromCache(query)) {
          handleSuggestions.apply(this, [this.cachedSuggestions].concat(this.cachedRenderExtraArgs));
        } else {
          var that = this;
          var execSource = function() {
            if (!that.canceled) {
              that.source(query, handleSuggestions.bind(that));
            }
          };
          if (this.debounce) {
            var later = function() {
              that.debounceTimeout = null;
              execSource();
            };
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(later, this.debounce);
          } else {
            execSource();
          }
        }
      },
      cacheSuggestions: function cacheSuggestions(query, suggestions, extraArgs) {
        this.cachedQuery = query;
        this.cachedSuggestions = suggestions;
        this.cachedRenderExtraArgs = extraArgs;
      },
      shouldFetchFromCache: function shouldFetchFromCache(query) {
        return this.cache && this.cachedQuery === query && this.cachedSuggestions && this.cachedSuggestions.length;
      },
      clearCachedSuggestions: function clearCachedSuggestions() {
        delete this.cachedQuery;
        delete this.cachedSuggestions;
        delete this.cachedRenderExtraArgs;
      },
      cancel: function cancel() {
        this.canceled = true;
      },
      clear: function clear() {
        this.cancel();
        this.$el.empty();
        this.trigger("rendered", "");
      },
      isEmpty: function isEmpty() {
        return this._isEmpty;
      },
      destroy: function destroy() {
        this.clearCachedSuggestions();
        this.$el = null;
      }
    });
    function getDisplayFn(display) {
      display = display || "value";
      return _.isFunction(display) ? display : displayFn;
      function displayFn(obj) {
        return obj[display];
      }
    }
    function getTemplates(templates, displayFn) {
      return {
        empty: templates.empty && _.templatify(templates.empty),
        header: templates.header && _.templatify(templates.header),
        footer: templates.footer && _.templatify(templates.footer),
        suggestion: templates.suggestion || suggestionTemplate
      };
      function suggestionTemplate(context) {
        return "<p>" + displayFn(context) + "</p>";
      }
    }
    function isValidName(str) {
      return /^[_a-zA-Z0-9-]+$/.test(str);
    }
    module.exports = Dataset;
  }
});

// node_modules/autocomplete.js/src/autocomplete/dropdown.js
var require_dropdown = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/dropdown.js"(exports, module) {
    "use strict";
    var _ = require_utils();
    var DOM = require_dom();
    var EventEmitter = require_event_emitter();
    var Dataset = require_dataset();
    var css = require_css();
    function Dropdown(o) {
      var that = this;
      var onSuggestionClick;
      var onSuggestionMouseEnter;
      var onSuggestionMouseLeave;
      o = o || {};
      if (!o.menu) {
        _.error("menu is required");
      }
      if (!_.isArray(o.datasets) && !_.isObject(o.datasets)) {
        _.error("1 or more datasets required");
      }
      if (!o.datasets) {
        _.error("datasets is required");
      }
      this.isOpen = false;
      this.isEmpty = true;
      this.minLength = o.minLength || 0;
      this.templates = {};
      this.appendTo = o.appendTo || false;
      this.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
      this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
      this.cssClasses.prefix = o.cssClasses.formattedPrefix || _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
      onSuggestionClick = _.bind(this._onSuggestionClick, this);
      onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
      onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
      var cssClass = _.className(this.cssClasses.prefix, this.cssClasses.suggestion);
      this.$menu = DOM.element(o.menu).on("mouseenter.aa", cssClass, onSuggestionMouseEnter).on("mouseleave.aa", cssClass, onSuggestionMouseLeave).on("click.aa", cssClass, onSuggestionClick);
      this.$container = o.appendTo ? o.wrapper : this.$menu;
      if (o.templates && o.templates.header) {
        this.templates.header = _.templatify(o.templates.header);
        this.$menu.prepend(this.templates.header());
      }
      if (o.templates && o.templates.empty) {
        this.templates.empty = _.templatify(o.templates.empty);
        this.$empty = DOM.element('<div class="' + _.className(this.cssClasses.prefix, this.cssClasses.empty, true) + '"></div>');
        this.$menu.append(this.$empty);
        this.$empty.hide();
      }
      this.datasets = _.map(o.datasets, function(oDataset) {
        return initializeDataset(that.$menu, oDataset, o.cssClasses);
      });
      _.each(this.datasets, function(dataset) {
        var root = dataset.getRoot();
        if (root && root.parent().length === 0) {
          that.$menu.append(root);
        }
        dataset.onSync("rendered", that._onRendered, that);
      });
      if (o.templates && o.templates.footer) {
        this.templates.footer = _.templatify(o.templates.footer);
        this.$menu.append(this.templates.footer());
      }
      var self2 = this;
      DOM.element(window).resize(function() {
        self2._redraw();
      });
    }
    _.mixin(Dropdown.prototype, EventEmitter, {
      // ### private
      _onSuggestionClick: function onSuggestionClick($e) {
        this.trigger("suggestionClicked", DOM.element($e.currentTarget));
      },
      _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
        var elt = DOM.element($e.currentTarget);
        if (elt.hasClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true))) {
          return;
        }
        this._removeCursor();
        var suggestion = this;
        setTimeout(function() {
          suggestion._setCursor(elt, false);
        }, 0);
      },
      _onSuggestionMouseLeave: function onSuggestionMouseLeave($e) {
        if ($e.relatedTarget) {
          var elt = DOM.element($e.relatedTarget);
          if (elt.closest("." + _.className(this.cssClasses.prefix, this.cssClasses.cursor, true)).length > 0) {
            return;
          }
        }
        this._removeCursor();
        this.trigger("cursorRemoved");
      },
      _onRendered: function onRendered(e, query) {
        this.isEmpty = _.every(this.datasets, isDatasetEmpty);
        if (this.isEmpty) {
          if (query.length >= this.minLength) {
            this.trigger("empty");
          }
          if (this.$empty) {
            if (query.length < this.minLength) {
              this._hide();
            } else {
              var html = this.templates.empty({
                query: this.datasets[0] && this.datasets[0].query
              });
              this.$empty.html(html);
              this.$empty.show();
              this._show();
            }
          } else if (_.any(this.datasets, hasEmptyTemplate)) {
            if (query.length < this.minLength) {
              this._hide();
            } else {
              this._show();
            }
          } else {
            this._hide();
          }
        } else if (this.isOpen) {
          if (this.$empty) {
            this.$empty.empty();
            this.$empty.hide();
          }
          if (query.length >= this.minLength) {
            this._show();
          } else {
            this._hide();
          }
        }
        this.trigger("datasetRendered");
        function isDatasetEmpty(dataset) {
          return dataset.isEmpty();
        }
        function hasEmptyTemplate(dataset) {
          return dataset.templates && dataset.templates.empty;
        }
      },
      _hide: function() {
        this.$container.hide();
      },
      _show: function() {
        this.$container.css("display", "block");
        this._redraw();
        this.trigger("shown");
      },
      _redraw: function redraw() {
        if (!this.isOpen || !this.appendTo) return;
        this.trigger("redrawn");
      },
      _getSuggestions: function getSuggestions() {
        return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.suggestion));
      },
      _getCursor: function getCursor() {
        return this.$menu.find(_.className(this.cssClasses.prefix, this.cssClasses.cursor)).first();
      },
      _setCursor: function setCursor($el, updateInput) {
        $el.first().addClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true)).attr("aria-selected", "true");
        this.trigger("cursorMoved", updateInput);
      },
      _removeCursor: function removeCursor() {
        this._getCursor().removeClass(_.className(this.cssClasses.prefix, this.cssClasses.cursor, true)).removeAttr("aria-selected");
      },
      _moveCursor: function moveCursor(increment) {
        var $suggestions;
        var $oldCursor;
        var newCursorIndex;
        var $newCursor;
        if (!this.isOpen) {
          return;
        }
        $oldCursor = this._getCursor();
        $suggestions = this._getSuggestions();
        this._removeCursor();
        newCursorIndex = $suggestions.index($oldCursor) + increment;
        newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
        if (newCursorIndex === -1) {
          this.trigger("cursorRemoved");
          return;
        } else if (newCursorIndex < -1) {
          newCursorIndex = $suggestions.length - 1;
        }
        this._setCursor($newCursor = $suggestions.eq(newCursorIndex), true);
        this._ensureVisible($newCursor);
      },
      _ensureVisible: function ensureVisible($el) {
        var elTop;
        var elBottom;
        var menuScrollTop;
        var menuHeight;
        elTop = $el.position().top;
        elBottom = elTop + $el.height() + parseInt($el.css("margin-top"), 10) + parseInt($el.css("margin-bottom"), 10);
        menuScrollTop = this.$menu.scrollTop();
        menuHeight = this.$menu.height() + parseInt(this.$menu.css("padding-top"), 10) + parseInt(this.$menu.css("padding-bottom"), 10);
        if (elTop < 0) {
          this.$menu.scrollTop(menuScrollTop + elTop);
        } else if (menuHeight < elBottom) {
          this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
        }
      },
      // ### public
      close: function close() {
        if (this.isOpen) {
          this.isOpen = false;
          this._removeCursor();
          this._hide();
          this.trigger("closed");
        }
      },
      open: function open() {
        if (!this.isOpen) {
          this.isOpen = true;
          if (!this.isEmpty) {
            this._show();
          }
          this.trigger("opened");
        }
      },
      setLanguageDirection: function setLanguageDirection(dir) {
        this.$menu.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
      },
      moveCursorUp: function moveCursorUp() {
        this._moveCursor(-1);
      },
      moveCursorDown: function moveCursorDown() {
        this._moveCursor(1);
      },
      getDatumForSuggestion: function getDatumForSuggestion($el) {
        var datum = null;
        if ($el.length) {
          datum = {
            raw: Dataset.extractDatum($el),
            value: Dataset.extractValue($el),
            datasetName: Dataset.extractDatasetName($el)
          };
        }
        return datum;
      },
      getCurrentCursor: function getCurrentCursor() {
        return this._getCursor().first();
      },
      getDatumForCursor: function getDatumForCursor() {
        return this.getDatumForSuggestion(this._getCursor().first());
      },
      getDatumForTopSuggestion: function getDatumForTopSuggestion() {
        return this.getDatumForSuggestion(this._getSuggestions().first());
      },
      cursorTopSuggestion: function cursorTopSuggestion() {
        this._setCursor(this._getSuggestions().first(), false);
      },
      update: function update(query) {
        _.each(this.datasets, updateDataset);
        function updateDataset(dataset) {
          dataset.update(query);
        }
      },
      empty: function empty() {
        _.each(this.datasets, clearDataset);
        this.isEmpty = true;
        function clearDataset(dataset) {
          dataset.clear();
        }
      },
      isVisible: function isVisible() {
        return this.isOpen && !this.isEmpty;
      },
      destroy: function destroy() {
        this.$menu.off(".aa");
        this.$menu = null;
        _.each(this.datasets, destroyDataset);
        function destroyDataset(dataset) {
          dataset.destroy();
        }
      }
    });
    Dropdown.Dataset = Dataset;
    function initializeDataset($menu, oDataset, cssClasses) {
      return new Dropdown.Dataset(_.mixin({ $menu, cssClasses }, oDataset));
    }
    module.exports = Dropdown;
  }
});

// node_modules/autocomplete.js/version.js
var require_version2 = __commonJS({
  "node_modules/autocomplete.js/version.js"(exports, module) {
    module.exports = "0.36.0";
  }
});

// node_modules/autocomplete.js/src/common/parseAlgoliaClientVersion.js
var require_parseAlgoliaClientVersion = __commonJS({
  "node_modules/autocomplete.js/src/common/parseAlgoliaClientVersion.js"(exports, module) {
    "use strict";
    module.exports = function parseAlgoliaClientVersion(agent) {
      var parsed = agent.match(/Algolia for vanilla JavaScript (\d+\.)(\d+\.)(\d+)/);
      if (parsed) return [parsed[1], parsed[2], parsed[3]];
      return void 0;
    };
  }
});

// node_modules/autocomplete.js/src/sources/hits.js
var require_hits = __commonJS({
  "node_modules/autocomplete.js/src/sources/hits.js"(exports, module) {
    "use strict";
    var _ = require_utils();
    var version = require_version2();
    var parseAlgoliaClientVersion = require_parseAlgoliaClientVersion();
    module.exports = function search(index, params) {
      var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
      if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
        params = params || {};
        params.additionalUA = "autocomplete.js " + version;
      }
      return sourceFn;
      function sourceFn(query, cb) {
        index.search(query, params, function(error, content) {
          if (error) {
            _.error(error.message);
            return;
          }
          cb(content.hits, content);
        });
      }
    };
  }
});

// node_modules/autocomplete.js/src/sources/popularIn.js
var require_popularIn = __commonJS({
  "node_modules/autocomplete.js/src/sources/popularIn.js"(exports, module) {
    "use strict";
    var _ = require_utils();
    var version = require_version2();
    var parseAlgoliaClientVersion = require_parseAlgoliaClientVersion();
    module.exports = function popularIn(index, params, details, options) {
      var algoliaVersion = parseAlgoliaClientVersion(index.as._ua);
      if (algoliaVersion && algoliaVersion[0] >= 3 && algoliaVersion[1] > 20) {
        params = params || {};
        params.additionalUA = "autocomplete.js " + version;
      }
      if (!details.source) {
        return _.error("Missing 'source' key");
      }
      var source = _.isFunction(details.source) ? details.source : function(hit) {
        return hit[details.source];
      };
      if (!details.index) {
        return _.error("Missing 'index' key");
      }
      var detailsIndex = details.index;
      options = options || {};
      return sourceFn;
      function sourceFn(query, cb) {
        index.search(query, params, function(error, content) {
          if (error) {
            _.error(error.message);
            return;
          }
          if (content.hits.length > 0) {
            var first = content.hits[0];
            var detailsParams = _.mixin({ hitsPerPage: 0 }, details);
            delete detailsParams.source;
            delete detailsParams.index;
            var detailsAlgoliaVersion = parseAlgoliaClientVersion(detailsIndex.as._ua);
            if (detailsAlgoliaVersion && detailsAlgoliaVersion[0] >= 3 && detailsAlgoliaVersion[1] > 20) {
              params.additionalUA = "autocomplete.js " + version;
            }
            detailsIndex.search(source(first), detailsParams, function(error2, content2) {
              if (error2) {
                _.error(error2.message);
                return;
              }
              var suggestions = [];
              if (options.includeAll) {
                var label = options.allTitle || "All departments";
                suggestions.push(_.mixin({
                  facet: { value: label, count: content2.nbHits }
                }, _.cloneDeep(first)));
              }
              _.each(content2.facets, function(values, facet) {
                _.each(values, function(count, value) {
                  suggestions.push(_.mixin({
                    facet: { facet, value, count }
                  }, _.cloneDeep(first)));
                });
              });
              for (var i = 1; i < content.hits.length; ++i) {
                suggestions.push(content.hits[i]);
              }
              cb(suggestions, content);
            });
            return;
          }
          cb([]);
        });
      }
    };
  }
});

// node_modules/autocomplete.js/src/sources/index.js
var require_sources = __commonJS({
  "node_modules/autocomplete.js/src/sources/index.js"(exports, module) {
    "use strict";
    module.exports = {
      hits: require_hits(),
      popularIn: require_popularIn()
    };
  }
});

// node_modules/autocomplete.js/src/autocomplete/typeahead.js
var require_typeahead = __commonJS({
  "node_modules/autocomplete.js/src/autocomplete/typeahead.js"(exports, module) {
    "use strict";
    var attrsKey = "aaAttrs";
    var _ = require_utils();
    var DOM = require_dom();
    var EventBus = require_event_bus();
    var Input = require_input();
    var Dropdown = require_dropdown();
    var html = require_html();
    var css = require_css();
    function Typeahead(o) {
      var $menu;
      var $hint;
      o = o || {};
      if (!o.input) {
        _.error("missing input");
      }
      this.isActivated = false;
      this.debug = !!o.debug;
      this.autoselect = !!o.autoselect;
      this.autoselectOnBlur = !!o.autoselectOnBlur;
      this.openOnFocus = !!o.openOnFocus;
      this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
      this.autoWidth = o.autoWidth === void 0 ? true : !!o.autoWidth;
      this.clearOnSelected = !!o.clearOnSelected;
      this.tabAutocomplete = o.tabAutocomplete === void 0 ? true : !!o.tabAutocomplete;
      o.hint = !!o.hint;
      if (o.hint && o.appendTo) {
        throw new Error("[autocomplete.js] hint and appendTo options can't be used at the same time");
      }
      this.css = o.css = _.mixin({}, css, o.appendTo ? css.appendTo : {});
      this.cssClasses = o.cssClasses = _.mixin({}, css.defaultClasses, o.cssClasses || {});
      this.cssClasses.prefix = o.cssClasses.formattedPrefix = _.formatPrefix(this.cssClasses.prefix, this.cssClasses.noPrefix);
      this.listboxId = o.listboxId = [this.cssClasses.root, "listbox", _.getUniqueId()].join("-");
      var domElts = buildDom(o);
      this.$node = domElts.wrapper;
      var $input = this.$input = domElts.input;
      $menu = domElts.menu;
      $hint = domElts.hint;
      if (o.dropdownMenuContainer) {
        DOM.element(o.dropdownMenuContainer).css("position", "relative").append($menu.css("top", "0"));
      }
      $input.on("blur.aa", function($e) {
        var active = document.activeElement;
        if (_.isMsie() && ($menu[0] === active || $menu[0].contains(active))) {
          $e.preventDefault();
          $e.stopImmediatePropagation();
          _.defer(function() {
            $input.focus();
          });
        }
      });
      $menu.on("mousedown.aa", function($e) {
        $e.preventDefault();
      });
      this.eventBus = o.eventBus || new EventBus({ el: $input });
      this.dropdown = new Typeahead.Dropdown({
        appendTo: o.appendTo,
        wrapper: this.$node,
        menu: $menu,
        datasets: o.datasets,
        templates: o.templates,
        cssClasses: o.cssClasses,
        minLength: this.minLength
      }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onSync("shown", this._onShown, this).onSync("empty", this._onEmpty, this).onSync("redrawn", this._onRedrawn, this).onAsync("datasetRendered", this._onDatasetRendered, this);
      this.input = new Typeahead.Input({ input: $input, hint: $hint }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
      this._bindKeyboardShortcuts(o);
      this._setLanguageDirection();
    }
    _.mixin(Typeahead.prototype, {
      // ### private
      _bindKeyboardShortcuts: function(options) {
        if (!options.keyboardShortcuts) {
          return;
        }
        var $input = this.$input;
        var keyboardShortcuts = [];
        _.each(options.keyboardShortcuts, function(key2) {
          if (typeof key2 === "string") {
            key2 = key2.toUpperCase().charCodeAt(0);
          }
          keyboardShortcuts.push(key2);
        });
        DOM.element(document).keydown(function(event) {
          var elt = event.target || event.srcElement;
          var tagName = elt.tagName;
          if (elt.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA") {
            return;
          }
          var which = event.which || event.keyCode;
          if (keyboardShortcuts.indexOf(which) === -1) {
            return;
          }
          $input.focus();
          event.stopPropagation();
          event.preventDefault();
        });
      },
      _onSuggestionClicked: function onSuggestionClicked(type, $el) {
        var datum;
        var context = { selectionMethod: "click" };
        if (datum = this.dropdown.getDatumForSuggestion($el)) {
          this._select(datum, context);
        }
      },
      _onCursorMoved: function onCursorMoved(event, updateInput) {
        var datum = this.dropdown.getDatumForCursor();
        var currentCursorId = this.dropdown.getCurrentCursor().attr("id");
        this.input.setActiveDescendant(currentCursorId);
        if (datum) {
          if (updateInput) {
            this.input.setInputValue(datum.value, true);
          }
          this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
        }
      },
      _onCursorRemoved: function onCursorRemoved() {
        this.input.resetInputValue();
        this._updateHint();
        this.eventBus.trigger("cursorremoved");
      },
      _onDatasetRendered: function onDatasetRendered() {
        this._updateHint();
        this.eventBus.trigger("updated");
      },
      _onOpened: function onOpened() {
        this._updateHint();
        this.input.expand();
        this.eventBus.trigger("opened");
      },
      _onEmpty: function onEmpty() {
        this.eventBus.trigger("empty");
      },
      _onRedrawn: function onRedrawn() {
        this.$node.css("top", "0px");
        this.$node.css("left", "0px");
        var inputRect = this.$input[0].getBoundingClientRect();
        if (this.autoWidth) {
          this.$node.css("width", inputRect.width + "px");
        }
        var wrapperRect = this.$node[0].getBoundingClientRect();
        var top = inputRect.bottom - wrapperRect.top;
        this.$node.css("top", top + "px");
        var left = inputRect.left - wrapperRect.left;
        this.$node.css("left", left + "px");
        this.eventBus.trigger("redrawn");
      },
      _onShown: function onShown() {
        this.eventBus.trigger("shown");
        if (this.autoselect) {
          this.dropdown.cursorTopSuggestion();
        }
      },
      _onClosed: function onClosed() {
        this.input.clearHint();
        this.input.removeActiveDescendant();
        this.input.collapse();
        this.eventBus.trigger("closed");
      },
      _onFocused: function onFocused() {
        this.isActivated = true;
        if (this.openOnFocus) {
          var query = this.input.getQuery();
          if (query.length >= this.minLength) {
            this.dropdown.update(query);
          } else {
            this.dropdown.empty();
          }
          this.dropdown.open();
        }
      },
      _onBlurred: function onBlurred() {
        var cursorDatum;
        var topSuggestionDatum;
        cursorDatum = this.dropdown.getDatumForCursor();
        topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
        var context = { selectionMethod: "blur" };
        if (!this.debug) {
          if (this.autoselectOnBlur && cursorDatum) {
            this._select(cursorDatum, context);
          } else if (this.autoselectOnBlur && topSuggestionDatum) {
            this._select(topSuggestionDatum, context);
          } else {
            this.isActivated = false;
            this.dropdown.empty();
            this.dropdown.close();
          }
        }
      },
      _onEnterKeyed: function onEnterKeyed(type, $e) {
        var cursorDatum;
        var topSuggestionDatum;
        cursorDatum = this.dropdown.getDatumForCursor();
        topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
        var context = { selectionMethod: "enterKey" };
        if (cursorDatum) {
          this._select(cursorDatum, context);
          $e.preventDefault();
        } else if (this.autoselect && topSuggestionDatum) {
          this._select(topSuggestionDatum, context);
          $e.preventDefault();
        }
      },
      _onTabKeyed: function onTabKeyed(type, $e) {
        if (!this.tabAutocomplete) {
          this.dropdown.close();
          return;
        }
        var datum;
        var context = { selectionMethod: "tabKey" };
        if (datum = this.dropdown.getDatumForCursor()) {
          this._select(datum, context);
          $e.preventDefault();
        } else {
          this._autocomplete(true);
        }
      },
      _onEscKeyed: function onEscKeyed() {
        this.dropdown.close();
        this.input.resetInputValue();
      },
      _onUpKeyed: function onUpKeyed() {
        var query = this.input.getQuery();
        if (this.dropdown.isEmpty && query.length >= this.minLength) {
          this.dropdown.update(query);
        } else {
          this.dropdown.moveCursorUp();
        }
        this.dropdown.open();
      },
      _onDownKeyed: function onDownKeyed() {
        var query = this.input.getQuery();
        if (this.dropdown.isEmpty && query.length >= this.minLength) {
          this.dropdown.update(query);
        } else {
          this.dropdown.moveCursorDown();
        }
        this.dropdown.open();
      },
      _onLeftKeyed: function onLeftKeyed() {
        if (this.dir === "rtl") {
          this._autocomplete();
        }
      },
      _onRightKeyed: function onRightKeyed() {
        if (this.dir === "ltr") {
          this._autocomplete();
        }
      },
      _onQueryChanged: function onQueryChanged(e, query) {
        this.input.clearHintIfInvalid();
        if (query.length >= this.minLength) {
          this.dropdown.update(query);
        } else {
          this.dropdown.empty();
        }
        this.dropdown.open();
        this._setLanguageDirection();
      },
      _onWhitespaceChanged: function onWhitespaceChanged() {
        this._updateHint();
        this.dropdown.open();
      },
      _setLanguageDirection: function setLanguageDirection() {
        var dir = this.input.getLanguageDirection();
        if (this.dir !== dir) {
          this.dir = dir;
          this.$node.css("direction", dir);
          this.dropdown.setLanguageDirection(dir);
        }
      },
      _updateHint: function updateHint() {
        var datum;
        var val;
        var query;
        var escapedQuery;
        var frontMatchRegEx;
        var match;
        datum = this.dropdown.getDatumForTopSuggestion();
        if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
          val = this.input.getInputValue();
          query = Input.normalizeQuery(val);
          escapedQuery = _.escapeRegExChars(query);
          frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
          match = frontMatchRegEx.exec(datum.value);
          if (match) {
            this.input.setHint(val + match[1]);
          } else {
            this.input.clearHint();
          }
        } else {
          this.input.clearHint();
        }
      },
      _autocomplete: function autocomplete(laxCursor) {
        var hint;
        var query;
        var isCursorAtEnd;
        var datum;
        hint = this.input.getHint();
        query = this.input.getQuery();
        isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
        if (hint && query !== hint && isCursorAtEnd) {
          datum = this.dropdown.getDatumForTopSuggestion();
          if (datum) {
            this.input.setInputValue(datum.value);
          }
          this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
        }
      },
      _select: function select(datum, context) {
        if (typeof datum.value !== "undefined") {
          this.input.setQuery(datum.value);
        }
        if (this.clearOnSelected) {
          this.setVal("");
        } else {
          this.input.setInputValue(datum.value, true);
        }
        this._setLanguageDirection();
        var event = this.eventBus.trigger("selected", datum.raw, datum.datasetName, context);
        if (event.isDefaultPrevented() === false) {
          this.dropdown.close();
          _.defer(_.bind(this.dropdown.empty, this.dropdown));
        }
      },
      // ### public
      open: function open() {
        if (!this.isActivated) {
          var query = this.input.getInputValue();
          if (query.length >= this.minLength) {
            this.dropdown.update(query);
          } else {
            this.dropdown.empty();
          }
        }
        this.dropdown.open();
      },
      close: function close() {
        this.dropdown.close();
      },
      setVal: function setVal(val) {
        val = _.toStr(val);
        if (this.isActivated) {
          this.input.setInputValue(val);
        } else {
          this.input.setQuery(val);
          this.input.setInputValue(val, true);
        }
        this._setLanguageDirection();
      },
      getVal: function getVal() {
        return this.input.getQuery();
      },
      destroy: function destroy() {
        this.input.destroy();
        this.dropdown.destroy();
        destroyDomStructure(this.$node, this.cssClasses);
        this.$node = null;
      },
      getWrapper: function getWrapper() {
        return this.dropdown.$container[0];
      }
    });
    function buildDom(options) {
      var $input;
      var $wrapper;
      var $dropdown;
      var $hint;
      $input = DOM.element(options.input);
      $wrapper = DOM.element(html.wrapper.replace("%ROOT%", options.cssClasses.root)).css(options.css.wrapper);
      if (!options.appendTo && $input.css("display") === "block" && $input.parent().css("display") === "table") {
        $wrapper.css("display", "table-cell");
      }
      var dropdownHtml = html.dropdown.replace("%PREFIX%", options.cssClasses.prefix).replace("%DROPDOWN_MENU%", options.cssClasses.dropdownMenu);
      $dropdown = DOM.element(dropdownHtml).css(options.css.dropdown).attr({
        role: "listbox",
        id: options.listboxId
      });
      if (options.templates && options.templates.dropdownMenu) {
        $dropdown.html(_.templatify(options.templates.dropdownMenu)());
      }
      $hint = $input.clone().css(options.css.hint).css(getBackgroundStyles($input));
      $hint.val("").addClass(_.className(options.cssClasses.prefix, options.cssClasses.hint, true)).removeAttr("id name placeholder required").prop("readonly", true).attr({
        "aria-hidden": "true",
        autocomplete: "off",
        spellcheck: "false",
        tabindex: -1
      });
      if ($hint.removeData) {
        $hint.removeData();
      }
      $input.data(attrsKey, {
        "aria-autocomplete": $input.attr("aria-autocomplete"),
        "aria-expanded": $input.attr("aria-expanded"),
        "aria-owns": $input.attr("aria-owns"),
        autocomplete: $input.attr("autocomplete"),
        dir: $input.attr("dir"),
        role: $input.attr("role"),
        spellcheck: $input.attr("spellcheck"),
        style: $input.attr("style"),
        type: $input.attr("type")
      });
      $input.addClass(_.className(options.cssClasses.prefix, options.cssClasses.input, true)).attr({
        autocomplete: "off",
        spellcheck: false,
        // Accessibility features
        // Give the field a presentation of a "select".
        // Combobox is the combined presentation of a single line textfield
        // with a listbox popup.
        // https://www.w3.org/WAI/PF/aria/roles#combobox
        role: "combobox",
        // Let the screen reader know the field has an autocomplete
        // feature to it.
        "aria-autocomplete": options.datasets && options.datasets[0] && options.datasets[0].displayKey ? "both" : "list",
        // Indicates whether the dropdown it controls is currently expanded or collapsed
        "aria-expanded": "false",
        "aria-label": options.ariaLabel,
        // Explicitly point to the listbox,
        // which is a list of suggestions (aka options)
        "aria-owns": options.listboxId
      }).css(options.hint ? options.css.input : options.css.inputWithNoHint);
      try {
        if (!$input.attr("dir")) {
          $input.attr("dir", "auto");
        }
      } catch (e) {
      }
      $wrapper = options.appendTo ? $wrapper.appendTo(DOM.element(options.appendTo).eq(0)).eq(0) : $input.wrap($wrapper).parent();
      $wrapper.prepend(options.hint ? $hint : null).append($dropdown);
      return {
        wrapper: $wrapper,
        input: $input,
        hint: $hint,
        menu: $dropdown
      };
    }
    function getBackgroundStyles($el) {
      return {
        backgroundAttachment: $el.css("background-attachment"),
        backgroundClip: $el.css("background-clip"),
        backgroundColor: $el.css("background-color"),
        backgroundImage: $el.css("background-image"),
        backgroundOrigin: $el.css("background-origin"),
        backgroundPosition: $el.css("background-position"),
        backgroundRepeat: $el.css("background-repeat"),
        backgroundSize: $el.css("background-size")
      };
    }
    function destroyDomStructure($node, cssClasses) {
      var $input = $node.find(_.className(cssClasses.prefix, cssClasses.input));
      _.each($input.data(attrsKey), function(val, key2) {
        if (val === void 0) {
          $input.removeAttr(key2);
        } else {
          $input.attr(key2, val);
        }
      });
      $input.detach().removeClass(_.className(cssClasses.prefix, cssClasses.input, true)).insertAfter($node);
      if ($input.removeData) {
        $input.removeData(attrsKey);
      }
      $node.remove();
    }
    Typeahead.Dropdown = Dropdown;
    Typeahead.Input = Input;
    Typeahead.sources = require_sources();
    module.exports = Typeahead;
  }
});

// node_modules/autocomplete.js/src/standalone/index.js
var require_standalone = __commonJS({
  "node_modules/autocomplete.js/src/standalone/index.js"(exports, module) {
    "use strict";
    var zepto = require_zepto();
    var DOM = require_dom();
    DOM.element = zepto;
    var _ = require_utils();
    _.isArray = zepto.isArray;
    _.isFunction = zepto.isFunction;
    _.isObject = zepto.isPlainObject;
    _.bind = zepto.proxy;
    _.each = function(collection, cb) {
      zepto.each(collection, reverseArgs);
      function reverseArgs(index, value) {
        return cb(value, index);
      }
    };
    _.map = zepto.map;
    _.mixin = zepto.extend;
    _.Event = zepto.Event;
    var typeaheadKey = "aaAutocomplete";
    var Typeahead = require_typeahead();
    var EventBus = require_event_bus();
    function autocomplete(selector, options, datasets, typeaheadObject) {
      datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);
      var inputs = zepto(selector).each(function(i, input) {
        var $input = zepto(input);
        var eventBus = new EventBus({ el: $input });
        var typeahead = typeaheadObject || new Typeahead({
          input: $input,
          eventBus,
          dropdownMenuContainer: options.dropdownMenuContainer,
          hint: options.hint === void 0 ? true : !!options.hint,
          minLength: options.minLength,
          autoselect: options.autoselect,
          autoselectOnBlur: options.autoselectOnBlur,
          tabAutocomplete: options.tabAutocomplete,
          openOnFocus: options.openOnFocus,
          templates: options.templates,
          debug: options.debug,
          clearOnSelected: options.clearOnSelected,
          cssClasses: options.cssClasses,
          datasets,
          keyboardShortcuts: options.keyboardShortcuts,
          appendTo: options.appendTo,
          autoWidth: options.autoWidth,
          ariaLabel: options.ariaLabel || input.getAttribute("aria-label")
        });
        $input.data(typeaheadKey, typeahead);
      });
      inputs.autocomplete = {};
      _.each(["open", "close", "getVal", "setVal", "destroy", "getWrapper"], function(method) {
        inputs.autocomplete[method] = function() {
          var methodArguments = arguments;
          var result;
          inputs.each(function(j, input) {
            var typeahead = zepto(input).data(typeaheadKey);
            result = typeahead[method].apply(typeahead, methodArguments);
          });
          return result;
        };
      });
      return inputs;
    }
    autocomplete.sources = Typeahead.sources;
    autocomplete.escapeHighlightedString = _.escapeHighlightedString;
    var wasAutocompleteSet = "autocomplete" in window;
    var oldAutocomplete = window.autocomplete;
    autocomplete.noConflict = function noConflict() {
      if (wasAutocompleteSet) {
        window.autocomplete = oldAutocomplete;
      } else {
        delete window.autocomplete;
      }
      return autocomplete;
    };
    module.exports = autocomplete;
  }
});

// node_modules/autocomplete.js/index.js
var require_autocomplete = __commonJS({
  "node_modules/autocomplete.js/index.js"(exports, module) {
    "use strict";
    module.exports = require_standalone();
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/templates.js
var require_templates = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/templates.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var prefix = "algolia-docsearch";
    var suggestionPrefix = prefix + "-suggestion";
    var footerPrefix = prefix + "-footer";
    var templates = {
      suggestion: '\n  <a class="' + suggestionPrefix + "\n    {{#isCategoryHeader}}" + suggestionPrefix + "__main{{/isCategoryHeader}}\n    {{#isSubCategoryHeader}}" + suggestionPrefix + '__secondary{{/isSubCategoryHeader}}\n    "\n    aria-label="Link to the result"\n    href="{{{url}}}"\n    >\n    <div class="' + suggestionPrefix + '--category-header">\n        <span class="' + suggestionPrefix + '--category-header-lvl0">{{{category}}}</span>\n    </div>\n    <div class="' + suggestionPrefix + '--wrapper">\n      <div class="' + suggestionPrefix + '--subcategory-column">\n        <span class="' + suggestionPrefix + '--subcategory-column-text">{{{subcategory}}}</span>\n      </div>\n      {{#isTextOrSubcategoryNonEmpty}}\n      <div class="' + suggestionPrefix + '--content">\n        <div class="' + suggestionPrefix + '--subcategory-inline">{{{subcategory}}}</div>\n        <div class="' + suggestionPrefix + '--title">{{{title}}}</div>\n        {{#text}}<div class="' + suggestionPrefix + '--text">{{{text}}}</div>{{/text}}\n      </div>\n      {{/isTextOrSubcategoryNonEmpty}}\n    </div>\n  </a>\n  ',
      suggestionSimple: '\n  <div class="' + suggestionPrefix + "\n    {{#isCategoryHeader}}" + suggestionPrefix + "__main{{/isCategoryHeader}}\n    {{#isSubCategoryHeader}}" + suggestionPrefix + '__secondary{{/isSubCategoryHeader}}\n    suggestion-layout-simple\n  ">\n    <div class="' + suggestionPrefix + '--category-header">\n        {{^isLvl0}}\n        <span class="' + suggestionPrefix + "--category-header-lvl0 " + suggestionPrefix + '--category-header-item">{{{category}}}</span>\n          {{^isLvl1}}\n          {{^isLvl1EmptyOrDuplicate}}\n          <span class="' + suggestionPrefix + "--category-header-lvl1 " + suggestionPrefix + '--category-header-item">\n              {{{subcategory}}}\n          </span>\n          {{/isLvl1EmptyOrDuplicate}}\n          {{/isLvl1}}\n        {{/isLvl0}}\n        <div class="' + suggestionPrefix + "--title " + suggestionPrefix + '--category-header-item">\n            {{#isLvl2}}\n                {{{title}}}\n            {{/isLvl2}}\n            {{#isLvl1}}\n                {{{subcategory}}}\n            {{/isLvl1}}\n            {{#isLvl0}}\n                {{{category}}}\n            {{/isLvl0}}\n        </div>\n    </div>\n    <div class="' + suggestionPrefix + '--wrapper">\n      {{#text}}\n      <div class="' + suggestionPrefix + '--content">\n        <div class="' + suggestionPrefix + '--text">{{{text}}}</div>\n      </div>\n      {{/text}}\n    </div>\n  </div>\n  ',
      footer: '\n    <div class="' + footerPrefix + '">\n      Search by <a class="' + footerPrefix + '--logo" href="https://www.algolia.com/docsearch">Algolia</a>\n    </div>\n  ',
      empty: '\n  <div class="' + suggestionPrefix + '">\n    <div class="' + suggestionPrefix + '--wrapper">\n        <div class="' + suggestionPrefix + "--content " + suggestionPrefix + '--no-results">\n            <div class="' + suggestionPrefix + '--title">\n                <div class="' + suggestionPrefix + '--text">\n                    No results found for query <b>"{{query}}"</b>\n                </div>\n            </div>\n        </div>\n    </div>\n  </div>\n  ',
      searchBox: '\n  <form novalidate="novalidate" onsubmit="return false;" class="searchbox">\n    <div role="search" class="searchbox__wrapper">\n      <input id="docsearch" type="search" name="search" placeholder="Search the docs" autocomplete="off" required="required" class="searchbox__input"/>\n      <button type="submit" title="Submit your search query." class="searchbox__submit" >\n        <svg width=12 height=12 role="img" aria-label="Search">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-13"></use>\n        </svg>\n      </button>\n      <button type="reset" title="Clear the search query." class="searchbox__reset hide">\n        <svg width=12 height=12 role="img" aria-label="Reset">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-3"></use>\n        </svg>\n      </button>\n    </div>\n</form>\n\n<div class="svg-icons" style="height: 0; width: 0; position: absolute; visibility: hidden">\n  <svg xmlns="http://www.w3.org/2000/svg">\n    <symbol id="sbx-icon-clear-3" viewBox="0 0 40 40"><path d="M16.228 20L1.886 5.657 0 3.772 3.772 0l1.885 1.886L20 16.228 34.343 1.886 36.228 0 40 3.772l-1.886 1.885L23.772 20l14.342 14.343L40 36.228 36.228 40l-1.885-1.886L20 23.772 5.657 38.114 3.772 40 0 36.228l1.886-1.885L16.228 20z" fill-rule="evenodd"></symbol>\n    <symbol id="sbx-icon-search-13" viewBox="0 0 40 40"><path d="M26.806 29.012a16.312 16.312 0 0 1-10.427 3.746C7.332 32.758 0 25.425 0 16.378 0 7.334 7.333 0 16.38 0c9.045 0 16.378 7.333 16.378 16.38 0 3.96-1.406 7.593-3.746 10.426L39.547 37.34c.607.608.61 1.59-.004 2.203a1.56 1.56 0 0 1-2.202.004L26.807 29.012zm-10.427.627c7.322 0 13.26-5.938 13.26-13.26 0-7.324-5.938-13.26-13.26-13.26-7.324 0-13.26 5.936-13.26 13.26 0 7.322 5.936 13.26 13.26 13.26z" fill-rule="evenodd"></symbol>\n  </svg>\n</div>\n  '
    };
    exports.default = templates;
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/zepto.js
var require_zepto2 = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/zepto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _zepto = require_zepto();
    var _zepto2 = _interopRequireDefault(_zepto);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    exports.default = _zepto2.default;
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var _zepto = require_zepto2();
    var _zepto2 = _interopRequireDefault(_zepto);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var utils = {
      /*
      * Move the content of an object key one level higher.
      * eg.
      * {
      *   name: 'My name',
      *   hierarchy: {
      *     lvl0: 'Foo',
      *     lvl1: 'Bar'
      *   }
      * }
      * Will be converted to
      * {
      *   name: 'My name',
      *   lvl0: 'Foo',
      *   lvl1: 'Bar'
      * }
      * @param {Object} object Main object
      * @param {String} property Main object key to move up
      * @return {Object}
      * @throws Error when key is not an attribute of Object or is not an object itself
      */
      mergeKeyWithParent: function mergeKeyWithParent(object, property) {
        if (object[property] === void 0) {
          return object;
        }
        if (_typeof(object[property]) !== "object") {
          return object;
        }
        var newObject = _zepto2.default.extend({}, object, object[property]);
        delete newObject[property];
        return newObject;
      },
      /*
      * Group all objects of a collection by the value of the specified attribute
      * If the attribute is a string, use the lowercase form.
      *
      * eg.
      * groupBy([
      *   {name: 'Tim', category: 'dev'},
      *   {name: 'Vincent', category: 'dev'},
      *   {name: 'Ben', category: 'sales'},
      *   {name: 'Jeremy', category: 'sales'},
      *   {name: 'AlexS', category: 'dev'},
      *   {name: 'AlexK', category: 'sales'}
      * ], 'category');
      * =>
      * {
      *   'devs': [
      *     {name: 'Tim', category: 'dev'},
      *     {name: 'Vincent', category: 'dev'},
      *     {name: 'AlexS', category: 'dev'}
      *   ],
      *   'sales': [
      *     {name: 'Ben', category: 'sales'},
      *     {name: 'Jeremy', category: 'sales'},
      *     {name: 'AlexK', category: 'sales'}
      *   ]
      * }
      * @param {array} collection Array of objects to group
      * @param {String} property The attribute on which apply the grouping
      * @return {array}
      * @throws Error when one of the element does not have the specified property
      */
      groupBy: function groupBy(collection, property) {
        var newCollection = {};
        _zepto2.default.each(collection, function(index, item) {
          if (item[property] === void 0) {
            throw new Error("[groupBy]: Object has no key " + property);
          }
          var key2 = item[property];
          if (typeof key2 === "string") {
            key2 = key2.toLowerCase();
          }
          if (!Object.prototype.hasOwnProperty.call(newCollection, key2)) {
            newCollection[key2] = [];
          }
          newCollection[key2].push(item);
        });
        return newCollection;
      },
      /*
      * Return an array of all the values of the specified object
      * eg.
      * values({
      *   foo: 42,
      *   bar: true,
      *   baz: 'yep'
      * })
      * =>
      * [42, true, yep]
      * @param {object} object Object to extract values from
      * @return {array}
      */
      values: function values(object) {
        return Object.keys(object).map(function(key2) {
          return object[key2];
        });
      },
      /*
      * Flattens an array
      * eg.
      * flatten([1, 2, [3, 4], [5, 6]])
      * =>
      * [1, 2, 3, 4, 5, 6]
      * @param {array} array Array to flatten
      * @return {array}
      */
      flatten: function flatten(array) {
        var results = [];
        array.forEach(function(value) {
          if (!Array.isArray(value)) {
            results.push(value);
            return;
          }
          value.forEach(function(subvalue) {
            results.push(subvalue);
          });
        });
        return results;
      },
      /*
      * Flatten all values of an object into an array, marking each first element of
      * each group with a specific flag
      * eg.
      * flattenAndFlagFirst({
      *   'devs': [
      *     {name: 'Tim', category: 'dev'},
      *     {name: 'Vincent', category: 'dev'},
      *     {name: 'AlexS', category: 'dev'}
      *   ],
      *   'sales': [
      *     {name: 'Ben', category: 'sales'},
      *     {name: 'Jeremy', category: 'sales'},
      *     {name: 'AlexK', category: 'sales'}
      *   ]
      * , 'isTop');
      * =>
      * [
      *     {name: 'Tim', category: 'dev', isTop: true},
      *     {name: 'Vincent', category: 'dev', isTop: false},
      *     {name: 'AlexS', category: 'dev', isTop: false},
      *     {name: 'Ben', category: 'sales', isTop: true},
      *     {name: 'Jeremy', category: 'sales', isTop: false},
      *     {name: 'AlexK', category: 'sales', isTop: false}
      * ]
      * @param {object} object Object to flatten
      * @param {string} flag Flag to set to true on first element of each group
      * @return {array}
      */
      flattenAndFlagFirst: function flattenAndFlagFirst(object, flag) {
        var values = this.values(object).map(function(collection) {
          return collection.map(function(item, index) {
            item[flag] = index === 0;
            return item;
          });
        });
        return this.flatten(values);
      },
      /*
      * Removes all empty strings, null, false and undefined elements array
      * eg.
      * compact([42, false, null, undefined, '', [], 'foo']);
      * =>
      * [42, [], 'foo']
      * @param {array} array Array to compact
      * @return {array}
      */
      compact: function compact(array) {
        var results = [];
        array.forEach(function(value) {
          if (!value) {
            return;
          }
          results.push(value);
        });
        return results;
      },
      /*
       * Returns the highlighted value of the specified key in the specified object.
       * If no highlighted value is available, will return the key value directly
       * eg.
       * getHighlightedValue({
       *    _highlightResult: {
       *      text: {
       *        value: '<mark>foo</mark>'
       *      }
       *    },
       *    text: 'foo'
       * }, 'text');
       * =>
       * '<mark>foo</mark>'
       * @param {object} object Hit object returned by the Algolia API
       * @param {string} property Object key to look for
       * @return {string}
       **/
      getHighlightedValue: function getHighlightedValue(object, property) {
        if (object._highlightResult && object._highlightResult.hierarchy_camel && object._highlightResult.hierarchy_camel[property] && object._highlightResult.hierarchy_camel[property].matchLevel && object._highlightResult.hierarchy_camel[property].matchLevel !== "none" && object._highlightResult.hierarchy_camel[property].value) {
          return object._highlightResult.hierarchy_camel[property].value;
        }
        if (object._highlightResult && object._highlightResult && object._highlightResult[property] && object._highlightResult[property].value) {
          return object._highlightResult[property].value;
        }
        return object[property];
      },
      /*
       * Returns the snippeted value of the specified key in the specified object.
       * If no highlighted value is available, will return the key value directly.
       * Will add starting and ending ellipsis (…) if we detect that a sentence is
       * incomplete
       * eg.
       * getSnippetedValue({
       *    _snippetResult: {
       *      text: {
       *        value: '<mark>This is an unfinished sentence</mark>'
       *      }
       *    },
       *    text: 'This is an unfinished sentence'
       * }, 'text');
       * =>
       * '<mark>This is an unfinished sentence</mark>…'
       * @param {object} object Hit object returned by the Algolia API
       * @param {string} property Object key to look for
       * @return {string}
       **/
      getSnippetedValue: function getSnippetedValue(object, property) {
        if (!object._snippetResult || !object._snippetResult[property] || !object._snippetResult[property].value) {
          return object[property];
        }
        var snippet = object._snippetResult[property].value;
        if (snippet[0] !== snippet[0].toUpperCase()) {
          snippet = "\u2026" + snippet;
        }
        if ([".", "!", "?"].indexOf(snippet[snippet.length - 1]) === -1) {
          snippet = snippet + "\u2026";
        }
        return snippet;
      },
      /*
      * Deep clone an object.
      * Note: This will not clone functions and dates
      * @param {object} object Object to clone
      * @return {object}
      */
      deepClone: function deepClone(object) {
        return JSON.parse(JSON.stringify(object));
      }
    };
    exports.default = utils;
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/version.js
var require_version3 = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = "2.6.3";
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/DocSearch.js
var require_DocSearch = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/DocSearch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key2 in source) {
          if (Object.prototype.hasOwnProperty.call(source, key2)) {
            target[key2] = source[key2];
          }
        }
      }
      return target;
    };
    var _createClass = /* @__PURE__ */ (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    var _hogan = require_hogan();
    var _hogan2 = _interopRequireDefault(_hogan);
    var _lite = require_algoliasearchLite();
    var _lite2 = _interopRequireDefault(_lite);
    var _autocomplete = require_autocomplete();
    var _autocomplete2 = _interopRequireDefault(_autocomplete);
    var _templates = require_templates();
    var _templates2 = _interopRequireDefault(_templates);
    var _utils = require_utils2();
    var _utils2 = _interopRequireDefault(_utils);
    var _version = require_version3();
    var _version2 = _interopRequireDefault(_version);
    var _zepto = require_zepto2();
    var _zepto2 = _interopRequireDefault(_zepto);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var usage = "Usage:\n  documentationSearch({\n  apiKey,\n  indexName,\n  inputSelector,\n  [ appId ],\n  [ algoliaOptions.{hitsPerPage} ]\n  [ autocompleteOptions.{hint,debug} ]\n})";
    var DocSearch = (function() {
      function DocSearch2(_ref) {
        var apiKey = _ref.apiKey, indexName = _ref.indexName, inputSelector = _ref.inputSelector, _ref$appId = _ref.appId, appId = _ref$appId === void 0 ? "BH4D9OD16A" : _ref$appId, _ref$debug = _ref.debug, debug = _ref$debug === void 0 ? false : _ref$debug, _ref$algoliaOptions = _ref.algoliaOptions, algoliaOptions = _ref$algoliaOptions === void 0 ? {} : _ref$algoliaOptions, _ref$queryDataCallbac = _ref.queryDataCallback, queryDataCallback = _ref$queryDataCallbac === void 0 ? null : _ref$queryDataCallbac, _ref$autocompleteOpti = _ref.autocompleteOptions, autocompleteOptions = _ref$autocompleteOpti === void 0 ? {
          debug: false,
          hint: false,
          autoselect: true
        } : _ref$autocompleteOpti, _ref$transformData = _ref.transformData, transformData = _ref$transformData === void 0 ? false : _ref$transformData, _ref$queryHook = _ref.queryHook, queryHook = _ref$queryHook === void 0 ? false : _ref$queryHook, _ref$handleSelected = _ref.handleSelected, handleSelected = _ref$handleSelected === void 0 ? false : _ref$handleSelected, _ref$enhancedSearchIn = _ref.enhancedSearchInput, enhancedSearchInput = _ref$enhancedSearchIn === void 0 ? false : _ref$enhancedSearchIn, _ref$layout = _ref.layout, layout = _ref$layout === void 0 ? "collumns" : _ref$layout;
        _classCallCheck(this, DocSearch2);
        DocSearch2.checkArguments({
          apiKey,
          indexName,
          inputSelector,
          debug,
          algoliaOptions,
          queryDataCallback,
          autocompleteOptions,
          transformData,
          queryHook,
          handleSelected,
          enhancedSearchInput,
          layout
        });
        this.apiKey = apiKey;
        this.appId = appId;
        this.indexName = indexName;
        this.input = DocSearch2.getInputFromSelector(inputSelector);
        this.algoliaOptions = _extends({ hitsPerPage: 5 }, algoliaOptions);
        this.queryDataCallback = queryDataCallback || null;
        var autocompleteOptionsDebug = autocompleteOptions && autocompleteOptions.debug ? autocompleteOptions.debug : false;
        autocompleteOptions.debug = debug || autocompleteOptionsDebug;
        this.autocompleteOptions = autocompleteOptions;
        this.autocompleteOptions.cssClasses = this.autocompleteOptions.cssClasses || {};
        this.autocompleteOptions.cssClasses.prefix = this.autocompleteOptions.cssClasses.prefix || "ds";
        var inputAriaLabel = this.input && typeof this.input.attr === "function" && this.input.attr("aria-label");
        this.autocompleteOptions.ariaLabel = this.autocompleteOptions.ariaLabel || inputAriaLabel || "search input";
        this.isSimpleLayout = layout === "simple";
        this.client = (0, _lite2.default)(this.appId, this.apiKey);
        this.client.addAlgoliaAgent("docsearch.js " + _version2.default);
        if (enhancedSearchInput) {
          this.input = DocSearch2.injectSearchBox(this.input);
        }
        this.autocomplete = (0, _autocomplete2.default)(this.input, autocompleteOptions, [{
          source: this.getAutocompleteSource(transformData, queryHook),
          templates: {
            suggestion: DocSearch2.getSuggestionTemplate(this.isSimpleLayout),
            footer: _templates2.default.footer,
            empty: DocSearch2.getEmptyTemplate()
          }
        }]);
        var customHandleSelected = handleSelected;
        this.handleSelected = customHandleSelected || this.handleSelected;
        if (customHandleSelected) {
          (0, _zepto2.default)(".algolia-autocomplete").on("click", ".ds-suggestions a", function(event) {
            event.preventDefault();
          });
        }
        this.autocomplete.on("autocomplete:selected", this.handleSelected.bind(null, this.autocomplete.autocomplete));
        this.autocomplete.on("autocomplete:shown", this.handleShown.bind(null, this.input));
        if (enhancedSearchInput) {
          DocSearch2.bindSearchBoxEvent();
        }
      }
      _createClass(DocSearch2, [{
        key: "getAutocompleteSource",
        /**
         * Returns the `source` method to be passed to autocomplete.js. It will query
         * the Algolia index and call the callbacks with the formatted hits.
         * @function getAutocompleteSource
         * @param  {function} transformData An optional function to transform the hits
         * @param {function} queryHook An optional function to transform the query
         * @returns {function} Method to be passed as the `source` option of
         * autocomplete
         */
        value: function getAutocompleteSource(transformData, queryHook) {
          var _this = this;
          return function(query, callback) {
            if (queryHook) {
              query = queryHook(query) || query;
            }
            _this.client.search([{
              indexName: _this.indexName,
              query,
              params: _this.algoliaOptions
            }]).then(function(data) {
              if (_this.queryDataCallback && typeof _this.queryDataCallback == "function") {
                _this.queryDataCallback(data);
              }
              var hits = data.results[0].hits;
              if (transformData) {
                hits = transformData(hits) || hits;
              }
              callback(DocSearch2.formatHits(hits));
            });
          };
        }
        // Given a list of hits returned by the API, will reformat them to be used in
        // a Hogan template
      }, {
        key: "handleSelected",
        value: function handleSelected(input, event, suggestion, datasetNumber) {
          var context = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {};
          if (context.selectionMethod === "click") {
            return;
          }
          input.setVal("");
          window.location.assign(suggestion.url);
        }
      }, {
        key: "handleShown",
        value: function handleShown(input) {
          var middleOfInput = input.offset().left + input.width() / 2;
          var middleOfWindow = (0, _zepto2.default)(document).width() / 2;
          if (isNaN(middleOfWindow)) {
            middleOfWindow = 900;
          }
          var alignClass = middleOfInput - middleOfWindow >= 0 ? "algolia-autocomplete-right" : "algolia-autocomplete-left";
          var otherAlignClass = middleOfInput - middleOfWindow < 0 ? "algolia-autocomplete-right" : "algolia-autocomplete-left";
          var autocompleteWrapper = (0, _zepto2.default)(".algolia-autocomplete");
          if (!autocompleteWrapper.hasClass(alignClass)) {
            autocompleteWrapper.addClass(alignClass);
          }
          if (autocompleteWrapper.hasClass(otherAlignClass)) {
            autocompleteWrapper.removeClass(otherAlignClass);
          }
        }
      }], [{
        key: "checkArguments",
        value: function checkArguments(args) {
          if (!args.apiKey || !args.indexName) {
            throw new Error(usage);
          }
          if (typeof args.inputSelector !== "string") {
            throw new Error("Error: inputSelector:" + args.inputSelector + "  must be a string. Each selector must match only one element and separated by ','");
          }
          if (!DocSearch2.getInputFromSelector(args.inputSelector)) {
            throw new Error("Error: No input element in the page matches " + args.inputSelector);
          }
        }
      }, {
        key: "injectSearchBox",
        value: function injectSearchBox(input) {
          input.before(_templates2.default.searchBox);
          var newInput = input.prev().prev().find("input");
          input.remove();
          return newInput;
        }
      }, {
        key: "bindSearchBoxEvent",
        value: function bindSearchBoxEvent() {
          (0, _zepto2.default)('.searchbox [type="reset"]').on("click", function() {
            (0, _zepto2.default)("input#docsearch").focus();
            (0, _zepto2.default)(this).addClass("hide");
            _autocomplete2.default.autocomplete.setVal("");
          });
          (0, _zepto2.default)("input#docsearch").on("keyup", function() {
            var searchbox = document.querySelector("input#docsearch");
            var reset = document.querySelector('.searchbox [type="reset"]');
            reset.className = "searchbox__reset";
            if (searchbox.value.length === 0) {
              reset.className += " hide";
            }
          });
        }
        /**
         * Returns the matching input from a CSS selector, null if none matches
         * @function getInputFromSelector
         * @param  {string} selector CSS selector that matches the search
         * input of the page
         * @returns {void}
         */
      }, {
        key: "getInputFromSelector",
        value: function getInputFromSelector(selector) {
          var input = (0, _zepto2.default)(selector).filter("input");
          return input.length ? (0, _zepto2.default)(input[0]) : null;
        }
      }, {
        key: "formatHits",
        value: function formatHits(receivedHits) {
          var clonedHits = _utils2.default.deepClone(receivedHits);
          var hits = clonedHits.map(function(hit) {
            if (hit._highlightResult) {
              hit._highlightResult = _utils2.default.mergeKeyWithParent(hit._highlightResult, "hierarchy");
            }
            return _utils2.default.mergeKeyWithParent(hit, "hierarchy");
          });
          var groupedHits = _utils2.default.groupBy(hits, "lvl0");
          _zepto2.default.each(groupedHits, function(level, collection) {
            var groupedHitsByLvl1 = _utils2.default.groupBy(collection, "lvl1");
            var flattenedHits = _utils2.default.flattenAndFlagFirst(groupedHitsByLvl1, "isSubCategoryHeader");
            groupedHits[level] = flattenedHits;
          });
          groupedHits = _utils2.default.flattenAndFlagFirst(groupedHits, "isCategoryHeader");
          return groupedHits.map(function(hit) {
            var url = DocSearch2.formatURL(hit);
            var category = _utils2.default.getHighlightedValue(hit, "lvl0");
            var subcategory = _utils2.default.getHighlightedValue(hit, "lvl1") || category;
            var displayTitle = _utils2.default.compact([_utils2.default.getHighlightedValue(hit, "lvl2") || subcategory, _utils2.default.getHighlightedValue(hit, "lvl3"), _utils2.default.getHighlightedValue(hit, "lvl4"), _utils2.default.getHighlightedValue(hit, "lvl5"), _utils2.default.getHighlightedValue(hit, "lvl6")]).join('<span class="aa-suggestion-title-separator" aria-hidden="true"> \u203A </span>');
            var text = _utils2.default.getSnippetedValue(hit, "content");
            var isTextOrSubcategoryNonEmpty = subcategory && subcategory !== "" || displayTitle && displayTitle !== "";
            var isLvl1EmptyOrDuplicate = !subcategory || subcategory === "" || subcategory === category;
            var isLvl2 = displayTitle && displayTitle !== "" && displayTitle !== subcategory;
            var isLvl1 = !isLvl2 && subcategory && subcategory !== "" && subcategory !== category;
            var isLvl0 = !isLvl1 && !isLvl2;
            return {
              isLvl0,
              isLvl1,
              isLvl2,
              isLvl1EmptyOrDuplicate,
              isCategoryHeader: hit.isCategoryHeader,
              isSubCategoryHeader: hit.isSubCategoryHeader,
              isTextOrSubcategoryNonEmpty,
              category,
              subcategory,
              title: displayTitle,
              text,
              url
            };
          });
        }
      }, {
        key: "formatURL",
        value: function formatURL(hit) {
          var url = hit.url, anchor = hit.anchor;
          if (url) {
            var containsAnchor = url.indexOf("#") !== -1;
            if (containsAnchor) return url;
            else if (anchor) return hit.url + "#" + hit.anchor;
            return url;
          } else if (anchor) return "#" + hit.anchor;
          console.warn("no anchor nor url for : ", JSON.stringify(hit));
          return null;
        }
      }, {
        key: "getEmptyTemplate",
        value: function getEmptyTemplate() {
          return function(args) {
            return _hogan2.default.compile(_templates2.default.empty).render(args);
          };
        }
      }, {
        key: "getSuggestionTemplate",
        value: function getSuggestionTemplate(isSimpleLayout) {
          var stringTemplate = isSimpleLayout ? _templates2.default.suggestionSimple : _templates2.default.suggestion;
          var template = _hogan2.default.compile(stringTemplate);
          return function(suggestion) {
            return template.render(suggestion);
          };
        }
      }]);
      return DocSearch2;
    })();
    exports.default = DocSearch;
  }
});

// node_modules/docsearch.js/dist/npm/src/lib/main.js
var require_main = __commonJS({
  "node_modules/docsearch.js/dist/npm/src/lib/main.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _toFactory = require_to_factory();
    var _toFactory2 = _interopRequireDefault(_toFactory);
    var _DocSearch = require_DocSearch();
    var _DocSearch2 = _interopRequireDefault(_DocSearch);
    var _version = require_version3();
    var _version2 = _interopRequireDefault(_version);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var docsearch = (0, _toFactory2.default)(_DocSearch2.default);
    docsearch.version = _version2.default;
    exports.default = docsearch;
  }
});

// node_modules/docsearch.js/dist/npm/index.js
var require_npm = __commonJS({
  "node_modules/docsearch.js/dist/npm/index.js"(exports, module) {
    var _main = require_main();
    var _main2 = _interopRequireDefault(_main);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    module.exports = _main2.default;
  }
});
export default require_npm();
/*! Bundled license information:

es6-promise/dist/es6-promise.js:
  (*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   v4.2.8+1e68dce6
   *)
*/
//# sourceMappingURL=npm-OGS3ZB2E.js.map
