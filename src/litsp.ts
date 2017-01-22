import { Lisp } from './lisp';
import { Eval } from './interface';
import { Func, Lambda } from './fun';
import { Symb, FALSE } from './atom';
import { List } from './seq';
import { Reader } from './reader';
import Environment from './environment';

export class Litsp extends Lisp {

    environment: Environment;
    reader: Reader;

    constructor() {
        super();

        this.environment = new Environment();
        this.reader = new Reader();

        this.init();
    }

    init(): void {
        this.environment.set(new Symb("eq"), new Func(this.eq, "eq"));
        this.environment.set(new Symb("quote"), new Func(this.quote, "quote"));
        this.environment.set(new Symb("car"), new Func(this.car, "car"));
        this.environment.set(new Symb("cdr"), new Func(this.cdr, "cdr"));
        this.environment.set(new Symb("cons"), new Func(this.cons, "cons"));
        this.environment.set(new Symb("atom"), new Func(this.atom, "atom"));
        this.environment.set(new Symb("cond"), new Func(this.cond, "cond"));

        this.environment.set(new Symb("lambda"), new Func(this.lambda_, "lambda"));
        this.environment.set(new Symb("label"), new Func(this.label, "label"));

        this.environment.set(new Symb("__litsp__"), this);
    }

    process(source: string): Eval {
        let sexpr = this.reader.getSexp(source);
        let result: Eval = null;

        while (sexpr != null && sexpr.data) {

            try {
                result = this.eval(sexpr);
            } catch(e) {
                console.error(e);
            }

            sexpr = this.reader.getSexp();
        }

        return result;
    }

    eval(sexpr: Eval): Eval {
        try {
            return sexpr.eval(this.environment);
        } catch(e) {
            console.error(e);
            return FALSE;
        }
    }

    push(env: Environment = null) {
        if (env) {
            this.environment = this.environment.push(env.binds); // TODO check?
        } else {
            this.environment = this.environment.push();
        }
    }

    pop() {
        this.environment = this.environment.pop();
    }

    lambda_ (env: Environment, [x, ...xs]: List[]) {
        return new Lambda(x, xs);
    }
}