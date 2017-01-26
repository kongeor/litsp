import { Lisp } from './lisp';
import { Symb, Str } from './atom';
import { Num } from './number';
import { List } from './seq';
import { Eval } from './interface';

const DELIM = /\(|\)|\s+/;

export class Reader {

    rawSource: string;
    index = 0;
    length = 0;
    sexp:Eval;

    constructor(str = "") {
        this.rawSource = str;

        if (str) {
            this.sexp = this.getSexp();
        }
    }

    isEval(e: Eval | string): e is Eval {
        return e && (<Eval>e).eval !== undefined;
    }

    getSexp(source = ""): Eval {

        if (source) {
            this.rawSource = source;
            this.length = source.length;
            this.index = 0;
        }

        let expr: Array<Eval> = null;
        let token = this.getToken();

        if (token == null) {
            return null;
        } else if (this.isEval(token)) {
            return token;
        } else {
            if (token === ")") {
                throw new Error("Unexpected right paren");
            } else if (token === "(") {
                expr = [];
                let token = this.getToken();

                while (token !== ")") {
                    if (this.isEval(token)) {
                        expr.push(token);
                    } else if (token === "(") {
                        this.prev();
                        let sexp = this.getSexp();
                        if (typeof sexp === "string") {
                            // TODO check
                            throw new Error("should never happen ?");
                        } else {
                            expr.push(sexp);
                        }
                    }  else if (token === null) {
                        throw new Error("Invalid end of expression: " + this.rawSource);
                    }

                    token = this.getToken();
                }
                return new List(expr);
            }
        }
    }

    getToken() : Eval | string {
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
            let str = "";
            this.next();

            while (this.current() !== "\"" && this.index < this.length) {
                str += this.current();
                this.next();
            }

            this.next();
            return new Str(str);
        }
        else {
            let tokenStr = "";

            while (this.index < this.length - 1) {
                if (DELIM.test(this.current())) {
                    break;
                } else {
                    tokenStr += this.current();
                    this.next();
                }
            }

            if (!DELIM.test(this.current())) {
                tokenStr += this.current();
                this.next();
            }

            if (Num.REGEX.test(tokenStr)) {
                return new Num(+tokenStr);
            } else {
                return new Symb(tokenStr);
            }

        }



    }

    next(): void {
        this.index += 1;
    }

    prev(): void {
        this.index -= 1;
    }

    current(): string {
        return this.rawSource[this.index];
    }

    previous(): string {
        return this.rawSource[this.index - 1];
    }
}