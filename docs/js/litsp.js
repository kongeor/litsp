var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("seq", ["require", "exports"], function (require, exports) {
    "use strict";
    var Seq = (function () {
        function Seq(data) {
            if (data === void 0) { data = []; }
            this.data = data;
        }
        Seq.prototype.car = function () {
            return this.data[0];
        };
        Seq.prototype.equals = function (rhs) {
            if (rhs instanceof Seq) {
                if (this.data.length == rhs.data.length) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (!this.data[i].equals(rhs.data[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        return Seq;
    }());
    exports.Seq = Seq;
    var List = (function (_super) {
        __extends(List, _super);
        function List(data) {
            if (data === void 0) { data = []; }
            return _super.call(this, data) || this;
        }
        List.prototype.cdr = function () {
            return new List(this.data.slice(1));
        };
        List.prototype.cons = function (e) {
            return new List([e].concat(this.data));
        };
        List.prototype.eval = function (env, args) {
            if (args === void 0) { args = []; }
            var form = this.car().eval(env);
            return form.eval(env, this.cdr().data);
        };
        List.prototype.length = function () {
            return this.data.length;
        };
        List.prototype.toString = function () {
            if (this.data.length === 0) {
                return "()";
            }
            else {
                var ret = "(" + this.data[0];
                for (var i = 1; i < this.data.length; i++) {
                    ret += " " + this.data[i];
                }
                return ret + ")";
            }
        };
        return List;
    }(Seq));
    exports.List = List;
});
define("lisp", ["require", "exports", "atom"], function (require, exports, atom_1) {
    "use strict";
    var Lisp = (function () {
        function Lisp() {
        }
        // TODO move to Seq
        Lisp.isISeq = function (e) {
            return e && e.cdr !== undefined;
        };
        Lisp.prototype.cond = function (env, args) {
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var test = args_1[_i];
                if (test.car().eval(env).equals(atom_1.TRUE)) {
                    return test.cdr().car().eval(env);
                }
            }
            return atom_1.FALSE;
        };
        Lisp.prototype.eq = function (env, args) {
            if (args.length != 2) {
                throw new Error("Wrong number of arguments, expected 2, got " + args.length);
            }
            if (args[0].eval(env).equals(args[1].eval(env))) {
                return atom_1.TRUE;
            }
            return atom_1.FALSE;
        };
        Lisp.prototype.quote = function (env, args) {
            if (args.length != 1) {
                throw new Error("Wrong number of arguments, expected 1, got " + args.length);
            }
            return args[0];
        };
        Lisp.prototype.car = function (env, args) {
            if (args.length != 1) {
                throw new Error("Wrong number of arguments, expected 1, got " + args.length);
            }
            var cell = args[0].eval(env);
            if (Lisp.isISeq(cell)) {
                return cell.car();
            }
            else {
                throw new Error("Function car not valid on non-sequence type: " + cell); // TODO data not present on interface
            }
        };
        Lisp.prototype.cdr = function (env, args) {
            if (args.length != 1) {
                throw new Error("Wrong number of arguments, expected 1, got " + args.length);
            }
            var cell = args[0].eval(env);
            if (Lisp.isISeq(cell)) {
                return cell.cdr();
            }
            else {
                throw new Error("Function car not valid on non-sequence type: " + cell); // TODO data not present on interface
            }
        };
        Lisp.prototype.cons = function (env, args) {
            if (args.length != 2) {
                throw new Error("Wrong number of arguments, expected 2, got " + args.length);
            }
            var first = args[0].eval(env);
            var second = args[1].eval(env);
            if (Lisp.isISeq(second)) {
                return second.cons(first);
            }
            else {
                throw new Error("Function cons not valid on non-sequence type: " + second); // TODO data not present on interface
            }
        };
        Lisp.prototype.atom = function (env, args) {
            if (args.length != 1) {
                throw new Error("Wrong number of arguments, expected 1, got " + args.length);
            }
            var first = args[0].eval(env);
            if (first.equals(atom_1.FALSE)) {
                return atom_1.TRUE;
            }
            else if (first instanceof atom_1.Symb) {
                return atom_1.TRUE;
            }
            return atom_1.FALSE;
        };
        Lisp.prototype.label = function (env, args) {
            if (args.length != 2) {
                throw new Error("Wrong number of arguments, expected 2, got " + args.length);
            }
            env.set(args[0], args[1].eval(env));
            return env.get(args[0]);
        };
        return Lisp;
    }());
    Lisp.SPECIAL = "()";
    exports.Lisp = Lisp;
});
define("fun", ["require", "exports", "atom"], function (require, exports, atom_2) {
    "use strict";
    var Func = (function () {
        function Func(fn, hint) {
            this.fn = fn;
            this.hint = hint;
        }
        Func.prototype.eval = function (env, args) {
            return this.fn(env, args);
        };
        // TODO check!
        Func.prototype.equals = function (rhs) {
            return false;
        };
        // TODO interface
        Func.prototype.toString = function () {
            return "<built-in function " + this.hint + ">";
        };
        return Func;
    }());
    exports.Func = Func;
    var LambdaId = (function () {
        function LambdaId() {
        }
        return LambdaId;
    }());
    LambdaId.id = 0;
    var Lambda = (function () {
        function Lambda(names, body) {
            this.names = names;
            this.body = body;
            this.id = LambdaId.id++;
        }
        Lambda.prototype.pushBindings = function (containingEnv, values) {
            containingEnv.push();
            this.setBindings(containingEnv, values);
        };
        Lambda.prototype.setBindings = function (containingEnv, values) {
            for (var i = 0; i < values.length; i++) {
                containingEnv.environment.binds[this.names.data[i].data] =
                    values[i].eval(containingEnv.environment);
            }
        };
        Lambda.prototype.eval = function (env, args) {
            if (args.length != this.names.length()) {
                throw new Error("Wrong number of arguments, expected " + this.names.length() + ", got " + args.length);
            }
            var LITSP = env.get("__litsp__");
            this.pushBindings(LITSP, args);
            var ret = atom_2.FALSE;
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var form = _a[_i];
                ret = form.eval(LITSP.environment);
            }
            LITSP.pop();
            return ret;
        };
        Lambda.prototype.equals = function (rhs) {
            return false; // TODO
        };
        Lambda.prototype.toString = function () {
            return "<lambda " + this.id + ">"; // TODO unique
        };
        return Lambda;
    }());
    exports.Lambda = Lambda;
    var Closure = (function (_super) {
        __extends(Closure, _super);
        function Closure(env, names, body) {
            var _this = _super.call(this, names, body) || this;
            _this.env = env;
            return _this;
        }
        Closure.prototype.pushBindings = function (containingEnv, values) {
            containingEnv.push(this.env.binds);
            this.setBindings(containingEnv, values);
        };
        Closure.prototype.toString = function () {
            return "<lexical closure " + this.id + ">";
        };
        return Closure;
    }(Lambda));
    exports.Closure = Closure;
});
define("number", ["require", "exports"], function (require, exports) {
    "use strict";
    var Num = (function () {
        function Num(data) {
            this.data = data;
        }
        Num.prototype.eval = function (env, args) {
            if (args === void 0) { args = []; }
            return this;
        };
        Num.prototype.equals = function (rhs) {
            if (rhs instanceof Num) {
                return this.data === rhs.data;
            }
            return false;
        };
        Num.prototype.toString = function () {
            return "" + this.data;
        };
        return Num;
    }());
    Num.REGEX = /^\d+$/;
    exports.Num = Num;
});
define("reader", ["require", "exports", "atom", "number", "seq"], function (require, exports, atom_3, number_1, seq_1) {
    "use strict";
    var DELIM = /\(|\)|\s+/;
    var Reader = (function () {
        function Reader(str) {
            if (str === void 0) { str = ""; }
            this.index = 0;
            this.length = 0;
            this.rawSource = str;
            if (str) {
                this.sexp = this.getSexp();
            }
        }
        Reader.prototype.isEval = function (e) {
            return e && e.eval !== undefined;
        };
        Reader.prototype.getSexp = function (source) {
            if (source === void 0) { source = ""; }
            if (source) {
                this.rawSource = source;
                this.length = source.length;
                this.index = 0;
            }
            var expr = null;
            var token = this.getToken();
            if (token == null) {
                return null;
            }
            else if (this.isEval(token)) {
                return token;
            }
            else {
                if (token === ")") {
                    throw new Error("Unexpected right paren");
                }
                else if (token === "(") {
                    expr = [];
                    var token_1 = this.getToken();
                    while (token_1 !== ")") {
                        if (this.isEval(token_1)) {
                            expr.push(token_1);
                        }
                        else if (token_1 === "(") {
                            this.prev();
                            var sexp = this.getSexp();
                            if (typeof sexp === "string") {
                                // TODO check
                                throw new Error("should never happen ?");
                            }
                            else {
                                expr.push(sexp);
                            }
                        }
                        else if (token_1 === null) {
                            throw new Error("Invalid end of expression: " + this.rawSource);
                        }
                        token_1 = this.getToken();
                    }
                    return new seq_1.List(expr);
                }
            }
        };
        Reader.prototype.getToken = function () {
            if (this.index >= this.length) {
                return null; // TODO check
            }
            while (this.index < this.length && /\s/.test(this.current())) {
                this.next();
            }
            if (this.index == this.length) {
                return null;
            }
            // TODO check
            if (/\(|\)/.test(this.current())) {
                this.next();
                return this.previous();
            }
            else if (this.current() === "\"") {
                var str = "";
                this.next();
                while (this.current() !== "\"" && this.index < this.length) {
                    str += this.current();
                    this.next();
                }
                this.next();
                return new atom_3.Str(str);
            }
            else {
                var tokenStr = "";
                while (this.index < this.length - 1) {
                    if (DELIM.test(this.current())) {
                        break;
                    }
                    else {
                        tokenStr += this.current();
                        this.next();
                    }
                }
                if (!DELIM.test(this.current())) {
                    tokenStr += this.current();
                    this.next();
                }
                if (number_1.Num.REGEX.test(tokenStr)) {
                    return new number_1.Num(+tokenStr);
                }
                else {
                    return new atom_3.Symb(tokenStr);
                }
            }
        };
        Reader.prototype.next = function () {
            this.index += 1;
        };
        Reader.prototype.prev = function () {
            this.index -= 1;
        };
        Reader.prototype.current = function () {
            return this.rawSource[this.index];
        };
        Reader.prototype.previous = function () {
            return this.rawSource[this.index - 1];
        };
        return Reader;
    }());
    exports.Reader = Reader;
});
define("core", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.core = "\n\n(label t (quote t))\n(label nil (quote ()))\n\n(label and (lambda (and_x and_y)\n             (cond (and_x\n                    (cond (and_y t)\n                          (t nil)))\n                   (t nil))))\n\n(label not (lambda (not_x)\n             (cond (not_x nil)\n                   (t t))))\n\n(label nand (lambda (nand_x nand_y)\n              (not (and nand_x nand_y))))\n\n(label or (lambda (or_x or_y)\n            (nand\n             (nand or_x or_x)\n             (nand or_y or_y))))\n\n(label nor (lambda (nor_x nor_y)\n             (not (or nor_x nor_y))))\n\n(label xor (lambda (xor_x xor_y)\n             (or\n              (and xor_x (not xor_y))\n              (and (not xor_x) xor_y))))\n\n(label and_ (lambda (x y) (cond (x (cond (y t) (t nil))) (t nil))))\n(label not_ (lambda (x) (cond (x nil) (t t))))\n(label nand_ (lambda (x y) (not_ (and_ x y))))\n(label or_ (lambda (x y) (nand_ (nand_ x x) (nand_ y y))))\n(label xor_ (lambda (x y) (or_ (and_ x (not_ y)) (and_ (not_ x) y))))\n\n(label pair (lambda (x y)\n              (cons x (cons y nil))))\n\n(label zip (lambda (x y)\n              (cond ((and (null x) (null y)) nil)\n                    ((and (not (atom x)) (not (atom y)))\n                     (cons (pair (car x) (car y))\n                           (zip (cdr x) (cdr y)))))))\n\n(label lookup (lambda (name context)\n                (cond ((eq (car (car context)) name) (car (cdr (car context))))\n                       (t (lookup name (cdr context))))))\n\n(label caar (lambda (x) (car (car x))))\n(label cadr (lambda (x) (car (cdr x))))\n(label caddr (lambda (x) (car (cdr (cdr x)))))\n(label cadar (lambda (x) (car (cdr (car x)))))\n(label caddar (lambda (x) (car (cdr (cdr (car x))))))\n(label cadddar (lambda (x) (car (cdr (cdr (cdr (car x)))))))\n\n(label null (lambda (null_x)\n              (eq null_x nil)))\n\n(label mapcar (lambda (mapcar_f mapcar_lst)\n                (cond\n                  ((null mapcar_lst) mapcar_lst)\n                  (t (cons\n                      (mapcar_f (car mapcar_lst))\n                      (mapcar mapcar_f (cdr mapcar_lst)))))))\n\n(label reduce (lambda (reduce_f reduce_lst)\n                (cond\n                  ((null reduce_lst) (reduce_f))\n                  (t (reduce_f (car reduce_lst)\n                               (reduce reduce_f (cdr reduce_lst)))))))\n\n(label append (lambda (append_x append_y)\n                (cond ((null append_x) append_y)\n                      (t (cons (car append_x) \n                               (append (cdr append_x) append_y))))))\n\n(label filter (lambda (filter_f filter_lst)\n                (cond\n                  ((null filter_lst) filter_lst)\n                  (t (cond\n                       ((filter_f (car filter_lst)) (cons\n                                                     (car filter_lst) \n                                                     (filter filter_f (cdr filter_lst))))\n                       (t (filter filter_f (cdr filter_lst))))))))\n\n(label env' (pair (pair (quote t) (quote t)) \n\t\t  (pair (quote nil) nil)))\n\n(label quote' (lambda (qexpr)\n                (car (cdr qexpr))))\n\n(label atom' (lambda (aexpr abinds)\n\t       (atom (eval (car (cdr aexpr)) abinds))))\n\n(label eq' (lambda (eexpr ebinds)\n\t     (eq (eval (car (cdr eexpr)) ebinds)\n\t\t (eval (car (cdr (cdr eexpr))) ebinds))))\n\n(label car' (lambda (caexpr cabinds)\n\t      (car (eval (car (cdr caexpr)) cabinds))))\n\n(label cdr' (lambda (cdexpr cdbinds)\n\t      (cdr (eval (car (cdr cdexpr)) cdbinds))))\n\n(label cons' (lambda (coexpr cobinds)\n\t       (cons   (eval (car (cdr coexpr)) cobinds)\n\t\t       (eval (car (cdr (cdr coexpr))) cobinds))))\n\n(label eval-cond (lambda (condition condbinds)\n                   (cond ((eval (car (car condition)) condbinds)\n                          (eval (car (cdr (car condition))) condbinds))\n                         (t (eval-cond (cdr condition) condbinds)))))\n\n(label cond' (lambda (cndexpr cndbinds)\n\t       (eval-cond (cdr cndexpr) cndbinds)))\n\n(label rewrite (lambda (rexpr rbinds)\n\t\t (cons (lookup (car rexpr) rbinds)\n\t\t       (cdr rexpr))))\n\n(label eval (lambda (expr binds)\n              (cond\n                ((atom expr) (lookup expr binds))\n                ((atom (car expr))\n                 (cond\n                   ((eq (car expr) (quote quote)) (quote' expr))\n                   ((eq (car expr) (quote atom))  (atom'  expr binds))\n                   ((eq (car expr) (quote eq))    (eq'    expr binds))\n                   ((eq (car expr) (quote car))   (car'   expr binds))\n                   ((eq (car expr) (quote cdr))   (cdr'   expr binds))\n                   ((eq (car expr) (quote cons))  (cons'  expr binds))\n                   ((eq (car expr) (quote cond))  (cond'  expr binds))\n                   (t (eval (rewrite expr binds) binds))))\n                ((eq (car (car expr)) (quote label))\n                 (eval (cons (car (cdr (cdr (car expr)))) (cdr expr))\n                       (cons (pair (car (cdr (car expr))) (car expr)) binds)))\n                ((eq (caar expr) (quote lambda))\n                 (eval (caddar expr)\n                       (append (zip (cadar expr) (eval-args (cdr expr) binds))\n                               binds)))\n                ((eq (caar expr) (quote macro))\n                 (cond\n                   ((eq (cadar expr) (quote lambda))\n                    (eval (eval (car (cdddar expr))\n                                (cons (pair (car (caddar expr)) \n                                             (cadr expr)) \n                                      binds))\n                          binds)))))))\n\n(label eval-args (lambda (eval-args_m eval-args_a)\n                   (cond ((null eval-args_m) nil)\n                         (t (cons (eval  (car eval-args_m) eval-args_a)\n                                  (eval-args (cdr eval-args_m) eval-args_a))))))\n\n(label apply (lambda (apply_name apply_args)\n               ((pair apply_name (pair (quote quote) apply_args)))))\n\n\n(label zero (lambda (s z) z))\n(label one (lambda (s z) (s z)))\n(label plus (lambda (m n) (lambda (f x) (m f (n f x)))))\n";
});
define("litsp", ["require", "exports", "lisp", "fun", "atom", "reader", "environment", "core"], function (require, exports, lisp_1, fun_1, atom_4, reader_1, environment_1, core_1) {
    "use strict";
    var Litsp = (function (_super) {
        __extends(Litsp, _super);
        function Litsp() {
            var _this = _super.call(this) || this;
            // preserve lexical scope
            _this.lambda_ = function (env, _a) {
                var x = _a[0], xs = _a.slice(1);
                if (_this.environment != env.get("__global__") && _this.closures) {
                    return new fun_1.Closure(env, x, xs);
                }
                else {
                    return new fun_1.Lambda(x, xs);
                }
            };
            _this.init();
            return _this;
        }
        Litsp.prototype.init = function (loadCore, closures) {
            if (loadCore === void 0) { loadCore = true; }
            if (closures === void 0) { closures = true; }
            console.info("Initializing Litsp with loadCore=" + loadCore + " and closures=" + closures);
            this.loadCore = loadCore;
            this.closures = closures;
            this.environment = new environment_1.default();
            this.reader = new reader_1.Reader();
            this.environment.set(new atom_4.Symb("eq"), new fun_1.Func(this.eq, "eq"));
            this.environment.set(new atom_4.Symb("quote"), new fun_1.Func(this.quote, "quote"));
            this.environment.set(new atom_4.Symb("car"), new fun_1.Func(this.car, "car"));
            this.environment.set(new atom_4.Symb("cdr"), new fun_1.Func(this.cdr, "cdr"));
            this.environment.set(new atom_4.Symb("cons"), new fun_1.Func(this.cons, "cons"));
            this.environment.set(new atom_4.Symb("atom"), new fun_1.Func(this.atom, "atom"));
            this.environment.set(new atom_4.Symb("cond"), new fun_1.Func(this.cond, "cond"));
            this.environment.set(new atom_4.Symb("lambda"), new fun_1.Func(this.lambda_, "lambda"));
            this.environment.set(new atom_4.Symb("label"), new fun_1.Func(this.label, "label"));
            this.environment.set(new atom_4.Symb("__litsp__"), this);
            this.environment.set(new atom_4.Symb("__global__"), this.environment);
            if (loadCore) {
                this.process(core_1.core);
            }
        };
        Litsp.prototype.process = function (source) {
            var sexpr = this.reader.getSexp(source);
            var result = null;
            while (sexpr != null && sexpr.data) {
                result = this.eval(sexpr);
                sexpr = this.reader.getSexp();
            }
            return result;
        };
        Litsp.prototype.eval = function (sexpr) {
            return sexpr.eval(this.environment);
        };
        Litsp.prototype.push = function (binds) {
            if (binds === void 0) { binds = {}; }
            this.environment = this.environment.push(binds); // TODO check?
        };
        Litsp.prototype.pop = function () {
            this.environment = this.environment.pop();
        };
        return Litsp;
    }(lisp_1.Lisp));
    exports.Litsp = Litsp;
});
define("interface", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("atom", ["require", "exports", "seq"], function (require, exports, seq_2) {
    "use strict";
    var Atom = (function () {
        function Atom(data) {
            this.data = data;
        }
        Atom.prototype.equals = function (rhs) {
            if (rhs instanceof Atom) {
                return this.data === rhs.data;
            }
            return false;
        };
        Atom.prototype.toString = function () {
            return this.data.toString();
        };
        return Atom;
    }());
    exports.Atom = Atom;
    var Symb = (function (_super) {
        __extends(Symb, _super);
        function Symb(sym) {
            return _super.call(this, sym) || this;
        }
        Symb.prototype.eval = function (env, args) {
            return env.get(this);
        };
        return Symb;
    }(Atom));
    exports.Symb = Symb;
    exports.TRUE = new Symb("t");
    exports.FALSE = new seq_2.List();
    var Str = (function (_super) {
        __extends(Str, _super);
        function Str(data) {
            if (data === void 0) { data = ""; }
            return _super.call(this, data) || this;
        }
        Str.prototype.eval = function (env, args) {
            if (args === void 0) { args = []; }
            return this;
        };
        Str.prototype.car = function () {
            return new Symb(this.data.slice(0, 1));
        };
        Str.prototype.cdr = function () {
            return new Str(this.data.slice(1));
        };
        Str.prototype.length = function () {
            return this.data.length;
        };
        Str.prototype.cons = function (e) {
            return new Str(e.data + this.data);
        };
        Str.prototype.toString = function () {
            return "\"" + this.data.toString() + "\"";
        };
        return Str;
    }(Atom));
    exports.Str = Str;
});
define("environment", ["require", "exports", "atom"], function (require, exports, atom_5) {
    "use strict";
    var Environment = (function () {
        function Environment(parent, binds) {
            if (parent === void 0) { parent = undefined; }
            if (binds === void 0) { binds = {}; }
            this.binds = binds;
            this.parent = parent;
            if (parent) {
                this.level = parent.level + 1;
            }
            else {
                this.level = 0;
            }
        }
        Environment.prototype.get = function (key) {
            var k;
            if (key instanceof atom_5.Symb) {
                k = key.data;
            }
            else {
                k = key;
            }
            if (this.binds[k]) {
                return this.binds[k];
            }
            else if (this.parent) {
                return this.parent.get(key);
            }
            else {
                throw new Error("Invalid symbol " + k);
            }
        };
        Environment.prototype.set = function (key, value) {
            var k;
            if (key instanceof atom_5.Symb) {
                k = key.data;
            }
            else {
                k = key;
            }
            if (this.binds[k]) {
                this.binds[k] = value;
            }
            else if (this.parent) {
                this.parent.set(key, value);
            }
            else {
                this.binds[k] = value;
            }
        };
        Environment.prototype.definedp = function (key) {
            return !!this.binds[key];
        };
        Environment.prototype.push = function (binds) {
            if (binds === void 0) { binds = {}; }
            return new Environment(this, binds);
        };
        Environment.prototype.pop = function () {
            return this.parent;
        };
        Environment.prototype.toString = function () {
            var s = "Environment " + this.level + "\n\n";
            for (var key in this.binds) {
                if (!(key.substring(0, 2) === "__")) {
                    s += "\t" + key + " : " + this.binds[key] + "\n";
                }
            }
            return s;
        };
        return Environment;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Environment;
});
define("app", ["require", "exports", "environment", "atom", "number", "seq", "lisp", "litsp"], function (require, exports, environment_2, atom_6, number_2, seq_3, lisp_2, litsp_1) {
    "use strict";
    function test1() {
        var data = { "a": new number_2.Num(1) };
        var env = new environment_2.default(null, data);
        var data2 = { "b": new number_2.Num(2) };
        var env2 = new environment_2.default(env, data2);
        var list = new seq_3.List([new atom_6.Symb("a"),
            new atom_6.Str("b"),
            new number_2.Num(3)]);
        var list2 = new seq_3.List([new atom_6.Symb("a"),
            new atom_6.Str("b"),
            new number_2.Num(3)]);
        console.log(list.equals(list2));
        var env3 = new environment_2.default();
        var list3 = new seq_3.List();
        var s3 = new atom_6.Symb("s3");
        env.set(s3, list3);
        var lisp = new lisp_2.Lisp();
        var e = lisp.atom(env, [s3]);
        console.log(e);
    }
    var litsp = new litsp_1.Litsp();
    var program = "\n(((lambda (x) (lambda (y) (cons x (cons y (quote ()))))) 3) 4)\n\n(cons \"a\" \"bc\")\n(cdr \"abc\")\n";
    var result = litsp.environment.toString();
    // let result = litsp.process(program);
    console.log(result.toString());
});
//# sourceMappingURL=litsp.js.map