import { Lisp } from './lisp';
import { Eval, Bindings } from './interface';
import { Func, Lambda, Closure } from './fun';
import { Symb, FALSE } from './atom';
import { List } from './seq';
import { Reader } from './reader';
import Environment from './environment';
import { core } from './core';

export class Litsp extends Lisp {

    environment: Environment;
    reader: Reader;

    closures: boolean;
    loadCore: boolean;

    lambda_: (env: Environment, [x, ...xs]: List[]) => Lambda;
    
    constructor() {
        super();

        // preserve lexical scope
        this.lambda_ = (env: Environment, [x, ...xs]: List[]): Lambda => {
            if (this.environment != env.get("__global__") && this.closures) {
                return new Closure(env, x, xs);
            } else {
                return new Lambda(x, xs);
            }
        }

        this.init();
    }

    init(loadCore = true, closures = true): void {

        console.info(`Initializing Litsp with loadCore=${loadCore} and closures=${closures}`);

        this.loadCore = loadCore;
        this.closures = closures;

        this.environment = new Environment();
        this.reader = new Reader();

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
        this.environment.set(new Symb("__global__"), this.environment);

        if (loadCore) {
            this.process(core);
        }
    }

    process(source: string): Eval {
        let sexpr = this.reader.getSexp(source);
        let result: Eval = null;

        while (sexpr != null && sexpr.data) {
            result = this.eval(sexpr);
            sexpr = this.reader.getSexp();
        }

        return result;
    }

    eval(sexpr: Eval): Eval {
        return sexpr.eval(this.environment);
    }

    push(binds: Bindings = {}) {
        this.environment = this.environment.push(binds); // TODO check?
    }

    pop() {
        this.environment = this.environment.pop();
    }

}